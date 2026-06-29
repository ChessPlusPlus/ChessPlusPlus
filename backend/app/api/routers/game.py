import uuid
import itertools
import json
import time

from fastapi import APIRouter

from app.schemas.create_game_request import CreateGameRequest, CreateGameResponse
from app.schemas.game_legal_move_generation_request import GameLegalMoveGenerationRequest, GameLegalMoveGenerationResponse
from app.schemas.game_make_move_request import GameMakeMoveRequest, GameMakeMoveResponse
from app.schemas.batch_generate_legal_moves import BatchGenerateLegalMovesRequest, BatchGenerateLegalMovesResponse

from app.engine.legal_move_generator.legal_move_generator import Game, Piece
from app.utils.case_converter import convert_camel_to_snake
from app.utils.starting_position_serialiser import serialise_starting_position
from app.core.game_store import get_game_instance, update_game_instance, create_game as create_game_in_store

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
	await create_game_in_store(game_id, game_instance)

	return CreateGameResponse(
		game_id=game_id, 
		game_state=dict.items(game_instance.get_game_state())
	)

@router.post("/generate-legal-moves", response_model=GameLegalMoveGenerationResponse)
async def generate_legal_moves(request: GameLegalMoveGenerationRequest):
	full_legal_moves_start = time.perf_counter()
	game_instance = await get_game_instance(request.game_id)

	if game_instance is None:
		return GameLegalMoveGenerationResponse(legal_moves=None)

	legal_moves = game_instance.get_legal_moves(request.current_pos)
	
	legal_moves = list(itertools.chain(*legal_moves.values()))

	full_legal_moves_end = time.perf_counter()
	time_taken = full_legal_moves_end - full_legal_moves_start
	print(f"full_legal_moves took {time_taken:.6f} seconds")
	print(f"full_legal_moves took {time_taken * 1000:.6f} milliseconds")

	return GameLegalMoveGenerationResponse(legal_moves=legal_moves)

@router.post("/batch-generate-legal-moves", response_model=BatchGenerateLegalMovesResponse)
async def batch_generate_legal_moves(request: BatchGenerateLegalMovesRequest):
	game_instance = await get_game_instance(request.game_id)
	if game_instance is None:
		return BatchGenerateLegalMovesResponse(legal_moves=None)

	all_legal_moves = []
	game_state = game_instance.get_game_state()
	for position in game_state.keys():
		legal_moves = game_instance.get_legal_moves(position)
		piece_legal_moves = list(itertools.chain(*legal_moves.values()))
		all_legal_moves.append((position, piece_legal_moves))

	return BatchGenerateLegalMovesResponse(legal_moves=all_legal_moves)

@router.post("/process-move", response_model=GameMakeMoveResponse)
async def process_move(request: GameMakeMoveRequest):
	game_instance = await get_game_instance(request.game_id)
	if game_instance is None:
		return GameMakeMoveResponse(valid_move=False, new_game_state=None)

	legal_moves = game_instance.get_legal_moves(request.piece_start_pos)

	legal_moves = list(itertools.chain(*legal_moves.values()))

	simplified_new_game_state = None
	if request.piece_end_pos in legal_moves:
		game_instance.make_move(request.piece_start_pos, request.piece_end_pos)
		await update_game_instance(request.game_id, game_instance)
		simplified_new_game_state = dict.items(game_instance.get_game_state())

		valid_move = True
	else:
		valid_move = False

	return GameMakeMoveResponse(valid_move=valid_move, new_game_state=simplified_new_game_state)