import { create } from "zustand";

type ImportJSONDialogStore = {
	isImportJSONDialogOpen: boolean;
	openImportJSONDialog: () => void;
	closeImportJSONDialog: () => void;

	jsonFile: Blob | null;
	updateJsonFile: (jsonFile: Blob | null) => void;
	clearJsonFile: () => void;

	jsonFileErrors: string[];
	updateJsonFileErrors: (jsonFileErrors: string[]) => void;
	clearJsonFileErrors: () => void;
};

const useImportJSONDialogStore = create<ImportJSONDialogStore>((set) => ({
	isImportJSONDialogOpen: false,
	openImportJSONDialog: () => set({ isImportJSONDialogOpen: true }),
	closeImportJSONDialog: () => set({ isImportJSONDialogOpen: false }),

	jsonFile: null,
	updateJsonFile: (jsonFile) => set({ jsonFile }),
	clearJsonFile: () => set({ jsonFile: null }),

	jsonFileErrors: [],
	updateJsonFileErrors: (jsonFileErrors) => set({ jsonFileErrors }),
	clearJsonFileErrors: () => set({ jsonFileErrors: [] }),
}));

export default useImportJSONDialogStore;