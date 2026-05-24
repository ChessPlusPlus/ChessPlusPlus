import usePiecesEditorStore from "@/features/variants/variantEditor/piecesEditor/stores/piecesEditor";
import { Button } from "@/components/ui/button";
import {
	IconChevronDown,
	IconChevronUp,
	IconDotsVertical,
	IconX,
} from "@tabler/icons-react";
import {
	Collapsible,
	CollapsibleTrigger,
	CollapsibleContent,
} from "@/components/ui/collapsible";
import { TabsContent } from "@/components/ui/tabs";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import useVariantDraftStore from "@/features/variants/variantEditor/common/stores/variantDraft";
import useChainedMovesDialogStore from "@/features/variants/variantEditor/piecesEditor/stores/chainedMovesDialog";
import ChainedMovesDialog from "@/features/variants/variantEditor/piecesEditor/components/PiecesEditorSheet/components/PieceEditorScreen/components/MovementsTab/components/ChainedMovesDialog";
import SelectionDialog from "@/features/variants/variantEditor/common/components/SelectionDialog";
import useMovementSelectionDialogStore from "@/features/variants/variantEditor/piecesEditor/stores/movementSelectionDialog";
import type {
	ChainedMoveNode,
	RegularMove,
} from "@/features/variants/common/types/pieceRules";
import { ScrollArea } from "@/components/ui/scroll-area";
import { isNullOrUndefined } from "@/shared/utils/typeChecks";

