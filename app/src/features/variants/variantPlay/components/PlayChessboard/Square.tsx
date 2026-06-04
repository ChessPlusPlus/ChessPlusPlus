import _ from "lodash";

import type { GameState2DArray } from "@/features/variants/common/types/setupRules";
import PieceImage from "@/features/variants/variantPlay/components/PlayChessboard/PieceImage";
import {
	batchGenerateLegalMoves,
	generateLegalMoves,
	processMove,
} from "@/features/variants/variantPlay/services/moveProcessing";
import useGameplayStore from "@/features/variants/variantPlay/stores/gameplay";
import { useDroppable } from "@dnd-kit/react";
import clsx from "clsx";
import { useEffect, useRef } from "react";

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

		legalMoveCache,
		updateLegalMoveCache,
		clearLegalMoveCache,
	} = useGameplayStore();

	async function handleSquareClick(squareFile: number, squareRank: number) {
		if (!activeGameId) return;
		if (!gameBoardState) return;

		const currentPrevClickedSquare =
			useGameplayStore.getState().prevClickedSquare;
		const currentClickedSquare = useGameplayStore.getState().clickedSquare;

		if (!currentPrevClickedSquare && !currentClickedSquare) {
			if (!piece) return;

			updatePrevClickedSquare([squareFile, squareRank])
			
			let batchGeneratedLegalMoves = null;
			if (legalMoveCache.length === 0) {
				const { legalMoves } = await batchGenerateLegalMoves(activeGameId);
				if (!legalMoves) {
					clearLegalMoves();
					clearPrevClickedSquare();
					clearClickedSquare();
					return;
				};

				updateLegalMoveCache(legalMoves);
				batchGeneratedLegalMoves = legalMoves;
			}

			const legalMovesUsed = legalMoveCache.length > 0 ? legalMoveCache : batchGeneratedLegalMoves;
			if (!legalMovesUsed) return;

			const legalMovesForCurrentPiece = legalMovesUsed.find(([position]) => position[0] === squareFile && position[1] === squareRank)?.[1] ?? [];
			updateLegalMoves(legalMovesForCurrentPiece);
			updatePrevClickedSquare([squareFile, squareRank]);

			return;
		}

		if (currentPrevClickedSquare && !currentClickedSquare) {
			if (
				currentPrevClickedSquare[0] === squareFile &&
				currentPrevClickedSquare[1] === squareRank
			) {
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

				const cacheLegalMovesEntry = legalMoveCache.find(([position]) => position[0] === squareFile && position[1] === squareRank);
				if (!cacheLegalMovesEntry) {
					const { legalMoves } = await generateLegalMoves(activeGameId, [squareFile, squareRank]);
					if (!legalMoves) {
						clearLegalMoves();
						clearPrevClickedSquare();
						clearClickedSquare();
						return;
					};

					updateLegalMoveCache([...legalMoveCache, [[squareFile, squareRank], legalMoves]]);
					updateLegalMoves(legalMoves);
					return;
				}

				updateLegalMoves(cacheLegalMovesEntry[1]);
				updatePrevClickedSquare([squareFile, squareRank]);

				return;
			}

			const pieceAtStartLocation = gameBoardState.find(
				([location]) =>
					location[0] === currentPrevClickedSquare[0] &&
					location[1] === currentPrevClickedSquare[1],
			)?.[1];

			if (!pieceAtStartLocation) {
				clearPrevClickedSquare();
				clearClickedSquare();
				clearLegalMoves();
				return;
			}

			const newGameBoardState = [
				...gameBoardState,
				[[squareFile, squareRank], pieceAtStartLocation],
			].filter(([location]) => {
				if (location[0] !== currentPrevClickedSquare[0]) {
					return true;
				}

				if (location[1] !== currentPrevClickedSquare[1]) {
					return true;
				}
				return false;
			});

			clearLegalMoves();
			updateGameBoardState(newGameBoardState as GameState2DArray);

			const { validMove, newGameState } = await processMove(
				activeGameId,
				currentPrevClickedSquare,
				[squareFile, squareRank],
			);

			if (!validMove || !newGameState) {
				clearLegalMoves();
				updateGameBoardState(gameBoardState);
				updatePrevClickedSquare([squareFile, squareRank]);
				clearClickedSquare();

				await handleSquareClick(
					currentPrevClickedSquare[0],
					currentPrevClickedSquare[1],
				);

				return;
			}

			updateGameBoardState(newGameState);
			clearLegalMoveCache();
			clearPrevClickedSquare();
			clearClickedSquare();

			return;
		}
	}

	const handleSquareClickRef = useRef(handleSquareClick);
	const handleSquareClickDebouncedRef = useRef<_.DebouncedFunc<
		(file: number, rank: number) => void
	> | null>(null);

	useEffect(() => {
		handleSquareClickRef.current = handleSquareClick;
	});

	useEffect(() => {
		handleSquareClickDebouncedRef.current = _.debounce(
			(file: number, rank: number) => {
				handleSquareClickRef.current?.(file, rank);
			},
			300,
			{
				leading: true,
				trailing: false,
			},
		);
	}, []);

	const isDark = (rank + file) % 2 === 0;

	const isOnLeftEdge = isFlipped ? file === boardXSize - 1 : file === 0;
	const isOnBottomEdge = isFlipped ? rank === boardYSize - 1 : rank === 0;

	return (
		<div
			onClick={() => handleSquareClickDebouncedRef.current?.(file, rank)}
			ref={ref}
			key={`${file}-${rank}`}
			className={`${isDark ? "bg-chessboard-square-dark" : "bg-chessboard-square-light"} aspect-square relative`}
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

			{isLegal && (
				<span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-4 rounded-full bg-primary"></span>
			)}
		</div>
	);
}

export default Square;
