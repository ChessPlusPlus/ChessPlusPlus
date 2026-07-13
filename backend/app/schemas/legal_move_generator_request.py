from app.schemas.base_schema import BaseSchema

class SetupRules(BaseSchema):
    piece_ownership: dict[str, list[str]]
    board_x_size: int
    board_y_size: int
    starting_position: list[tuple[tuple[int, int], str]]

class GenerateLegalMovesRequest(BaseSchema):
    piece_name: str
    current_pos: tuple[int, int]
    game_state: list[tuple[tuple[int, int], str]]
    piece_ruleset: dict
    setup_rules: SetupRules
    movement_rules: dict

class GenerateLegalMovesResponse(BaseSchema):
    legal_moves: dict[str, list[tuple[int, int]]]