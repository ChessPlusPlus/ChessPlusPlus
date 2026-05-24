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

type PieceImageProps = {
	player: string;
	piece: string;
};

function PieceImage({ player, piece }: PieceImageProps) {
	const { images } = usePieceImagesStore();
	const { currentVariantId } = useVariantDraftStore();

	const { ref } = useDraggable({
		id: `${player}-${piece}`,
	});

	if (!images) return null;
	if (!currentVariantId) return null;

	const pieceImage = URL.createObjectURL(
		images[piece][currentVariantId] ?? images[piece].image,
	);

	return (
		<img
			ref={ref}
			key={`${player}-${piece}`}
			className="size-14 hover:bg-gray-300 rounded-md"
			src={pieceImage}
			alt={piece}
		/>
	);
}

function SetupMenu() {
	const {
		setupRulesDraft,
		updateSetupRulesDraft,
		syncSetupRulesDraftToDB,
		pieceRulesetDraft,
		currentVariantId,
	} = useVariantDraftStore();
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
		resetOriginalBoardYSize,
		updateOriginalBoardXSize,
		resetOriginalBoardXSize,
		expandBoardSize,
		collapseBoardSize,
		expandPlayers,
		collapsePlayers,
		expandPieces,
		collapsePieces,
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
		const saveTimeout = setTimeout(() => {
			const boardXSize = setupRulesDraft?.boardXSize;

			if (isNullOrUndefined(boardXSize)) return;
			if (Number.isNaN(boardXSize)) return;
			if (!Number.isFinite(boardXSize)) return;
			if (boardXSize < 1) return;
			if (boardXSize > 32) return;

			syncSetupRulesDraftToDB(["boardXSize"]);
			console.log("Board x size saved");
		}, 400);

		return () => clearTimeout(saveTimeout);
	}, [
		setupRulesDraft?.boardXSize,
		resetOriginalBoardXSize,
		syncSetupRulesDraftToDB,
		updateSetupRulesDraft,
	]);

	useEffect(() => {
		const saveTimeout = setTimeout(() => {
			const boardYSize = setupRulesDraft?.boardYSize;

			if (isNullOrUndefined(boardYSize)) return;
			if (Number.isNaN(boardYSize)) return;
			if (!Number.isFinite(boardYSize)) return;
			if (boardYSize < 1) return;
			if (boardYSize > 32) return;

			syncSetupRulesDraftToDB(["boardYSize"]);
		}, 400);

		return () => clearTimeout(saveTimeout);
	}, [
		setupRulesDraft?.boardYSize,
		resetOriginalBoardYSize,
		syncSetupRulesDraftToDB,
		updateSetupRulesDraft,
	]);

	useEffect(() => {
		if (isNullOrUndefined(setupRulesDraft?.boardXSize)) return;

		if (Number.isNaN(setupRulesDraft.boardXSize)) return;
		if (!Number.isFinite(setupRulesDraft.boardXSize)) return;
		if (setupRulesDraft.boardXSize < 1) return;
		if (setupRulesDraft.boardXSize > 32) return;

		const timeout = setTimeout(() => {
			updateOriginalBoardXSize(setupRulesDraft.boardXSize);
		}, 400);

		return () => clearTimeout(timeout);
	}, [setupRulesDraft?.boardXSize, updateOriginalBoardXSize]);

	useEffect(() => {
		if (isNullOrUndefined(setupRulesDraft?.boardYSize)) return;

		if (Number.isNaN(setupRulesDraft.boardYSize)) return;
		if (!Number.isFinite(setupRulesDraft.boardYSize)) return;
		if (setupRulesDraft.boardYSize < 1) return;
		if (setupRulesDraft.boardYSize > 32) return;

		const timeout = setTimeout(() => {
			updateOriginalBoardYSize(setupRulesDraft.boardYSize);
		}, 400);

		return () => clearTimeout(timeout);
	}, [setupRulesDraft?.boardYSize, updateOriginalBoardYSize]);

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
		syncSetupRulesDraftToDB();
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

		if (!setupRulesDraft) return;
		if (isNullOrUndefined(updatedOriginalBoardXSize)) return;

		const updatedSetupRulesDraft = structuredClone(setupRulesDraft);
		updatedSetupRulesDraft.boardXSize = updatedOriginalBoardXSize;
		updateSetupRulesDraft(updatedSetupRulesDraft);
		syncSetupRulesDraftToDB();

		resetOriginalBoardXSize();
	}

	function revertBoardYSize() {
		const updatedOriginalBoardYSize =
			useSetupMenuStore.getState().originalBoardYSize;

		if (!setupRulesDraft) return;
		if (isNullOrUndefined(updatedOriginalBoardYSize)) return;

		const updatedSetupRulesDraft = structuredClone(setupRulesDraft);
		updatedSetupRulesDraft.boardYSize = updatedOriginalBoardYSize;
		updateSetupRulesDraft(updatedSetupRulesDraft);
		syncSetupRulesDraftToDB();

		resetOriginalBoardYSize();
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

		syncSetupRulesDraftToDB();
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

		syncSetupRulesDraftToDB();
	}

	function handleAddPlayerButtonClick() {
		openAddPlayerDialog();
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
