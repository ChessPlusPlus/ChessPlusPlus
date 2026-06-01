function isNullOrUndefined(value: unknown) {
	return value === null || value === undefined;
}

function hasInternalMap(
	value: unknown,
): value is { _map: Map<unknown, unknown>; _size: number } {
	return (
		typeof value === "object" &&
		value !== null &&
		"_map" in value &&
		(value as { _map?: unknown })._map instanceof Map
	);
}

function isValidNumber(value: unknown): value is number {
	if (Number.isNaN(Number(value))) return false;
	if (!Number.isFinite(Number(value))) return false;
	if (value === "") return false;
	
	return true;
}

export { isNullOrUndefined, hasInternalMap, isValidNumber };
