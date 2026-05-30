import { Button } from "@/components/ui/button";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
} from "@/components/ui/combobox";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import type { MovementRule } from "@/features/variants/common/types/movementRules";
import useVariantDraftStore from "@/features/variants/variantEditor/common/stores/variantDraft";
import useEditChainedMoveDialogStore from "@/features/variants/variantEditor/piecesEditor/stores/editChainedMoveDialog";
import usePiecesEditorStore from "@/features/variants/variantEditor/piecesEditor/stores/piecesEditor";
import { isNullOrUndefined } from "@/shared/utils/typeChecks";
import type { ChangeEvent } from "react";

function EditChainedMoveDialog() {
	const {
		isEditChainedMoveDialogOpen,
		openEditChainedMoveDialog,
		closeEditChainedMoveDialog,

		newMovementName,
		updateNewMovementName,
		clearNewMovementName,

		sequenceIndex,
		clearSequenceIndex,

		nodeIndex,
		clearNodeIndex,

		errors,
		addErrors,
		clearErrors,
	} = useEditChainedMoveDialogStore();

	const { movementRulesDraft } = useVariantDraftStore();
	const { replaceChainedMoveInSequence } = usePiecesEditorStore();

	if (!movementRulesDraft) return null;

	function handleMovementNameInputChange(e: ChangeEvent<HTMLInputElement>) {
		updateNewMovementName(e.target.value);
	}

	function handleComboboxItemSelect(movementName: string) {
		updateNewMovementName(movementName);
	}

	function handleEditChainedMoveButtonClick() {
		clearErrors();

		if (isNullOrUndefined(sequenceIndex)) return;
		if (isNullOrUndefined(nodeIndex)) return;

		if (!movementRulesDraft) return;

		const trimmedNewMovementName = newMovementName.trim();

		if (trimmedNewMovementName === "") {
			addErrors(["Movement name cannot be empty"]);
			return;
		}

		if (!movementRulesDraft[trimmedNewMovementName]) {
			addErrors(["Movement name is not valid"]);
			return;
		}

		replaceChainedMoveInSequence(sequenceIndex, nodeIndex, {
			moveName: trimmedNewMovementName,
			validMove: true,
			terminateOnStop: true,
		});

		closeEditChainedMoveDialog();
		clearNewMovementName();
		clearSequenceIndex();
		clearNodeIndex();
		clearErrors();
	}

	return (
		<Dialog
			open={isEditChainedMoveDialogOpen}
			onOpenChange={(open) => {
				if (open) {
					openEditChainedMoveDialog();
				} else {
					closeEditChainedMoveDialog();
					clearNewMovementName();
					clearSequenceIndex();
					clearNodeIndex();
					clearErrors();
				}
			}}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit chained move</DialogTitle>
				</DialogHeader>

				<Field>
					<FieldLabel htmlFor="movementNameComboboxInput">
						Movement name
					</FieldLabel>
					<Combobox
						id="movementNameComboboxInput"
						modal={true}
						items={Object.entries(movementRulesDraft)}
						itemToStringValue={(
							movementEntry: [string, MovementRule],
						) => movementEntry[0]}
					>
						<ComboboxInput
							value={newMovementName}
							onChange={handleMovementNameInputChange}
							placeholder="Select a move"
							data-invalid={errors.length > 0}
							aria-invalid={errors.length > 0}
						/>
						<ComboboxContent
							onWheel={(e) => e.stopPropagation()}
							className="pointer-events-auto"
						>
							<ComboboxEmpty>No movements found</ComboboxEmpty>
							<ComboboxList>
								{(movementEntry: [string, MovementRule]) => (
									<ComboboxItem
										onClick={() =>
											handleComboboxItemSelect(
												movementEntry[0],
											)
										}
										key={movementEntry[0]}
										value={movementEntry[0]}
									>
										{movementEntry[0]}
									</ComboboxItem>
								)}
							</ComboboxList>
						</ComboboxContent>
					</Combobox>

					<FieldError
						errors={errors.map((error) => ({ message: error }))}
					/>
				</Field>

				<DialogFooter>
					<Button
						onClick={handleEditChainedMoveButtonClick}
						className="w-full"
					>
						Save changes
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default EditChainedMoveDialog;
