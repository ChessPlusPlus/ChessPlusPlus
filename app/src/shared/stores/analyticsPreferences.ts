import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AnalyticsPreferencesStore = {
	analyticsEnabled: boolean | null;
	enableAnalytics: () => void;
	disableAnalytics: () => void;
	resetAnalyticsData: () => void;
};

const useAnalyticsPreferencesStore = create<AnalyticsPreferencesStore>()(
	persist(
		(set) => ({
			analyticsEnabled: null,
			enableAnalytics: () => set({ analyticsEnabled: true }),
			disableAnalytics: () => set({ analyticsEnabled: false }),
			resetAnalyticsData: () => set({ analyticsEnabled: null }),
		}),
		{
			name: "analyticsPreferences",
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({
				analyticsEnabled: state.analyticsEnabled,
			}),
		},
	),
);

export default useAnalyticsPreferencesStore;
