import type { MovementRule } from "@/features/variants/common/types/movementRules";
import type { PieceRules } from "@/features/variants/common/types/pieceRules";
import type { GameState2DArray, SetupRules } from "@/features/variants/common/types/setupRules";
import type { VariantRules } from "@/features/variants/common/types/variants";
import { convertDictToSnakeCase } from "@/features/variants/common/utils/caseConverter";
import type { ImportedJSON, ImportedPiece, ImportedSetupRules } from "@/features/variants/variantEditor/json/types/jsonImport";
import { generateId } from "@/shared/utils/idGeneration";

function serialiseJSONForImport(json: Record<string, Record<string, unknown>>): VariantRules {
	const caseConvertedSetup = convertDictToSnakeCase(json.setup, [], "camel");
	const caseConvertedMoves = convertDictToSnakeCase(json.moves, [0], "camel");
	const caseConvertedPieces = convertDictToSnakeCase(json.pieces, [0], "camel");

	const caseConvertedJSON: ImportedJSON = {
		setup: caseConvertedSetup as ImportedSetupRules,
		moves: caseConvertedMoves as Record<string, MovementRule>,
		pieces: caseConvertedPieces as Record<string, ImportedPiece>,
	};

	const serialisedStartingPosition: GameState2DArray = caseConvertedJSON.setup.startingPosition.map((squareInfo) => {
		return [[squareInfo.xPos, squareInfo.yPos], squareInfo.pieceName];
	});

	const serialisedSetupRules: SetupRules = {
		pieceOwnership: caseConvertedJSON.setup.pieceOwnership,
		boardXSize: caseConvertedJSON.setup.boardXSize,
		boardYSize: caseConvertedJSON.setup.boardYSize,
		startingPosition: serialisedStartingPosition,
	};

	const serialisedPieces: Record<string, PieceRules> = Object.fromEntries(
		Object.entries(caseConvertedJSON.pieces).map(([pieceName, pieceRuleset]) => {
			return [pieceName, {
				...(pieceRuleset as PieceRules),
				imageId: "placeholder"
			}]
		}).map(([pieceName, pieceRuleset]) => {
			return [pieceName, {
				...(pieceRuleset as PieceRules),
				moveset: (pieceRuleset as PieceRules).moveset.map((move) => {
					if (Array.isArray(move)) {
						return move.map((chainedMove) => {
							return {
								moveName: chainedMove.moveName,
								validMove: chainedMove.validMove,
								terminateOnStop: chainedMove.terminateOnStop,
								nodeId: generateId()
							};
						});
					} else {
						return move;
					}
				}),
			}];
		}),
	);

	return {
		setupRules: serialisedSetupRules,
		pieceRuleset: serialisedPieces,
		movementRules: caseConvertedJSON.moves,
	}
}

export { serialiseJSONForImport };