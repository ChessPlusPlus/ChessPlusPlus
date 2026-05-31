import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	PopoverContent,
	PopoverDescription,
	PopoverTitle,
} from "@/components/ui/popover";
import useFeedbackCollectionCredentialsFormStore from "@/features/feedbackCollection/stores/feedbackCollectionCredentialsForm";

function FeedbackCollectionCredentialsForm() {
	const { nameDraft, updateNameDraft, emailDraft, updateEmailDraft } =
		useFeedbackCollectionCredentialsFormStore();

	function handleStartGivingFeedbackButtonClick() {
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
				/>
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
