import copy
from app.engine.legal_move_generator.custom_errors import *
from app.engine.legal_move_generator.piece_class import Piece

from app.engine.json_validator.json_validator import validate_json

class Game:

    piece_default_start_data = {
        "piece_move_count": 0
    }

    def __init__(self, rules: dict):

        validated, validate_message = validate_json(rules)
        if not validated:
            raise InvalidJSONRulesError(validate_message)

        self.debug_mode = False

        self._rules = rules
        self._game_state = {}
        self._id_counter = 0

        for starting_piece in rules["setup"]["starting_position"]:
            self._game_state[(starting_piece["x_pos"], starting_piece["y_pos"])] = Piece((starting_piece["x_pos"], starting_piece["y_pos"]), self._id_counter, starting_piece["piece_name"], copy.deepcopy(Game.piece_default_start_data))
            self._id_counter += 1

    def set_debug_mode(self, debug_mode: bool):
        self.debug_mode = debug_mode

    def _debug_print(self, statement, end="\n"):
        if self.debug_mode:
            print(statement, end=end)

    def get_board_size(self):
        return (self._rules["setup"]["board_x_size"], self._rules["setup"]["board_y_size"])
    
    def get_game_state_raw(self, include_size: bool = False):
        if include_size:
            return (self._rules["setup"]["board_x_size"], self._rules["setup"]["board_y_size"]), self._game_state
        return self._game_state

    def get_game_state(self):
        game_state = {}
        for position, piece_object in self._game_state.items():
            game_state[position] = piece_object.piece_name

        return game_state

    def overwrite_game_state(self, new_game_state: dict): # Format is a dictionary with tuple position as the keys, and piece name as the values
        self._game_state = {}
        self._id_counter = 0
        for position, piece_name in new_game_state.items():
            self._game_state[position] = Piece(position, self._id_counter, piece_name, copy.deepcopy(self.piece_default_start_data))
            self._id_counter += 1

    def overwrite_game_state_raw(self, new_game_state: dict): # Format is the raw game state format, where the items are Piece objects. BE CAREFUL OF THIS
        self._game_state = new_game_state

    def make_move(self, piece_start_position: tuple, piece_end_position: tuple): # Note that move will be accepted regardless of whether the move is legal or not

        if piece_start_position == piece_end_position:
            raise StationaryMoveError

        piece_object = self._game_state[piece_start_position]

        piece_object.data["piece_move_count"] += 1

        piece_object.position = piece_end_position

        self._game_state[piece_end_position] = piece_object
        self._game_state.pop(piece_start_position)

    def _check_condition(self, condition_name: str, piece_object: Piece):
        condition_definition = self._rules["conditions"][condition_name]
        condition_type = condition_definition["type"]

        output = None
        match condition_type:

            case "all_of":
                parameter_conditions = condition_definition["conditions"]
                for parameter_condition in parameter_conditions:
                    para_condition_name = parameter_condition["condition"]
                    para_output = self._check_condition(para_condition_name, piece_object)
                    if parameter_condition["invert"] == True:
                        para_output = not para_output
                    if para_output == False:
                        break
                else:
                    output = True
                if output != True:
                    output = False

            case "any_of":
                parameter_conditions = condition_definition["conditions"]
                for parameter_condition in parameter_conditions:
                    para_condition_name = parameter_condition["condition"]
                    para_output = self._check_condition(para_condition_name, piece_object)
                    if parameter_condition["invert"] == True:
                        para_output = not para_output
                    if para_output == True:
                        break
                else:
                    output = True
                if output != True:
                    output = False

            case "square_occupied":
                check_position = piece_object.position
                check_position[0] += condition_definition["offset_x"]
                check_position[1] += condition_definition["offset_y"]
                if check_position in self._game_state:
                    output = True
                else:
                    output = False

            case "range":
                value = None
                value_source = condition_definition["value_source"]
                match value_source:
                    case "piece_x":
                        value = piece_object.position[0]
                    case "piece_y":
                        value = piece_object.position[1]
                    case "piece_move_count":
                        value = piece_object.data["piece_move_count"]

                value += condition_definition["offset"]
                if condition_definition["min"] <= value <= condition_definition["max"]:
                    output = True
                else:
                    output = False

        invert = condition_definition["invert"]
        if invert:
            output = not output
        return output

    def _position_within_board(self, position: tuple):
        board_x_size = self._rules["setup"]["board_x_size"]
        board_y_size = self._rules["setup"]["board_y_size"]

        if 0 <= position[0] < board_x_size and 0 <= position[1] < board_y_size:
            return True
        else:
            return False

    def _inside_piece(self, position: tuple):
        if position in self._game_state:
            return True
        else:
            return False

    def _loop_move(self, start_object: Piece, move_name: str, get_termination: bool = False):
        self._debug_print(f"Move name: {move_name}")
        self._debug_print(f"Start: {start_object.position}")

        terminate = False

        move_definition = self._rules["moves"][move_name]

        start_conditions = move_definition["start_conditions"]

        if start_conditions != []:
            pass_conditions = True
            for condition in start_conditions:
                if self._check_condition(condition, start_object) == False:
                    pass_conditions = False
                    terminate = True
                    break
            if pass_conditions == False:
                self._debug_print("Failed start conditions")
                if get_termination == True:
                    return [], terminate
                else:
                    return []

        move_x = move_definition["move_definition"]["move_x"]
        move_y = move_definition["move_definition"]["move_y"]
        move_range = move_definition["move_definition"]["range"]

        move_stop_conditions = move_definition["move_definition"]["move_stop_conditions"]
        move_end_conditions = move_definition["move_end_conditions"]

        legal_moves = []

        current_position = start_object.position
        range_counter = 0
        piece_object = copy.deepcopy(start_object)
        while True:
            self._debug_print(f"Moved from {current_position} to ", end="")
            current_position = list(current_position)
            current_position[0] += move_x
            current_position[1] += move_y
            current_position = tuple(current_position)
            self._debug_print(current_position)

            if not self._position_within_board(current_position):
                self._debug_print("Outside board: break")
                terminate = True
                break
            else:
                stop_loop = False
                range_counter += 1
                if move_range != "inf":
                    if range_counter >= move_range:
                        self._debug_print("Reached max range: break")
                        stop_loop = True

                pass_conditions = True
                self._debug_print(f"Checking move_stop_conditions at {current_position}")
                for move_stop_condition in move_stop_conditions:
                    piece_object.position = current_position
                    if self._check_condition(move_stop_condition, piece_object):
                        pass_conditions = False
                        break
                if pass_conditions == False:
                    self._debug_print("Failed move stop conditions: break")
                    terminate = True
                    stop_loop = True

            pass_end_conditions = True
            for end_condition_name in move_end_conditions:
                if self._check_condition(end_condition_name, piece_object) == False:
                    pass_end_conditions = False
                    break
            if pass_end_conditions:
                legal_moves.append(current_position)
                self._debug_print(f"Added position {current_position} to legal moves")
            else:
                self._debug_print("Failed end conditions: break")

            if stop_loop:
                break

        self._debug_print(f"Returned at {current_position}")
        self._debug_print("")
        if get_termination == True:
            return legal_moves, terminate
        else:
            return legal_moves

    def get_legal_moves(self, piece_position: tuple):
        legal_moves = {}
        print(self._game_state, piece_position)

        if not piece_position in self._game_state:
            raise NoPieceFoundError
        piece_object = copy.deepcopy(self._game_state[piece_position])

        piece_name = self._game_state[piece_position].piece_name
        piece_move_names = self._rules["pieces"][piece_name]["moveset"]
        for move_group in piece_move_names:
            if isinstance(move_group, dict):
                legal_move_group = self._loop_move(piece_object, move_group["move_name"])
                legal_moves[move_group["move_name"]] = legal_move_group

            elif isinstance(move_group, list):
                each_piece_object = copy.deepcopy(piece_object)
                for each_move in move_group:
                    each_legal_moves_both = self._loop_move(each_piece_object, each_move["move_name"], True)
                    each_legal_moves = each_legal_moves_both[0]

                    if each_move["valid_move"]:
                        legal_moves[each_move["move_name"]] = each_legal_moves
                    if not each_legal_moves == []:
                        each_piece_object.position = each_legal_moves[-1]

                    if each_legal_moves_both[1] and each_move["terminate_on_stop"]:
                        break

        return legal_moves
