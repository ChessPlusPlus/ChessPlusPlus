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
import usePieceOwnershipSelectionDialogStore from "@/features/variants/variantEditor/setupEditor/stores/pieceOwnershipSelectionDialog";
import useSetupMenuStore from "@/features/variants/variantEditor/setupEditor/stores/setupMenu";
import { useDraggable } from "@dnd-kit/react";
import {
	IconChevronDown,
	IconChevronUp,
	IconDotsVertical,
	IconX,
} from "@tabler/icons-react";
import { ChessKnight } from "lucide-react";
import type { ChangeEvent } from "react";

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
		expandBoardSize,
		collapseBoardSize,
		expandPlayers,
		collapsePlayers,
		expandPieces,
		collapsePieces,
	} = useSetupMenuStore();

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

	function handleBoardWidthInputChange(e: ChangeEvent<HTMLInputElement>) {
		if (!setupRulesDraft) return;
		
		const newBoardXSize = e.target.valueAsNumber;
		const updatedSetupRulesDraft = structuredClone(setupRulesDraft);
		
		updatedSetupRulesDraft.boardXSize = newBoardXSize;
		updateSetupRulesDraft(updatedSetupRulesDraft);
		syncSetupRulesDraftToDB();
	}

	function handleBoardHeightInputChange(e: ChangeEvent<HTMLInputElement>) {
		if (!setupRulesDraft) return;
		
		const newBoardYSize = e.target.valueAsNumber;
		const updatedSetupRulesDraft = structuredClone(setupRulesDraft);
		updatedSetupRulesDraft.boardYSize = newBoardYSize;
		updateSetupRulesDraft(updatedSetupRulesDraft);
		syncSetupRulesDraftToDB();
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
						<span className="text-sm font-semibold">Board size</span>
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
						<div className="flex flex-col">
							{players.map((color) => {
								return (
									<div
										key={color}
										className="flex flex-row items-center justify-between w-full px-2"
									>
										<span className="text-sm">{color}</span>
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
															color,
														)
													}
												>
													<ChessKnight className="size-4" />
													Edit pieces
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
		</>
	);
}

export default SetupMenu;
