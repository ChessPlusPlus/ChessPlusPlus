import uuid
import itertools

from fastapi import APIRouter

from app.schemas.create_game_request import CreateGameRequest, CreateGameResponse
from app.schemas.game_legal_move_generation_request import GameLegalMoveGenerationRequest, GameLegalMoveGenerationResponse
from app.schemas.game_make_move_request import GameMakeMoveRequest, GameMakeMoveResponse

from app.engine.legal_move_generator.legal_move_generator import Game, Piece
from app.utils.case_converter import convert_camel_to_snake
from app.utils.starting_position_serialiser import serialise_starting_position

active_games = {}

router = APIRouter()

@router.post("/create-game", response_model=CreateGameResponse)
async def create_game(request: CreateGameRequest):
	game_id = str(uuid.uuid4())
	
	setup_rules = {
		"piece_ownership": request.setup_rules.piece_ownership,
		"board_x_size": request.setup_rules.board_x_size,
		"board_y_size": request.setup_rules.board_y_size,
		"starting_position": serialise_starting_position(request.setup_rules.starting_position),
	}

	piece_ruleset = convert_camel_to_snake(request.piece_ruleset, [0])
	movement_rules = convert_camel_to_snake(request.movement_rules, [0])

	rules = {
		"pieces": piece_ruleset,
		"moves": movement_rules,
		"setup": setup_rules,
	}

	game_instance = Game(rules)

	id_counter = 0
	for starting_piece in setup_rules["starting_position"]:
		square = (starting_piece["x_pos"], starting_piece["y_pos"])
		piece_name = starting_piece["piece_name"]

		game_instance._game_state[square] = Piece(
			position=square,
			piece_id=id_counter,
			piece_name=piece_name,
			data={ "has_not_moved": True }
		)

		id_counter += 1

	active_games[game_id] = game_instance

	return CreateGameResponse(
		game_id=game_id, 
		game_state=list[tuple[tuple[int, int], str]]((entry[0], entry[1].piece_name) for entry in game_instance.get_game_state().items())
	)

@router.post("/generate-legal-moves", response_model=GameLegalMoveGenerationResponse)
async def generate_legal_moves(request: GameLegalMoveGenerationRequest):
	game_instance = active_games.get(request.game_id)
	print(f"Game instance: {game_instance}")
	print(f"Requested game ID: {request.game_id}")
	print(f"Active games: {active_games}")

	if game_instance is None:
		return GameLegalMoveGenerationResponse(legal_moves=None)

	legal_moves = game_instance.get_legal_moves(request.current_pos)
	legal_moves = list(itertools.chain(*legal_moves.values()))

	return GameLegalMoveGenerationResponse(legal_moves=legal_moves)

@router.post("/process-move", response_model=GameMakeMoveResponse)
async def process_move(request: GameMakeMoveRequest):
	game_instance = active_games.get(request.game_id)
	if game_instance is None:
		return GameMakeMoveResponse(valid_move=False, new_game_state=None)

	legal_moves = game_instance.get_legal_moves(request.piece_start_pos)
	legal_moves = list(itertools.chain(*legal_moves.values()))

	if request.piece_end_pos in legal_moves:
		game_instance.make_move(request.piece_start_pos, request.piece_end_pos)
		valid_move = True
	else:
		valid_move = False

	if valid_move:
		new_game_state = list[tuple[tuple[int, int], str]]((entry[0], entry[1].piece_name) for entry in game_instance.get_game_state().items())
	else:
		new_game_state = None

	return GameMakeMoveResponse(valid_move=valid_move, new_game_state=new_game_state)