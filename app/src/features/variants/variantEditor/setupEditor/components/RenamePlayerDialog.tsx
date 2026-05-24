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
import useRenamePlayerDialogStore from "@/features/variants/variantEditor/setupEditor/stores/renamePlayerDialog";
import { useEffect, type ChangeEvent } from "react";

function RenamePlayerDialog() {
	const {
		isRenamePlayerDialogOpen,
		openRenamePlayerDialog,
		closeRenamePlayerDialog,
		playerName,
		updatePlayerName,
		updatePlayerNameErrors,
		playerNameErrors,
		clearPlayerNameErrors,
		originalPlayerName,
	} = useRenamePlayerDialogStore();

	const { setupRulesDraft, updateSetupRulesDraft, syncSetupRulesDraftToDB } = useVariantDraftStore();
	
	useEffect(() => {
		if (!originalPlayerName) return;

		updatePlayerName(originalPlayerName);
	}, [originalPlayerName, updatePlayerName]);
	
	if (!setupRulesDraft) return null;

	function handlePlayerNameInputChange(e: ChangeEvent<HTMLInputElement>) {
		updatePlayerName(e.target.value);
	}

	function handleRenamePlayerButtonClick() {
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

		updateSetupRulesDraft(updatedSetupRulesDraft);
		syncSetupRulesDraftToDB();

		closeRenamePlayerDialog();
		clearPlayerNameErrors();
	}

	return (
		<Dialog
			open={isRenamePlayerDialogOpen}
			onOpenChange={(open) => {
				if (open) {
					openRenamePlayerDialog();
				} else {
					closeRenamePlayerDialog();
				}
			}}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Rename player</DialogTitle>
					<DialogDescription>
						Rename the player.
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
					<Button className="w-full" onClick={handleRenamePlayerButtonClick}>Rename player</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default RenamePlayerDialog;
