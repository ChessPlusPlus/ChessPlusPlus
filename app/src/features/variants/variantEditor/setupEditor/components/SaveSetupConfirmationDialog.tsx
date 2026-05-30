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
import useSetupSaveConfirmationDialogStore from "@/features/variants/variantEditor/setupEditor/stores/setupSaveConfirmationDialog";
import { useNavigate, useParams } from "react-router-dom";

function SaveSetupConfirmationDialog() {
	const {
		isSetupSaveConfirmationDialogOpen,
		openSetupSaveConfirmationDialog,
		closeSetupSaveConfirmationDialog,
	} = useSetupSaveConfirmationDialogStore();
	const { syncSetupRulesDraftToDB, currentVariantId } = useVariantDraftStore();
	const { variantId } = useParams();

	const navigate = useNavigate();

	function handleSaveAndLeaveButtonClick() {
		syncSetupRulesDraftToDB();
		closeSetupSaveConfirmationDialog();
		navigate(`/variants/${currentVariantId ?? variantId}`);
	}

	function handleLeaveWithoutSavingButtonClick() {
		closeSetupSaveConfirmationDialog();
		navigate(`/variants/${currentVariantId ?? variantId}`);
	}

	return (
		<AlertDialog
			open={isSetupSaveConfirmationDialogOpen}
			onOpenChange={(open) => {
				if (open) {
					openSetupSaveConfirmationDialog();
				} else {
					closeSetupSaveConfirmationDialog();
				}
			}}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Leave setup page?</AlertDialogTitle>
					<AlertDialogDescription>
						You have unsaved changes. Are you sure you want to
						leave?
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter className="grid grid-cols-[1.5fr_1.5fr_1fr] gap-2">
					<AlertDialogAction variant="default" className="px-4" onClick={handleSaveAndLeaveButtonClick}>
						Save and leave
					</AlertDialogAction>
					<AlertDialogAction variant="destructive" className="px-4" onClick={handleLeaveWithoutSavingButtonClick}>
						Leave without saving
					</AlertDialogAction>
					<AlertDialogCancel className="px-4">
						Cancel
					</AlertDialogCancel>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export default SaveSetupConfirmationDialog;
