from app.engine.json_validator.helper_functions import HelperGet
from app.engine.json_validator.error_messages import ErrorMessageGet

class Component:

    @staticmethod
    def check_keys(check_dict, correct_keys: set, location: str):
        if HelperGet.if_wrong_data_type(check_dict, dict):
            return False, ErrorMessageGet.wrong_data_type(type(check_dict), dict, f"{location} (value)")
        if set(check_dict.keys()) != correct_keys:
            missing_and_invalid = HelperGet.missing_and_invalid(correct_keys, set(check_dict))
            return False, ErrorMessageGet.wrong_keys(missing_and_invalid, f"{location} (keys)")
        return True, None

    @staticmethod
    def check_range(check_int, min_int: float, max_int: float, location: str):
        if HelperGet.if_wrong_data_type(check_int, int):
            return False, ErrorMessageGet.wrong_data_type(type(check_int), int, f"{location} (value)")
        if HelperGet.if_int_not_in_range(check_int, min_int, max_int):
            return False, ErrorMessageGet.out_of_range(min_int, max_int, f"{location} (value)")
        return True, None
