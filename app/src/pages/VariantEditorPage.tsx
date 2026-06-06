import { IconChevronLeft } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import useVariantsStore from "@/features/variants/common/stores/variantsStore";
import Sidebar from "@/features/variants/variantEditor/common/components/Sidebar";
import { useEffect } from "react";
import useVariantDraftStore from "@/features/variants/variantEditor/common/stores/variantDraft";
import ChessboardGrid from "@/features/variants/variantEditor/common/components/ChessboardGrid";
import useSidebarStore from "@/features/variants/variantEditor/common/stores/sidebar";
import clsx from "clsx";
import usePiecesEditorStore from "@/features/variants/variantEditor/piecesEditor/stores/piecesEditor";
import { TupleKeyedMap } from "@itwin/core-bentley";
import { useQuery } from "@tanstack/react-query";
import { displayLegalMoves } from "@/features/variants/variantEditor/common/services/legalMoveDisplay";
import { serialiseGameState } from "@/features/variants/variantEditor/common/utils/gameStateSerialisation";
import useMovementsEditorStore from "@/features/variants/variantEditor/movementsEditor/stores/movementsEditor";
import useMovementsEditorSheetStore from "@/features/variants/variantEditor/movementsEditor/stores/movementsEditorSheet";
import usePiecesEditorSheetStore from "@/features/variants/variantEditor/piecesEditor/stores/piecesEditorSheet";
import { isValidNumber } from "@/shared/utils/typeChecks";

function VariantEditorPage() {
	const { variantId } = useParams();
	const { variants, hasHydrated } = useVariantsStore();
	const {
		setupRulesDraft,
		updateCurrentVariantId,
		updateSetupRulesDraft,
		movementRulesDraft,
		updateMovementRulesDraft,
		pieceRulesetDraft,
		updatePieceRulesetDraft,
	} = useVariantDraftStore();

	const { activePiece } = usePiecesEditorStore();
	const {
		activeMovementName,
		forMovement,
		forCapture,
		offsetX,
		offsetY,
		range,
		resetMovementsEditorState,
	} = useMovementsEditorStore();
	const { resetPiecesEditorState } = usePiecesEditorStore();
	const { resetMovementsEditorSheetState } = useMovementsEditorSheetStore();
	const { resetPiecesEditorSheetState } = usePiecesEditorSheetStore();

	const navigate = useNavigate();

	const { data: legalMovesPreview } = useQuery({
		queryKey: [
			"legalMovesPreview",
			activePiece,
			activeMovementName,
			forMovement,
			forCapture,
			offsetX,
			offsetY,
			range,
			variantId,
			pieceRulesetDraft,
			movementRulesDraft,
		],
		queryFn: async () => {
			if (!pieceRulesetDraft) return null;
			if (!movementRulesDraft) return null;
			if (!activePiece) return null;

			if (!setupRulesDraft) return null;

			const previewBoardState = new TupleKeyedMap<
				[number, number],
				string
			>([[[4, 3], activePiece]]);

			if (activeMovementName) {
				return await displayLegalMoves({
					pieceName: activePiece,
					pieceRuleset: pieceRulesetDraft,
					movementRules: {
						...movementRulesDraft,
						[activeMovementName]: {
							...movementRulesDraft[activeMovementName],
							forMovement: forMovement ?? false,
							forCapture: forCapture ?? false,
							moveDefinition: {
								...movementRulesDraft[activeMovementName]
									.moveDefinition,
								...(isValidNumber(range)
									? { range: Number(range) }
									: {}),
								...(isValidNumber(offsetX)
									? { moveX: Number(offsetX) }
									: {}),
								...(isValidNumber(offsetY)
									? { moveY: Number(offsetY) }
									: {}),
							},
						},
					},
					currentPos: [4, 3],
					gameState: serialiseGameState(previewBoardState),
					setupRules: {
						pieceOwnership: setupRulesDraft.pieceOwnership,
						boardXSize: setupRulesDraft.boardXSize,
						boardYSize: setupRulesDraft.boardYSize,
						startingPosition: setupRulesDraft.startingPosition,
					},
				});
			} else {
				return await displayLegalMoves({
					pieceName: activePiece,
					pieceRuleset: pieceRulesetDraft,
					movementRules: movementRulesDraft,
					currentPos: [4, 3],
					gameState: serialiseGameState(previewBoardState),
					setupRules: {
						pieceOwnership: setupRulesDraft.pieceOwnership,
						boardXSize: setupRulesDraft.boardXSize,
						boardYSize: setupRulesDraft.boardYSize,
						startingPosition: setupRulesDraft.startingPosition,
					},
				});
			}
		},
	});

	useEffect(() => {
		if (!variantId) return;

		const selectedVariant = variants[variantId];
		if (!selectedVariant) return;

		updateCurrentVariantId(variantId);
		updateSetupRulesDraft(selectedVariant.variantRules.setupRules);
		updateMovementRulesDraft(selectedVariant.variantRules.movementRules);
		updatePieceRulesetDraft(selectedVariant.variantRules.pieceRuleset);
	}, [
		updateCurrentVariantId,
		updateMovementRulesDraft,
		updatePieceRulesetDraft,
		updateSetupRulesDraft,
		variantId,
		variants,
	]);

	const { currentOpenMenu } = useSidebarStore();

	if (!variantId) return null;
	if (!hasHydrated) return null;

	const selectedVariant = variants[variantId];
	if (!selectedVariant) return null;

	const variantName = variants[variantId].variantName;

	if (!setupRulesDraft) return null;

	function handleNavigationToHomePage() {
		resetMovementsEditorState();
		resetPiecesEditorState();
		resetMovementsEditorSheetState();
		resetPiecesEditorSheetState();

		navigate("/");
	}

	function parseLegalMovesPreview() {
		if (!legalMovesPreview) return;
		if (!movementRulesDraft) return;

		const legalMoveEntries = Object.entries(legalMovesPreview);
		const movementRuleEntries = Object.entries(movementRulesDraft);

		const entriesWithIndicies = legalMoveEntries.map(
			([movementName, legalMoves]) => {
				const movementIndex = movementRuleEntries.findIndex(
					([name]) => name === movementName,
				);

				if (movementIndex === -1) {
					return [0, []];
				}

				return [movementIndex + 1, legalMoves];
			},
		);

		return Object.fromEntries(entriesWithIndicies);
	}

	return (
		<div className="relative min-h-screen">
			<div className="flex flex-col gap-6">
				<div className="flex flex-row gap-2 px-4 py-4 items-center p-12">
					<Button
						onClick={handleNavigationToHomePage}
						size="xs"
						className="p-0"
						data-icon="inline-start"
						variant="ghost"
						aria-label="Back to home page"
					>
						<IconChevronLeft className="size-5" />
					</Button>

					<span>{variantName}</span>
				</div>

				{activePiece && (
					<div
						className={clsx(
							"flex flex-row justify-center",
							currentOpenMenu === "movements" ||
								currentOpenMenu === "pieces"
								? "-ml-28"
								: "mr-13 md:mr-0",
						)}
					>
						<div className="aspect-square flex flex-row justify-center w-full max-w-[12rem] md:max-w-md">
							<ChessboardGrid
								boardState={
									new TupleKeyedMap([[[4, 3], activePiece]])
								}
								legalMoves={parseLegalMovesPreview() ?? {}}
							/>
						</div>
					</div>
				)}
			</div>

			<Sidebar />
		</div>
	);
}

export default VariantEditorPage;
