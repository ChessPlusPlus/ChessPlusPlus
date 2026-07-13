import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import type {
	ChainedMoveNode,
	ChainedMoveSequence,
} from "@/features/variants/common/types/pieceRules";
import useVariantDraftStore from "@/features/variants/variantEditor/common/stores/variantDraft";
import AddChainedMoveDialog from "@/features/variants/variantEditor/piecesEditor/components/PiecesEditorSheet/components/PieceEditorScreen/components/MovementsTab/components/AddChainedMoveDialog";
import EditChainedMoveDialog from "@/features/variants/variantEditor/piecesEditor/components/PiecesEditorSheet/components/PieceEditorScreen/components/MovementsTab/components/EditChainedMoveDialog";
import useAddChainedMoveDialogStore from "@/features/variants/variantEditor/piecesEditor/stores/addChainedMoveDialog";
import useChainedMovesDialogStore from "@/features/variants/variantEditor/piecesEditor/stores/chainedMovesDialog";
import useEditChainedMoveDialogStore from "@/features/variants/variantEditor/piecesEditor/stores/editChainedMoveDialog";
import usePiecesEditorStore from "@/features/variants/variantEditor/piecesEditor/stores/piecesEditor";
import { isNullOrUndefined } from "@/shared/utils/typeChecks";
import {
	IconGripVertical,
	IconPencil,
	IconPlus,
	IconTrash,
} from "@tabler/icons-react";
import { type MouseEvent, useEffect } from "react";

import { isSortable, useSortable } from "@dnd-kit/react/sortable";
import { DragDropProvider } from "@dnd-kit/react";

type SequenceNodeCardProps = {
	chainedMoveNode: ChainedMoveNode;
	nodeId: string;
	sequenceIndex: number;
	nodeIndex: number;
	sequenceIndexInMoveset: number | null;
	sequenceLength: number;
};

type ChainedMoveSequenceCardProps = {
	sequence: ChainedMoveSequence;
	sequenceIndex: number;
	indexInMoveset: number | null;
};

