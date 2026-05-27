function convertStringToSnakeCase(str: string) {
	return str
		.replace(/([A-Z])/g, "_$1")
		.toLowerCase()
		.trim();
}

function convertDictToSnakeCase(
	dict: Record<string, unknown>,
	excludeLevels: number[] = [],
) {
	function _convert(
		data: Record<string, unknown>,
		currentLevel: number,
	): Record<string, unknown> | Record<string, unknown>[] {
		if (
			data instanceof Object &&
			data !== null &&
			!Array.isArray(data)
		) {
			return Object.fromEntries(
				Object.entries(data).map(([key, value]) => {
					return [
						excludeLevels.includes(currentLevel) ? key : convertStringToSnakeCase(key),
						_convert(
							value as Record<string, unknown>,
							currentLevel + 1,
						),
					];
				}),
			);
		} else if (Array.isArray(data)) {
			return data.map((item) =>
				_convert(item as Record<string, unknown>, currentLevel + 1),
			) as Record<string, unknown>[];
		} else {
			return data;
		}
	}

	return _convert(dict, 0);
}

console.log(
	convertDictToSnakeCase(
		{
			keyTest: "valueTest",
			camelCaseTest: {
				camelCaseKeyTest: "camelCaseValueTest",
			},
			camelCaseArrayTest: [
				{
					camelCaseKeyTest: "camelCaseValueTest",
				},
			],
		},
		[0],
	),
);

export { convertDictToSnakeCase };
