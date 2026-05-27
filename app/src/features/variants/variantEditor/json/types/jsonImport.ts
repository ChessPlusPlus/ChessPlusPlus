import type { MovementRule } from "@/features/variants/common/types/movementRules";
import type { RegularMove } from "@/features/variants/common/types/pieceRules";

type SquareInfo = {
	pieceName: string;
	xPos: number;
	yPos: number;
}

type ImportedSetupRules = {
	pieceOwnership: Record<string, unknown>;
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
	moves: Record<string, unknown>;
	pieces: Record<string, MovementRule>;
}

export type { ImportedJSON, ImportedSetupRules, ImportedChainedMoveSequence, ImportedPiece };