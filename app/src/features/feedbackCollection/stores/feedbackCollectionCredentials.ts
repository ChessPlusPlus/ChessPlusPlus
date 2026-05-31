import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type FeedbackCollectionCredentialsStore = {
	userId: string | null;
	updateUserId: (userId: string) => void;
	clearUserId: () => void;

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
		userId: null,
		updateUserId: (userId) => set({ userId }),
		clearUserId: () => set({ userId: null }),

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