import { create } from "zustand";

type AnalyticsDisclaimerDialogStore = {
	isAnalyticsDisclaimerDialogOpen: boolean;
	openAnalyticsDisclaimerDialog: () => void;
	closeAnalyticsDisclaimerDialog: () => void;
}

const useAnalyticsDisclaimerDialogStore = create<AnalyticsDisclaimerDialogStore>((set) => ({
	isAnalyticsDisclaimerDialogOpen: false,
	openAnalyticsDisclaimerDialog: () => set({ isAnalyticsDisclaimerDialogOpen: true }),
	closeAnalyticsDisclaimerDialog: () => set({ isAnalyticsDisclaimerDialogOpen: false }),
}));

export default useAnalyticsDisclaimerDialogStore;