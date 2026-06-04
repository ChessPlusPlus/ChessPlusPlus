import json
import time

from app.core.redis import redis_client

async def create_game(game_id: str, rules: dict, game_state: dict):
	await redis_client.set(f"game:{game_id}", json.dumps({
		"rules": rules,
		"game_state": game_state,
	}))

async def get_game_info(game_id: str):
	store_retrieval_start = time.perf_counter()
	game_info = await redis_client.get(f"game:{game_id}")
	store_retrieval_end = time.perf_counter()
	time_taken = store_retrieval_end - store_retrieval_start
	print(f"store_retrieval took {time_taken:.6f} seconds")
	print(f"store_retrieval took {time_taken * 1000:.6f} milliseconds")

	if game_info is None:
		return None

	return json.loads(game_info)

async def get_game_state(game_id: str):
	game_info = await get_game_info(game_id)
	if game_info is None:
		return None

	return game_info["game_state"]

async def update_game_info(game_id: str, game_info: dict):
	await redis_client.set(f"game:{game_id}", json.dumps(game_info))

async def update_game_state(game_id: str, game_state: dict):
	game_info = await get_game_info(game_id)
	if game_info is None:
		return None

	game_info["game_state"] = game_state
	
	await update_game_info(game_id, game_info)
