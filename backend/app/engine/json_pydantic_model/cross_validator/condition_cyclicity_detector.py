from ..common import *

PARAMETERED_CONDITION_TYPES = {
    "all_of",
    "any_of"
}

# note that this function will also be used in the website
def check_for_cyclicity_in_conditions(variant_rules: VariantRules):

    conditions = variant_rules.conditions

    directed_graph = {}
    for condition_name, condition in conditions.items():
        directed_graph[condition_name] = set()
        if condition.type in PARAMETERED_CONDITION_TYPES:
            for child_condition in condition.conditions:
                directed_graph[condition_name].add(child_condition.condition)

    visited = set()
    visiting = set()
    path = []

    def dfs(node):
        if node in visiting:
            start = path.index(node)
            return True, path[start:] + [node]

        if node in visited:
            return False, None

        visiting.add(node)
        path.append(node)

        for neighbour in directed_graph.get(node, ()):
            cyclic, cycle = dfs(neighbour)
            if cyclic:
                return True, cycle

        path.pop()
        visiting.remove(node)
        visited.add(node)

        return False, None

    for node in directed_graph:
        cyclic, cycle = dfs(node)
        if cyclic:
            return True, cycle

    return False, None

