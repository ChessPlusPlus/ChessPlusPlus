import type { PieceImage } from "@/features/variants/common/types/pieceImages";
import { generateId } from "@/shared/utils/idGeneration";
import { create } from "zustand";
import { createIndexedDBStorage } from "zustand-indexeddb";
import { persist } from "zustand/middleware";

type PieceImagesStore = {
	images: Record<string, PieceImage>;
	addImage: (imageBlob: Blob) => void;
	updateImage: (imageId: string, imageBlob: Blob) => void;
	updateImageForVariantId: (
		imageId: string,
		variantId: string,
		newImage: Blob,
	) => void;
	updateImages: (images: Record<string, PieceImage>) => void;
	removeImage: (imageId: string) => void;

	defaultImagesCreated: boolean;
	markAsDefaultImagesCreated: () => void;
	resetDefaultImagesCreationState: () => void;

	hasHydrated: boolean;
	markAsHydrated: () => void;
	resetHydrationState: () => void;
};

const usePieceImagesStore = create<PieceImagesStore>()(
	persist(
		(set) => ({
			images: {},
			addImage: (imageBlob) => {
				const generatedImageId = generateId();

				set((state) => ({
					images: {
						...state.images,
						[generatedImageId]: { image: imageBlob },
					},
				}));

				return generatedImageId;
			},

			updateImage: (imageId, imageBlob) => {
				set((state) => ({
					images: {
						...state.images,
						[imageId]: { image: imageBlob },
					},
				}));
			},

			updateImageForVariantId: (imageId, variantId, newImage) => {
				set((state) => ({
					images: {
						...state.images,
						[imageId]: {
							...state.images[imageId],
							[variantId]: newImage,
						},
					},
				}));
			},

			updateImages: (images) => {
				set({ images });
			},

			removeImage: (imageId: string) => {
				set((state) => {
					const updatedImages = structuredClone(state.images);
					delete updatedImages[imageId];
					return { images: updatedImages };
				});
			},

			defaultImagesCreated: false,
			markAsDefaultImagesCreated: () =>
				set({ defaultImagesCreated: true }),
			resetDefaultImagesCreationState: () =>
				set({ defaultImagesCreated: false }),

			hasHydrated: false,
			markAsHydrated: () => set({ hasHydrated: true }),
			resetHydrationState: () => set({ hasHydrated: false }),
		}),

		{
			name: "pieceImages",
			storage: createIndexedDBStorage(
				"chessPlusPlusPieceImagesDB",
				"pieceImages",
			),
			partialize: (state) => ({
				images: state.images,
				defaultImagesCreated: state.defaultImagesCreated,
			}),
			onRehydrateStorage: () => (state, error) => {
				if (error) {
					console.error("Error rehydrating piece images:", error);
				}

				state?.markAsHydrated();
			},
		},
	),
);

export default usePieceImagesStore;