function SequenceNodeCard({
	chainedMoveNode,
	nodeId,
	sequenceIndex,
	nodeIndex,
	sequenceIndexInMoveset,
	sequenceLength,
}: SequenceNodeCardProps) {
	const {
		chainedMoveSequences,
		removeChainedMoveSequence,
		removeChainedMoveFromSequence,
		removeChainedMovesFromSequence,
		addDeletedChainedMoveSequence,
		addChainedMoveToSequence,
	} = usePiecesEditorStore();

	const {
		openChainedMoveDialog,
		updateChainedMoveSequenceIndex,
		updateAdditionalInfo,
		updateOnAddChainedMove,
	} = useAddChainedMoveDialogStore();

	const { addNodeId } = useChainedMovesDialogStore();

	const {
		openEditChainedMoveDialog,
		updateSequenceIndex,
		updateNodeIndex,
		updateNewMovementName,
	} = useEditChainedMoveDialogStore();

	const { deleteNodeIdSequence } = useChainedMovesDialogStore();

	const { ref, handleRef } = useSortable({
		id: nodeId,
		index: nodeIndex,
	});

	function handleDeleteSequenceButtonClick(e: MouseEvent<HTMLDivElement>) {
		e.stopPropagation();
		removeChainedMoveSequence(sequenceIndex);
		deleteNodeIdSequence(sequenceIndex);

		if (isNullOrUndefined(sequenceIndexInMoveset)) return;

		addDeletedChainedMoveSequence([
			sequenceIndexInMoveset,
			chainedMoveSequences[sequenceIndex][1],
		]);
	}

	function handleDeleteThisMoveButtonClick(e: MouseEvent<HTMLDivElement>) {
		e.stopPropagation();

		removeChainedMoveFromSequence(sequenceIndex, nodeIndex);

		if (sequenceLength === 1) {
			removeChainedMoveSequence(sequenceIndex);
			addDeletedChainedMoveSequence([
				sequenceIndexInMoveset,
				chainedMoveSequences[sequenceIndex][1],
			]);
		}
	}

	function handleDeleteMovesBeforeButtonClick(e: MouseEvent<HTMLDivElement>) {
		e.stopPropagation();

		removeChainedMovesFromSequence(
			sequenceIndex,
			Array.from({ length: nodeIndex }, (_, index) => index),
		);
	}

	function handleDeleteMovesAfterButtonClick(e: MouseEvent<HTMLDivElement>) {
		e.stopPropagation();

		removeChainedMovesFromSequence(
			sequenceIndex,
			Array.from(
				{ length: sequenceLength - nodeIndex },
				(_, index) => index + nodeIndex + 1,
			),
		);
	}

	function handleAddMoveBeforeButtonClick(e: MouseEvent<HTMLDivElement>) {
		e.stopPropagation();

		updateAdditionalInfo({
			sequenceIndex,
			nodeIndex,
		});

		updateOnAddChainedMove((movementToAdd, additionalInfo) => {
			const { sequenceIndex, nodeIndex } = additionalInfo as {
				sequenceIndex: number;
				nodeIndex: number;
			};

			addChainedMoveToSequence(sequenceIndex, nodeIndex, {
				moveName: movementToAdd,
				validMove: true,
				terminateOnStop: true,
			});

			addNodeId(sequenceIndex, nodeIndex);
		});

		updateChainedMoveSequenceIndex(sequenceIndex);

		openChainedMoveDialog();
	}

	function handleAddMoveAfterButtonClick(e: MouseEvent<HTMLDivElement>) {
		e.stopPropagation();

		updateAdditionalInfo({
			sequenceIndex,
			nodeIndex,
		});

		updateOnAddChainedMove((movementToAdd, additionalInfo) => {
			const { sequenceIndex, nodeIndex } = additionalInfo as {
				sequenceIndex: number;
				nodeIndex: number;
			};

			addChainedMoveToSequence(sequenceIndex, nodeIndex + 1, {
				moveName: movementToAdd,
				validMove: true,
				terminateOnStop: true,
			});

			addNodeId(sequenceIndex, nodeIndex + 1);
		});

		updateChainedMoveSequenceIndex(sequenceIndex);

		openChainedMoveDialog();
	}

	function handleEditChainedMoveButtonClick(e: MouseEvent<HTMLDivElement>) {
		e.stopPropagation();

		openEditChainedMoveDialog();
		updateSequenceIndex(sequenceIndex);
		updateNodeIndex(nodeIndex);
		updateNewMovementName(chainedMoveNode.moveName);
	}

	return (
		<div ref={ref} className="flex flex-col w-full">
			<div className="grid grid-cols-[9fr_auto] items-center justify-between">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							className="px-4 py-2 rounded-md bg-muted w-full"
						>
							{chainedMoveNode.moveName}
						</Button>
					</DropdownMenuTrigger>

					<DropdownMenuContent className="w-max" side="bottom">
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>
								<IconPlus />
								Add
							</DropdownMenuSubTrigger>

							<DropdownMenuPortal>
								<DropdownMenuSubContent>
									<DropdownMenuItem
										onClick={handleAddMoveBeforeButtonClick}
									>
										<IconPlus />
										Add move before
									</DropdownMenuItem>

									<DropdownMenuItem
										onClick={handleAddMoveAfterButtonClick}
									>
										<IconPlus />
										Add move after
									</DropdownMenuItem>
								</DropdownMenuSubContent>
							</DropdownMenuPortal>
						</DropdownMenuSub>

						<DropdownMenuItem
							onClick={handleEditChainedMoveButtonClick}
						>
							<IconPencil />
							Edit
						</DropdownMenuItem>

						<DropdownMenuSub>
							<DropdownMenuSubTrigger variant="destructive">
								<IconTrash />
								Delete
							</DropdownMenuSubTrigger>

							<DropdownMenuPortal>
								<DropdownMenuSubContent>
									<DropdownMenuItem
										onClick={
											handleDeleteThisMoveButtonClick
										}
										variant="destructive"
									>
										<IconTrash />
										Delete this move
									</DropdownMenuItem>

									{nodeIndex > 0 && (
										<DropdownMenuItem
											onClick={
												handleDeleteMovesBeforeButtonClick
											}
											variant="destructive"
										>
											<IconTrash />
											Delete moves before
										</DropdownMenuItem>
									)}

									{nodeIndex < sequenceLength - 1 && (
										<DropdownMenuItem
											onClick={
												handleDeleteMovesAfterButtonClick
											}
											variant="destructive"
										>
											<IconTrash />
											Delete moves after
										</DropdownMenuItem>
									)}

									<DropdownMenuItem
										onClick={
											handleDeleteSequenceButtonClick
										}
										variant="destructive"
									>
										<IconTrash />
										Delete sequence
									</DropdownMenuItem>
								</DropdownMenuSubContent>
							</DropdownMenuPortal>
						</DropdownMenuSub>
					</DropdownMenuContent>
				</DropdownMenu>

				<div ref={handleRef} className="cursor-grab">
					<IconGripVertical className="stroke-muted-foreground" />
				</div>
			</div>
		</div>
	);
}

