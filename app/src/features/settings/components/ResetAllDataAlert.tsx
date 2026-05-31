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
import useFeedbackCollectionCredentialsStore from "@/features/feedbackCollection/stores/feedbackCollectionCredentials";
import useResetAllDataAlertStore from "@/features/settings/stores/resetAllDataAlert";
import useSettingsDialogStore from "@/features/settings/stores/settingsDialog";
import usePieceImagesStore from "@/features/variants/common/stores/pieceImages";
import useVariantsStore from "@/features/variants/common/stores/variantsStore";
import useSidebarStore from "@/features/variants/variantEditor/common/stores/sidebar";
import useVariantDraftStore from "@/features/variants/variantEditor/common/stores/variantDraft";
import useMovementsEditorStore from "@/features/variants/variantEditor/movementsEditor/stores/movementsEditor";
import useMovementsEditorSheetStore from "@/features/variants/variantEditor/movementsEditor/stores/movementsEditorSheet";
import usePiecesEditorStore from "@/features/variants/variantEditor/piecesEditor/stores/piecesEditor";
import usePiecesEditorSheetStore from "@/features/variants/variantEditor/piecesEditor/stores/piecesEditorSheet";
import useAnalyticsPreferencesStore from "@/shared/stores/analyticsPreferences";

function ResetAllDataAlert() {
	const { resetVariantsData } = useVariantsStore();
	const { resetPieceImagesData } = usePieceImagesStore();
	const { resetAnalyticsData } = useAnalyticsPreferencesStore();
	const { resetMovementsEditorState } = useMovementsEditorStore();
	const { resetMovementsEditorSheetState } = useMovementsEditorSheetStore();
	const { resetPiecesEditorState } = usePiecesEditorStore();
	const { resetPiecesEditorSheetState } = usePiecesEditorSheetStore();
	const { resetVariantDraftState } = useVariantDraftStore();
	const { resetSidebarState } = useSidebarStore();
	const { closeSettingsDialog } = useSettingsDialogStore();
	const { resetFeedbackCollectionCredentials } = useFeedbackCollectionCredentialsStore();

	const {
		isResetAllDataAlertOpen,
		openResetAllDataAlert,
		closeResetAllDataAlert,
	} = useResetAllDataAlertStore();

	function handleResetAllData() {
		closeResetAllDataAlert();
		closeSettingsDialog();

		resetVariantsData();
		resetPieceImagesData();
		resetAnalyticsData();

		resetMovementsEditorState();
		resetMovementsEditorSheetState();
		resetPiecesEditorState();
		resetPiecesEditorSheetState();
		resetVariantDraftState();
		resetSidebarState();
		resetFeedbackCollectionCredentials();

		window.uj?.identify(null);
	}

	return (
		<AlertDialog
			open={isResetAllDataAlertOpen}
			onOpenChange={(open) => {
				if (open) {
					openResetAllDataAlert();
				} else {
					closeResetAllDataAlert();
				}
			}}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Reset all data?</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to reset all data? This action
						will delete all your variants, piece images, and
						settings. This action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel className="px-4">
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction
						className="px-4"
						onClick={handleResetAllData}
					>
						Reset all data
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export default ResetAllDataAlert;
