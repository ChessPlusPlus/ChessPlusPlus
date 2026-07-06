import { create } from "zustand";

type ChainedMovesDialogStore = {
	isChainedMovesDialogOpen: boolean;
	openChainedMovesDialog: () => void;
	closeChainedMovesDialog: () => void;

	nodeIds: [number, string[]][] | null;
	updateNodeIds: (nodeIds: [number, string[]][]) => void;
	addNodeId: (sequenceIndex: number, insertPos: number | "end") => void;
	moveNodeId: (
		sequenceIndexOfNode: number,
		oldNodeIndex: number,
		newNodeIndex: number,
	) => void;
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

	addNodeId: (sequenceIndexOfNode, insertPos) => {
		if (insertPos === "end") {
			set((state) => ({
				nodeIds: state.nodeIds?.map(([sequenceIndex, sequence]) => {
					if (sequenceIndexOfNode === sequenceIndex) {
						return [
							sequenceIndex,
							[...sequence, crypto.randomUUID()],
						];
					} else {
						return [sequenceIndex, sequence];
					}
				}),
			}));
		} else {
			set((state) => ({
				nodeIds: state.nodeIds?.map(([sequenceIndex, sequence]) => {
					if (sequenceIndexOfNode === sequenceIndex) {
						return [
							sequenceIndex,
							[
								...sequence.slice(0, insertPos),
								crypto.randomUUID(),
								...sequence.slice(insertPos),
							],
						];
					} else {
						return [sequenceIndex, sequence];
					}
				}),
			}));
		}
	},

	moveNodeId: (sequenceIndexOfNode, oldNodeIndex, newNodeIndex) => {
		set((state) => ({
			nodeIds: state.nodeIds?.map(([sequenceIndex, sequence]) => {
				if (sequenceIndexOfNode === sequenceIndex) {
					const newSequence = structuredClone(sequence);
					const [nodeIdToMove] = newSequence.splice(oldNodeIndex, 1);

					newSequence.splice(newNodeIndex, 0, nodeIdToMove);

					return [sequenceIndex, newSequence];
				} else {
					return [sequenceIndex, sequence];
				}
			}),
		}));
	},

	clearNodeIds: () => {
		set({ nodeIds: null });
	},

	activePiece: null,
	updateActivePiece: (piece) => set({ activePiece: piece }),
	clearActivePiece: () => set({ activePiece: null }),
}));

export default useChainedMovesDialogStore;
