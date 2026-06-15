import json
import pickle
import time

from app.core.redis import redis_client
from backend.app.engine.legal_move_generator.legal_move_generator import Game

async def create_game(game_id: str, game_class: Game):
	await redis_client.set(f"game:{game_id}", pickle.dumps(game_class))


async def get_game_class(game_id: str):
	store_retrieval_start = time.perf_counter()
	game_class = await redis_client.get(f"game:{game_id}")
	store_retrieval_end = time.perf_counter()
	time_taken = store_retrieval_end - store_retrieval_start
	print(f"store_retrieval took {time_taken:.6f} seconds")
	print(f"store_retrieval took {time_taken * 1000:.6f} milliseconds")

	if game_class is None:
		return None

	return pickle.loads(game_class)

async def get_game_state(game_id: str):
	game_class = await get_game_class(game_id)
	if game_class is None:
		return None

	return game_class.get_game_state()

async def update_game_class(game_id: str, game_class: Game):
	await redis_client.set(f"game:{game_id}", pickle.dumps(game_class))