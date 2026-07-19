
from pydantic import BaseModel, ConfigDict, model_validator, Field
from typing import TYPE_CHECKING, Literal, Annotated
from cross_validators.helpers import *

if TYPE_CHECKING:
    from .json_model import VariantRules

class StrictBaseModel(BaseModel):
    model_config = ConfigDict(extra="forbid")
