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
import useAddPlayerDialogStore from "@/features/variants/variantEditor/setupEditor/stores/addPlayerDialog";
import type { ChangeEvent } from "react";

function AddPlayerDialog() {
	const {
		isAddPlayerDialogOpen,
		openAddPlayerDialog,
		closeAddPlayerDialog,
		playerName,
		updatePlayerName,
		playerNameErrors,
	} = useAddPlayerDialogStore();

	function handlePlayerNameInputChange(e: ChangeEvent<HTMLInputElement>) {
		updatePlayerName(e.target.value);
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
					<Button className="w-full">Add player</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default AddPlayerDialog;
