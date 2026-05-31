import { create } from "zustand";

type FeedbackCollectionCredentialsFormStore = {
	isFeedbackCollectionCredentialsFormOpen: boolean;
	openFeedbackCollectionCredentialsForm: () => void;
	closeFeedbackCollectionCredentialsForm: () => void;

	nameDraft: string;
	updateNameDraft: (nameDraft: string) => void;

	emailDraft: string;
	updateEmailDraft: (emailDraft: string) => void;

	emailDraftErrors: string[];
	updateEmailDraftErrors: (emailDraftErrors: string[]) => void;
	clearEmailDraftErrors: () => void;
}

const useFeedbackCollectionCredentialsFormStore = create<FeedbackCollectionCredentialsFormStore>((set) => ({
	isFeedbackCollectionCredentialsFormOpen: false,
	openFeedbackCollectionCredentialsForm: () => set({ isFeedbackCollectionCredentialsFormOpen: true }),
	closeFeedbackCollectionCredentialsForm: () => set({ isFeedbackCollectionCredentialsFormOpen: false }),

	nameDraft: "",
	updateNameDraft: (nameDraft) => set({ nameDraft }),

	emailDraft: "",
	updateEmailDraft: (emailDraft) => set({ emailDraft }),

	emailDraftErrors: [],
	updateEmailDraftErrors: (emailDraftErrors) => set({ emailDraftErrors }),
	clearEmailDraftErrors: () => set({ emailDraftErrors: [] }),
}))

export default useFeedbackCollectionCredentialsFormStore;