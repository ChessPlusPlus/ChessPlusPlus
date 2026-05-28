import PieceImage from "@/features/variants/variantEditor/setupEditor/components/SetupChessboard/PieceImage";
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
};

function Square({
	file,
	rank,
	imageUrl,
	piece,
	isFlipped,
	boardXSize,
	boardYSize,
}: SquareProps) {
	const { ref } = useDroppable({
		id: `${file}-${rank}`,
	});

	const isDark = (rank + file) % 2 === 0;

	const isOnLeftEdge = isFlipped ? file === boardXSize - 1 : file === 0;
	const isOnBottomEdge = isFlipped ? rank === boardYSize - 1 : rank === 0;
	return (
		<div
			ref={ref}
			className={`${isDark ? "bg-chessboard-square-dark" : "bg-chessboard-square-light"} aspect-square relative select-none`}
		>
			{imageUrl && piece && (
				<PieceImage
					imageUrl={imageUrl}
					piece={piece}
					file={file}
					rank={rank}
				/>
			)}

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
		</div>
	);
}

export default Square;
