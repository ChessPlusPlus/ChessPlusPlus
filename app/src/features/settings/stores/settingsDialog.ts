import { create } from "zustand";

type SettingsDialogStore = {
	isSettingsDialogOpen: boolean;
	openSettingsDialog: () => void;
	closeSettingsDialog: () => void;
}

const useSettingsDialogStore = create<SettingsDialogStore>((set) => ({
	isSettingsDialogOpen: false,
	openSettingsDialog: () => set({ isSettingsDialogOpen: true }),
	closeSettingsDialog: () => set({ isSettingsDialogOpen: false }),
}));

export default useSettingsDialogStore;