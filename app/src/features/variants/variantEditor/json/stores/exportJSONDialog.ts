import { create } from "zustand";

type ExportJSONDialogStore = {
	isExportJSONDialogOpen: boolean;
	openExportJSONDialog: () => void;
	closeExportJSONDialog: () => void;

	fileName: string;
	updateFileName: (fileName: string) => void;
	clearFileName: () => void;
}

const useExportJSONDialogStore = create<ExportJSONDialogStore>((set) => ({
	isExportJSONDialogOpen: false,
	openExportJSONDialog: () => set({ isExportJSONDialogOpen: true }),
	closeExportJSONDialog: () => set({ isExportJSONDialogOpen: false }),

	fileName: "",
	updateFileName: (fileName) => set({ fileName }),
	clearFileName: () => set({ fileName: "" }),
}));

export default useExportJSONDialogStore;