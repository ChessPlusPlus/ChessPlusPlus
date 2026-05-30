import useVariantsStore from "@/features/variants/common/stores/variantsStore";
import DeleteVariantAlert from "@/features/variants/variantListing/components/DeleteVariantAlert";
import useVariantDeleteAlertStore from "@/features/variants/variantListing/stores/variantDeleteAlert";
import VariantRenameDialog from "@/features/variants/variantListing/components/VariantRenameDialog";
import useVariantRenameDialogStore from "@/features/variants/variantListing/stores/variantRenameDialog";
import { useNavigate } from "react-router-dom";
import VariantSelectionDialog, {
	type VariantActions,
} from "@/features/variants/common/components/VariantSelectionDialog";
import useMyVariantsDialogStore from "@/features/variants/variantListing/stores/myVariantsDialog";
import posthog from "posthog-js";

function MyVariantsDialog() {
	const { hasHydrated } = useVariantsStore();
	const {
		isOpen,
		openDialog: openMyVariantsDialog,
		closeDialog: closeMyVariantsDialog,
		selectedVariantId,
		updateSelectedVariantId,
		clearSelectedVariantId,
	} = useMyVariantsDialogStore();

	const { openAlert } = useVariantDeleteAlertStore();

	const { openDialog: openVariantRenameDialog } =
		useVariantRenameDialogStore();

	const navigate = useNavigate();

	if (!hasHydrated) return null;

	function handleVariantSelection(variantId: string) {
		if (variantId === selectedVariantId) {
			clearSelectedVariantId();
		} else {
			updateSelectedVariantId(variantId);
		}
	}

	const actions: VariantActions = {
		open: {
			label: "Open",
			variant: "default",
			execute: (variantId) => {
				closeMyVariantsDialog();
				posthog.capture("variant_opened", {
					source: "my_variants_dialog",
				});
				navigate(`/variants/${variantId}`);
			},
		},
		rename: {
			label: "Rename",
			variant: "outline",
			execute: (variantId) => {
				openVariantRenameDialog(variantId);
			},
		},
		delete: {
			label: "Delete",
			variant: "destructive",
			execute: (variantId) => {
				openAlert(variantId);
			},
		},
	};

	return (
		<>
			<VariantSelectionDialog
				title="My variants"
				description="Below is a list of your created variants"
				actions={actions}
				isOpen={isOpen}
				onOpenChange={(isOpen) =>
					isOpen ? openMyVariantsDialog() : closeMyVariantsDialog()
				}
				handleVariantSelection={handleVariantSelection}
				selectedVariantId={selectedVariantId}
			/>

			<DeleteVariantAlert />
			<VariantRenameDialog />
		</>
	);
}

export default MyVariantsDialog;
