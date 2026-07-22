from pydantic.v1 import PositiveInt

from ..common import *

class MoveDefinition(StrictBaseModel):
    move_x: int
    move_y: int
    range: Literal["inf"] | Annotated[int, Field(..., ge=0)]
    move_stop_conditions: list[str]

    @model_validator(mode="after")
    def validate_x_y_zero(self):
        if self.move_x == 0 and self.move_y == 0:
            raise ValueError("Both move_x and move_y cannot be zero")

    def cross_validate(self, variant_rules: VariantRules):
        for move_stop_condition in self.move_stop_conditions:
            check_condition_exits(move_stop_condition, variant_rules)

class Move(StrictBaseModel):
    start_conditions: list[str]
    move_definition: MoveDefinition
    end_conditions: list[str]

    def cross_validate(self, variant_rules: VariantRules):
        for start_condition in self.start_conditions:
            check_condition_exits(start_condition, variant_rules)
        self.move_definition.cross_validate(variant_rules)
        for end_condition in self.end_conditions:
            check_condition_exits(end_condition, variant_rules)
