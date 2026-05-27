import type { PieceRules } from "@/features/variants/common/types/pieceRules";
import type { GameState2DArray } from "@/features/variants/common/types/setupRules";
import type { VariantInfo } from "@/features/variants/common/types/variants";

type ExportedJSON = {
	setup: Record<string, unknown>;
	moves: Record<string, unknown>;
	pieces: Record<string, unknown>;
};

function serialiseStartingPositionForExport(
	startingPosition: GameState2DArray,
) {
	console.log(startingPosition);

	return startingPosition.map((squareInfo) => {
		return {
			pieceName: squareInfo[1],
			xPos: squareInfo[0][0],
			yPos: squareInfo[0][1],
		};
	});
}

function serialiseJSONForExport(rawJSON: VariantInfo) {
	const newJSON: ExportedJSON = {
		setup: {},
		moves: {},
		pieces: {},
	};

	newJSON.setup = structuredClone(rawJSON.variantRules.setupRules);
	newJSON.moves = structuredClone(rawJSON.variantRules.movementRules);
	newJSON.pieces = structuredClone(rawJSON.variantRules.pieceRuleset);

	newJSON.setup.startingPosition = serialiseStartingPositionForExport(
		rawJSON.variantRules.setupRules.startingPosition,
	);

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
