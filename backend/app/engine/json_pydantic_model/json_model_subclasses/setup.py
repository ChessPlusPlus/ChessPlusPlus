from __future__ import annotations
from ..common import *

if TYPE_CHECKING:
    from ..json_model import VariantRules

class StartingPiece(StrictBaseModel):
    piece_name: str
    x_pos: int
    y_pos: int

    def cross_validate(self, variant_rules: VariantRules):
        check_piece_exists(self.piece_name, variant_rules)
        check_range(self.x_pos, 0, variant_rules.setup.board_x_size - 1)
        check_range(self.y_pos, 0, variant_rules.setup.board_y_size - 1)

class Setup(StrictBaseModel):
    piece_ownership: dict[str, list[str]]
    board_x_size: int = Field(..., gt=0)
    board_y_size: int = Field(..., gt=0)
    starting_position: list[StartingPiece]

    def cross_validate(self, variant_rules: VariantRules):
        for pieces in self.piece_ownership.values():
            for piece_name in pieces:
                check_piece_exists(piece_name, variant_rules)

        for starting_piece in self.starting_position:
            starting_piece.cross_validate(variant_rules)
