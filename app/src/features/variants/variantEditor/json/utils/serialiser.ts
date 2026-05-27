import type { VariantInfo } from "@/features/variants/common/types/variants";

type ExportedJSON = {
	setup: Record<string, unknown>;
	moves: Record<string, unknown>;
	pieces: Record<string, unknown>;
}

function serialiseJSONForExport(rawJSON: VariantInfo) {
	const newJSON: ExportedJSON = {
		setup: {},
		moves: {},
		pieces: {},
	};

	newJSON.setup = rawJSON.variantRules.setupRules;
	newJSON.moves = rawJSON.variantRules.movementRules;
	newJSON.pieces = rawJSON.variantRules.pieceRuleset;

	return newJSON;
}

export { serialiseJSONForExport };