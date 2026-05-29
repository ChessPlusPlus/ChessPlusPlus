import VariantSelectionDialog, {
	type VariantActions,
} from "@/features/variants/common/components/VariantSelectionDialog";
import useVariantPlaySelectionDialogStore from "@/features/variants/variantPlay/stores/variantPlaySelectionDialog";
import posthog from "posthog-js";
import { useNavigate } from "react-router-dom";

function VariantPlaySelectionDialog() {
	const {
		isVariantPlaySelectionDialogOpen,
		openVariantPlaySelectionDialog,
		closeVariantPlaySelectionDialog,
		selectedVariantId,
		updateSelectedVariantId,
		clearSelectedVariantId,
	} = useVariantPlaySelectionDialogStore();

	const navigate = useNavigate();

	function handleVariantSelection(variantId: string) {
		if (variantId === selectedVariantId) {
			clearSelectedVariantId();
		} else {
			updateSelectedVariantId(variantId);
		}
	}

	const actions: VariantActions = {
		play: {
			label: "Play",
			variant: "default",
			execute: (variantId) => {
				posthog.capture("variant_played");
				navigate(`/variants/${variantId}/play`);
			},
		},
	};
	return (
		<VariantSelectionDialog
			title="Select a variant"
			description="Select a variant to play"
			actions={actions}
			isOpen={isVariantPlaySelectionDialogOpen}
			onOpenChange={(isOpen) => {
				if (isOpen) {
					openVariantPlaySelectionDialog();
				} else {
					closeVariantPlaySelectionDialog();
				}
			}}
			handleVariantSelection={handleVariantSelection}
			selectedVariantId={selectedVariantId}
		/>
	);
}

export default VariantPlaySelectionDialog;
