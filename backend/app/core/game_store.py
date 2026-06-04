from app.core.redis import redis_client

def create_game(game_id: str, rules: dict, game_state: dict):
	redis_client.set(f"game:{game_id}", json.dumps({
		"rules": rules,
		"game_state": game_state,
	}))

def get_game_state(game_id: str):
	game_info = json.loads(redis_client.get(f"game:{game_id}"))
	return game_info["game_state"]

def update_game_state(game_id: str, game_state: dict):
	redis_client.set(f"game:{game_id}", json.dumps({
		"rules": rules,
		"game_state": game_state,
	}))