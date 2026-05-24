import { create } from "zustand";
import useVariantDraftStore from "@/features/variants/variantEditor/common/stores/variantDraft";
import type {
	ChainedMoveNodeInput,
	ChainedMoveSequence,
	RegularMove,
} from "@/features/variants/common/types/pieceRules";
import { handlePieceNameUpdate } from "@/features/variants/variantEditor/common/utils/nameUpdateHandler";
import { generateId } from "@/shared/utils/idGeneration";
import { isNullOrUndefined } from "@/shared/utils/typeChecks";

type PieceEditorChanges = {
	pieceName: string;
	activePieceMovements: string[];
};

type PiecesEditorStore = {
	activePiece: string | null;
	updateActivePiece: (newActivePiece: string) => void;
	clearActivePiece: () => void;

	currentTab: "appearance" | "movements";
	updateCurrentTab: (newCurrentTab: "appearance" | "movements") => void;

	isMovementsExpanded: boolean;
	expandMovements: () => void;
	collapseMovements: () => void;

	piecesEditorChanges: Partial<PieceEditorChanges>;
	addPieceEditorChanges: (changes: Partial<PieceEditorChanges>) => void;
	removePieceEditorChanges: (
		changeKeys: (keyof PieceEditorChanges)[],
	) => void;
	clearPieceEditorChanges: () => void;

	activePieceMovements: RegularMove[];
	addMovementToActivePiece: (movement: RegularMove) => void;
	removeMovementFromActivePiece: (movementName: string) => void;
	updateMovementsInActivePiece: (movements: RegularMove[]) => void;
	clearMovementsFromActivePiece: () => void;

	chainedMoveSequences: [number | null, ChainedMoveSequence][];
	addChainedMoveSequence: (sequence: ChainedMoveSequence) => void;
	removeChainedMoveSequence: (sequenceIndex: number) => void;
	updateChainedMoveSequence: (
		sequenceIndex: number,
		newSequence: ChainedMoveSequence,
	) => void;
	updateChainedMoveSequences: (
		newSequences: [number | null, ChainedMoveSequence][],
	) => void;
	clearChainedMoveSequences: () => void;

	deletedChainedMoveSequences: [number | null, ChainedMoveSequence][];
	addDeletedChainedMoveSequence: (
		sequence: [number | null, ChainedMoveSequence],
	) => void;
	removeDeletedChainedMoveSequence: (sequenceIndex: number) => void;
	clearDeletedChainedMoveSequences: () => void;

	addChainedMoveToSequence: (
		sequenceIndex: number,
		insertPos: number | "end",
		move: ChainedMoveNodeInput,
	) => void;
	removeChainedMoveFromSequence: (
		sequenceIndex: number,
		moveIndex: number,
	) => void;
	removeChainedMovesFromSequence: (
		sequenceIndex: number,
		moveIndices: number[],
	) => void;
	replaceChainedMoveInSequence: (
		sequenceIndex: number,
		moveIndex: number,
		newMove: ChainedMoveNodeInput,
	) => void;
	moveChainedMoveInSequence: (
		sequenceIndex: number,
		oldIndex: number,
		newIndex: number,
	) => void;

	pieceName: string | null;
	updatePieceName: (newPieceName: string) => void;
	clearPieceName: () => void;

	pieceImageId: string | null;
	updatePieceImageId: (newPieceImageId: string) => void;
	clearPieceImageId: () => void;

	commitToDraft: (keys?: (keyof PieceEditorChanges)[]) => void;
};

