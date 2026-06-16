
class ErrorMessageGet:

    @staticmethod
    def wrong_keys(missing_and_invalid: tuple, location: str):
        return f"Incorrect keys detected. Missing: {missing_and_invalid[0]}; Invalid: {missing_and_invalid[1]}. Location: {location}. "

    @staticmethod
    def wrong_values(wrong_values: set, location: str, extra: str = ""):
        return f"Invalid values detected. Wrong values: {wrong_values}. Location: {location}. {extra}."

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
        return f"Compulsory key \"{compulsory_key}\" is missing. Location: {location}. \""
