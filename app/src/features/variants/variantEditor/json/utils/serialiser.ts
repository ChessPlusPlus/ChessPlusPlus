import type { PieceRules } from "@/features/variants/common/types/pieceRules";
import type { VariantInfo } from "@/features/variants/common/types/variants";

type ExportedJSON = {
	setup: Record<string, unknown>;
	moves: Record<string, unknown>;
	pieces: Record<string, unknown>;
};

function serialiseJSONForExport(rawJSON: VariantInfo) {
	const newJSON: ExportedJSON = {
		setup: {},
		moves: {},
		pieces: {},
	};

	newJSON.setup = rawJSON.variantRules.setupRules;
	newJSON.moves = rawJSON.variantRules.movementRules;
	newJSON.pieces = rawJSON.variantRules.pieceRuleset;

	newJSON.pieces = Object.fromEntries(
		Object.entries(newJSON.pieces).map(([pieceName, pieceRuleset]) => {
			console.log(pieceName, pieceRuleset);

			return [
				pieceName,
				Object.fromEntries(
					Object.entries(
						pieceRuleset as Record<string, unknown>,
					).filter(([key]) => key !== "imageId"),
				),
			];
		}),
	);

	newJSON.pieces = Object.fromEntries(
		Object.entries(newJSON.pieces).map(([pieceName, pieceRuleset]) => {
			return [
				pieceName,
				{
					...(pieceRuleset as Record<string, unknown>),
					moveset: (pieceRuleset as PieceRules).moveset.map(
						(move) => {
							if (Array.isArray(move)) {
								return move.map((chainedMove) => {
									return {
										moveName: chainedMove.moveName,
										validMove: chainedMove.validMove,
										terminateOnStop:
											chainedMove.terminateOnStop,
									};
								});
							} else {
								return move;
							}
						},
					),
				},
			];
		}),
	);

	return newJSON;
}

export { serialiseJSONForExport };
