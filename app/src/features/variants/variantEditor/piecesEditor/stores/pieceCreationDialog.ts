import { create } from "zustand";

type PieceCreationDialogStore = {
	isPieceCreationDialogOpen: boolean;
	openPieceCreationDialog: () => void;
	closePieceCreationDialog: () => void;

	pieceName: string;
	updatePieceName: (name: string) => void;

	pieceImage: Blob | null;
	updatePieceImage: (image: Blob | null) => void;
	clearPieceImage: () => void;

	pieceNameErrors: string[];
	updatePieceNameErrors: (errors: string[]) => void;
}

const usePieceCreationDialogStore = create<PieceCreationDialogStore>((set) => ({
	isPieceCreationDialogOpen: false,
	openPieceCreationDialog: () => set({ isPieceCreationDialogOpen: true }),
	closePieceCreationDialog: () => set({ isPieceCreationDialogOpen: false, pieceName: "", pieceNameErrors: [] }),
	
	pieceName: "",
	updatePieceName: (name) => set({ pieceName: name }),
	
	pieceImage: null,
	updatePieceImage: (image) => set({ pieceImage: image }),
	clearPieceImage: () => set({ pieceImage: null }),
	
	pieceNameErrors: [],
	updatePieceNameErrors: (errors) => set({ pieceNameErrors: errors }),
}));

export default usePieceCreationDialogStore;