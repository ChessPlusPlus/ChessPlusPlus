from app.engine.json_validator.components import *

def validate_json(data: dict):

    if not (temp := check_keys(data, {"setup", "pieces", "moves", "conditions"}, "main"))[0]:
        return temp

    if not (temp := check_keys(data["setup"], {"piece_ownership", "board_x_size", "board_y_size", "starting_position"}, "main/setup"))[0]:
        return temp

    if get_if_wrong_data_type(data["pieces"], dict):
        return False, get_wrong_data_type_error_message(type(data["pieces"]), dict, "main/pieces (value)")
    if get_if_wrong_data_type(data["setup"]["piece_ownership"], dict):
        return False, get_wrong_data_type_error_message(type(data["setup"]["piece_ownership"]), dict, "main/setup/piece_ownership (value)")
    for player, pieces_array in data["setup"]["piece_ownership"].items():
        wrong_values = get_invalid(set(data["pieces"].keys()), set(pieces_array))
        if wrong_values != set():
            return False, get_wrong_values_error_message(wrong_values, f"main/setup/piece_ownership/{player} (values)", "Wrong pieces do not exist in \"main/pieces (keys)\"")

    if not (temp := check_range(data["setup"]["board_x_size"], 1, inf, "main/setup/board_x_size"))[0]:
        return temp

    if not (temp := check_range(data["setup"]["board_y_size"], 1, inf, "main/setup/board_y_size"))[0]:
        return temp

    if get_if_wrong_data_type(data["setup"]["starting_position"], list):
        return False, get_wrong_data_type_error_message(type(data["setup"]["starting_position"]), list, "main/setup/starting_position (value)")
    for index, piece in enumerate(data["setup"]["starting_position"]):
        if get_if_wrong_data_type(piece, dict):
            return False, get_wrong_data_type_error_message(type(piece), dict, f"main/setup/starting_position/[{index}]")
        if not (temp := check_keys(piece, {"piece_name", "x_pos", "y_pos"}, f"main/setup/starting_position/[{index}]"))[0]:
            return temp
        if get_if_wrong_data_type(piece["piece_name"], str):
            return False, get_wrong_data_type_error_message(type(piece["piece_name"]), str, f"main/setup/starting_position/[{index}]/piece_name (value)")
        if piece["piece_name"] not in data["pieces"].keys():
            return False, get_wrong_values_error_message(piece["piece_name"], f"main/setup/starting_position/[{index}]/piece_name (value)", "Wrong piece does not exist in \"main/pieces (keys)\"")
        if not (temp := check_range(piece["x_pos"], 0, data["setup"]["board_x_size"] - 1, f"main/setup/starting_position/[{index}]/x_pos"))[0]:
            return temp
        if not (temp := check_range(piece["y_pos"], 0, data["setup"]["board_y_size"] - 1, f"main/setup/starting_position/[{index}]/y_pos"))[0]:
            return temp

    if get_if_wrong_data_type(data["moves"], dict):
        return False, get_wrong_data_type_error_message(type(data["moves"]), dict, "main/moves (value)")
    for move_name, move in data["moves"].items():
        if get_if_wrong_data_type(move, dict):
            return False, get_wrong_data_type_error_message(type(move), dict, f"main/moves/{move_name} (value)")
        if not (temp := check_keys(move, {"start_conditions", "end_conditions", "move_definition"}, f"main/moves/{move_name}"))[0]:
            return temp

        if get_if_wrong_data_type(move["start_conditions"], list):
            return False, get_wrong_data_type_error_message(type(move["start_conditions"]), list, f"main/moves/{move_name}/start_conditions (value)")
        for index, start_condition in enumerate(move["start_conditions"]):
            if get_if_wrong_data_type(start_condition, str):
                return False, get_wrong_data_type_error_message(type(start_condition), str, f"main/moves/{move_name}/start_conditions/[{index}] (value)")
        wrong_values = get_invalid(set(data["conditions"].keys()), set(move["start_conditions"]))
        if wrong_values != set():
            return False, get_wrong_values_error_message(wrong_values, f"main/moves/{move_name}/start_conditions (values)", "Wrong conditions do not exist in \"main/conditions (keys)\"")

        if get_if_wrong_data_type(move["end_conditions"], list):
            return False, get_wrong_data_type_error_message(type(move["end_conditions"]), list, f"main/moves/{move_name}/conditions (value)")
        for index, end_condition in enumerate(move["end_conditions"]):
            if get_if_wrong_data_type(end_condition, str):
                return False, get_wrong_data_type_error_message(type(end_condition), str, f"main/moves/{move_name}/end_conditions/[{index}] (value)")
        wrong_values = get_invalid(set(data["conditions"].keys()), set(move["end_conditions"]))
        if wrong_values != set():
            return False, get_wrong_values_error_message(wrong_values, f"main/moves/{move_name}/end_conditions (values)", "Wrong conditions do not exist in \"main/conditions (keys)\"")

        if get_if_wrong_data_type(move["move_definition"], dict):
            return False, get_wrong_data_type_error_message(type(move["move_definition"]), dict, f"main/moves/{move_name}/move_definition (value)")
        if not (temp := check_keys(move["move_definition"], {"move_x", "move_y", "range", "move_stop_conditions"}, f"main/moves/{move_name}/move_definition"))[0]:
            return temp
        if get_if_wrong_data_type(move["move_definition"]["move_x"], int):
            return False, get_wrong_data_type_error_message(type(move["move_definition"]["move_x"]), int, f"main/moves/{move_name}/move_definition/move_x (value)")
        if get_if_wrong_data_type(move["move_definition"]["move_y"], int):
            return False, get_wrong_data_type_error_message(type(move["move_definition"]["move_y"]), int, f"main/moves/{move_name}/move_definition/move_y (value)")
        if move["move_definition"]["range"] != "inf":
            if get_if_wrong_data_type(move["move_definition"]["range"], int):
                return False, get_wrong_data_type_error_message(type(move["move_definition"]["range"]), int, f"main/moves/{move_name}/move_definition/range (value)")
        if get_if_wrong_data_type(move["move_definition"]["move_stop_conditions"], list):
            return False, get_wrong_data_type_error_message(type(move["move_definition"]["move_stop_conditions"]), list, f"main/moves/{move_name}/move_definition/move_stop_conditions (value)")
        wrong_values = get_invalid(set(data["conditions"].keys()), set(move["move_definition"]["move_stop_conditions"]))
        if wrong_values != set():
            return False, get_wrong_values_error_message(wrong_values, f"main/moves/{move_name}/move_definition/move_stop_conditions (values)", "Wrong conditions do not exist in \"main/conditions (keys)\"")

    for piece_name, piece in data["pieces"].items():
        if get_if_wrong_data_type(piece, dict):
            return False, get_wrong_data_type_error_message(type(piece), dict, f"main/pieces/{piece_name} (value)")
        if not (temp := check_keys(piece, {"moveset"}, f"main/pieces/{piece_name}"))[0]:
            return temp
        if get_if_wrong_data_type(piece["moveset"], list):
            return False, get_wrong_data_type_error_message(type(piece["moveset"]), list, f"main/pieces/{piece_name}/moveset (value)")

        for index, move in enumerate(piece["moveset"]):
            if get_if_wrong_data_type(move, (dict, list), True):
                return False, get_wrong_data_type_error_message(type(move), (dict, list), f"main/pieces/{piece_name}/moveset/[{index}] (value)")
            if isinstance(move, dict):
                if not (temp := check_keys(move, {"move_name"}, f"main/pieces/{piece_name}/moveset/[{index}]"))[0]:
                    return temp
                if get_if_wrong_data_type(move["move_name"], str):
                    return False, get_wrong_data_type_error_message(type(move["move_name"]), str, f"main/pieces/{piece_name}/moveset/[{index}]/move_name (value)")
                if move["move_name"] not in data["moves"].keys():
                    return False, f"\"{move["move_name"]}\" does not exist in \"main/moves\". Location: main/pieces/{piece_name}/moveset/[{index}]/move_name (value)"
            elif isinstance(move, list):
                has_valid_move = False
                for cindex, cmove in enumerate(move):
                    if get_if_wrong_data_type(cmove, dict):
                        return False, get_wrong_data_type_error_message(type(cmove), dict, f"main/pieces/{piece_name}/moveset/[{index}]/[{cindex}] (value)")
                    if not (temp := check_keys(cmove, {"move_name", "valid_move", "terminate_on_stop"}, f"main/pieces/{piece_name}/moveset/[{index}]/[{cindex}]"))[0]:
                        return temp
                    if get_if_wrong_data_type(cmove["move_name"], str):
                        return False, get_wrong_data_type_error_message(type(cmove["move_name"]), str, f"main/pieces/{piece_name}/moveset/[{index}]/[{cindex}]/move_name (value)")
                    if cmove["move_name"] not in data["moves"].keys():
                        return False, f"\"{cmove["move_name"]}\" does not exist in \"main/moves\". Location: main/pieces/{piece_name}/moveset/[{index}]/[{cindex}]/move_name (value)"
                    if get_if_wrong_data_type(cmove["valid_move"], bool):
                        return False, get_wrong_data_type_error_message(type(cmove["valid_move"]), bool, f"main/pieces/{piece_name}/moveset/[{index}]/[{cindex}]/valid_move (value)")
                    if get_if_wrong_data_type(cmove["terminate_on_stop"], bool):
                        return False, f"main/pieces/{piece_name}/moveset/[{index}]/[{cindex}]/terminate_on_stop (value)"
                    if cmove["valid_move"] == True:
                        has_valid_move = True
                if has_valid_move == False:
                    return False, f"Impossibility error detected. Chained move must have at least one \"valid_move\" set to True. Location: main/pieces/{piece_name}/moveset/[{index}] (values)"

    return True, "No errors detected! :)"
