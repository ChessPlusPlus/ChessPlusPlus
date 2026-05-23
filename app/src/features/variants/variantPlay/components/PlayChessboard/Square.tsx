import type { GameState2DArray } from "@/features/variants/common/types/setupRules";
import PieceImage from "@/features/variants/variantPlay/components/PlayChessboard/PieceImage";
import { generateLegalMoves, processMove } from "@/features/variants/variantPlay/services/moveProcessing";
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
		updatePrevClickedSquare,
		updateClickedSquare,
		clearPrevClickedSquare,
		clearClickedSquare,
		activeGameId,
		legalMoves,
		updateLegalMoves,
		clearLegalMoves,
		gameBoardState,
		updateGameBoardState,
	} = useGameplayStore();

	const isDark = (rank + file) % 2 === 0;

	const isOnLeftEdge = isFlipped ? file === boardXSize - 1 : file === 0;
	const isOnBottomEdge = isFlipped ? rank === boardYSize - 1 : rank === 0;

	async function handleSquareClick(squareFile: number, squareRank: number) {
		if (!activeGameId) return;
		if (!gameBoardState) return;

		const currentPrevClickedSquare = useGameplayStore.getState().prevClickedSquare;
		const currentClickedSquare = useGameplayStore.getState().clickedSquare;

		if (!currentPrevClickedSquare && !currentClickedSquare) {
			console.log("Displaying legal moves", [squareFile, squareRank]);

			if (!piece) return;

			updatePrevClickedSquare([squareFile, squareRank]);

			const legalMoves = (
				await generateLegalMoves(activeGameId, [squareFile, squareRank])
			).legalMoves;

			if (!legalMoves) return;

			updateLegalMoves(legalMoves);

			return;
		}

		if (currentPrevClickedSquare && !currentClickedSquare) {
			if (
				currentPrevClickedSquare[0] === squareFile &&
				currentPrevClickedSquare[1] === squareRank
			) {
				clearPrevClickedSquare();
				clearClickedSquare();
				clearLegalMoves();
				return;
			}

			updateClickedSquare([squareFile, squareRank]);

			const locallyComputedLegalMoves = legalMoves;
			if (!locallyComputedLegalMoves) return;

			const isLocallyLegal = locallyComputedLegalMoves.some(
				([legalFile, legalRank]) =>
					legalFile === squareFile && legalRank === squareRank,
			);

			if (!isLocallyLegal) {
				clearLegalMoves();
				clearPrevClickedSquare();
				clearClickedSquare();

				handleSquareClick(squareFile, squareRank);
				
				return;
			};

			const newGameBoardState = [
				...gameBoardState,
				[[squareFile, squareRank], piece],
			].filter(
				([location]) => {
					if (location[0] !== currentPrevClickedSquare[0]) {
						return true;
					}

					if (location[1] !== currentPrevClickedSquare[1]) {
						return true;
					}
					return false;
				}
			);

			updateGameBoardState(newGameBoardState as GameState2DArray);

			const { validMove, newGameState } = await processMove(
				activeGameId,
				currentPrevClickedSquare,
				[squareFile, squareRank],
			);

			console.log(validMove, newGameState);

			if (!validMove || !newGameState) {
				clearLegalMoves();
				updateGameBoardState(gameBoardState);
				updatePrevClickedSquare([squareFile, squareRank]);
				clearClickedSquare();
				handleSquareClick(currentPrevClickedSquare[0], currentPrevClickedSquare[1]);

				return;
			}

			updateGameBoardState(newGameState);
			clearPrevClickedSquare();
			clearClickedSquare();
			clearLegalMoves();
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
