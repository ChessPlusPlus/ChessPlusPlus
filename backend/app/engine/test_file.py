import json
from json import JSONDecodeError
from pathlib import Path

import app.engine.json_validator.json_validator as json_validator
import app.engine.legal_move_generator.legal_move_generator as lmg
import app.engine.json_normaliser.json_normaliser as jn
import app.engine.legal_move_generator.instanceless_legal_move_generator as ilmg

from app.engine.legal_move_generator.legal_move_generator import Piece

BASE_DIR = Path(__file__).parent.resolve()
TEST_NORMALISED_JSON_PATH = BASE_DIR / "test_normalised_json.json"
TEST_SIMPLE_JSON_PATH = BASE_DIR / "test_simple_json.json"

def test_validate_json():
    try:
        test_data = json.load(open(TEST_NORMALISED_JSON_PATH))
    except JSONDecodeError:
        return False, "JSON Decode Error detected. Please check the file's syntax."

    output = json_validator.validate_json(test_data)
    return output

def display_game_state(board_size: tuple, game_state: dict, show_coords: bool = False):
    print("\nGame state:")
    for y in range(board_size[1]):
        print("+", end="")
        print("----+" * board_size[0])
        print("|", end="")
        for x in range(board_size[0]):
            if show_coords:
                if (x, y) in game_state:
                    print("*", end="")
                else:
                    print(" ", end="")
                print(f"{x},{y}", end="")
            else:
                print(" ", end="")
                if (x, y) in game_state:
                    print_piece = "#"

                    match game_state[(x, y)].piece_name:
                        case "white_pawn":
                            print_piece = "P"
                        case "black_pawn":
                            print_piece = "p"
                        case "white_knight":
                            print_piece = "N"
                        case "black_knight":
                            print_piece = "n"
                        case "white_queen":
                            print_piece = "Q"
                        case "black_queen":
                            print_piece = "q"
                        case "white_king":
                            print_piece = "K"
                        case "black_king":
                            print_piece = "k"
                        case "white_rook":
                            print_piece = "R"
                        case "black_rook":
                            print_piece = "r"
                        case "white_bishop":
                            print_piece = "B"
                        case "black_bishop":
                            print_piece = "b"

                    print(print_piece, end=" ")
                else:
                    print("  ", end="")

            print("|", end="")
        print()
    print("+", end="")
    print("----+" * board_size[0])

def test_get_legal_moves():
    SHOW_COORDS = True

    tvj_output = test_validate_json()
    print("JSON Validation:")
    print(f"\tOutput: {tvj_output[0]}")
    print(f"\tMessage: {tvj_output[1]}")

    if tvj_output[0]:
        game = lmg.Game(json.load(open(TEST_NORMALISED_JSON_PATH)))
        game.overwrite_game_state({(4, 3): "white_bishop"})

        legal_moves = game.get_legal_moves((4, 3))

        return legal_moves

def test_normalise_json():
    test_data = json.load(open(TEST_SIMPLE_JSON_PATH))
    print(jn.normalise_json(test_data))

def debug_movement():

    game = lmg.Game(json.load(open(TEST_NORMALISED_JSON_PATH)))
    game.set_debug_mode(True)
    game.overwrite_game_state({(0, 0): "white_knight", (1, 2): "black_pawn", (0, 1): "white_queen", (1, 0): "white_pawn"})
    # game.overwrite_game_state({(0, 0): "white_knight", (1, 2): "black_pawn", (2, 1): "black_pawn", (0, 4): "black_pawn", (4, 2): "black_pawn"})
    # game.overwrite_game_state_raw({(3, 3): Piece((3, 3), 0, "white_pawn", {"has_not_moved": True}), (5, 5): Piece((5, 5), 1, "black_queen", {"has_not_moved": False})})
    game_state = game.get_game_state(True)
    display_game_state(game_state[0], game_state[1], True)
    legal_moves = game.get_legal_moves((0, 1))
    print(legal_moves)

def test_ilmg():
    game_state = ilmg.get_start_game_state(json.load(open(TEST_NORMALISED_JSON_PATH)))
    print(ilmg.make_move(game_state, (0, 0), (0, 1)))

test_ilmg()
