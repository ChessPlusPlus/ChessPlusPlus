from ..common import *

class Move(StrictBaseModel):
    move_name: str

    def cross_validate(self, variant_rules: VariantRules):
        check_move_exists(self.move_name, variant_rules)

class ChainedMove(Move):
    valid_move: bool
    terminate_on_stop: bool

class Piece(StrictBaseModel):
    moveset: list[Move | list[ChainedMove]]

    def cross_validate(self, variant_rules: VariantRules):
        for move in self.moveset:
            if isinstance(move, Move):
                move.cross_validate(variant_rules)
            elif isinstance(move, list):
                for chained_move in move:
                    chained_move.cross_validate(variant_rules)
