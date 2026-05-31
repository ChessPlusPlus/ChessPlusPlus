import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AnalyticsPreferencesStore = {
	analyticsEnabled: boolean;
	enableAnalytics: () => void;
	disableAnalytics: () => void;
}

const useAnalyticsPreferencesStore = create<AnalyticsPreferencesStore>()(
	persist(
		(set) => ({
			analyticsEnabled: false,
			enableAnalytics: () => set({ analyticsEnabled: true }),
			disableAnalytics: () => set({ analyticsEnabled: false }),
		}),
		{
			name: "analyticsPreferences",
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({ analyticsEnabled: state.analyticsEnabled }),
		}
	),
);

export default useAnalyticsPreferencesStore;