import PieceImage from "@/features/variants/variantPlay/components/PlayChessboard/PieceImage";
import useGameplayStore from "@/features/variants/variantPlay/stores/gameplay";
import { useDroppable } from "@dnd-kit/react";
import clsx from "clsx";

type SquareProps = {
	file: number;
	rank: number;
	imageUrl: string | null;
	piece: string;

	isFlipped: boolean;
	boardXSize: number;
	boardYSize: number;

	isLegal: boolean;
};

function Square({
	file,
	rank,
	imageUrl,
	piece,
	isFlipped,
	boardXSize,
	boardYSize,
	isLegal,
}: SquareProps) {
	const { ref } = useDroppable({
		id: `${file}-${rank}`,
	});

	const {
		prevClickedSquare,
		clickedSquare,
		updatePrevClickedSquare,
		updateClickedSquare,
		clearPrevClickedSquare,
		clearClickedSquare,
	} = useGameplayStore();

	const isDark = (rank + file) % 2 === 0;

	const isOnLeftEdge = isFlipped ? file === boardXSize - 1 : file === 0;
	const isOnBottomEdge = isFlipped ? rank === boardYSize - 1 : rank === 0;

	function handleSquareClick(squareFile: number, squareRank: number) {
		if (!prevClickedSquare && !clickedSquare) {
			if (!piece) return;

			updatePrevClickedSquare([squareFile, squareRank]);
			return;
		}

		if (prevClickedSquare && !clickedSquare) {
			updateClickedSquare([squareFile, squareRank]);
			return;
		}

		if (prevClickedSquare && clickedSquare) {
			clearPrevClickedSquare();
			clearClickedSquare();
			return;
		}
	}

	return (
		<div
			onClick={() => handleSquareClick(file, rank)}
			ref={ref}
			key={`${file}-${rank}`}
			className={`${isDark ? "bg-chessboard-square-dark" : "bg-chessboard-square-light"} aspect-square relative`}
		>
			<PieceImage
				imageUrl={imageUrl ?? null}
				piece={piece}
				file={file}
				rank={rank}
			/>

			{isOnLeftEdge && (
				<span
					className={clsx(
						"absolute top-0 left-0 text-xs font-semibold p-1",
						isDark
							? "text-chessboard-square-light"
							: "text-chessboard-square-dark",
					)}
				>
					{rank}
				</span>
			)}

			{isOnBottomEdge && (
				<span
					className={clsx(
						"absolute bottom-0 right-0 text-xs font-semibold p-1",
						isDark
							? "text-chessboard-square-light"
							: "text-chessboard-square-dark",
					)}
				>
					{file}
				</span>
			)}

			{isLegal && (
				<span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-4 rounded-full bg-primary"></span>
			)}
		</div>
	);
}

export default Square;
