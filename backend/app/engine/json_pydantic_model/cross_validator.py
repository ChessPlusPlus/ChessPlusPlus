from .common import *

class Helpers:

    @staticmethod
    def check_range(value, min_value=None, max_value=None):
        passed = True
        if min_value is not None and value < min_value:
            passed = False
        if max_value is not None and value > max_value:
            passed = False
        if not passed:
            raise ValueError

    @staticmethod
    def check_piece_exists(piece_name, variant_rules):
        if piece_name not in variant_rules.pieces:
            raise ValueError

class Components:

    @staticmethod
    def piece_ownership_check(variant_rules):
        pass

    @staticmethod
    def start_piece_check(variant_rules):
        board_x_size = variant_rules.setup.board_x_size
        board_y_size = variant_rules.setup.board_y_size
        for piece_starting in variant_rules.setup.starting_position:
            Helpers.check_piece_exists(piece_starting.piece_name, variant_rules)
            Helpers.check_range(piece_starting.x_pos, 0, board_x_size)
            Helpers.check_range(piece_starting.y_pos, 0, board_y_size)

class CrossValidator:
    
    @staticmethod
    def validate(variant_rules):
        Components.start_piece_check(variant_rules)