const usePiecesEditorStore = create<PiecesEditorStore>((set, get) => ({
	activePiece: null,
	updateActivePiece: (newPiece) => set({ activePiece: newPiece }),
	clearActivePiece: () => set({ activePiece: null }),

	currentTab: "appearance",
	updateCurrentTab: (newCurrentTab) => set({ currentTab: newCurrentTab }),

	isMovementsExpanded: false,
	expandMovements: () => set({ isMovementsExpanded: true }),
	collapseMovements: () => set({ isMovementsExpanded: false }),

	piecesEditorChanges: {},
	addPieceEditorChanges: (changes) =>
		set((state) => ({
			piecesEditorChanges: {
				...state.piecesEditorChanges,
				...changes,
			},
		})),

	removePieceEditorChanges: (changes) => {
		set((state) => {
			const newChanges = structuredClone(state.piecesEditorChanges);
			for (const key of changes) {
				delete newChanges[key];
			}

			return { piecesEditorChanges: newChanges };
		});
	},

	clearPieceEditorChanges: () => set({ piecesEditorChanges: {} }),

	activePieceMovements: [],
	addMovementToActivePiece: (movement) =>
		set((state) => ({
			activePieceMovements: [...state.activePieceMovements, movement],
		})),
	removeMovementFromActivePiece: (movementName) =>
		set((state) => ({
			activePieceMovements: state.activePieceMovements.filter(
				(movement) => movement.moveName !== movementName,
			),
		})),
	updateMovementsInActivePiece: (movements) =>
		set({ activePieceMovements: movements }),
	clearMovementsFromActivePiece: () => set({ activePieceMovements: [] }),

	chainedMoveSequences: [],
	addChainedMoveSequence: (sequence) =>
		set({
			chainedMoveSequences: [
				...get().chainedMoveSequences,
				[null, sequence],
			],
		}),

	removeChainedMoveSequence: (sequenceIndex) =>
		set({
			chainedMoveSequences: get().chainedMoveSequences.filter(
				(_, index) => index !== sequenceIndex,
			),
		}),

	updateChainedMoveSequence: (sequenceIndex, newSequence) =>
		set({
			chainedMoveSequences: get().chainedMoveSequences.map(
				(sequence, index) =>
					index === sequenceIndex
						? [sequence[0], newSequence]
						: sequence,
			),
		}),

	updateChainedMoveSequences: (newSequences) =>
		set({
			chainedMoveSequences: newSequences,
		}),
	clearChainedMoveSequences: () => set({ chainedMoveSequences: [] }),

	addChainedMoveToSequence: (sequenceIndex, insertPos, move) => {
		if (insertPos === "end") {
			set({
				chainedMoveSequences: get().chainedMoveSequences.map(
					(sequence, index) =>
						index === sequenceIndex
							? [
									sequence[0],
									[
										...sequence[1],
										{ ...move, nodeId: generateId() },
									],
								]
							: sequence,
				),
			});
		} else {
			set({
				chainedMoveSequences: get().chainedMoveSequences.map(
					(sequence, index) =>
						index === sequenceIndex
							? [
									sequence[0],
									[
										...sequence[1].slice(0, insertPos),
										{ ...move, nodeId: generateId() },
										...sequence[1].slice(insertPos),
									],
								]
							: sequence,
				),
			});
		}
	},

	removeChainedMoveFromSequence: (sequenceIndex, moveIndex) =>
		set({
			chainedMoveSequences: get().chainedMoveSequences.map(
				(sequence, index) =>
					index === sequenceIndex
						? [
								sequence[0],
								sequence[1].filter(
									(_, index) => index !== moveIndex,
								),
							]
						: sequence,
			),
		}),

	removeChainedMovesFromSequence: (sequenceIndex, moveIndices) =>
		set({
			chainedMoveSequences: get().chainedMoveSequences.map(
				(sequence, index) =>
					index === sequenceIndex
						? [
								sequence[0],
								sequence[1].filter(
									(_, index) => !moveIndices.includes(index),
								),
							]
						: sequence,
			),
		}),

	replaceChainedMoveInSequence: (sequenceIndex, moveIndex, newMove) =>
		set({
			chainedMoveSequences: get().chainedMoveSequences.map(
				(sequence, index) =>
					index === sequenceIndex
						? [
								sequence[0],
								sequence[1].map((move, index) =>
									index === moveIndex ? { nodeId: move.nodeId, ...newMove } : move,
								),
							]
						: sequence,
			),
		}),

	moveChainedMoveInSequence: (sequenceIndex, oldIndex, newIndex) =>
		set({
			chainedMoveSequences: get().chainedMoveSequences.map(
				(sequence, index) => {
					if (index === sequenceIndex) {
						const newSequence = structuredClone(sequence[1]);
						const element = newSequence.splice(oldIndex, 1)[0];

						newSequence.splice(newIndex, 0, element);

						return [sequence[0], newSequence];
					} else {
						return sequence;
					}
				},
			),
		}),

	deletedChainedMoveSequences: [],
	addDeletedChainedMoveSequence: (sequence) =>
		set({
			deletedChainedMoveSequences: [
				...get().deletedChainedMoveSequences,
				sequence,
			],
		}),
	removeDeletedChainedMoveSequence: (sequenceIndex) =>
		set({
			deletedChainedMoveSequences:
				get().deletedChainedMoveSequences.filter(
					(_, index) => index !== sequenceIndex,
				),
		}),
	clearDeletedChainedMoveSequences: () =>
		set({ deletedChainedMoveSequences: [] }),

	pieceImageId: null,
	updatePieceImageId: (newPieceImageId) =>
		set({ pieceImageId: newPieceImageId }),
	clearPieceImageId: () => set({ pieceImageId: null }),

	pieceName: null,
	updatePieceName: (newPieceName) => set({ pieceName: newPieceName }),
	clearPieceName: () => set({ pieceName: null }),

	commitToDraft: (keys) => {
		const pieceEditorChanges = get().piecesEditorChanges;
		const pieceRulesetDraft =
			useVariantDraftStore.getState().pieceRulesetDraft;
		const setupRulesDraft = useVariantDraftStore.getState().setupRulesDraft;

		if (!pieceRulesetDraft) return;
		if (!setupRulesDraft) return;

		const updatedPieceRulesetDraft = structuredClone(pieceRulesetDraft);
		const updatedSetupRulesDraft = structuredClone(setupRulesDraft);

		const originalPieceName = get().activePiece;
		if (!originalPieceName) return;

		const originalPieceRules = updatedPieceRulesetDraft[originalPieceName];
		if (!originalPieceRules) return;

		if (!keys) {
			const nonNameChanges = Object.fromEntries(
				Object.entries(pieceEditorChanges).filter(
					([key]) => key !== "pieceName",
				),
			);

			const newPieceInfo = {
				...originalPieceRules,
				...nonNameChanges,
			};

			updatedPieceRulesetDraft[originalPieceName] = newPieceInfo;

			if (Object.keys(pieceEditorChanges).includes("pieceName")) {
				if (isNullOrUndefined(pieceEditorChanges.pieceName)) return;

				const trimmedPieceName = pieceEditorChanges.pieceName.trim();

				if (trimmedPieceName === "") {
					get().updatePieceName(originalPieceName);
					get().removePieceEditorChanges(["pieceName"]);
					return;
				};

				if (Object.keys(pieceRulesetDraft).includes(trimmedPieceName)) {
					get().updatePieceName(originalPieceName);
					get().removePieceEditorChanges(["pieceName"]);
					return;
				};
				
				handlePieceNameUpdate(
					originalPieceName,
					updatedPieceRulesetDraft,
					updatedSetupRulesDraft,
					newPieceInfo,
					trimmedPieceName,
				);
			}

			get().clearPieceEditorChanges();
		} else {
			const changesToCommit = Object.fromEntries(
				Object.entries(pieceEditorChanges).filter(([key]) =>
					keys.includes(key as keyof PieceEditorChanges),
				),
			);

			const nonNameChanges = Object.fromEntries(
				Object.entries(changesToCommit).filter(
					([key]) => key !== "pieceName",
				),
			);

			const newPieceInfo = {
				...originalPieceRules,
				...nonNameChanges,
			};

			if (Object.keys(pieceEditorChanges).includes("pieceName")) {
				if (isNullOrUndefined(pieceEditorChanges.pieceName)) return;
				if (pieceEditorChanges.pieceName.trim() === "") {
					get().updatePieceName(originalPieceName);
					get().removePieceEditorChanges(["pieceName"]);
					return;
				};

				if (Object.keys(pieceRulesetDraft).includes(pieceEditorChanges.pieceName.trim())) {
					get().updatePieceName(originalPieceName);
					get().removePieceEditorChanges(["pieceName"]);
					return;
				};

				handlePieceNameUpdate(
					originalPieceName,
					updatedPieceRulesetDraft,
					updatedSetupRulesDraft,
					newPieceInfo,
					pieceEditorChanges.pieceName,
				);
			}

			get().removePieceEditorChanges(keys);
		}

		const updateSetupRulesDraft =
			useVariantDraftStore.getState().updateSetupRulesDraft;
		const updatePieceRulesetDraft =
			useVariantDraftStore.getState().updatePieceRulesetDraft;

		updateSetupRulesDraft(updatedSetupRulesDraft);
		updatePieceRulesetDraft(updatedPieceRulesetDraft);
	},
}));

export default usePiecesEditorStore;
