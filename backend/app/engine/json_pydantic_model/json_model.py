from pydantic import ValidationError

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

def get_json_pydantic_model(raw_json_str: str) -> VariantRules | list[dict]: # either returns the variant rules or all the errors found
    try:
        model = VariantRules.model_validate_json(raw_json_str)
    except ValidationError as e:
        return e.errors()
    return model

def validate_json_pydantic_model(model: VariantRules) -> tuple[bool, None | list[dict]]:
    try:
        VariantRules.model_validate(model)
    except ValidationError as e:
        return e.errors()

    return True, None
