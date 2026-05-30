import { create } from "zustand";

type PiecesEditorSheetStore = {
    currentMode: "pieceSelection" | "pieceEditing";
    updateCurrentMode: (newMode: "pieceSelection" | "pieceEditing") => void;
    resetPiecesEditorSheetState: () => void;
};

const usePiecesEditorSheetStore = create<PiecesEditorSheetStore>((set) => ({
    currentMode: "pieceSelection",
    updateCurrentMode: (newMode) => set({ currentMode: newMode }),
    resetPiecesEditorSheetState: () => set({ currentMode: "pieceSelection" }),
}));

export default usePiecesEditorSheetStore;
