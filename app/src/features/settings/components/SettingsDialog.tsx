import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

				<Tabs orientation="vertical">
					<TabsList className="h-full">
						<TabsTrigger value="analytics">Analytics</TabsTrigger>
						<TabsTrigger value="danger-zone">Danger zone</TabsTrigger>
					</TabsList>

					<TabsContent value="analytics">
						
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	)
}

export default SettingsDialog;