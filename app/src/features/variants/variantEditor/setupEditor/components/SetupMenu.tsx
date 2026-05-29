import { Button } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Tooltip,
	TooltipTrigger,
	TooltipContent,
} from "@/components/ui/tooltip";
import usePieceImagesStore from "@/features/variants/common/stores/pieceImages";
import SelectionDialog from "@/features/variants/variantEditor/common/components/SelectionDialog";
import useVariantDraftStore from "@/features/variants/variantEditor/common/stores/variantDraft";
import AddPlayerDialog from "@/features/variants/variantEditor/setupEditor/components/AddPlayerDialog";
import RenamePlayerDialog from "@/features/variants/variantEditor/setupEditor/components/RenamePlayerDialog";
import useAddPlayerDialogStore from "@/features/variants/variantEditor/setupEditor/stores/addPlayerDialog";
import usePieceOwnershipSelectionDialogStore from "@/features/variants/variantEditor/setupEditor/stores/pieceOwnershipSelectionDialog";
import useRenamePlayerDialogStore from "@/features/variants/variantEditor/setupEditor/stores/renamePlayerDialog";
import useSetupMenuStore from "@/features/variants/variantEditor/setupEditor/stores/setupMenu";
import { isNullOrUndefined } from "@/shared/utils/typeChecks";
import { useDraggable } from "@dnd-kit/react";
import {
	IconChevronDown,
	IconChevronUp,
	IconDotsVertical,
	IconPencil,
	IconPlus,
	IconX,
} from "@tabler/icons-react";
import { ChessKnight } from "lucide-react";
import { useEffect, type ChangeEvent } from "react";

import _ from "lodash";

type PieceImageProps = {
	player: string;
	piece: string;
	imageId: string;
};

function PieceImage({ player, piece, imageId }: PieceImageProps) {
	const { images } = usePieceImagesStore();
	const { currentVariantId } = useVariantDraftStore();

	const { ref } = useDraggable({
		id: `${player}-${piece}`,
	});

	if (!images) return null;
	if (!currentVariantId) return null;

	const pieceImage = URL.createObjectURL(
		images[imageId][currentVariantId] ?? images[imageId].image,
	);

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<img
					ref={ref}
					key={`${player}-${piece}`}
					className="size-14 hover:bg-gray-300 rounded-md"
					src={pieceImage}
					alt={piece}
				/>
			</TooltipTrigger>
			<TooltipContent>{piece}</TooltipContent>
		</Tooltip>
	);
}

