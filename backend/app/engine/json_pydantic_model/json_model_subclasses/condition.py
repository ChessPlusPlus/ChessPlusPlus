from ..common import *

class BaseCondition(StrictBaseModel):
    invert: bool

class ParameterCondition(BaseCondition):
    condition: str

class Parametered(BaseCondition):
    type: Literal["all_of", "any_of"]
    conditions: list[ParameterCondition] = Field(min_length=1)

class SquareOccupied(BaseCondition):
    type: Literal["square_occupied"]
    offset_x: int
    offset_y: int

class Range(BaseCondition):
    type: Literal["range"]
    value_source: str
    offset: int
    min: int | Literal["inf"]
    max: int | Literal["inf"]

    @model_validator(mode="after")
    def validate(self):
        min_value = float("inf") if self.min == "inf" else self.min
        max_value = float("inf") if self.max == "inf" else self.max
        if max_value < min_value:
            raise ValueError
        return self

Condition = Annotated[Parametered | SquareOccupied | Range, Field(discriminator="type")]