function ChainedMoveSequenceCard({
	sequence,
	sequenceIndex,
	indexInMoveset,
}: ChainedMoveSequenceCardProps) {
	const { moveChainedMoveInSequence } = usePiecesEditorStore();
	const { nodeIds, moveNodeId } = useChainedMovesDialogStore();

	if (!nodeIds) return;

	return (
		<div className="w-full">
			<DragDropProvider
				onDragEnd={(event) => {
					const { operation } = event;

					if (!operation.target) return;
					if (!isSortable(operation.source)) return;

					const { initialIndex: startIndex, index: endIndex } =
						operation.source;

					if (startIndex === endIndex) return;

					moveChainedMoveInSequence(
						sequenceIndex,
						startIndex,
						endIndex,
					);

					moveNodeId(sequenceIndex, startIndex, endIndex);
				}}
			>
				<div className="flex min-w-max w-full flex-col gap-2 p-4">
					{sequence.map((node, nodeIndex) => {
						const nodeIdSequence = nodeIds.find(
							([position]) => position === sequenceIndex,
						);
						if (!nodeIdSequence) return;

						return (
							<SequenceNodeCard
								key={nodeIdSequence[1][nodeIndex]}
								nodeId={nodeIdSequence[1][nodeIndex]}
								chainedMoveNode={node}
								sequenceIndex={sequenceIndex}
								sequenceIndexInMoveset={indexInMoveset}
								nodeIndex={nodeIndex}
								sequenceLength={sequence.length}
							/>
						);
					})}
				</div>
			</DragDropProvider>
		</div>
	);
}