function SetupMenu() {
	const {
		setupRulesDraft,
		updateSetupRulesDraft,
		pieceRulesetDraft,
		currentVariantId,
	} = useVariantDraftStore();
	const { originalSetupRulesDraft } = useSetupMenuStore();
	const { images } = usePieceImagesStore();
	const {
		isPieceOwnershipSelectionDialogOpen,
		openPieceOwnershipSelectionDialog,
		closePieceOwnershipSelectionDialog,
		player,
		updatePlayer,
		searchQuery,
		updateSearchQuery,
		clearSearchQuery,
	} = usePieceOwnershipSelectionDialogStore();

	const {
		isPlayersExpanded,
		isPiecesExpanded,
		isBoardSizeExpanded,
		originalBoardXSize,
		originalBoardYSize,
		updateOriginalBoardYSize,
		updateOriginalBoardXSize,
		expandBoardSize,
		collapseBoardSize,
		expandPlayers,
		collapsePlayers,
		expandPieces,
		collapsePieces,
		updateOriginalSetupRulesDraft,
	} = useSetupMenuStore();

	const {
		openAddPlayerDialog,
		clearPlayerNameErrors,
		closeAddPlayerDialog,
		clearPlayerName,
	} = useAddPlayerDialogStore();
	const {
		openRenamePlayerDialog,
		clearOriginalPlayerName,
		clearPlayerName: clearRenamePlayerName,
		clearPlayerNameErrors: clearRenamePlayerNameErrors,
		closeRenamePlayerDialog,
	} = useRenamePlayerDialogStore();

	useEffect(() => {
		if (!setupRulesDraft) return;
		updateOriginalSetupRulesDraft(setupRulesDraft);
	}, []);

	useEffect(() => {
		return () => {
			clearPlayerNameErrors();
			clearSearchQuery();
			closePieceOwnershipSelectionDialog();
			closeAddPlayerDialog();
			clearPlayerName();
		};
	}, [
		clearPlayerNameErrors,
		clearSearchQuery,
		closePieceOwnershipSelectionDialog,
		closeAddPlayerDialog,
		clearPlayerName,
	]);

	useEffect(() => {
		return () => {
			clearOriginalPlayerName();
			clearRenamePlayerName();
			clearRenamePlayerNameErrors();
			closeRenamePlayerDialog();
		};
	}, [
		clearOriginalPlayerName,
		clearRenamePlayerName,
		clearRenamePlayerNameErrors,
		closeRenamePlayerDialog,
	]);

	if (!setupRulesDraft) return null;
	if (!pieceRulesetDraft) return null;
	if (!images) return null;
	if (!currentVariantId) return null;

	const pieceOwnershipRules = setupRulesDraft.pieceOwnership;
	const players = Object.keys(pieceOwnershipRules);
	const { boardXSize, boardYSize } = setupRulesDraft;

	const selectionList = player
		? Object.keys(pieceRulesetDraft).map((piece) => {
				return {
					name: piece,
					isSelected: pieceOwnershipRules[player].includes(piece),
				};
			})
		: [];

	function handlePieceSelection(piece: string) {
		if (!player) return;
		if (!setupRulesDraft) return;

		const updatedSetupRulesDraft = structuredClone(setupRulesDraft);

		if (updatedSetupRulesDraft.pieceOwnership[player].includes(piece)) {
			updatedSetupRulesDraft.pieceOwnership[player] =
				updatedSetupRulesDraft.pieceOwnership[player].filter(
					(p) => p !== piece,
				);
		} else {
			updatedSetupRulesDraft.pieceOwnership[player] = [
				...updatedSetupRulesDraft.pieceOwnership[player],
				piece,
			];
		}

		updateSetupRulesDraft(updatedSetupRulesDraft);
	}

	function handleEditPiecesButtonClick(playerName: string) {
		openPieceOwnershipSelectionDialog();
		updatePlayer(playerName);
	}

	function handleRenamePlayerButtonClick(playerName: string) {
		openRenamePlayerDialog(playerName);
	}

	function handleBoardWidthInputChange(e: ChangeEvent<HTMLInputElement>) {
		if (!setupRulesDraft) return;

		const newBoardXSize = e.target.valueAsNumber;
		const updatedSetupRulesDraft = structuredClone(setupRulesDraft);

		updatedSetupRulesDraft.boardXSize = newBoardXSize;
		updateSetupRulesDraft(updatedSetupRulesDraft);

		if (isNullOrUndefined(originalBoardXSize)) {
			if (Number.isNaN(newBoardXSize)) return;
			if (!Number.isFinite(newBoardXSize)) return;
			if (newBoardXSize < 1) return;
			if (newBoardXSize > 32) return;

			updateOriginalBoardXSize(newBoardXSize);
		}
	}

	function handleBoardHeightInputChange(e: ChangeEvent<HTMLInputElement>) {
		if (!setupRulesDraft) return;

		const newBoardYSize = e.target.valueAsNumber;
		const updatedSetupRulesDraft = structuredClone(setupRulesDraft);

		updatedSetupRulesDraft.boardYSize = newBoardYSize;
		updateSetupRulesDraft(updatedSetupRulesDraft);

		if (isNullOrUndefined(originalBoardYSize)) {
			if (Number.isNaN(newBoardYSize)) return;
			if (!Number.isFinite(newBoardYSize)) return;
			if (newBoardYSize < 1) return;
			if (newBoardYSize > 32) return;

			updateOriginalBoardYSize(newBoardYSize);
		}
	}

	function revertBoardXSize() {
		const updatedOriginalBoardXSize =
			useSetupMenuStore.getState().originalBoardXSize;
		const currentSetupRulesDraft = useVariantDraftStore.getState().setupRulesDraft;

		if (!currentSetupRulesDraft) return;
		if (isNullOrUndefined(updatedOriginalBoardXSize)) return;

		const updatedSetupRulesDraft = structuredClone(currentSetupRulesDraft);
		updatedSetupRulesDraft.boardXSize = updatedOriginalBoardXSize;

		updateSetupRulesDraft(updatedSetupRulesDraft);
		updateOriginalBoardXSize(updatedOriginalBoardXSize);
	}

	function revertBoardYSize() {
		const updatedOriginalBoardYSize =
			useSetupMenuStore.getState().originalBoardYSize;
		const currentSetupRulesDraft = useVariantDraftStore.getState().setupRulesDraft;

		if (!currentSetupRulesDraft) return;
		if (isNullOrUndefined(updatedOriginalBoardYSize)) return;

		const updatedSetupRulesDraft = structuredClone(currentSetupRulesDraft);
		updatedSetupRulesDraft.boardYSize = updatedOriginalBoardYSize;

		updateSetupRulesDraft(updatedSetupRulesDraft);

		updateOriginalBoardYSize(updatedOriginalBoardYSize);
	}

	function handleBoardWidthInputBlur() {
		if (!setupRulesDraft) return;

		if (Number.isNaN(boardXSize)) {
			revertBoardXSize();
			return;
		}

		if (!Number.isFinite(boardXSize)) {
			revertBoardXSize();
			return;
		}

		if (boardXSize < 1) {
			revertBoardXSize();
			return;
		}

		if (boardXSize > 32) {
			revertBoardXSize();
			return;
		}
	}

	function handleBoardHeightInputBlur() {
		if (!setupRulesDraft) return;

		if (Number.isNaN(boardYSize)) {
			revertBoardYSize();
			return;
		}

		if (!Number.isFinite(boardYSize)) {
			revertBoardYSize();
			return;
		}

		if (boardYSize < 1) {
			revertBoardYSize();
			return;
		}

		if (boardYSize > 32) {
			revertBoardYSize();
			return;
		}
	}

	function handleAddPlayerButtonClick() {
		openAddPlayerDialog();
	}

	function handleSaveBoardSizeButtonClick() {
		if (!setupRulesDraft) return;

		const updatedSetupRulesDraft = structuredClone(setupRulesDraft);
		updatedSetupRulesDraft.boardXSize = boardXSize;
		updatedSetupRulesDraft.boardYSize = boardYSize;

		updatedSetupRulesDraft.startingPosition =
			updatedSetupRulesDraft.startingPosition.filter(([[file, rank]]) => {
				return file < boardXSize && rank < boardYSize;
			});

		updateSetupRulesDraft(updatedSetupRulesDraft);

		updateOriginalBoardXSize(updatedSetupRulesDraft.boardXSize);
		updateOriginalBoardYSize(updatedSetupRulesDraft.boardYSize);
	}

	function handleRevertBoardSizeButtonClick() {
		revertBoardXSize();
		revertBoardYSize();
	}

	return (
		<>
			<div className="bg-muted p-2 rounded-lg">
				<div className="flex flex-row justify-between items-center p-2 gap-4">
					<h1 className="text-xl font-semibold">Setup options</h1>
					<Button size="icon-xs" variant="ghost">
						<IconX className="size-4" />
					</Button>
				</div>

				<Collapsible
					open={isBoardSizeExpanded}
					onOpenChange={(open) => {
						if (open) {
							expandBoardSize();
						} else {
							collapseBoardSize();
						}
					}}
				>
					<div className="flex flex-row items-center justify-between w-full p-2">
						<span className="text-sm font-semibold">
							Board size
						</span>
						<CollapsibleTrigger asChild>
							<Button
								variant="ghost"
								size="icon-xs"
								className="hover:bg-gray-300 aria-expanded:hover:bg-gray-300"
							>
								{isPlayersExpanded ? (
									<IconChevronUp className="size-4" />
								) : (
									<IconChevronDown className="size-4" />
								)}
							</Button>
						</CollapsibleTrigger>
					</div>

					<CollapsibleContent>
						<FieldSet className="flex flex-col gap-4 px-2">
							<Field
								className="grid grid-cols-2 gap-4 items-center"
								orientation="horizontal"
							>
								<FieldLabel htmlFor="boardWidthInput">
									Board width
								</FieldLabel>
								<Input
									className="bg-background"
									id="boardWidthInput"
									type="number"
									placeholder="Width"
									min={1}
									max={32}
									value={boardXSize}
									onChange={handleBoardWidthInputChange}
									onBlur={handleBoardWidthInputBlur}
								/>
							</Field>
							<Field
								className="grid grid-cols-2 gap-4 items-center"
								orientation="horizontal"
							>
								<FieldLabel htmlFor="boardHeightInput">
									Board height
								</FieldLabel>
								<Input
									className="bg-background"
									id="boardHeightInput"
									type="number"
									placeholder="Height"
									min={1}
									max={32}
									value={boardYSize}
									onChange={handleBoardHeightInputChange}
									onBlur={handleBoardHeightInputBlur}
								/>
							</Field>
						</FieldSet>
					</CollapsibleContent>
				</Collapsible>

				<Collapsible
					open={isPlayersExpanded}
					onOpenChange={(open) => {
						if (open) {
							expandPlayers();
						} else {
							collapsePlayers();
						}
					}}
				>
					<div className="flex flex-row items-center justify-between w-full p-2">
						<span className="text-sm font-semibold">Players</span>
						<div className="flex flex-row items-center">
							<Button
								variant="ghost"
								size="icon-xs"
								className="hover:bg-gray-300"
								onClick={handleAddPlayerButtonClick}
								disabled={players.length >= 2}
								aria-disabled={players.length >= 2}
								aria-label="Add player"
								title="Add player"
							>
								<IconPlus className="size-4" />
							</Button>
							<CollapsibleTrigger asChild>
								<Button
									variant="ghost"
									size="icon-xs"
									className="hover:bg-gray-300 aria-expanded:hover:bg-gray-300"
								>
									{isPlayersExpanded ? (
										<IconChevronUp className="size-4" />
									) : (
										<IconChevronDown className="size-4" />
									)}
								</Button>
							</CollapsibleTrigger>
						</div>
					</div>

					<CollapsibleContent>
						<div className="flex flex-col">
							{players.map((player) => {
								return (
									<div
										key={player}
										className="flex flex-row items-center justify-between w-full px-2"
									>
										<span className="text-sm">
											{player}
										</span>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="icon-xs"
													className="hover:bg-gray-300 py-4"
												>
													<IconDotsVertical className="size-5" />
												</Button>
											</DropdownMenuTrigger>

											<DropdownMenuContent side="right">
												<DropdownMenuItem
													onClick={() =>
														handleEditPiecesButtonClick(
															player,
														)
													}
												>
													<ChessKnight className="size-4" />
													Edit pieces
												</DropdownMenuItem>

												<DropdownMenuItem
													onClick={() =>
														handleRenamePlayerButtonClick(
															player,
														)
													}
												>
													<IconPencil className="size-4" />
													Rename
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								);
							})}
						</div>
					</CollapsibleContent>
				</Collapsible>

				<Collapsible
					open={isPiecesExpanded}
					onOpenChange={(open) => {
						if (open) {
							expandPieces();
						} else {
							collapsePieces();
						}
					}}
				>
					<div className="flex flex-row items-center justify-between w-full p-2">
						<span className="text-sm font-semibold">Pieces</span>
						<CollapsibleTrigger asChild>
							<Button
								variant="ghost"
								size="icon-xs"
								className="hover:bg-gray-300 aria-expanded:hover:bg-gray-300"
							>
								{isPiecesExpanded ? (
									<IconChevronUp className="size-4" />
								) : (
									<IconChevronDown className="size-4" />
								)}
							</Button>
						</CollapsibleTrigger>
					</div>

					<CollapsibleContent>
						<Tabs>
							<TabsList variant="line">
								{players.map((color) => (
									<TabsTrigger key={color} value={color}>
										{color}
									</TabsTrigger>
								))}
							</TabsList>

							{players.map((color) => (
								<TabsContent key={color} value={color}>
									<div className="grid grid-cols-8 w-full p-2">
										{pieceOwnershipRules[
											color as keyof typeof pieceOwnershipRules
										].map((piece) => (
											<PieceImage
												key={piece}
												imageId={
													pieceRulesetDraft[piece]
														.imageId ?? ""
												}
												piece={piece}
												player={color}
											/>
										))}
									</div>
								</TabsContent>
							))}
						</Tabs>
					</CollapsibleContent>
				</Collapsible>

				{(!_.isEqual(originalSetupRulesDraft, setupRulesDraft)) && (
					<div className="flex flex-row gap-2 p-2">
						<Button
							disabled={
								Number.isNaN(boardXSize) ||
								!Number.isFinite(boardXSize) ||
								boardXSize < 1 ||
								boardXSize > 32 ||
								Number.isNaN(boardYSize) ||
								!Number.isFinite(boardYSize) ||
								boardYSize < 1 ||
								boardYSize > 32
							}
							onClick={handleSaveBoardSizeButtonClick}
						>
							Save
						</Button>
						<Button
							onClick={handleRevertBoardSizeButtonClick}
							variant="destructive"
						>
							Revert
						</Button>
					</div>
				)}
			</div>

			<SelectionDialog
				isOpen={isPieceOwnershipSelectionDialogOpen}
				onOpenChange={(open) => {
					if (open) {
						openPieceOwnershipSelectionDialog();
					} else {
						closePieceOwnershipSelectionDialog();
					}
				}}
				onSelection={handlePieceSelection}
				title="Select pieces"
				description="Select the pieces you want to assign to the player"
				items={selectionList}
				searchPlaceholder="Search pieces"
				searchQuery={searchQuery}
				updateSearchQuery={updateSearchQuery}
				clearSearchQuery={clearSearchQuery}
			/>

			<AddPlayerDialog />
			<RenamePlayerDialog />
		</>
	);
}

export default SetupMenu;
