import { create } from "zustand";

type CreateVariantDialog = {
	isOpen: boolean;
	openDialog: () => void;
	closeDialog: () => void;

	templateType: "start-from-scratch" | "chess-preset";
	updateTemplateType: (templateType: "start-from-scratch" | "chess-preset") => void;

	variantName: string;
	updateVariantName: (name: string) => void;
	clearVariantName: () => void;

	variantNameErrors: string[];
	updateVariantNameErrors: (errors: string[]) => void;
	clearVariantNameErrors: () => void;
};

const useCreateVariantDialogStore = create<CreateVariantDialog>((set) => ({
	isOpen: false,
	openDialog: () => set({ isOpen: true }),
	closeDialog: () => set({ isOpen: false }),

	templateType: "start-from-scratch",
	updateTemplateType: (templateType) => set({ templateType }),

	variantName: "",
	updateVariantName: (name) => set({ variantName: name }),
	clearVariantName: () => set({ variantName: "" }),

	variantNameErrors: [],
	updateVariantNameErrors: (errors) => set({ variantNameErrors: errors }),
	clearVariantNameErrors: () => set({ variantNameErrors: [] }),
}));

export default useCreateVariantDialogStore;
