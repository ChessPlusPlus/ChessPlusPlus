import type { MovementRule } from "@/features/variants/common/types/movementRules";
import type { RegularMove } from "@/features/variants/common/types/pieceRules";
import type { PieceOwnershipRules } from "@/features/variants/common/types/setupRules";

type SquareInfo = {
	pieceName: string;
	xPos: number;
	yPos: number;
}

type ImportedSetupRules = {
	pieceOwnership: PieceOwnershipRules;
	boardXSize: number;
	boardYSize: number;
	startingPosition: SquareInfo[];
}

type ImportedChainedMoveSequence = {
	moveName: string;
	terminateOnStop: boolean;
	validMove: boolean;
}

type ImportedPiece = {
	moveset: (RegularMove | ImportedChainedMoveSequence)[];
};

type ImportedJSON = {
	setup: ImportedSetupRules;
	moves: Record<string, MovementRule>;
	pieces: Record<string, ImportedPiece>;
}

export type { ImportedJSON, ImportedSetupRules, ImportedChainedMoveSequence, ImportedPiece };