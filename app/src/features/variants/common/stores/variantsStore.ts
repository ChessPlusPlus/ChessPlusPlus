import type { VariantInfo } from "@/features/variants/common/types/variants";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateId } from "@/shared/utils/idGeneration";
import { createIndexedDBStorage } from "zustand-indexeddb";

type VariantsStore = {
	variants: Record<string, VariantInfo>;

	createVariant: (variantInfo: VariantInfo) => string;
	removeVariant: (variantId: string) => void;
	updateVariant: (variantId: string, newVariantInfo: VariantInfo) => void;

	hasHydrated: boolean;
	markAsHydrated: () => void;
	resetHydrationState: () => void;
};

const useVariantsStore = create<VariantsStore>()(
	persist(
		(set) => ({
			variants: {},

			createVariant: (variantInfo) => {
				const generatedVariantId = generateId();

				set((state) => ({
					variants: {
						...state.variants,
						[generatedVariantId]: variantInfo,
					},
				}));

				return generatedVariantId;
			},

			removeVariant: (variantId) => {
				set((state) => {
					const updatedVariants = structuredClone(state.variants);
					delete updatedVariants[variantId];

					return { variants: updatedVariants };
				});
			},

			updateVariant: (variantId, newVariantInfo) => {
				set((state) => ({
					variants: {
						...state.variants,
						[variantId]: newVariantInfo,
					},
				}));
			},

			hasHydrated: false,
			markAsHydrated: () => set({ hasHydrated: true }),
			resetHydrationState: () => set({ hasHydrated: false }),
		}),
		{
			name: "variants",
			storage: createIndexedDBStorage(
				"chessPlusPlusVariantsDB",
				"variants",
			),
			partialize: (state) => ({ variants: state.variants }),
			onRehydrateStorage: () => (state, error) => {
				if (error) {
					console.error("Error rehydrating variants:", error);
				}

				state?.markAsHydrated();
			},
		},
	),
);

export default useVariantsStore;
