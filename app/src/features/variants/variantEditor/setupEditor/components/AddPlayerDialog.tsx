import { Button } from "@/components/ui/button";
import { Dialog, DialogTitle, DialogHeader, DialogContent, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import useAddPlayerDialogStore from "@/features/variants/variantEditor/setupEditor/stores/addPlayerDialog";

function AddPlayerDialog() {
	const { isAddPlayerDialogOpen, openAddPlayerDialog, closeAddPlayerDialog } = useAddPlayerDialogStore();

	return (
		<Dialog open={isAddPlayerDialogOpen} onOpenChange={(open) => {
			if (open) {
				openAddPlayerDialog();
			} else {
				closeAddPlayerDialog();
			}
		}}>
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
					<Input id="playerNameInput" type="text" placeholder="Enter player name" />
					<FieldError errors={[]} />
				</Field>

				<DialogFooter>
					<Button className="w-full">Add player</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default AddPlayerDialog;