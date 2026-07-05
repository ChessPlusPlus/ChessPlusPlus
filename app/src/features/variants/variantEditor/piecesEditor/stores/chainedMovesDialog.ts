import { create } from "zustand";

type ChainedMovesDialogStore = {
	isChainedMovesDialogOpen: boolean;
	openChainedMovesDialog: () => void;
	closeChainedMovesDialog: () => void;

	nodeIds: [number, string[]][] | null;
	updateNodeIds: (nodeIds: [number, string[]][]) => void;
	clearNodeIds: () => void;

	activePiece: string | null;
	updateActivePiece: (piece: string) => void;
	clearActivePiece: () => void;
};

const useChainedMovesDialogStore = create<ChainedMovesDialogStore>((set) => ({
	isChainedMovesDialogOpen: false,
	openChainedMovesDialog: () => set({ isChainedMovesDialogOpen: true }),
	closeChainedMovesDialog: () => set({ isChainedMovesDialogOpen: false }),

	nodeIds: null,
	updateNodeIds: (nodeIds) => {
		set({ nodeIds: nodeIds });
	},

	clearNodeIds: () => {
		set({ nodeIds: null });
	},

	activePiece: null,
	updateActivePiece: (piece) => set({ activePiece: piece }),
	clearActivePiece: () => set({ activePiece: null }),
}));

export default useChainedMovesDialogStore;
