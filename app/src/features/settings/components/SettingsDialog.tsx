import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import useSettingsDialogStore from "@/features/settings/stores/settingsDialog";

function SettingsDialog() {
	const { isSettingsDialogOpen, openSettingsDialog, closeSettingsDialog } = useSettingsDialogStore();

	return (
		<Dialog open={isSettingsDialogOpen} onOpenChange={(open) => {
			if (open) {
				openSettingsDialog();
			} else {
				closeSettingsDialog();
			}
		}}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Settings</DialogTitle>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}

export default SettingsDialog;