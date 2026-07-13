type ChainedMoveNodeInput = {
	moveName: string;
	terminateOnStop: boolean;
	validMove: boolean;
};

type ChainedMoveNode = ChainedMoveNodeInput;

type ChainedMoveSequence = ChainedMoveNode[];

type RegularMove = {
	moveName: string;
};

type PieceRules = {
	moveset: (RegularMove | ChainedMoveSequence)[];
	imageId?: string;
};

type PieceRuleset = Record<string, PieceRules>;

export type {
	PieceRuleset,
	RegularMove,
	PieceRules,
	ChainedMoveSequence,
	ChainedMoveNode,
	ChainedMoveNodeInput,
};
