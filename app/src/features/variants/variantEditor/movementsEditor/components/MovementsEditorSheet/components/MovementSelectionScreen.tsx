import useVariantDraftStore from "@/features/variants/variantEditor/common/stores/variantDraft";
import useMovementsEditorSheetStore from "@/features/variants/variantEditor/movementsEditor/stores/movementsEditorSheet";
import useMovementsEditorStore from "@/features/variants/variantEditor/movementsEditor/stores/movementsEditor";
import {
	SheetClose,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import useCreateMovementDialogStore from "@/features/variants/variantEditor/movementsEditor/stores/createMovementDialog";
import MovementCreationDialog from "@/features/variants/variantEditor/movementsEditor/components/MovementsEditorSheet/components/MovementCreationDialog";
import { ChessKnightIcon } from "lucide-react";
import { IconArrowsMove } from "@tabler/icons-react";
import useSidebarStore from "@/features/variants/variantEditor/common/stores/sidebar";

export function MovementSelectionScreen() {
	const { movementRulesDraft } = useVariantDraftStore();
	const { updateCurrentMode } = useMovementsEditorSheetStore();
	const { updateActiveMovementName } = useMovementsEditorStore();
	const { openCreateMovementDialog } = useCreateMovementDialogStore();
	const { updateCurrentOpenMenu } = useSidebarStore();

	if (!movementRulesDraft) return null;

	function handlePieceMovementClick(movementName: string) {
		updateCurrentMode("movementEditing");
		updateActiveMovementName(movementName);
	}

	function handlePiecesEditorButtonClick() {
		updateCurrentOpenMenu("pieces");
	}

	return (
		<>
			<>
				<SheetHeader>
					<div className="flex flex-row items-center justify-between">
						<SheetTitle>Movements editor</SheetTitle>

						<div className="flex flex-row gap-2">
							<Button
								onClick={handlePiecesEditorButtonClick}
								variant="ghost"
								className="p-0 hover:bg-(--sidebar-primary-hover)"
							>
								<ChessKnightIcon
									className="size-5"
									strokeWidth={1.5}
								/>
							</Button>

							<Button
								disabled
								variant="ghost"
								className="p-0 hover:bg-(--sidebar-primary-hover)"
							>
								<IconArrowsMove
									className="size-5"
									strokeWidth={1.5}
								/>
							</Button>
						</div>
					</div>
					<SheetDescription>
						Edit piece movement rules here
					</SheetDescription>
				</SheetHeader>

				<div className="flex flex-col overflow-y-auto px-3">
					{Object.entries(movementRulesDraft).map(
						([movementName], index) => (
							<Button
								key={movementName}
								className="p-0 px-1 text-left justify-start hover:bg-(--sidebar-primary-hover)"
								variant="ghost"
								onClick={() =>
									handlePieceMovementClick(movementName)
								}
							>
								{index + 1}. {movementName}
							</Button>
						),
					)}
				</div>

				<SheetFooter>
					<Button onClick={openCreateMovementDialog}>
						Create movement
					</Button>
					<SheetClose asChild>
						<Button variant="outline">Close</Button>
					</SheetClose>
				</SheetFooter>
			</>

			<MovementCreationDialog />
		</>
	);
}
