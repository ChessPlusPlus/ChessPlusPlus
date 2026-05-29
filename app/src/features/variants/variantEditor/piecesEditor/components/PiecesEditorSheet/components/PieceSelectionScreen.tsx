import useVariantDraftStore from "@/features/variants/variantEditor/common/stores/variantDraft";
import {
	SheetClose,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import usePiecesEditorSheetStore from "@/features/variants/variantEditor/piecesEditor/stores/piecesEditorSheet";
import usePiecesEditorStore from "@/features/variants/variantEditor/piecesEditor/stores/piecesEditor";
import PieceCreationDialog from "@/features/variants/variantEditor/piecesEditor/components/PiecesEditorSheet/components/PieceCreationDialog";
import usePieceCreationDialogStore from "@/features/variants/variantEditor/piecesEditor/stores/pieceCreationDialog";
import { IconArrowsMove } from "@tabler/icons-react";
import { ChessKnightIcon } from "lucide-react";
import useSidebarStore from "@/features/variants/variantEditor/common/stores/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import useMovementsEditorStore from "@/features/variants/variantEditor/movementsEditor/stores/movementsEditor";
import posthog from "posthog-js";

export function PieceSelectionScreen() {
	const { pieceRulesetDraft } = useVariantDraftStore();
	const { updateCurrentMode } = usePiecesEditorSheetStore();
	const { updateActivePiece } = usePiecesEditorStore();
	const { openPieceCreationDialog } = usePieceCreationDialogStore();
	const { updateCurrentOpenMenu } = useSidebarStore();
	const { activeMovementName } = useMovementsEditorStore();

	if (!pieceRulesetDraft) return null;

	function handlePieceClick(pieceName: string) {
		updateActivePiece(pieceName);
		updateCurrentMode("pieceEditing");
	}

	function handleMovementsEditorButtonClick() {
		updateCurrentOpenMenu("movements");
		posthog.capture("quicknav_used", {
			from: "pieces_editor",
		})
	}

	return (
		<>
			<>
				<SheetHeader>
					<div className="flex flex-row items-center justify-between">
						<SheetTitle>Pieces Editor</SheetTitle>

						<div className="flex flex-row gap-2">
							<Button
								disabled
								variant="ghost"
								className="p-0 hover:bg-(--sidebar-primary-hover)"
							>
								<ChessKnightIcon
									className="size-5"
									strokeWidth={1.5}
								/>
							</Button>
							
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										onClick={
											handleMovementsEditorButtonClick
										}
										variant="ghost"
										className="p-0 hover:bg-(--sidebar-primary-hover)"
									>
										<IconArrowsMove
											className="size-5"
											strokeWidth={1.5}
										/>
									</Button>
								</TooltipTrigger>

								<TooltipContent side="left" sideOffset={8}>
									{activeMovementName ??
										"No movement selected"}
								</TooltipContent>
							</Tooltip>
						</div>
					</div>

					<SheetDescription>
						Edit the pieces in this variant.
					</SheetDescription>
				</SheetHeader>

				<div className="flex flex-col px-3">
					{Object.keys(pieceRulesetDraft).map((piece) => (
						<Button
							className="p-0 px-1 justify-start hover:bg-(--sidebar-primary-hover)"
							variant="ghost"
							key={piece}
							onClick={() => handlePieceClick(piece)}
						>
							{piece}
						</Button>
					))}
				</div>

				<SheetFooter>
					<Button onClick={openPieceCreationDialog}>
						Create piece
					</Button>
					<SheetClose asChild>
						<Button variant="outline">Close</Button>
					</SheetClose>
				</SheetFooter>
			</>

			<PieceCreationDialog />
		</>
	);
}
