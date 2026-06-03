import copy

class Piece:
    def __init__(self, position: tuple, piece_id: int, piece_name: str, data: dict):
        self.position = position
        self.piece_id = piece_id
        self.piece_name = piece_name
        # note that data must be JSON compatible
        self.data = data

    def __repr__(self):
        return f"PieceObject={{position: {self.position}, piece_id: {self.piece_id}, piece_name: {self.piece_name}, data: {self.data}}}"

def convert_piece_to_dict(piece: Piece):
    return {
        "position": {
            "x_pos": piece.position[0],
            "y_pos": piece.position[1]
        },
        "piece_id": piece.piece_id,
        "piece_name": piece.piece_name,
        "data": piece.data
    }

def convert_dict_to_piece(piece_dict: dict):
    return Piece(
        (piece_dict["position"]["x_pos"], piece_dict["position"]["y_pos"]),
        piece_dict["piece_id"],
        piece_dict["piece_name"],
        copy.deepcopy(piece_dict["data"])
    )
