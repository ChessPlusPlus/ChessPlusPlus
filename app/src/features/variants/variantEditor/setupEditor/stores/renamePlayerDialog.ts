import { create } from "zustand";

type RenamePlayerDialogStore = {
	isRenamePlayerDialogOpen: boolean;
	openRenamePlayerDialog: (originalPlayerName?: string) => void;
	closeRenamePlayerDialog: () => void;

	originalPlayerName: string | null;
	updateOriginalPlayerName: (originalPlayerName: string) => void;
	clearOriginalPlayerName: () => void;

	playerName: string;
	updatePlayerName: (playerName: string) => void;
	clearPlayerName: () => void;

	playerNameErrors: string[];
	updatePlayerNameErrors: (playerNameErrors: string[]) => void;
	clearPlayerNameErrors: () => void;
};

const useRenamePlayerDialogStore = create<RenamePlayerDialogStore>((set) => ({
	isRenamePlayerDialogOpen: false,
	openRenamePlayerDialog: (originalPlayerName) => set((state) => ({
		isRenamePlayerDialogOpen: true,
		originalPlayerName: originalPlayerName ?? state.originalPlayerName,
	})),
	
	closeRenamePlayerDialog: () => set({ isRenamePlayerDialogOpen: false }),

	originalPlayerName: null,
	updateOriginalPlayerName: (originalPlayerName) =>
		set({ originalPlayerName }),
	clearOriginalPlayerName: () => set({ originalPlayerName: null }),

	playerName: "",
	updatePlayerName: (playerName) => set({ playerName }),
	clearPlayerName: () => set({ playerName: "" }),

	playerNameErrors: [],
	updatePlayerNameErrors: (playerNameErrors) => set({ playerNameErrors }),
	clearPlayerNameErrors: () => set({ playerNameErrors: [] }),
}));

export default useRenamePlayerDialogStore;
