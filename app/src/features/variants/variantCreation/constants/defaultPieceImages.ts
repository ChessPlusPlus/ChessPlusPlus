import type { PieceImage } from "@/features/variants/common/types/pieceImages";

import whitePawnSvg from "@/features/variants/common/assets/wP.svg?raw";
import blackPawnSvg from "@/features/variants/common/assets/bP.svg?raw";
import whiteQueenSvg from "@/features/variants/common/assets/wQ.svg?raw";
import blackQueenSvg from "@/features/variants/common/assets/bQ.svg?raw";
import whiteRookSvg from "@/features/variants/common/assets/wR.svg?raw";
import blackRookSvg from "@/features/variants/common/assets/bR.svg?raw";
import whiteBishopSvg from "@/features/variants/common/assets/wB.svg?raw";
import blackBishopSvg from "@/features/variants/common/assets/bB.svg?raw";
import whiteKnightSvg from "@/features/variants/common/assets/wN.svg?raw";
import blackKnightSvg from "@/features/variants/common/assets/bN.svg?raw";
import whiteKingSvg from "@/features/variants/common/assets/wK.svg?raw";
import blackKingSvg from "@/features/variants/common/assets/bK.svg?raw";
import placeholderImageJpeg from "@/features/variants/common/assets/placeholder.jpeg";
import movementPreviewSvg from "@/features/variants/common/assets/movementPreview.svg?raw";

async function getPlaceholderImageBlob() {
	const response = await fetch(placeholderImageJpeg);
	return await response.blob();
}

const defaultPieceImages: Record<string, PieceImage> = {
	white_pawn: {
		image: new Blob([whitePawnSvg], { type: "image/svg+xml" }),
	},
	black_pawn: {
		image: new Blob([blackPawnSvg], { type: "image/svg+xml" }),
	},
	white_queen: {
		image: new Blob([whiteQueenSvg], { type: "image/svg+xml" }),
	},
	black_queen: {
		image: new Blob([blackQueenSvg], { type: "image/svg+xml" }),
	},
	white_rook: {
		image: new Blob([whiteRookSvg], { type: "image/svg+xml" }),
	},
	black_rook: {
		image: new Blob([blackRookSvg], { type: "image/svg+xml" }),
	},
	white_bishop: {
		image: new Blob([whiteBishopSvg], { type: "image/svg+xml" }),
	},
	black_bishop: {
		image: new Blob([blackBishopSvg], { type: "image/svg+xml" }),
	},
	white_knight: {
		image: new Blob([whiteKnightSvg], { type: "image/svg+xml" }),
	},
	black_knight: {
		image: new Blob([blackKnightSvg], { type: "image/svg+xml" }),
	},
	white_king: {
		image: new Blob([whiteKingSvg], { type: "image/svg+xml" }),
	},
	black_king: {
		image: new Blob([blackKingSvg], { type: "image/svg+xml" }),
	},
	placeholder: {
		image: await getPlaceholderImageBlob(),
	},
	movement_preview: {
		image: new Blob([movementPreviewSvg], { type: "image/svg+xml" }),
	},
};

export { defaultPieceImages };
