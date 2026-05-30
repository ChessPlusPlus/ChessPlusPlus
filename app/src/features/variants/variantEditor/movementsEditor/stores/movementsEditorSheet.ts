import { create } from "zustand";

type MovementsEditorSheetStore = {
	currentMode: "movementSelection" | "movementEditing";
	updateCurrentMode: (
		newMode: "movementSelection" | "movementEditing",
	) => void;
	resetMovementsEditorSheetState: () => void;
};

const useMovementsEditorSheetStore = create<MovementsEditorSheetStore>(
	(set) => ({
		currentMode: "movementSelection",
		updateCurrentMode: (newMode) => set({ currentMode: newMode }),
		resetMovementsEditorSheetState: () =>
			set({ currentMode: "movementSelection" }),
	}),
);

export default useMovementsEditorSheetStore;
