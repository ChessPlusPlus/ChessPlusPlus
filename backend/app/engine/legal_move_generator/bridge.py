from app.schemas.legal_move_generator_request import SetupRules
from app.engine.legal_move_generator.legal_move_generator import Game
from typing import TypedDict
from app.engine.legal_move_generator.legal_move_generator import Piece
from app.utils.case_converter import convert_camel_to_snake
from app.utils.starting_position_serialiser import serialise_starting_position
from app.engine.legal_move_generator.instanceless_legal_move_generator import InstancelessLegalMoveGenerator

class PieceJSONRuleset(TypedDict):
	pos: tuple[int, int]

def convert_piece_json_ruleset_to_piece_object(piece_json_ruleset: dict):
    return Piece(
        position=(piece_json_ruleset["x_pos"], piece_json_ruleset["y_pos"]),
        piece_id=piece_json_ruleset["piece_id"],
        piece_name=piece_json_ruleset["piece_name"],
        data=piece_json_ruleset["data"]
    )

def generate_legal_moves_for_preview(piece_name: str, current_pos: tuple[int, int], game_state: list, piece_ruleset: dict, movement_rules: dict, setup_rules: SetupRules):
    serialized_piece_ruleset = convert_camel_to_snake(piece_ruleset, [0])
    serialized_movement_rules = convert_camel_to_snake(movement_rules, [0])
    serialized_setup_rules = {
        "piece_ownership": setup_rules.piece_ownership,
        "board_x_size": setup_rules.board_x_size,
        "board_y_size": setup_rules.board_y_size,
        "starting_position": serialise_starting_position(setup_rules.starting_position),
    }

    rules = {
        "moves": serialized_movement_rules,
        "pieces": serialized_piece_ruleset,
        "setup": serialized_setup_rules
    }

    game_instance = Game(rules)
    game_instance.overwrite_game_state(dict[tuple[int, int], str](game_state))

    return game_instance.get_legal_moves(current_pos)