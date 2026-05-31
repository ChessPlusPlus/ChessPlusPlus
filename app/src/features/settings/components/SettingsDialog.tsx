import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldLabel,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useSettingsDialogStore from "@/features/settings/stores/settingsDialog";
import useAnalyticsPreferencesStore from "@/shared/stores/analyticsPreferences";
import posthog from "posthog-js";
import useResetAllDataAlertStore from "@/features/settings/stores/resetAllDataAlert";

function SettingsDialog() {
	const { isSettingsDialogOpen, openSettingsDialog, closeSettingsDialog } =
		useSettingsDialogStore();

	const {
		analyticsEnabled,
		enableAnalytics,
		disableAnalytics,
	} = useAnalyticsPreferencesStore();

	const { openResetAllDataAlert } = useResetAllDataAlertStore();

	function handleAnalyticsChange(checked: boolean) {
		if (checked) {
			enableAnalytics();
			posthog.opt_in_capturing();
			return;
		}

		posthog.opt_out_capturing();
		disableAnalytics();
	}

	return (
		<Dialog
			open={isSettingsDialogOpen}
			onOpenChange={(open) => {
				if (open) {
					openSettingsDialog();
				} else {
					closeSettingsDialog();
				}
			}}
		>
			<DialogContent className="min-w-1/2">
				<DialogHeader>
					<DialogTitle>Settings</DialogTitle>
				</DialogHeader>

				<Tabs orientation="vertical" className="flex flex-row gap-4">
					<TabsList className="h-full">
						<TabsTrigger value="analytics">Analytics</TabsTrigger>
						<TabsTrigger value="danger-zone">
							Danger zone
						</TabsTrigger>
					</TabsList>

					<TabsContent
						value="analytics"
						className="flex flex-row gap-4"
					>
						<Field orientation="horizontal">
							<FieldContent>
								<FieldLabel htmlFor="allow-analytics">
									Allow analytics
								</FieldLabel>
								<FieldDescription>
									Allow us to collect anonymous usage data to
									help us improve Chess++.
								</FieldDescription>
							</FieldContent>
						</Field>

						<Switch
							id="allow-analytics"
							checked={analyticsEnabled === true}
							onCheckedChange={handleAnalyticsChange}
						/>
					</TabsContent>

					<TabsContent
						value="danger-zone"
						className="flex flex-row gap-4"
					>
						<Field orientation="horizontal">
							<FieldContent>
								<FieldLabel htmlFor="allow-analytics">
									Reset all data
								</FieldLabel>
								<FieldDescription>
									Reset all data, including created variants
									and settings
								</FieldDescription>
							</FieldContent>
						</Field>

						<Button
							variant="destructive"
							onClick={openResetAllDataAlert}
						>
							Reset all data
						</Button>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}

export default SettingsDialog;
