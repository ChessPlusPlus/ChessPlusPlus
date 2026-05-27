import { create } from "zustand";

type ExportJSONDialogStore = {
	isExportJSONDialogOpen: boolean;
	openExportJSONDialog: () => void;
	closeExportJSONDialog: () => void;

	fileName: string;
	updateFileName: (fileName: string) => void;
	clearFileName: () => void;

	exportCasing: "camel" | "snake";
	updateExportCasing: (exportCasing: "camel" | "snake") => void;
	clearExportCasing: () => void;
}

const useExportJSONDialogStore = create<ExportJSONDialogStore>((set) => ({
	isExportJSONDialogOpen: false,
	openExportJSONDialog: () => set({ isExportJSONDialogOpen: true }),
	closeExportJSONDialog: () => set({ isExportJSONDialogOpen: false }),

	fileName: "",
	updateFileName: (fileName) => set({ fileName }),
	clearFileName: () => set({ fileName: "" }),

	exportCasing: "camel",
	updateExportCasing: (exportCasing) => set({ exportCasing }),
	clearExportCasing: () => set({ exportCasing: "camel" }),
}));

export default useExportJSONDialogStore;