function ChainedMovesDialog() {
	const {
		isChainedMovesDialogOpen,
		openChainedMovesDialog,
		closeChainedMovesDialog,
		activePiece,
		clearActivePiece,
		nodeIds,
		updateNodeIds,
		addNodeId,
		addEmptyNodeIdSequence,
	} = useChainedMovesDialogStore();
	const {
		chainedMoveSequences,
		deletedChainedMoveSequences,
		addChainedMoveToSequence,
		addChainedMoveSequence,
	} = usePiecesEditorStore();
	const {
		pieceRulesetDraft,
		updatePieceRulesetDraft,
		syncPieceRulesetDraftToDB,
	} = useVariantDraftStore();

	const {
		openChainedMoveDialog,
		updateChainedMoveSequenceIndex,
		updateAdditionalInfo,
		updateOnAddChainedMove,
	} = useAddChainedMoveDialogStore();

	useEffect(() => {
		if (nodeIds) return;

		updateNodeIds(
			chainedMoveSequences.map(([, sequence], index) => [
				index,
				sequence.map(() => crypto.randomUUID()),
			]),
		);
	}, [nodeIds, chainedMoveSequences, updateNodeIds]);

	function handleAddChainedMoveButtonClick(chainedMoveSequenceIndex: number) {
		updateChainedMoveSequenceIndex(chainedMoveSequenceIndex);
		updateAdditionalInfo({
			chainedMoveSequenceIndex,
		});

		updateOnAddChainedMove((movementToAdd, additionalInfo) => {
			const additionalInfoData = additionalInfo as {
				chainedMoveSequenceIndex: number;
			};

			addChainedMoveToSequence(
				additionalInfoData.chainedMoveSequenceIndex,
				"end",
				{
					moveName: movementToAdd,
					validMove: true,
					terminateOnStop: true,
				},
			);

			addNodeId(additionalInfoData.chainedMoveSequenceIndex, "end");
		});

		openChainedMoveDialog();
	}

	function saveChainedMoveSequences() {
		if (!pieceRulesetDraft) return;
		if (!activePiece) return;

		const updatedPieceRulesetDraft = structuredClone(pieceRulesetDraft);

		chainedMoveSequences.forEach((sequence) => {
			const indexToUpdate = sequence[0];
			if (isNullOrUndefined(indexToUpdate)) {
				updatedPieceRulesetDraft[activePiece].moveset.push(sequence[1]);
			} else {
				updatedPieceRulesetDraft[activePiece].moveset[indexToUpdate] =
					sequence[1];
			}
		});

		deletedChainedMoveSequences.forEach((sequence) => {
			const indexToUpdate = sequence[0];
			if (isNullOrUndefined(indexToUpdate)) {
				return;
			}

			updatedPieceRulesetDraft[activePiece].moveset =
				updatedPieceRulesetDraft[activePiece].moveset.filter(
					(_, index) => index !== indexToUpdate,
				);
		});

		updatePieceRulesetDraft(updatedPieceRulesetDraft);
		syncPieceRulesetDraftToDB();
	}

	function handleAddSequenceButtonClick() {
		addChainedMoveSequence([]);
		addEmptyNodeIdSequence();
	}

	return (
		<>
			<Dialog
				open={isChainedMovesDialogOpen}
				onOpenChange={(open) => {
					if (open) {
						openChainedMovesDialog();
					} else {
						closeChainedMovesDialog();
						saveChainedMoveSequences();
						clearActivePiece();
					}
				}}
			>
				<DialogContent className="min-w-[50vw] w-[50vw] h-[90vh] flex flex-col">
					<DialogHeader>
						<DialogTitle>Chained moves</DialogTitle>
						<DialogDescription>
							View and modify chained move sequences
						</DialogDescription>
					</DialogHeader>

					<ScrollArea className="min-h-0 flex-1 p-4">
						<div className="flex flex-col gap-4">
							<div className="flex flex-1 flex-col gap-4 w-full">
								{chainedMoveSequences.map((sequence, index) => (
									<div
										key={index}
										className="flex min-w-0 flex-row items-center gap-4 w-full"
									>
										<div className="flex min-w-0 flex-1 flex-row items-center rounded-lg border-2 border-dashed border-muted-foreground w-0">
											<ChainedMoveSequenceCard
												sequence={sequence[1]}
												sequenceIndex={index}
												indexInMoveset={sequence[0]}
											/>
										</div>

										<Button
											onClick={() =>
												handleAddChainedMoveButtonClick(
													index,
												)
											}
											variant="outline"
											size="icon-sm"
										>
											<IconPlus />
										</Button>
									</div>
								))}
							</div>

							<Button
								onClick={handleAddSequenceButtonClick}
								className="w-full"
							>
								Add sequence
							</Button>
						</div>
					</ScrollArea>
				</DialogContent>
			</Dialog>

			<AddChainedMoveDialog />
			<EditChainedMoveDialog />
		</>
	);
}

export default ChainedMovesDialog;
