
class ErrorMessageGet:

    @staticmethod
    def wrong_keys(missing_and_invalid: tuple, location: str):

        missing = ""
        show_missing = False
        if missing_and_invalid[0] != set():
            missing = f"Missing: {missing_and_invalid[0]}"
            show_missing = True
        invalid = ""
        show_invalid = False
        if missing_and_invalid[1] != set():
            invalid = f"Invalid: {missing_and_invalid[1]}"
            show_invalid = True

        seperator = ""
        if show_missing and show_invalid:
            seperator = "; "

        return f"Incorrect keys detected. {missing}{seperator}{invalid}. Location: {location}. "

    @staticmethod
    def wrong_values(wrong_values: set | str, location: str, extra: str = ""):
        if extra != "":
            extra = extra + "."
        if type(wrong_values) is set:
            return f"Invalid values detected. Wrong values: {wrong_values}. Location: {location}. {extra}"
        elif type(wrong_values) is str:
            return f"Invalid value detected. Wrong value: \"{wrong_values}\". Location: {location}. {extra}"
        return None

    @staticmethod
    def wrong_data_type(current_type, correct_type, location: str, multiple_types: bool = False):
        if multiple_types == True:
            return f"Invalid data type detected. Current type: {current_type.__name__}; Correct types: {list(ctype.__name__ for ctype in correct_type)}. Location: {location}. "
        return f"Invalid data type detected. Current type: {current_type.__name__}; Correct type: {correct_type.__name__}. Location: {location}. "

    @staticmethod
    def out_of_range(min_int: float, max_int: float, location: str):
        return f"Integer out of range detected, is not within {min_int} and {max_int}. Location: {location}. "

    @staticmethod
    def missing_compulsory_key(compulsory_key: str, location: str):
        return f"Compulsory key \"{compulsory_key}\" is missing. Location: {location}. "

    @staticmethod
    def empty_field(key_name: str, location: str):
        return f"Field \"{key_name}\" cannot be empty. Location: {location}. "

    @staticmethod
    def duplicate_value(value_name: str, location: str):
        return f"Duplicate value \"{value_name}\" detected. Location: {location}. "
