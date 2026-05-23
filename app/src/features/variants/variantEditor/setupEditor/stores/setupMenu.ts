import { create } from "zustand";

type SetupMenuStore = {
	isBoardSizeExpanded: boolean;
	expandBoardSize: () => void;
	collapseBoardSize: () => void;

	isPlayersExpanded: boolean;
	expandPlayers: () => void;
	collapsePlayers: () => void;

	isPiecesExpanded: boolean;
	expandPieces: () => void;
	collapsePieces: () => void;

	originalBoardXSize: number | null,
	updateOriginalBoardXSize: (boardXSize: number) => void;
	resetOriginalBoardXSize: () => void;

	originalBoardYSize: number | null,
	updateOriginalBoardYSize: (boardYSize: number) => void;
	resetOriginalBoardYSize: () => void;
}

const useSetupMenuStore = create<SetupMenuStore>((set) => ({
	isBoardSizeExpanded: false,
	expandBoardSize: () => set({ isBoardSizeExpanded: true }),
	collapseBoardSize: () => set({ isBoardSizeExpanded: false }),

	isPlayersExpanded: false,
	expandPlayers: () => set({ isPlayersExpanded: true }),
	collapsePlayers: () => set({ isPlayersExpanded: false }),

	isPiecesExpanded: false,
	expandPieces: () => set({ isPiecesExpanded: true }),
	collapsePieces: () => set({ isPiecesExpanded: false }),

	originalBoardXSize: null,
	updateOriginalBoardXSize: (boardXSize: number) => set({ originalBoardXSize: boardXSize }),
	resetOriginalBoardXSize: () => set({ originalBoardXSize: null }),

	originalBoardYSize: null,
	updateOriginalBoardYSize: (boardYSize: number) => set({ originalBoardYSize: boardYSize }),
	resetOriginalBoardYSize: () => set({ originalBoardYSize: null }),
}))

export default useSetupMenuStore;