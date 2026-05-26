import _ from "lodash";

import { Button } from "@/components/ui/button";
import useVariantsStore from "@/features/variants/common/stores/variantsStore";
import type { GameState2DArray } from "@/features/variants/common/types/setupRules";
import PlayChessboard from "@/features/variants/variantPlay/components/PlayChessboard/PlayChessboard";
import { createGame } from "@/features/variants/variantPlay/services/game";
import {
	generateLegalMoves,
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
		clearLegalMoves,
	} = useGameplayStore();
	const { variants, hasHydrated: hasVariantsHydrated } = useVariantsStore();
	const { variantId } = useParams();

	useEffect(() => {
		if (!hasVariantsHydrated) return;
		if (!variantId) return;

		const selectedVariant = variants[variantId];
		if (!selectedVariant) return;

		const startingPosition =
			selectedVariant.variantRules.setupRules.startingPosition;
		updateGameBoardState(startingPosition);
	}, [updateGameBoardState, variants, variantId, hasVariantsHydrated]);

	useEffect(() => {
		if (!hasVariantsHydrated) return;
		if (!variantId) return;

		const selectedVariant = variants[variantId];
		if (!selectedVariant) return;

		const setupRules = selectedVariant.variantRules.setupRules;
		const pieceRuleset = selectedVariant.variantRules.pieceRuleset;
		const movementRules = selectedVariant.variantRules.movementRules;

		async function handleCreateGame() {
			const { gameId, gameState } = await createGame(
				setupRules,
				pieceRuleset,
				movementRules,
			);

			if (!gameId) return;
			if (!gameState) return;

			updateGameBoardState(gameState);
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
		};
	}, [clearLegalMoves]);

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

		updateGameBoardState(locallyUpdatedGameBoardState as GameState2DArray);
		clearLegalMoves();

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
	}

	const handleDragStart = _.debounce(
		async (...args: Parameters<NonNullable<OnDragStart>>) => {
			clearLegalMoves();

			if (!activeGameId) return;

			const [event] = args;

			if (event.operation.canceled) return;

			const startLocation = event.operation.source?.data.startLocation;
			if (!startLocation) return;

			const [file, rank] = startLocation;

			const legalMoves = (
				await generateLegalMoves(activeGameId, [file, rank])
			)?.legalMoves;

			if (!legalMoves) return;

			updateLegalMoves(legalMoves);
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
