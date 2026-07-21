from ..common import *

class BaseCondition(StrictBaseModel):
    invert: bool

class ParameterCondition(BaseCondition):
    condition: str

    def cross_validate(self, variant_rules: VariantRules):
        check_piece_exists(self.condition, variant_rules)

class Logical(BaseCondition):
    conditions: list[ParameterCondition] = Field(min_length=1)

    def cross_validate(self, variant_rules: VariantRules):
        used_parameter_conditions = set()
        for parameter_condition in self.conditions:
            parameter_condition.cross_validate(variant_rules)
            if parameter_condition not in used_parameter_conditions:
                used_parameter_conditions.add(parameter_condition.condition)
            else:
                raise ValueError(f"Duplicate condition {parameter_condition.condition} in logical condition")

class AllOf(Logical):
    type: Literal["all_of"]

class AnyOf(Logical):
    type: Literal["any_of"]

class SquareOccupied(BaseCondition):
    type: Literal["square_occupied"]
    offset_x: int
    offset_y: int

class Range(BaseCondition):
    type: Literal["range"]
    value_source: Literal["piece_x", "piece_y", "piece_move_count"]
    offset: int
    min: int | Literal["inf"]
    max: int | Literal["inf"]

    @model_validator(mode="after")
    def validate_min_max(self):
        min_value = float("inf") if self.min == "inf" else self.min
        max_value = float("inf") if self.max == "inf" else self.max
        if max_value < min_value:
            raise ValueError(f"max ({max_value}) cannot be smaller than min ({min_value})")
        return self

Condition = Annotated[AllOf | AnyOf | SquareOccupied | Range, Field(discriminator="type")]
