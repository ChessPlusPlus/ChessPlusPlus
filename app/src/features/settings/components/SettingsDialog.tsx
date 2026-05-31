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
import usePieceImagesStore from "@/features/variants/common/stores/pieceImages";
import useVariantsStore from "@/features/variants/common/stores/variantsStore";
import useMovementsEditorStore from "@/features/variants/variantEditor/movementsEditor/stores/movementsEditor";
import useAnalyticsPreferencesStore from "@/shared/stores/analyticsPreferences";
import posthog from "posthog-js";
import usePiecesEditorStore from "@/features/variants/variantEditor/piecesEditor/stores/piecesEditor";
import useMovementsEditorSheetStore from "@/features/variants/variantEditor/movementsEditor/stores/movementsEditorSheet";
import usePiecesEditorSheetStore from "@/features/variants/variantEditor/piecesEditor/stores/piecesEditorSheet";
import useVariantDraftStore from "@/features/variants/variantEditor/common/stores/variantDraft";
import useSidebarStore from "@/features/variants/variantEditor/common/stores/sidebar";

function SettingsDialog() {
	const { isSettingsDialogOpen, openSettingsDialog, closeSettingsDialog } =
		useSettingsDialogStore();

	const {
		analyticsEnabled,
		enableAnalytics,
		disableAnalytics,
		resetAnalyticsData,
	} = useAnalyticsPreferencesStore();

	const { resetMovementsEditorState } = useMovementsEditorStore();
	const { resetMovementsEditorSheetState } = useMovementsEditorSheetStore();
	const { resetPiecesEditorState } = usePiecesEditorStore();
	const { resetPiecesEditorSheetState } = usePiecesEditorSheetStore();
	const { resetVariantDraftState } = useVariantDraftStore();
	const { resetSidebarState } = useSidebarStore();

	const { resetVariantsData } = useVariantsStore();
	const { resetPieceImagesData } = usePieceImagesStore();

	function handleAnalyticsChange(checked: boolean) {
		if (checked) {
			enableAnalytics();
			posthog.opt_in_capturing();
			return;
		}

		posthog.opt_out_capturing();
		disableAnalytics();
	}

	function handleResetAllData() {
		resetVariantsData();
		resetPieceImagesData();
		resetAnalyticsData();

		resetMovementsEditorState();
		resetMovementsEditorSheetState();
		resetPiecesEditorState();
		resetPiecesEditorSheetState();
		resetVariantDraftState();
		resetSidebarState();
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
							onClick={handleResetAllData}
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
