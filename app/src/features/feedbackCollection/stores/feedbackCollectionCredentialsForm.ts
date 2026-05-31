import { create } from "zustand";

type FeedbackCollectionCredentialsFormStore = {
	isFeedbackCollectionCredentialsFormOpen: boolean;
	openFeedbackCollectionCredentialsForm: () => void;
	closeFeedbackCollectionCredentialsForm: () => void;
}

const useFeedbackCollectionCredentialsFormStore = create<FeedbackCollectionCredentialsFormStore>((set) => ({
	isFeedbackCollectionCredentialsFormOpen: false,
	openFeedbackCollectionCredentialsForm: () => set({ isFeedbackCollectionCredentialsFormOpen: true }),
	closeFeedbackCollectionCredentialsForm: () => set({ isFeedbackCollectionCredentialsFormOpen: false }),
}))

export default useFeedbackCollectionCredentialsFormStore;