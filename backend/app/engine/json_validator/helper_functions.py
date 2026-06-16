
class HelperGet:

    @staticmethod
    def missing_and_invalid(correct_data: set, test_data: set):
        missing = correct_data.difference(test_data)
        invalid = test_data.difference(correct_data)
        return missing, invalid

    @staticmethod
    def invalid(all_data: set, test_data: set):
        invalid = test_data.difference(all_data)
        return invalid

    @staticmethod
    def if_wrong_data_type(value, correct_type, multiple_types: bool = False):
        if multiple_types == True:
            for each_ct in correct_type:
                if type(value) is each_ct:
                    return False
            else:
                return True
        if type(value) is correct_type:
            return False
        return True

    @staticmethod
    def if_int_not_in_range(test_int: int, min_int: float, max_int: float): # min_int and max_int accepts inf and -inf, defined in json_validator_helper_functions
        if min_int <= test_int <= max_int:
            return False
        return True
