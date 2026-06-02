import copy
from app.engine.legal_move_generator.custom_errors import *
from app.engine.legal_move_generator.piece_class import *

def _convert_to_external_game_state(game_state: dict) -> list:
    external_game_state = []
    for piece_position, piece_object in game_state.items():
        external_game_state.append((piece_position, convert_piece_to_dict(piece_object)))
    return external_game_state

def _convert_to_internal_game_state(json_game_state: list) -> dict:
    game_state = {}
    for piece in json_game_state:
        game_state[(piece["position"]["x_pos"], piece["position"]["y_pos"])] = convert_dict_to_piece(piece)
    return game_state

def get_start_game_state(rules: dict) -> list:
    id_counter = 0
    piece_default_start_data = {
        "has_not_moved": True
    }
    game_state = []
    for starting_piece in rules["setup"]["starting_position"]:
        game_state.append(convert_piece_to_dict(Piece((starting_piece["x_pos"], starting_piece["y_pos"]), id_counter, starting_piece["piece_name"], copy.deepcopy(piece_default_start_data))))
        id_counter += 1
    return game_state

def get_simple_game_state(json_game_state: list) -> list:
    simple_game_state = []
    for piece in json_game_state:
        simple_game_state.append(((piece["position"]["x_pos"], piece["position"]["y_pos"]), piece["piece_name"]))
    return simple_game_state

def make_move(json_game_state: list, piece_start_position: tuple, piece_end_position: tuple) -> list:
    if piece_start_position == piece_end_position:
        raise StationaryMoveError

    game_state = _convert_to_internal_game_state(json_game_state)

    piece_object = game_state[piece_start_position]
    if piece_object.data["has_not_moved"] == True:
        piece_object.data["has_not_moved"] = False

    piece_object.position = piece_end_position

    game_state[piece_end_position] = piece_object
    game_state.pop(piece_start_position)

    return _convert_to_external_game_state(game_state)

def get_legal_moves(rules: dict, json_game_state: list, piece_position: tuple) -> dict:
    game_state = []
    for piece in json_game_state:
        game_state.append(((piece["position"]["x_pos"], piece["position"]["y_pos"]), convert_dict_to_piece(piece)))


