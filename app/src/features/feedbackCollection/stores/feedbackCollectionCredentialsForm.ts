import { create } from "zustand";

type FeedbackCollectionCredentialsFormStore = {
	isFeedbackCollectionCredentialsFormOpen: boolean;
	openFeedbackCollectionCredentialsForm: () => void;
	closeFeedbackCollectionCredentialsForm: () => void;

	nameDraft: string;
	updateNameDraft: (nameDraft: string) => void;

	emailDraft: string;
	updateEmailDraft: (emailDraft: string) => void;
}

const useFeedbackCollectionCredentialsFormStore = create<FeedbackCollectionCredentialsFormStore>((set) => ({
	isFeedbackCollectionCredentialsFormOpen: false,
	openFeedbackCollectionCredentialsForm: () => set({ isFeedbackCollectionCredentialsFormOpen: true }),
	closeFeedbackCollectionCredentialsForm: () => set({ isFeedbackCollectionCredentialsFormOpen: false }),

	nameDraft: "",
	updateNameDraft: (nameDraft) => set({ nameDraft }),

	emailDraft: "",
	updateEmailDraft: (emailDraft) => set({ emailDraft }),
}))

export default useFeedbackCollectionCredentialsFormStore;