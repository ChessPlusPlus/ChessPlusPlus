import json

from app.core.redis import redis_client

def create_game(game_id: str, rules: dict, game_state: dict):
	redis_client.set(f"game:{game_id}", json.dumps({
		"rules": rules,
		"game_state": game_state,
	}))

def get_game_info(game_id: str):
	game_info = redis_client.get(f"game:{game_id}")
	if game_info is None:
		return None

	game_info = json.loads(game_info)
	return game_info

def get_game_state(game_id: str):
	if get_game_info(game_id) is None:
		return None

	game_info = get_game_info(game_id)
	return game_info["game_state"]

def update_game_info(game_id: str, game_info: dict):
	redis_client.set(f"game:{game_id}", json.dumps(game_info))

def update_game_state(game_id: str, game_state: dict):
	game_info = get_game_info(game_id)
	game_info["game_state"] = game_state
	
	update_game_info(game_id, game_info)
