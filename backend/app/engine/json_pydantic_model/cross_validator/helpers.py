from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from ..json_model import VariantRules

def check_range(value, min_value=None, max_value=None):
    passed = True
    if min_value is not None and value < min_value:
        passed = False
    if max_value is not None and value > max_value:
        passed = False
    if not passed:
        raise ValueError(f"{value} is not within {min_value} and {max_value}")

def check_piece_exists(piece_name, variant_rules: VariantRules):
    if piece_name not in variant_rules.pieces:
        raise ValueError(f"\"{piece_name}\" piece does not exist")

def check_condition_exits(condition_name, variant_rules: VariantRules):
    if condition_name not in variant_rules.conditions:
        raise ValueError(f"\"{condition_name}\" condition does not exist")

def check_move_exists(move_name, variant_rules: VariantRules):
    if move_name not in variant_rules.moves:
        raise ValueError(f"\"{move_name}\" move does not exist")
