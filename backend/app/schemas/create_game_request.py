from app.schemas.base_schema import BaseSchema
from app.schemas.legal_move_generator_request import SetupRules

class CreateGameRequest(BaseSchema):
	json: dict
	serialise: bool

class CreateGameResponse(BaseSchema):
	game_id: str
	game_state: list[tuple[tuple[int, int], str]]
	board_size: tuple[int, int]
