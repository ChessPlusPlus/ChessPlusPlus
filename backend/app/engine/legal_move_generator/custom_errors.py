
# errors here must not be catchable by the json validator

class StationaryMoveError(Exception):
    pass
class NoPieceFoundError(Exception):
    pass
class NotVariantRulesInstanceError(Exception):
    pass
class InvalidJSONRulesError(Exception):
    pass
