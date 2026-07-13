import type {
	PieceRules,
	PieceRuleset,
} from "@/features/variants/common/types/pieceRules";

const queenRules: PieceRules = {
	moveset: [
		{
			moveName: "north",
		},
		{
			moveName: "south",
		},
		{
			moveName: "east",
		},
		{
			moveName: "west",
		},
		{
			moveName: "northeast",
		},
		{
			moveName: "northwest",
		},
		{
			moveName: "southeast",
		},
		{
			moveName: "southwest",
		},
	],
};

const rookRules: PieceRules = {
	moveset: [
		{
			moveName: "north",
		},
		{
			moveName: "south",
		},
		{
			moveName: "east",
		},
		{
			moveName: "west",
		},
	],
};
const bishopRules: PieceRules = {
	moveset: [
		{
			moveName: "northeast",
		},
		{
			moveName: "northwest",
		},
		{
			moveName: "southeast",
		},
		{
			moveName: "southwest",
		},
	],
};
const knightRules: PieceRules = {
	moveset: [
		{
			moveName: "knight_0201",
		},
		{
			moveName: "knight_02m1",
		},
		{
			moveName: "knight_m201",
		},
		{
			moveName: "knight_m2m1",
		},
		{
			moveName: "knight_0102",
		},
		{
			moveName: "knight_m102",
		},
		{
			moveName: "knight_01m2",
		},
		{
			moveName: "knight_m1m2",
		},
	],
};

const kingRules: PieceRules = {
	moveset: [
		{
			moveName: "north_1",
		},
		{
			moveName: "south_1",
		},
		{
			moveName: "east_1",
		},
		{
			moveName: "west_1",
		},
		{
			moveName: "northeast_1",
		},
		{
			moveName: "northwest_1",
		},
		{
			moveName: "southeast_1",
		},
		{
			moveName: "southwest_1",
		},
	],
};

const defaultPieceRuleset: PieceRuleset = {
	white_pawn: {
		moveset: [
			[
				{
					moveName: "white_pawn_forward",
					validMove: true,
					terminateOnStop: true,
				},
				{
					moveName: "white_pawn_double_step",
					validMove: true,
					terminateOnStop: true,
				},
			],
			{
				moveName: "white_pawn_capture_east",
			},
			{
				moveName: "white_pawn_capture_west",
			},
		],
		imageId: "white_pawn",
	},

	black_pawn: {
		moveset: [
			[
				{
					moveName: "black_pawn_forward",
					validMove: true,
					terminateOnStop: true,
				},
				{
					moveName: "black_pawn_double_step",
					validMove: true,
					terminateOnStop: true,
				},
			],
			{
				moveName: "black_pawn_capture_east",
			},
			{
				moveName: "black_pawn_capture_west",
			},
		],
		imageId: "black_pawn",
	},

	white_queen: { ...queenRules, imageId: "white_queen" },
	black_queen: { ...queenRules, imageId: "black_queen" },

	white_rook: { ...rookRules, imageId: "white_rook" },
	black_rook: { ...rookRules, imageId: "black_rook" },

	white_bishop: { ...bishopRules, imageId: "white_bishop" },
	black_bishop: { ...bishopRules, imageId: "black_bishop" },

	white_knight: { ...knightRules, imageId: "white_knight" },
	black_knight: { ...knightRules, imageId: "black_knight" },

	white_king: { ...kingRules, imageId: "white_king" },
	black_king: { ...kingRules, imageId: "black_king" },
};

export { defaultPieceRuleset };
