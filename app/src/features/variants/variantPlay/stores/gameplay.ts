import type { GameState2DArray } from "@/features/variants/common/types/setupRules";
import { create } from "zustand";

type GameplayStore = {
	gameBoardState: GameState2DArray | null;
	updateGameBoardState: (gameBoardState: GameState2DArray) => void;
	resetGameBoardState: () => void;

	prevClickedSquare: [number, number] | null;
	updatePrevClickedSquare: (prevClickedSquare: [number, number]) => void;
	clearPrevClickedSquare: () => void;

	clickedSquare: [number, number] | null;
	updateClickedSquare: (clickedSquare: [number, number]) => void;
	clearClickedSquare: () => void;

	legalMoves: [number, number][] | null;
	updateLegalMoves: (legalMoves: [number, number][]) => void;
	clearLegalMoves: () => void;

	activeGameId: string | null;
	updateActiveGameId: (activeGameId: string) => void;
	clearActiveGameId: () => void;

	isBoardFlipped: boolean;
	toggleBoardFlip: () => void;
	resetBoardFlip: () => void;
};

const useGameplayStore = create<GameplayStore>((set) => ({
	gameBoardState: null,
	updateGameBoardState: (gameBoardState: GameState2DArray) =>
		set({ gameBoardState }),
	resetGameBoardState: () => set({ gameBoardState: null }),

	prevClickedSquare: null,
	updatePrevClickedSquare: (prevClickedSquare: [number, number]) => set({ prevClickedSquare }),
	clearPrevClickedSquare: () => set({ prevClickedSquare: null }),

	clickedSquare: null,
	updateClickedSquare: (clickedSquare: [number, number]) => set({ clickedSquare }),
	clearClickedSquare: () => set({ clickedSquare: null }),

	legalMoves: null,
	updateLegalMoves: (legalMoves: [number, number][]) =>
		set({ legalMoves }),
	clearLegalMoves: () => set({ legalMoves: null }),

	activeGameId: null,
	updateActiveGameId: (activeGameId: string) =>
		set({ activeGameId }),
	clearActiveGameId: () => set({ activeGameId: null }),

	isBoardFlipped: false,
	toggleBoardFlip: () =>
		set((state) => ({ isBoardFlipped: !state.isBoardFlipped })),
	resetBoardFlip: () => set({ isBoardFlipped: false }),
}));

export default useGameplayStore;
