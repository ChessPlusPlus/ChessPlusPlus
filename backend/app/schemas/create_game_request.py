from app.schemas.base_schema import BaseSchema
from app.schemas.legal_move_generator_request import SetupRules

class CreateGameRequest(BaseSchema):
	setup_rules: SetupRules
	piece_ruleset: dict
	movement_rules: dict

class CreateGameRequestRaw(BaseSchema):
	json: dict

class CreateGameResponse(BaseSchema):
	game_id: str
	game_state: list[tuple[tuple[int, int], str]]
	board_size: tuple[int, int]
