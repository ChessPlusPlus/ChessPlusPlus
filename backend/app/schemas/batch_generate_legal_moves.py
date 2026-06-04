from app.schemas.base_schema import BaseSchema

class BatchGenerateLegalMovesRequest(BaseSchema):
	game_id: str

class BatchGenerateLegalMovesResponse(BaseSchema):
	legal_moves: list[tuple[tuple[int, int], list[tuple[int, int]]]] | None
