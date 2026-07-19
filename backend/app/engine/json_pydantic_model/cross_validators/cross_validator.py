from ..common import *
if TYPE_CHECKING:
    from ..json_model import VariantRules

def cross_validate(variant_rules: VariantRules):
    variant_rules.setup.cross_validate(variant_rules)
