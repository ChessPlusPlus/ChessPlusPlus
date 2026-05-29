import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { newMovementDefaults } from "@/features/variants/variantEditor/movementsEditor/constants/newMovementDefaults";
import useCreateMovementDialogStore from "@/features/variants/variantEditor/movementsEditor/stores/createMovementDialog";
import useVariantDraftStore from "@/features/variants/variantEditor/common/stores/variantDraft";
import posthog from "posthog-js";

function MovementCreationDialog() {
	const {
		isCreateMovementDialogOpen,
		openCreateMovementDialog,
		closeCreateMovementDialog,

		movementName,
		updateMovementName,
		clearMovementName,

		movementNameErrors,
		updateMovementNameErrors,
		clearMovementNameErrors,
	} = useCreateMovementDialogStore();

	const {
		movementRulesDraft,
		updateMovementRulesDraft,
		syncMovementRulesDraftToDB,
	} = useVariantDraftStore();

	if (!movementRulesDraft) return null;

	function handleMovementCreation() {
		if (!movementRulesDraft) return;

		if (movementName.trim() === "") {
			updateMovementNameErrors(["Movement name cannot be empty"]);
			return;
		}

		const sameMovementNames = Object.entries(movementRulesDraft).filter(
			([key]) => key === movementName.trim(),
		);

		if (sameMovementNames.length > 0) {
			updateMovementNameErrors(["Movement name already exists"]);
			return;
		}

		const updatedMovementRulesDraft = structuredClone(movementRulesDraft);

		updatedMovementRulesDraft[movementName.trim()] =
			structuredClone(newMovementDefaults);

		updateMovementRulesDraft(updatedMovementRulesDraft);
		syncMovementRulesDraftToDB();

		posthog.capture("movement_created");

		closeCreateMovementDialog();
	}

	return (
		<Dialog
			open={isCreateMovementDialogOpen}
			onOpenChange={(open) => {
				if (open) {
					openCreateMovementDialog();
				} else {
					clearMovementName();
					clearMovementNameErrors();
					closeCreateMovementDialog();
				}
			}}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create Movement</DialogTitle>
				</DialogHeader>

				<Field
					data-invalid={movementNameErrors.length > 0}
					className="gap-2"
				>
					<FieldLabel htmlFor="movementNameInput">
						Movement Name
					</FieldLabel>
					<Input
						id="movementNameInput"
						type="text"
						placeholder="Enter movement name"
						value={movementName}
						onChange={(e) => updateMovementName(e.target.value)}
						aria-invalid={movementNameErrors.length > 0}
					/>
					<FieldError
						errors={movementNameErrors.map((errorMessage) => ({
							message: errorMessage,
						}))}
					/>
				</Field>

				<DialogFooter>
					<Button className="px-4" onClick={handleMovementCreation}>
						Create
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default MovementCreationDialog;
