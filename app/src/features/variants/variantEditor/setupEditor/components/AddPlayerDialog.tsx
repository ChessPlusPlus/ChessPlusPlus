import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogTitle,
	DialogHeader,
	DialogContent,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import useVariantDraftStore from "@/features/variants/variantEditor/common/stores/variantDraft";
import useAddPlayerDialogStore from "@/features/variants/variantEditor/setupEditor/stores/addPlayerDialog";
import type { ChangeEvent } from "react";

function AddPlayerDialog() {
	const {
		isAddPlayerDialogOpen,
		openAddPlayerDialog,
		closeAddPlayerDialog,
		playerName,
		updatePlayerName,
		updatePlayerNameErrors,
		playerNameErrors,
		clearPlayerNameErrors,
	} = useAddPlayerDialogStore();

	const { setupRulesDraft, updateSetupRulesDraft, syncSetupRulesDraftToDB } = useVariantDraftStore();
	if (!setupRulesDraft) return null;

	function handlePlayerNameInputChange(e: ChangeEvent<HTMLInputElement>) {
		updatePlayerName(e.target.value);
	}

	function handleAddPlayerButtonClick() {
		if (!setupRulesDraft) return;

		if (playerName.trim() === "") {
			updatePlayerNameErrors(["Player name cannot be empty"]);
			return;
		}

		if (
			Object.keys(setupRulesDraft.pieceOwnership).includes(
				playerName.trim(),
			)
		) {
			updatePlayerNameErrors(["Player name already exists"]);
			return;
		}

		if (Object.keys(setupRulesDraft.pieceOwnership).length >= 2) {
			updatePlayerNameErrors(["Only 2 players are allowed (more coming soon)"]);
			return;
		}

		const updatedSetupRulesDraft = structuredClone(setupRulesDraft);
		updatedSetupRulesDraft.pieceOwnership[playerName.trim()] = [];

		updateSetupRulesDraft(updatedSetupRulesDraft);
		syncSetupRulesDraftToDB();

		closeAddPlayerDialog();
		clearPlayerNameErrors();
	}

	return (
		<Dialog
			open={isAddPlayerDialogOpen}
			onOpenChange={(open) => {
				if (open) {
					openAddPlayerDialog();
				} else {
					closeAddPlayerDialog();
				}
			}}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add player</DialogTitle>
					<DialogDescription>
						Add a new player to the setup.
					</DialogDescription>
				</DialogHeader>

				<Field>
					<FieldLabel htmlFor="playerNameInput">
						Player name
					</FieldLabel>
					<Input
						id="playerNameInput"
						type="text"
						placeholder="Enter player name"
						value={playerName}
						onChange={handlePlayerNameInputChange}
						data-invalid={playerNameErrors.length > 0}
						aria-invalid={playerNameErrors.length > 0}
					/>
					<FieldError
						errors={playerNameErrors.map((errorMessage) => ({
							message: errorMessage,
						}))}
					/>
				</Field>

				<DialogFooter>
					<Button className="w-full" onClick={handleAddPlayerButtonClick}>Add player</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default AddPlayerDialog;
