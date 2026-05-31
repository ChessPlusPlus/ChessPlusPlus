import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type FeedbackCollectionCredentialsStore = {
	email: string | null;
	updateEmail: (email: string) => void;
	clearEmail: () => void;

	name: string | null;
	updateName: (name: string) => void;
	clearName: () => void;

	resetFeedbackCollectionCredentials: () => void;
}

const useFeedbackCollectionCredentialsStore = create<FeedbackCollectionCredentialsStore>()(
	persist((set, _get, store) => ({
		email: null,
		updateEmail: (email) => set({ email }),
		clearEmail: () => set({ email: null }),

		name: null,
		updateName: (name) => set({ name }),
		clearName: () => set({ name: null }),

		resetFeedbackCollectionCredentials: () => set(store.getInitialState()),
	}), {
		name: "feedbackCollectionCredentials",
		storage: createJSONStorage(() => localStorage),
		partialize: (state) => ({
			email: state.email,
			name: state.name,
		}),
	})
)

export default useFeedbackCollectionCredentialsStore;