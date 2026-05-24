import type {
	PieceRules,
	PieceRuleset,
} from "@/features/variants/common/types/pieceRules";
import type { SetupRules } from "@/features/variants/common/types/setupRules";

function handlePieceNameUpdate(
	originalPieceName: string,
	pieceRulesetDraft: PieceRuleset,
	setupRulesDraft: SetupRules,
	pieceInfo: PieceRules,
	newName: string,
) {
	delete pieceRulesetDraft[originalPieceName];

	pieceRulesetDraft[newName] = pieceInfo;

	const pieceOwnership = setupRulesDraft.pieceOwnership;
	const startingPosition = setupRulesDraft.startingPosition;

	setupRulesDraft.pieceOwnership.white = pieceOwnership.white.map(
		(pieceName) =>
			pieceName === originalPieceName
				? newName
				: pieceName,
	);

	setupRulesDraft.pieceOwnership.black = pieceOwnership.black.map(
		(pieceName) =>
			pieceName === originalPieceName
				? newName
				: pieceName,
	);

	setupRulesDraft.startingPosition = startingPosition.map((squareInfo) => {
		if (squareInfo[1] === originalPieceName) {
			return [squareInfo[0], newName];
		} else {
			return squareInfo;
		}
	});
}

function handleMovementNameUpdate(
	pieceRulesetDraft: PieceRuleset,
	originalMovementName: string,
	newMovementName: string,
) {
	for (const [pieceName] of Object.entries(pieceRulesetDraft)) {
		pieceRulesetDraft[pieceName].moveset = pieceRulesetDraft[pieceName].moveset.map((move) => {
			if (Array.isArray(move)) {
				return move.map((chainedMove) => {
					if (chainedMove.moveName !== originalMovementName)
						return chainedMove;

					return {
						...chainedMove,
						moveName: newMovementName,
					};
				});
			}

			if (move.moveName === originalMovementName) {
				return {
					...move,
					moveName: newMovementName,
				};
			} 

			return move;
		});
	}
}

export { handlePieceNameUpdate, handleMovementNameUpdate };
