import copy
import time

from app.engine.legal_move_generator.custom_errors import *
from app.engine.legal_move_generator.piece_class import *

class GameContext:
    def __init__(self, rules: dict, json_game_state: list):
        self._rules = rules
        self._json_game_state = json_game_state

    def get_rules(self) -> dict:
        return self._rules

    def get_json_game_state(self) -> list:
        return self._json_game_state

    def update_json_game_state(self, new_json_game_state: list):
        self._json_game_state = new_json_game_state

class InstancelessLegalMoveGenerator:

    @staticmethod
    def _convert_to_external_game_state(game_state: dict) -> list:
        external_game_state = []
        for piece_position, piece_object in game_state.items():
            external_game_state.append(convert_piece_to_dict(piece_object))
        return external_game_state

    @staticmethod
    def _convert_to_internal_game_state(json_game_state: list) -> dict:
        game_state = {}
        for piece in json_game_state:
            game_state[(piece["position"]["x_pos"], piece["position"]["y_pos"])] = convert_dict_to_piece(piece)
        return game_state

    @staticmethod
    def get_start_game_state(rules: dict) -> list:
        id_counter = 0
        piece_default_start_data = {
            "has_not_moved": True
        }
        game_state = []
        for starting_piece in rules["setup"]["starting_position"]:
            game_state.append(convert_piece_to_dict(
                Piece((starting_piece["x_pos"], starting_piece["y_pos"]), id_counter, starting_piece["piece_name"],
                      copy.deepcopy(piece_default_start_data))))
            id_counter += 1
        return game_state

    @staticmethod
    def get_simple_game_state(json_game_state: list) -> list:
        simple_game_state = []
        for piece in json_game_state:
            simple_game_state.append(((piece["position"]["x_pos"], piece["position"]["y_pos"]), piece["piece_name"]))
        return simple_game_state

    @staticmethod
    def make_move(json_game_state: list, piece_start_position: tuple, piece_end_position: tuple) -> list:
        if piece_start_position == piece_end_position:
            raise StationaryMoveError

        game_state = InstancelessLegalMoveGenerator._convert_to_internal_game_state(json_game_state)

        piece_object = game_state[piece_start_position]
        if piece_object.data["has_not_moved"] == True:
            piece_object.data["has_not_moved"] = False

        piece_object.position = piece_end_position

        game_state[piece_end_position] = piece_object
        game_state.pop(piece_start_position)

        return InstancelessLegalMoveGenerator._convert_to_external_game_state(game_state)

    @staticmethod
    def _check_condition(condition_name: str, piece_object: Piece):
        match condition_name:
            case "has_not_moved":
                if piece_object.data["has_not_moved"] == True:
                    return True
                else:
                    return False
        raise InvalidConditionError

    @staticmethod
    def _position_within_board(rules, position: tuple):
        board_x_size = rules["setup"]["board_x_size"]
        board_y_size = rules["setup"]["board_y_size"]

        if 0 <= position[0] < board_x_size and 0 <= position[1] < board_y_size:
            return True
        else:
            return False

    @staticmethod
    def _check_move_stop_condition(game_state: dict, condition_name: str, piece_object: Piece):
        match condition_name:
            case "inside_piece":
                if InstancelessLegalMoveGenerator._inside_piece(game_state, piece_object.position):
                    return True
                else:
                    return False
        raise InvalidConditionError

    @staticmethod
    def _inside_piece(game_state: dict, position: tuple):
        if position in game_state:
            return True
        else:
            return False

    @staticmethod
    def _loop_move(rules: dict, game_state: dict, start_object: Piece, move_name: str, get_termination: bool = False):
        terminate = False

        legal_moves = []
        move_definition = rules["moves"][move_name]

        if move_definition["conditions"] != []:
            pass_conditions = True
            for condition in move_definition["conditions"]:
                if InstancelessLegalMoveGenerator._check_condition(condition, start_object) == False:
                    pass_conditions = False
                    terminate = True
                    break
            if pass_conditions == False:
                if get_termination == True:
                    return [], terminate
                else:
                    return []

        move_x = move_definition["move_definition"]["move_x"]
        move_y = move_definition["move_definition"]["move_y"]
        move_range = move_definition["move_definition"]["range"]

        move_stop_conditions = move_definition["move_definition"]["move_stop_conditions"]
        for_movement = move_definition["for_movement"]
        for_capture = move_definition["for_capture"]

        current_position = start_object.position
        range_counter = 0
        piece_object = copy.deepcopy(start_object)
        while True:
            current_position = list(current_position)
            current_position[0] += move_x
            current_position[1] += move_y
            current_position = tuple(current_position)

            if not InstancelessLegalMoveGenerator._position_within_board(rules, current_position):
                terminate = True
                break
            else:
                stop_loop = False
                range_counter += 1
                if move_range != "inf":
                    if range_counter >= move_range:
                        stop_loop = True

                pass_conditions = True
                for move_stop_condition in move_stop_conditions:
                    piece_object.position = current_position
                    if InstancelessLegalMoveGenerator._check_move_stop_condition(game_state, move_stop_condition, piece_object):
                        pass_conditions = False
                        break
                if pass_conditions == False:
                    terminate = True
                    stop_loop = True

                if stop_loop == True:
                    if InstancelessLegalMoveGenerator._inside_piece(game_state, current_position):
                        if for_capture:
                            legal_moves.append(current_position)
                    else:
                        if for_movement:
                            legal_moves.append(current_position)
                    break
            if for_movement:
                legal_moves.append(current_position)

        if get_termination == True:
            return legal_moves, terminate
        else:
            return legal_moves

    @staticmethod
    def get_legal_moves(rules: dict, json_game_state: list, piece_position: tuple) -> dict:
        get_legal_moves_start = time.perf_counter()
        game_state = InstancelessLegalMoveGenerator._convert_to_internal_game_state(json_game_state)

        legal_moves = {}

        if piece_position not in game_state:
            raise NoPieceFoundError
        piece_object = game_state[piece_position]

        piece_name = game_state[piece_position].piece_name
        piece_move_names = rules["pieces"][piece_name]["moveset"]
        for move_group in piece_move_names:
            if isinstance(move_group, dict):
                legal_move_group = InstancelessLegalMoveGenerator._loop_move(rules, game_state, piece_object, move_group["move_name"])
                legal_moves[move_group["move_name"]] = legal_move_group

            elif isinstance(move_group, list):
                each_piece_object = copy.deepcopy(piece_object)
                for each_move in move_group:
                    each_legal_moves_both = InstancelessLegalMoveGenerator._loop_move(rules, game_state, each_piece_object, each_move["move_name"], True)
                    each_legal_moves = each_legal_moves_both[0]

                    if each_move["valid_move"]:
                        legal_moves[each_move["move_name"]] = each_legal_moves
                    if not each_legal_moves == []:
                        each_piece_object.position = each_legal_moves[-1]

                    if each_legal_moves_both[1] and each_move["terminate_on_stop"]:
                        break

        get_legal_moves_end = time.perf_counter()
        time_taken = get_legal_moves_end - get_legal_moves_start
        print(f"get_legal_moves took {time_taken:.6f} seconds")
        print(f"get_legal_moves took {time_taken * 1000:.6f} milliseconds")

        return legal_moves
