import { create } from "zustand";

type AddPlayerDialogStore = {
	isAddPlayerDialogOpen: boolean;
	openAddPlayerDialog: () => void;
	closeAddPlayerDialog: () => void;

	playerName: string;
	updatePlayerName: (playerName: string) => void;
	clearPlayerName: () => void;

	playerNameErrors: string[];
	updatePlayerNameErrors: (playerNameErrors: string[]) => void;
	clearPlayerNameErrors: () => void;
};

const useAddPlayerDialogStore = create<AddPlayerDialogStore>((set) => ({
	isAddPlayerDialogOpen: false,
	openAddPlayerDialog: () => set({ isAddPlayerDialogOpen: true }),
	closeAddPlayerDialog: () => set({ isAddPlayerDialogOpen: false }),

	playerName: "",
	updatePlayerName: (playerName) => set({ playerName }),
	clearPlayerName: () => set({ playerName: "" }),

	playerNameErrors: [],
	updatePlayerNameErrors: (playerNameErrors) => set({ playerNameErrors }),
	clearPlayerNameErrors: () => set({ playerNameErrors: [] }),
}));

export default useAddPlayerDialogStore;