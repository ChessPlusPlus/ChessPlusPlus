import uuid
import itertools
import json
import time

from fastapi import APIRouter

from app.schemas.create_game_request import CreateGameRequest, CreateGameResponse
from app.schemas.game_legal_move_generation_request import GameLegalMoveGenerationRequest, GameLegalMoveGenerationResponse
from app.schemas.game_make_move_request import GameMakeMoveRequest, GameMakeMoveResponse

from app.engine.legal_move_generator.legal_move_generator import Game, Piece
from app.engine.legal_move_generator.instanceless_legal_move_generator import InstancelessLegalMoveGenerator
from app.utils.case_converter import convert_camel_to_snake
from app.utils.starting_position_serialiser import serialise_starting_position
from app.core.game_store import get_game_info, update_game_state, create_game as create_game_in_store

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

	start_game_state = InstancelessLegalMoveGenerator.get_start_game_state(rules)

	await create_game_in_store(game_id, rules, start_game_state)

	return CreateGameResponse(
		game_id=game_id, 
		game_state=InstancelessLegalMoveGenerator.get_simple_game_state(start_game_state)
	)

@router.post("/generate-legal-moves", response_model=GameLegalMoveGenerationResponse)
async def generate_legal_moves(request: GameLegalMoveGenerationRequest):
	full_legal_moves_start = time.perf_counter()
	game_info = await get_game_info(request.game_id)

	if game_info is None:
		return GameLegalMoveGenerationResponse(legal_moves=None)

	legal_moves = InstancelessLegalMoveGenerator.get_legal_moves(
		rules=game_info["rules"],
		json_game_state=game_info["game_state"],
		piece_position=request.current_pos,
	)
	
	legal_moves = list(itertools.chain(*legal_moves.values()))

	full_legal_moves_end = time.perf_counter()
	time_taken = full_legal_moves_end - full_legal_moves_start
	print(f"full_legal_moves took {time_taken:.6f} seconds")
	print(f"full_legal_moves took {time_taken * 1000:.6f} milliseconds")

	return GameLegalMoveGenerationResponse(legal_moves=legal_moves)

@router.post("/process-move", response_model=GameMakeMoveResponse)
async def process_move(request: GameMakeMoveRequest):
	game_info = await get_game_info(request.game_id)
	if game_info is None:
		return GameMakeMoveResponse(valid_move=False, new_game_state=None)

	legal_moves = InstancelessLegalMoveGenerator.get_legal_moves(
		rules=game_info["rules"],
		json_game_state=game_info["game_state"],
		piece_position=request.piece_start_pos,
	)

	legal_moves = list(itertools.chain(*legal_moves.values()))

	simplified_new_game_state = None
	if request.piece_end_pos in legal_moves:
		raw_new_game_state = InstancelessLegalMoveGenerator.make_move(
			json_game_state=game_info["game_state"],
			piece_start_position=request.piece_start_pos,
			piece_end_position=request.piece_end_pos,
		)

		simplified_new_game_state = InstancelessLegalMoveGenerator.get_simple_game_state(raw_new_game_state)

		await update_game_state(request.game_id, raw_new_game_state)

		valid_move = True
	else:
		valid_move = False

	return GameMakeMoveResponse(valid_move=valid_move, new_game_state=simplified_new_game_state)