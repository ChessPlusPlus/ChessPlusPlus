import { create } from "zustand";

type RenamePlayerDialogStore = {
	isRenamePlayerDialogOpen: boolean;
	openRenamePlayerDialog: () => void;
	closeRenamePlayerDialog: () => void;

	playerName: string;
	updatePlayerName: (playerName: string) => void;
	clearPlayerName: () => void;

	playerNameErrors: string[];
	updatePlayerNameErrors: (playerNameErrors: string[]) => void;
	clearPlayerNameErrors: () => void;
};

const useRenamePlayerDialogStore = create<RenamePlayerDialogStore>((set) => ({
	isRenamePlayerDialogOpen: false,
	openRenamePlayerDialog: () => set({ isRenamePlayerDialogOpen: true }),
	closeRenamePlayerDialog: () => set({ isRenamePlayerDialogOpen: false }),

	playerName: "",
	updatePlayerName: (playerName) => set({ playerName }),
	clearPlayerName: () => set({ playerName: "" }),

	playerNameErrors: [],
	updatePlayerNameErrors: (playerNameErrors) => set({ playerNameErrors }),
	clearPlayerNameErrors: () => set({ playerNameErrors: [] }),
}));

export default useRenamePlayerDialogStore;