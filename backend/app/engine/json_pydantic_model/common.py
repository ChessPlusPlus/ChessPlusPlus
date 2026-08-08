from __future__ import annotations
from pydantic import BaseModel, ConfigDict, model_validator, Field
from typing import TYPE_CHECKING, Literal, Annotated
from .cross_validator.helpers import *

if TYPE_CHECKING:
    from .json_model import VariantRules

class StrictBaseModel(BaseModel):
    model_config = ConfigDict(strict=True, extra="forbid")

    def cross_validate(self, variant_rules: VariantRules):
        pass
