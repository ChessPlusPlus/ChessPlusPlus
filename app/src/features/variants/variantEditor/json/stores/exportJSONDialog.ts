import { create } from "zustand";

type ExportJSONDialogStore = {
	isExportJSONDialogOpen: boolean;
	openExportJSONDialog: () => void;
	closeExportJSONDialog: () => void;

	fileName: string;
	updateFileName: (fileName: string) => void;
	clearFileName: () => void;

	fileNameErrors: string[];
	updateFileNameErrors: (fileNameErrors: string[]) => void;
	clearFileNameErrors: () => void;
}

const useExportJSONDialogStore = create<ExportJSONDialogStore>((set) => ({
	isExportJSONDialogOpen: false,
	openExportJSONDialog: () => set({ isExportJSONDialogOpen: true }),
	closeExportJSONDialog: () => set({ isExportJSONDialogOpen: false }),

	fileName: "",
	updateFileName: (fileName) => set({ fileName }),
	clearFileName: () => set({ fileName: "" }),

	fileNameErrors: [],
	updateFileNameErrors: (fileNameErrors) => set({ fileNameErrors }),
	clearFileNameErrors: () => set({ fileNameErrors: [] }),
}));

export default useExportJSONDialogStore;