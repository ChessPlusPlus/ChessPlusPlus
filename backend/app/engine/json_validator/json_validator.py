from app.engine.json_validator.helper_functions import HelperGet
from app.engine.json_validator.components import Component
from app.engine.json_validator.error_messages import ErrorMessageGet

from app.engine.json_validator.condition_types import CONDITION_TYPES
from app.engine.json_validator.value_sources import VALUE_SOURCES

inf = float("inf")

def validate_json(data: dict):

    if not (temp := Component.check_keys(data, {"setup", "pieces", "moves", "conditions"}, "main"))[0]:
        return temp

    if not (temp := Component.check_keys(data["setup"], {"piece_ownership", "board_x_size", "board_y_size", "starting_position"}, "main/setup"))[0]:
        return temp

    if HelperGet.if_wrong_data_type(data["pieces"], dict):
        return False, ErrorMessageGet.wrong_data_type(type(data["pieces"]), dict, "main/pieces (value)")
    if HelperGet.if_wrong_data_type(data["setup"]["piece_ownership"], dict):
        return False, ErrorMessageGet.wrong_data_type(type(data["setup"]["piece_ownership"]), dict, "main/setup/piece_ownership (value)")
    for player, pieces_array in data["setup"]["piece_ownership"].items():
        wrong_values = HelperGet.invalid(set(data["pieces"].keys()), set(pieces_array))
        if wrong_values != set():
            return False, ErrorMessageGet.wrong_values(wrong_values, f"main/setup/piece_ownership/{player} (values)", "Wrong pieces do not exist in \"main/pieces (keys)\"")

    if not (temp := Component.check_range(data["setup"]["board_x_size"], 1, inf, "main/setup/board_x_size"))[0]:
        return temp

    if not (temp := Component.check_range(data["setup"]["board_y_size"], 1, inf, "main/setup/board_y_size"))[0]:
        return temp

    if HelperGet.if_wrong_data_type(data["setup"]["starting_position"], list):
        return False, ErrorMessageGet.wrong_data_type(type(data["setup"]["starting_position"]), list, "main/setup/starting_position (value)")
    for index, piece in enumerate(data["setup"]["starting_position"]):
        if HelperGet.if_wrong_data_type(piece, dict):
            return False, ErrorMessageGet.wrong_data_type(type(piece), dict, f"main/setup/starting_position/[{index}]")
        if not (temp := Component.check_keys(piece, {"piece_name", "x_pos", "y_pos"}, f"main/setup/starting_position/[{index}]"))[0]:
            return temp
        if HelperGet.if_wrong_data_type(piece["piece_name"], str):
            return False, ErrorMessageGet.wrong_data_type(type(piece["piece_name"]), str, f"main/setup/starting_position/[{index}]/piece_name (value)")
        if piece["piece_name"] not in data["pieces"].keys():
            return False, ErrorMessageGet.wrong_values(piece["piece_name"], f"main/setup/starting_position/[{index}]/piece_name (value)", "Wrong piece does not exist in \"main/pieces (keys)\"")
        if not (temp := Component.check_range(piece["x_pos"], 0, data["setup"]["board_x_size"] - 1, f"main/setup/starting_position/[{index}]/x_pos"))[0]:
            return temp
        if not (temp := Component.check_range(piece["y_pos"], 0, data["setup"]["board_y_size"] - 1, f"main/setup/starting_position/[{index}]/y_pos"))[0]:
            return temp

    if HelperGet.if_wrong_data_type(data["conditions"], dict):
        return False, ErrorMessageGet.wrong_data_type(type(data["conditions"]), dict, "main/setup/conditions (value)")
    for condition_name, condition in data["conditions"].items():
        if HelperGet.if_wrong_data_type(condition, dict):
            return False, ErrorMessageGet.wrong_data_type(type(condition), dict, f"main/setup/conditions/{condition_name} (value)")
        if "type" not in condition.keys():
            return False, ErrorMessageGet.missing_compulsory_key("type", f"main/setup/conditions/{condition_name} (value)")
        if HelperGet.if_wrong_data_type(condition["type"], str):
            return False, ErrorMessageGet.wrong_data_type(type(condition["type"]), str, f"main/setup/conditions/{condition_name}/type (value)")
        if condition["type"] not in CONDITION_TYPES:
            return False, ErrorMessageGet.wrong_values(condition["type"], f"main/setup/conditions/{condition_name}/type (value)", f"Condition type \"{condition["type"]}\" is not a built-in condition type")
        if "invert" not in condition.keys():
            return False, ErrorMessageGet.missing_compulsory_key("invert", f"main/setup/conditions/{condition_name} (value)")
        if HelperGet.if_wrong_data_type(condition["invert"], bool):
            return False, ErrorMessageGet.wrong_data_type(type(condition["invert"]), bool, f"main/setup/conditions/{condition_name}/invert (value)")

        match condition["type"]:
            case "all_of" | "any_of":
                # still need to add a recursion checker
                if not (temp := Component.check_keys(condition, {"type", "invert", "conditions"}, f"main/setup/conditions/{condition_name}"))[0]:
                    return temp
                if HelperGet.if_wrong_data_type(condition["conditions"], list):
                    return False, ErrorMessageGet.wrong_data_type(condition["conditions"], list, f"main/setup/conditions/{condition_name}/conditions (value)")
                if condition["conditions"] == []:
                    return False, ErrorMessageGet.empty_field("conditions", f"main/setup/conditions/{condition_name}/conditions (value)")
                parameter_conditions = set()
                for index, parameter_condition in enumerate(condition["conditions"]):
                    if HelperGet.if_wrong_data_type(parameter_condition, dict):
                        return False, ErrorMessageGet.wrong_data_type(parameter_condition, dict, f"main/setup/conditions/{condition_name}/conditions/[{index}] (value)")
                    if not (temp := Component.check_keys(parameter_condition, {"condition", "invert"}, f"main/setup/conditions/{condition_name}/conditions/[{index}]"))[0]:
                        return temp
                    if parameter_condition["condition"] not in data["conditions"].keys():
                        return False, ErrorMessageGet.wrong_values(parameter_condition["condition"], f"main/setup/conditions/{condition_name}/conditions/[{index}]/condition (value)")
                    if parameter_condition["condition"] in parameter_conditions:
                        return False, ErrorMessageGet.duplicate_value(parameter_condition["condition"], f"main/setup/conditions/{condition_name}/conditions/[{index}]/condition (value)")
                    parameter_conditions.add(parameter_condition["condition"])
            case "range":
                if not (temp := Component.check_keys(condition, {"type", "invert", "value_source", "offset", "min", "max"}, f"main/setup/conditions/{condition_name}"))[0]:
                    return temp
                if HelperGet.if_wrong_data_type(condition["value_source"], str):
                    return False, ErrorMessageGet.wrong_data_type(condition["value_source"], str, f"main/setup/conditions/{condition_name}/value_source (value)")
                if condition["value_source"] not in VALUE_SOURCES:
                    return False, ErrorMessageGet.wrong_values(condition["value_source"], f"main/setup/conditions/{condition_name}/value_source (value)", f"Value source type \"{condition["value_source"]}\" is not a built-in value source")
                if HelperGet.if_wrong_data_type(condition["offset"], int):
                    return False, ErrorMessageGet.wrong_data_type(condition["offset"], int, f"main/setup/conditions/{condition_name}/offset (value)")
                if HelperGet.if_wrong_data_type(condition["min"], int):
                    return False, ErrorMessageGet.wrong_data_type(condition["min"], int, f"main/setup/conditions/{condition_name}/min (value)")
                if HelperGet.if_wrong_data_type(condition["max"], int):
                    return False, ErrorMessageGet.wrong_data_type(condition["max"], int, f"main/setup/conditions/{condition_name}/max (value)")
            case "square_occupied":
                if HelperGet.if_wrong_data_type(condition["offset_x"], int):
                    return False, ErrorMessageGet.wrong_data_type(condition["offset_x"], int, f"main/setup/conditions/{condition_name}/offset_x (value)")
                if HelperGet.if_wrong_data_type(condition["offset_y"], int):
                    return False, ErrorMessageGet.wrong_data_type(condition["offset_y"], int, f"main/setup/conditions/{condition_name}/offset_y (value)")

    if HelperGet.if_wrong_data_type(data["moves"], dict):
        return False, ErrorMessageGet.wrong_data_type(type(data["moves"]), dict, "main/moves (value)")
    for move_name, move in data["moves"].items():
        if HelperGet.if_wrong_data_type(move, dict):
            return False, ErrorMessageGet.wrong_data_type(type(move), dict, f"main/moves/{move_name} (value)")
        if not (temp := Component.check_keys(move, {"start_conditions", "end_conditions", "move_definition"}, f"main/moves/{move_name}"))[0]:
            return temp

        if HelperGet.if_wrong_data_type(move["start_conditions"], list):
            return False, ErrorMessageGet.wrong_data_type(type(move["start_conditions"]), list, f"main/moves/{move_name}/start_conditions (value)")
        for index, start_condition in enumerate(move["start_conditions"]):
            if HelperGet.if_wrong_data_type(start_condition, str):
                return False, ErrorMessageGet.wrong_data_type(type(start_condition), str, f"main/moves/{move_name}/start_conditions/[{index}] (value)")
        wrong_values = HelperGet.invalid(set(data["conditions"].keys()), set(move["start_conditions"]))
        if wrong_values != set():
            return False, ErrorMessageGet.wrong_values(wrong_values, f"main/moves/{move_name}/start_conditions (values)", "Wrong conditions do not exist in \"main/conditions (keys)\"")

        if HelperGet.if_wrong_data_type(move["end_conditions"], list):
            return False, ErrorMessageGet.wrong_data_type(type(move["end_conditions"]), list, f"main/moves/{move_name}/conditions (value)")
        for index, end_condition in enumerate(move["end_conditions"]):
            if HelperGet.if_wrong_data_type(end_condition, str):
                return False, ErrorMessageGet.wrong_data_type(type(end_condition), str, f"main/moves/{move_name}/end_conditions/[{index}] (value)")
        wrong_values = HelperGet.invalid(set(data["conditions"].keys()), set(move["end_conditions"]))
        if wrong_values != set():
            return False, ErrorMessageGet.wrong_values(wrong_values, f"main/moves/{move_name}/end_conditions (values)", "Wrong conditions do not exist in \"main/conditions (keys)\"")

        if HelperGet.if_wrong_data_type(move["move_definition"], dict):
            return False, ErrorMessageGet.wrong_data_type(type(move["move_definition"]), dict, f"main/moves/{move_name}/move_definition (value)")
        if not (temp := Component.check_keys(move["move_definition"], {"move_x", "move_y", "range", "move_stop_conditions"}, f"main/moves/{move_name}/move_definition"))[0]:
            return temp
        if HelperGet.if_wrong_data_type(move["move_definition"]["move_x"], int):
            return False, ErrorMessageGet.wrong_data_type(type(move["move_definition"]["move_x"]), int, f"main/moves/{move_name}/move_definition/move_x (value)")
        if HelperGet.if_wrong_data_type(move["move_definition"]["move_y"], int):
            return False, ErrorMessageGet.wrong_data_type(type(move["move_definition"]["move_y"]), int, f"main/moves/{move_name}/move_definition/move_y (value)")
        if move["move_definition"]["range"] != "inf":
            if HelperGet.if_wrong_data_type(move["move_definition"]["range"], int):
                return False, ErrorMessageGet.wrong_data_type(type(move["move_definition"]["range"]), int, f"main/moves/{move_name}/move_definition/range (value)")
        if HelperGet.if_wrong_data_type(move["move_definition"]["move_stop_conditions"], list):
            return False, ErrorMessageGet.wrong_data_type(type(move["move_definition"]["move_stop_conditions"]), list, f"main/moves/{move_name}/move_definition/move_stop_conditions (value)")
        wrong_values = HelperGet.invalid(set(data["conditions"].keys()), set(move["move_definition"]["move_stop_conditions"]))
        if wrong_values != set():
            return False, ErrorMessageGet.wrong_values(wrong_values, f"main/moves/{move_name}/move_definition/move_stop_conditions (values)", "Wrong conditions do not exist in \"main/conditions (keys)\"")

    for piece_name, piece in data["pieces"].items():
        if HelperGet.if_wrong_data_type(piece, dict):
            return False, ErrorMessageGet.wrong_data_type(type(piece), dict, f"main/pieces/{piece_name} (value)")
        if not (temp := Component.check_keys(piece, {"moveset"}, f"main/pieces/{piece_name}"))[0]:
            return temp
        if HelperGet.if_wrong_data_type(piece["moveset"], list):
            return False, ErrorMessageGet.wrong_data_type(type(piece["moveset"]), list, f"main/pieces/{piece_name}/moveset (value)")

        for index, move in enumerate(piece["moveset"]):
            if HelperGet.if_wrong_data_type(move, (dict, list), True):
                return False, ErrorMessageGet.wrong_data_type(type(move), (dict, list), f"main/pieces/{piece_name}/moveset/[{index}] (value)")
            if isinstance(move, dict):
                if not (temp := Component.check_keys(move, {"move_name"}, f"main/pieces/{piece_name}/moveset/[{index}]"))[0]:
                    return temp
                if HelperGet.if_wrong_data_type(move["move_name"], str):
                    return False, ErrorMessageGet.wrong_data_type(type(move["move_name"]), str, f"main/pieces/{piece_name}/moveset/[{index}]/move_name (value)")
                if move["move_name"] not in data["moves"].keys():
                    return False, f"\"{move["move_name"]}\" does not exist in \"main/moves\". Location: main/pieces/{piece_name}/moveset/[{index}]/move_name (value)"
            elif isinstance(move, list):
                has_valid_move = False
                for cindex, cmove in enumerate(move):
                    if HelperGet.if_wrong_data_type(cmove, dict):
                        return False, ErrorMessageGet.wrong_data_type(type(cmove), dict, f"main/pieces/{piece_name}/moveset/[{index}]/[{cindex}] (value)")
                    if not (temp := Component.check_keys(cmove, {"move_name", "valid_move", "terminate_on_stop"}, f"main/pieces/{piece_name}/moveset/[{index}]/[{cindex}]"))[0]:
                        return temp
                    if HelperGet.if_wrong_data_type(cmove["move_name"], str):
                        return False, ErrorMessageGet.wrong_data_type(type(cmove["move_name"]), str, f"main/pieces/{piece_name}/moveset/[{index}]/[{cindex}]/move_name (value)")
                    if cmove["move_name"] not in data["moves"].keys():
                        return False, f"\"{cmove["move_name"]}\" does not exist in \"main/moves\". Location: main/pieces/{piece_name}/moveset/[{index}]/[{cindex}]/move_name (value)"
                    if HelperGet.if_wrong_data_type(cmove["valid_move"], bool):
                        return False, ErrorMessageGet.wrong_data_type(type(cmove["valid_move"]), bool, f"main/pieces/{piece_name}/moveset/[{index}]/[{cindex}]/valid_move (value)")
                    if HelperGet.if_wrong_data_type(cmove["terminate_on_stop"], bool):
                        return False, f"main/pieces/{piece_name}/moveset/[{index}]/[{cindex}]/terminate_on_stop (value)"
                    if cmove["valid_move"] == True:
                        has_valid_move = True
                if has_valid_move == False:
                    return False, f"Impossibility error detected. Chained move must have at least one \"valid_move\" set to True. Location: main/pieces/{piece_name}/moveset/[{index}] (values)"

    return True, "No errors detected! :)"
