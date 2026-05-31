import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	PopoverContent,
	PopoverDescription,
	PopoverTitle,
} from "@/components/ui/popover";
import useFeedbackCollectionCredentialsStore from "@/features/feedbackCollection/stores/feedbackCollectionCredentials";

function FeedbackCollectionCredentialsForm() {
	const { name, updateName, email, updateEmail } =
		useFeedbackCollectionCredentialsStore();

	return (
		<PopoverContent>
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
					value={name ?? ""}
					onChange={(e) => updateName(e.target.value)}
				/>
			</Field>

			<Field>
				<FieldLabel htmlFor="emailInput">Email</FieldLabel>
				<Input
					id="emailInput"
					placeholder="Enter your email"
					value={email ?? ""}
					onChange={(e) => updateEmail(e.target.value)}
				/>
			</Field>
		</PopoverContent>
	);
}

export default FeedbackCollectionCredentialsForm;