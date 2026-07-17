
from pydantic import BaseModel, ConfigDict, model_validator, Field
from typing import TYPE_CHECKING

class StrictBaseModel(BaseModel):
    model_config = ConfigDict(extra="forbid")
