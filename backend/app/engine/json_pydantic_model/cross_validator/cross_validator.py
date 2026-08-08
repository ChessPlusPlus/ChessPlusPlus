from __future__ import annotations
from ..common import *
from .condition_cyclicity_detector import check_for_cyclicity_in_conditions
if TYPE_CHECKING:
    from ..json_model import VariantRules

def cross_validate(variant_rules: VariantRules):
    variant_rules.setup.cross_validate(variant_rules)

    for condition in variant_rules.conditions.values():
        condition.cross_validate(variant_rules)
    if (output := check_for_cyclicity_in_conditions(variant_rules))[0]:
        raise ValueError(f"Cyclcity in conditions: {output[1]}")


