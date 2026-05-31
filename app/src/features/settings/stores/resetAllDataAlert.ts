import { create } from "zustand";

type ResetAllDataAlertStore = {
	isResetAllDataAlertOpen: boolean;
	openResetAllDataAlert: () => void;
	closeResetAllDataAlert: () => void;
}

const useResetAllDataAlertStore = create<ResetAllDataAlertStore>((set) => ({
	isResetAllDataAlertOpen: false,
	openResetAllDataAlert: () => set({ isResetAllDataAlertOpen: true }),
	closeResetAllDataAlert: () => set({ isResetAllDataAlertOpen: false }),
}));

export default useResetAllDataAlertStore;
