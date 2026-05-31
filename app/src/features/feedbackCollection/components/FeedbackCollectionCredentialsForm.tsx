import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	PopoverContent,
	PopoverDescription,
	PopoverTitle,
} from "@/components/ui/popover";
import useFeedbackCollectionCredentialsStore from "@/features/feedbackCollection/stores/feedbackCollectionCredentials";
import useFeedbackCollectionCredentialsFormStore from "@/features/feedbackCollection/stores/feedbackCollectionCredentialsForm";
import validator from "validator";

function FeedbackCollectionCredentialsForm() {
	const { nameDraft, updateNameDraft, emailDraft, updateEmailDraft, emailDraftErrors, updateEmailDraftErrors } =
		useFeedbackCollectionCredentialsFormStore();

	const { updateEmail, updateName, updateUserId } = useFeedbackCollectionCredentialsStore();

	function handleStartGivingFeedbackButtonClick() {
		if (emailDraft === "") {
			const generatedUserId = crypto.randomUUID();

			updateUserId(generatedUserId);
			updateEmail(emailDraft);
			updateName(nameDraft);

			window.uj?.showWidget();
			return;
		}

		const isValidEmail = validator.isEmail(emailDraft);
		if (!isValidEmail) {
			updateEmailDraftErrors(["Invalid email"]);
			return;
		}

		const generatedUserId = crypto.randomUUID();

		updateUserId(generatedUserId);
		updateEmail(emailDraft);
		updateName(nameDraft);

		window.uj?.showWidget();
	}

	return (
		<PopoverContent side="right" sideOffset={8} align="end">
			<PopoverTitle>Feedback Collection Credentials</PopoverTitle>
			<PopoverDescription>
				Before submitting feedback, if you would like, you may provide
				your name and email, for us to contact you if needed.
			</PopoverDescription>

			<Field>
				<FieldLabel htmlFor="nameInput">Name (optional)</FieldLabel>
				<Input
					id="nameInput"
					placeholder="Enter your name"
					value={nameDraft}
					onChange={(e) => updateNameDraft(e.target.value)}
				/>
			</Field>

			<Field>
				<FieldLabel htmlFor="emailInput">Email (optional)</FieldLabel>
				<Input
					id="emailInput"
					placeholder="Enter your email"
					value={emailDraft}
					onChange={(e) => updateEmailDraft(e.target.value)}
					data-invalid={emailDraftErrors.length > 0}
					aria-invalid={emailDraftErrors.length > 0}
				/>
				<FieldError errors={emailDraftErrors.map((error) => ({ message: error }))} />
			</Field>

			<Button
				className="w-full"
				onClick={handleStartGivingFeedbackButtonClick}
			>
				Start giving feedback
			</Button>
		</PopoverContent>
	);
}

export default FeedbackCollectionCredentialsForm;