export function MovementsTab() {
	const {
		activePieceMovements,
		activePiece,
		isMovementsExpanded,
		expandMovements,
		collapseMovements,
	} = usePiecesEditorStore();

	const { movementRulesDraft } = useVariantDraftStore();

	const {
		pieceName,
		isMovementSelectionDialogOpen,
		openMovementSelectionDialog,
		closeMovementSelectionDialog,
		searchQuery,
		updateSearchQuery,
		clearSearchQuery,
	} = useMovementSelectionDialogStore();

	const { openChainedMovesDialog, updateActivePiece } =
		useChainedMovesDialogStore();

	const {
		pieceRulesetDraft,
		updatePieceRulesetDraft,
		syncPieceRulesetDraftToDB,
	} = useVariantDraftStore();

	if (!movementRulesDraft) return null;
	if (!pieceRulesetDraft) return null;

	const allRegularMovements = Object.values(pieceRulesetDraft).flatMap(
		(pieceRules) =>
			pieceRules.moveset
				.filter((move) => !Array.isArray(move))
				.map((regularMove) => (regularMove as RegularMove).moveName),
	);

	const allChainedMoves = Object.values(pieceRulesetDraft).flatMap(
		(pieceRules) =>
			pieceRules.moveset
				.filter((move) => Array.isArray(move))
				.flatMap((chainedMove) =>
					chainedMove.map(
						(move) => (move as ChainedMoveNode).moveName,
					),
				),
	);

	const sortedActivePieceMovements = structuredClone(
		activePieceMovements,
	).sort((a, b) => {
		const aIndex = Object.entries(movementRulesDraft).findIndex(
			([movementName]) => movementName === a.moveName,
		);

		if (aIndex === -1) return 1;

		const bIndex = Object.entries(movementRulesDraft).findIndex(
			([movementName]) => movementName === b.moveName,
		);

		if (bIndex === -1) return -1;

		return aIndex - bIndex;
	});

	function handleRegularMovementRemoveButtonClick(movementName: string) {
		if (!pieceRulesetDraft) return;
		if (!activePiece) return;

		const updatedPieceRulesetDraft = structuredClone(pieceRulesetDraft);

		updatedPieceRulesetDraft[activePiece].moveset = pieceRulesetDraft[
			activePiece
		].moveset.filter((move) => {
			if (Array.isArray(move)) {
				return true;
			}

			if (move.moveName === movementName) {
				return false;
			}

			return true;
		});

		updatePieceRulesetDraft(updatedPieceRulesetDraft);
		syncPieceRulesetDraftToDB();
	}

	function handleChainedMovesButtonClick() {
		if (!activePiece) return;

		openChainedMovesDialog();
		updateActivePiece(activePiece);
	}

	const selectionList = Object.entries(movementRulesDraft).map(
		([movementName]) => {
			const isMovementUsedInPiece = activePieceMovements.some(
				(move) => move.moveName === movementName,
			);

			const regularMoveUsageCount = allRegularMovements.filter(
				(move) => move === movementName,
			).length;

			const chainedMoveUsageCount = allChainedMoves.filter(
				(move) => move === movementName,
			).length;

			return {
				name: movementName,
				bottomComponent: (
					<span className="text-muted-foreground">
						{regularMoveUsageCount > 0 && (
							<span>{regularMoveUsageCount} regular</span>
						)}

						{regularMoveUsageCount > 0 &&
							chainedMoveUsageCount > 0 && <span> • </span>}

						{chainedMoveUsageCount > 0 && (
							<span>{chainedMoveUsageCount} chained</span>
						)}
					</span>
				),
				isSelected: isMovementUsedInPiece,
			};
		},
	);

	function handleMovementSelection(movementName: string) {
		if (!pieceRulesetDraft) return;
		if (isNullOrUndefined(pieceName)) return;
		if (pieceName.trim() === "") return;

		const updatedPieceRulesetDraft = structuredClone(pieceRulesetDraft);

		if (
			updatedPieceRulesetDraft[pieceName].moveset
				.filter((move) => !Array.isArray(move))
				.some((move) => (move as RegularMove).moveName === movementName)
		) {
			updatedPieceRulesetDraft[pieceName].moveset =
				updatedPieceRulesetDraft[pieceName].moveset.filter(
					(move) => (move as RegularMove).moveName !== movementName,
				);
		} else {
			updatedPieceRulesetDraft[pieceName].moveset.push({
				moveName: movementName,
			});
		}

		updatePieceRulesetDraft(updatedPieceRulesetDraft);
	}

	return (
		<>
			<TabsContent value="movements" className="flex flex-col gap-4 h-full min-h-0">
				<Collapsible
					className="flex flex-col gap-1 min-h-0"
					open={isMovementsExpanded}
					onOpenChange={(open) => {
						if (open) {
							expandMovements();
						} else {
							collapseMovements();
						}
					}}
				>
					<div className="flex flex-row items-center justify-between">
						<p className="font-semibold">Movements</p>

						<CollapsibleTrigger asChild>
							<Button
								variant="ghost"
								className="p-0 px-1 hover:bg-(--sidebar-primary-hover) hover:aria-expanded:bg-(--sidebar-primary-hover)"
							>
								{isMovementsExpanded ? (
									<IconChevronUp className="size-4" />
								) : (
									<IconChevronDown className="size-4" />
								)}
							</Button>
						</CollapsibleTrigger>
					</div>

					<CollapsibleContent className="flex flex-col min-h-0">
						<ScrollArea className="flex-1 h-full min-h-0">
							{sortedActivePieceMovements.map((movement) => {
								const moveIndex = Object.entries(
									movementRulesDraft,
								).findIndex(
									([movementName]) =>
										movementName === movement.moveName,
								);

								if (moveIndex === -1) return null;

								return (
									<div
										className="flex flex-row items-center justify-between"
										key={movement.moveName}
									>
										<p>
											{moveIndex + 1}. {movement.moveName}
										</p>

										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													className="p-0 hover:bg-(--sidebar-primary-hover)"
												>
													<IconDotsVertical className="size-5" />
												</Button>
											</DropdownMenuTrigger>

											<DropdownMenuContent side="left">
												<DropdownMenuItem
													variant="destructive"
													onClick={() =>
														handleRegularMovementRemoveButtonClick(
															movement.moveName,
														)
													}
												>
													<IconX className="size-4" />
													Remove
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								);
							})}
						</ScrollArea>
					</CollapsibleContent>
				</Collapsible>

				<div className="grid grid-cols-[65fr_35fr] items-center">
					<p>Chained moves</p>
					<Button
						onClick={handleChainedMovesButtonClick}
						className="px-4"
						variant="outline"
					>
						View
					</Button>
				</div>
			</TabsContent>

			<SelectionDialog
				isOpen={isMovementSelectionDialogOpen}
				onOpenChange={(isOpen) => {
					if (isOpen) {
						openMovementSelectionDialog();
					} else {
						closeMovementSelectionDialog();
					}
				}}
				onSelection={handleMovementSelection}
				title="Select movements"
				description="Select the movements you want to add to the piece. Changes are saved automatically."
				searchPlaceholder="Search movements"
				searchQuery={searchQuery}
				updateSearchQuery={updateSearchQuery}
				clearSearchQuery={clearSearchQuery}
				items={selectionList}
			/>

			<ChainedMovesDialog />
		</>
	);
}
