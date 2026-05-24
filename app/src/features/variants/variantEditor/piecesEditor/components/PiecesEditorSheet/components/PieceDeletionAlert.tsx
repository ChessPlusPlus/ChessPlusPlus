import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import useVariantDraftStore from "@/features/variants/variantEditor/common/stores/variantDraft";
import usePieceDeletionAlertStore from "@/features/variants/variantEditor/piecesEditor/stores/pieceDeletionAlert";
import usePiecesEditorStore from "@/features/variants/variantEditor/piecesEditor/stores/piecesEditor";
import usePiecesEditorSheetStore from "@/features/variants/variantEditor/piecesEditor/stores/piecesEditorSheet";

function PieceDeletionAlert() {
	const {
		isPieceDeletionAlertOpen,
		openPieceDeletionAlert,
		closePieceDeletionAlert,
		pieceToDelete,
	} = usePieceDeletionAlertStore();
	const {
		pieceRulesetDraft,
		updatePieceRulesetDraft,
		setupRulesDraft,
		updateSetupRulesDraft,
		syncSetupRulesDraftToDB,
		syncPieceRulesetDraftToDB,
	} = useVariantDraftStore();
	const { updateCurrentMode } = usePiecesEditorSheetStore();
	const { clearActivePiece } = usePiecesEditorStore();

	if (!pieceRulesetDraft) return null;
	if (!setupRulesDraft) return null;

	function handlePieceDeletion() {
		if (!pieceToDelete) return;

		if (!pieceRulesetDraft) return;
		if (!setupRulesDraft) return;

		const updatedPieceRulesetDraft = structuredClone(pieceRulesetDraft);
		delete updatedPieceRulesetDraft[pieceToDelete];

		const updatedSetupRulesDraft = structuredClone(setupRulesDraft);

		for (const color of Object.keys(
			updatedSetupRulesDraft.pieceOwnership,
		)) {
			updatedSetupRulesDraft.pieceOwnership[color as "white" | "black"] =
				updatedSetupRulesDraft.pieceOwnership[
					color as "white" | "black"
				].filter((piece) => piece !== pieceToDelete);
		}

		updatedSetupRulesDraft.startingPosition =
			updatedSetupRulesDraft.startingPosition.filter(
				([, pieceName]) => pieceName !== pieceToDelete,
			);

		updatePieceRulesetDraft(updatedPieceRulesetDraft);
		updateSetupRulesDraft(updatedSetupRulesDraft);

		syncSetupRulesDraftToDB();
		syncPieceRulesetDraftToDB();
		
		closePieceDeletionAlert();
		updateCurrentMode("pieceSelection");

		clearActivePiece();
	}

	return (
		<AlertDialog
			open={isPieceDeletionAlertOpen}
			onOpenChange={(open) =>
				open ? openPieceDeletionAlert() : closePieceDeletionAlert()
			}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete piece?</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete this piece? This action
						cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel className="px-4">
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction className="px-4" onClick={handlePieceDeletion}>
						Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export default PieceDeletionAlert;
