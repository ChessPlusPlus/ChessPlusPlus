from common import *

class StartingPosition(BaseModel):
    piece_name: str
    x_pos: int
    y_pos: int

class Setup(BaseModel):
    piece_ownership: dict[str, list[str]]
    board_x_size: int = Field(..., gt=0)
    board_y_size: int = Field(..., gt=0)
    starting_position: list[StartingPosition]
