
# errors here must not be catchable by the json validator

class StationaryMoveError(Exception):
    pass
class NoPieceFoundError(Exception):
    pass
