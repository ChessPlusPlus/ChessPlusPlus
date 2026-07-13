import _ from "lodash";

import { Button } from "@/components/ui/button";
import useVariantsStore from "@/features/variants/common/stores/variantsStore";
import type { GameState2DArray } from "@/features/variants/common/types/setupRules";
import PlayChessboard from "@/features/variants/variantPlay/components/PlayChessboard/PlayChessboard";
import { createGame } from "@/features/variants/variantPlay/services/game";
import {
	batchGenerateLegalMoves,
	processMove,
} from "@/features/variants/variantPlay/services/moveProcessing";
import useGameplayStore from "@/features/variants/variantPlay/stores/gameplay";
import { DragDropProvider } from "@dnd-kit/react";
import { IconChevronLeft } from "@tabler/icons-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

type OnDragEnd = React.ComponentProps<typeof DragDropProvider>["onDragEnd"];
type OnDragStart = React.ComponentProps<typeof DragDropProvider>["onDragStart"];

function VariantPlayPage() {
	const navigate = useNavigate();

	const {
		legalMoves,
		gameBoardState,
		updateGameBoardState,
		activeGameId,
		updateActiveGameId,
		updateLegalMoves,
		updateBoardXSize,
		updateBoardYSize,
		clearLegalMoves,

		legalMoveCache,
		updateLegalMoveCache,
		clearLegalMoveCache,
	} = useGameplayStore();
	const { variants, hasHydrated: hasVariantsHydrated } = useVariantsStore();
	const { variantId } = useParams();

	useEffect(() => {
		if (!hasVariantsHydrated) return;
		if (!variantId) return;

		const selectedVariant = variants[variantId];
		if (!selectedVariant) return;

		const setupRules = selectedVariant.variantRules.setup;
		const pieceRuleset = selectedVariant.variantRules.pieces;
		const movementRules = selectedVariant.variantRules.moves;

		console.log(setupRules, pieceRuleset, movementRules);

		async function handleCreateGame() {
			const { gameId, gameState, boardSize } = await createGame(
				setupRules,
				pieceRuleset,
				movementRules,
			);

			if (!gameId) return;
			if (!gameState) return;
			if (!boardSize) return;

			updateGameBoardState(gameState as GameState2DArray);
			updateBoardXSize(boardSize[0]);
			updateBoardYSize(boardSize[1]);
			updateActiveGameId(gameId);
		}

		handleCreateGame();
	}, [
		hasVariantsHydrated,
		variantId,
		variants,
		updateGameBoardState,
		updateActiveGameId,
	]);

	useEffect(() => {
		return () => {
			clearLegalMoves();
			clearLegalMoveCache();
		};
	}, [clearLegalMoves, clearLegalMoveCache]);

	useEffect(() => {
		clearLegalMoveCache();
	}, [activeGameId, clearLegalMoveCache]);

	function handleBackToHomePage() {
		navigate("/");
	}

	async function handleDragEnd(...args: Parameters<NonNullable<OnDragEnd>>) {
		const locallyComputedLegalMoves = legalMoves;
		if (!locallyComputedLegalMoves) return;

		if (!activeGameId) return;
		if (!gameBoardState) return;

		const [event] = args;

		if (event.operation.canceled) return;

		const targetSquareId = event.operation.target?.id;
		const [file, rank] = (targetSquareId as string)?.split("-") ?? [];

		if (!file) return;
		if (!rank) return;

		const startLocation = event.operation.source?.data.startLocation;
		const piece = event.operation.source?.data.piece;

		if (!startLocation) return;
		if (!piece) return;

		if (
			startLocation[0] === Number(file) &&
			startLocation[1] === Number(rank)
		)
			return;

		const isLocallyLegal = locallyComputedLegalMoves.some(
			(legalMove) =>
				legalMove[0] === Number(file) && legalMove[1] === Number(rank),
		);

		if (!isLocallyLegal) return;

		const locallyUpdatedGameBoardState = [
			...gameBoardState,
			[[Number(file), Number(rank)], piece],
		].filter(
			([location]) =>
				location[0] !== Number(startLocation[0]) ||
				location[1] !== Number(startLocation[1]),
		);

		clearLegalMoves();
		updateGameBoardState(locallyUpdatedGameBoardState as GameState2DArray);

		const { validMove, newGameState } = await processMove(
			activeGameId,
			startLocation,
			[Number(file), Number(rank)],
		);

		if (!validMove || !newGameState) {
			updateGameBoardState(gameBoardState);
			return;
		}

		updateGameBoardState(newGameState);
		clearLegalMoveCache();
	}

	const handleDragStart = _.debounce(
		async (...args: Parameters<NonNullable<OnDragStart>>) => {
			if (!activeGameId) return;

			const [event] = args;

			if (event.operation.canceled) return;

			const startLocation = event.operation.source?.data.startLocation;
			if (!startLocation) return;

			const [file, rank] = startLocation;

			let batchGeneratedLegalMoves = null;
			if (legalMoveCache.length === 0) {
				const { legalMoves } =
					await batchGenerateLegalMoves(activeGameId);
				if (!legalMoves) return;

				updateLegalMoveCache(legalMoves);
				batchGeneratedLegalMoves = legalMoves;
			}

			const legalMovesUsed =
				legalMoveCache.length > 0
					? legalMoveCache
					: batchGeneratedLegalMoves;
			if (!legalMovesUsed) return;

			const legalMovesForCurrentPiece =
				legalMovesUsed.find(
					([position]) =>
						position[0] === file && position[1] === rank,
				)?.[1] ?? [];

			updateLegalMoves(legalMovesForCurrentPiece);
		},
		500,
		{ leading: true, trailing: false },
	);

	return (
		<div className="flex flex-col w-full h-full">
			<div className="flex flex-row items-center gap-2 w-full p-3 pb-0">
				<Button
					variant="ghost"
					className="pl-1 pr-2"
					data-icon="inline-start"
					onClick={handleBackToHomePage}
				>
					<IconChevronLeft className="size-5" />
					<span className="text-base font-normal">Back</span>
				</Button>
			</div>

			<div className="flex flex-row items-center justify-center w-full h-full">
				<DragDropProvider
					onDragEnd={handleDragEnd}
					onDragStart={handleDragStart}
				>
					<PlayChessboard />
				</DragDropProvider>
			</div>
		</div>
	);
}

export default VariantPlayPage;
