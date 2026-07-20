from .common import *

from .json_model_subclasses.setup import Setup
from .json_model_subclasses.condition import Condition
from .json_model_subclasses.move import Move
from .json_model_subclasses.piece import Piece

from .cross_validator.cross_validator import *

class VariantRules(StrictBaseModel):
    setup: Setup
    conditions: dict[str, Condition]
    moves: dict[str, Move]
    pieces: dict[str, Piece]

    @model_validator(mode="after")
    def model_cross_validate(self):
        cross_validate(self)
        return self
