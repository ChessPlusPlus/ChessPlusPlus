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
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useSettingsDialogStore from "@/features/settings/stores/settingsDialog";
import useAnalyticsPreferencesStore from "@/shared/stores/analyticsPreferences";
import posthog from "posthog-js";
import useResetAllDataAlertStore from "@/features/settings/stores/resetAllDataAlert";
import { Input } from "@/components/ui/input";
import validator from "validator";
import useFeedbackCollectionCredentialsStore from "@/features/feedbackCollection/stores/feedbackCollectionCredentials";
import { useEffect } from "react";

function SettingsDialog() {
	const { isSettingsDialogOpen, openSettingsDialog, closeSettingsDialog } =
		useSettingsDialogStore();

	const { analyticsEnabled, enableAnalytics, disableAnalytics } =
		useAnalyticsPreferencesStore();

	const { openResetAllDataAlert } = useResetAllDataAlertStore();

	const {
		nameDraft,
		updateNameDraft,
		emailDraft,
		updateEmailDraft,
		emailDraftErrors,
		updateEmailDraftErrors,
		clearEmailDraftErrors,
	} = useSettingsDialogStore();

	const { updateEmail, updateName, email, name } = useFeedbackCollectionCredentialsStore();

	useEffect(() => {
		updateEmail(email ?? "");
		updateName(name ?? "");
	}, [name, email, updateEmail, updateName]);

	function handleAnalyticsChange(checked: boolean) {
		if (checked) {
			enableAnalytics();
			posthog.opt_in_capturing();
			return;
		}

		posthog.opt_out_capturing();
		disableAnalytics();
	}

	function handleEmailInputBlur() {
		if (emailDraft === "") {
			clearEmailDraftErrors();
			return;
		}

		const isValidEmail = validator.isEmail(emailDraft);
		if (!isValidEmail) {
			updateEmailDraftErrors(["Invalid email"]);
			return;
		}

		clearEmailDraftErrors();
		updateEmail(emailDraft);
	}

	function handleNameInputBlur() {
		updateName(nameDraft);
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
						<TabsTrigger value="feedback-collection">
							Feedback collection
						</TabsTrigger>
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
						value="feedback-collection"
						className="flex flex-col gap-4"
					>
						<Field
							className="grid grid-cols-2 gap-4"
							orientation="horizontal"
						>
							<FieldContent>
								<FieldLabel htmlFor="nameInput">
									Name
								</FieldLabel>
								<FieldDescription>
									Name to be displayed when submitting
									feedback (optional).
								</FieldDescription>
							</FieldContent>

							<Input
								id="nameInput"
								placeholder="Enter your name"
								value={nameDraft}
								onChange={(e) =>
									updateNameDraft(e.target.value)
								}
								onBlur={handleNameInputBlur}
							/>
						</Field>

						<Field
							className="grid grid-cols-2 gap-4"
							orientation="horizontal"
						>
							<FieldContent>
								<FieldLabel htmlFor="emailInput">
									Email
								</FieldLabel>
								<FieldDescription>
									Email to be used to contact you if needed
									(optional).
								</FieldDescription>
							</FieldContent>

							<Input
								id="emailInput"
								placeholder="Enter your email"
								value={emailDraft}
								onChange={(e) =>
									updateEmailDraft(e.target.value)
								}
								data-invalid={emailDraftErrors.length > 0}
								aria-invalid={emailDraftErrors.length > 0}
								onBlur={handleEmailInputBlur}
							/>
							<FieldError
								errors={emailDraftErrors.map((error) => ({
									message: error,
								}))}
							/>
						</Field>
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
