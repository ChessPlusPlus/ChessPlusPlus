import { create } from "zustand";

type ImportJSONDialogStore = {
	isImportJSONDialogOpen: boolean;
	openImportJSONDialog: () => void;
	closeImportJSONDialog: () => void;

	variantName: string;
	updateVariantName: (variantName: string) => void;
	clearVariantName: () => void;

	variantNameErrors: string[];
	updateVariantNameErrors: (variantNameErrors: string[]) => void;
	clearVariantNameErrors: () => void;

	jsonFile: Blob | null;
	updateJsonFile: (jsonFile: Blob | null) => void;
	clearJsonFile: () => void;

	jsonFileName: string;
	updateJsonFileName: (jsonFileName: string) => void;
	clearJsonFileName: () => void;

	jsonFileErrors: string[];
	updateJsonFileErrors: (jsonFileErrors: string[]) => void;
	clearJsonFileErrors: () => void;
};

const useImportJSONDialogStore = create<ImportJSONDialogStore>((set) => ({
	isImportJSONDialogOpen: false,
	openImportJSONDialog: () => set({ isImportJSONDialogOpen: true }),
	closeImportJSONDialog: () => set({ isImportJSONDialogOpen: false }),

	variantName: "",
	updateVariantName: (variantName) => set({ variantName }),
	clearVariantName: () => set({ variantName: "" }),

	variantNameErrors: [],
	updateVariantNameErrors: (variantNameErrors) => set({ variantNameErrors }),
	clearVariantNameErrors: () => set({ variantNameErrors: [] }),

	jsonFile: null,
	updateJsonFile: (jsonFile) => set({ jsonFile }),
	clearJsonFile: () => set({ jsonFile: null }),

	jsonFileName: "",
	updateJsonFileName: (jsonFileName) => set({ jsonFileName }),
	clearJsonFileName: () => set({ jsonFileName: "" }),

	jsonFileErrors: [],
	updateJsonFileErrors: (jsonFileErrors) => set({ jsonFileErrors }),
	clearJsonFileErrors: () => set({ jsonFileErrors: [] }),
}));

export default useImportJSONDialogStore;