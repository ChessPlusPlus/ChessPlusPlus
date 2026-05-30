import { create } from "zustand";

type SetupSaveConfirmationDialogStore = {
	isSetupSaveConfirmationDialogOpen: boolean;
	openSetupSaveConfirmationDialog: () => void;
	closeSetupSaveConfirmationDialog: () => void;
}

const useSetupSaveConfirmationDialogStore = create<SetupSaveConfirmationDialogStore>((set) => ({
	isSetupSaveConfirmationDialogOpen: false,
	openSetupSaveConfirmationDialog: () => set({ isSetupSaveConfirmationDialogOpen: true }),
	closeSetupSaveConfirmationDialog: () => set({ isSetupSaveConfirmationDialogOpen: false }),
}));

export default useSetupSaveConfirmationDialogStore;