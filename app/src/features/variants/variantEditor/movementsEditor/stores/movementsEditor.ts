import { create } from "zustand";
import useVariantDraftStore from "@/features/variants/variantEditor/common/stores/variantDraft";
import type {
	MoveDefinitionChanges,
	MoveDefinition,
	NumericFieldConstraints,
} from "@/features/variants/common/types/movementRules";
import { handleMovementNameUpdate } from "@/features/variants/variantEditor/common/utils/nameUpdateHandler";

type MovementsEditorChanges = {
	movementName: string;
	forMovement: boolean;
	forCapture: boolean;
	offsetX: string | number;
	offsetY: string | number;
	range: number | "inf";
	allowOnlyOnFirstMove: boolean;
};

type MovementsEditorStore = {
	activeMovementName: string | null;
	updateActiveMovementName: (newMovementName: string) => void;
	clearActiveMovementName: () => void;

	movementName: string | null;
	updateMovementName: (newMovementName: string) => void;
	clearMovementName: () => void;

	movementsEditorChanges: Partial<MovementsEditorChanges>;
	addMovementsEditorChanges: (
		changes: Partial<MovementsEditorChanges>,
	) => void;
	removeMovementsEditorChanges: (
		changeKeys: (keyof MovementsEditorChanges)[],
	) => void;
	clearMovementsEditorChanges: () => void;

	forMovement: boolean | null;
	toggleForMovement: () => void;
	updateForMovement: (newForMovement: boolean) => void;
	clearForMovement: () => void;

	forCapture: boolean | null;
	toggleForCapture: () => void;
	updateForCapture: (newForCapture: boolean) => void;
	clearForCapture: () => void;

	offsetX: number | string | null;
	updateOffsetX: (newOffset: string | number) => void;
	clearOffsetX: () => void;

	offsetY: number | string | null;
	updateOffsetY: (newOffset: string | number) => void;
	clearOffsetY: () => void;

	range: number | "inf" | null;
	updateRange: (newRange: number | "inf") => void;
	clearRange: () => void;

	allowOnlyOnFirstMove: boolean | null;
	toggleAllowOnlyOnFirstMove: () => void;
	updateAllowOnlyOnFirstMove: (newAllowOnlyOnFirstMove: boolean) => void;
	clearAllowOnlyOnFirstMove: () => void;

	commitToDraft: (keys?: (keyof MovementsEditorChanges)[]) => void;
	resetMovementsEditorState: () => void;
};

const useMovementsEditorStore = create<MovementsEditorStore>(
	(set, get, store) => ({
		activeMovementName: null,
		updateActiveMovementName: (newMovementName) =>
			set({ activeMovementName: newMovementName }),
		clearActiveMovementName: () => set({ activeMovementName: null }),

		movementName: null,
		updateMovementName: (newMovementName) =>
			set({ movementName: newMovementName }),
		clearMovementName: () => set({ movementName: null }),

		movementsEditorChanges: {},
		addMovementsEditorChanges: (changes) =>
			set((state) => ({
				movementsEditorChanges: {
					...state.movementsEditorChanges,
					...changes,
				},
			})),

		removeMovementsEditorChanges: (changeKeys) => {
			set((state) => {
				const newChanges = structuredClone(
					state.movementsEditorChanges,
				);

				for (const key of changeKeys) {
					delete newChanges[key];
				}

				return { movementsEditorChanges: newChanges };
			});
		},

		clearMovementsEditorChanges: () => set({ movementsEditorChanges: {} }),

		forMovement: null,
		toggleForMovement: () =>
			set((state) => ({ forMovement: !state.forMovement })),
		updateForMovement: (newForMovement) =>
			set({ forMovement: newForMovement }),
		clearForMovement: () => set({ forMovement: null }),

		forCapture: null,
		toggleForCapture: () =>
			set((state) => ({ forCapture: !state.forCapture })),
		updateForCapture: (newForCapture) => set({ forCapture: newForCapture }),
		clearForCapture: () => set({ forCapture: null }),

		offsetX: null,
		updateOffsetX: (newOffset) => set({ offsetX: newOffset }),
		clearOffsetX: () => set({ offsetX: null }),

		offsetY: null,
		updateOffsetY: (newOffset) => set({ offsetY: newOffset }),
		clearOffsetY: () => set({ offsetY: null }),

		range: null,
		updateRange: (newRange) => set({ range: newRange }),
		clearRange: () => set({ range: null }),

		allowOnlyOnFirstMove: null,
		toggleAllowOnlyOnFirstMove: () =>
			set((state) => ({ allowOnlyOnFirstMove: !state.allowOnlyOnFirstMove })),
		updateAllowOnlyOnFirstMove: (newAllowOnlyOnFirstMove) =>
			set({ allowOnlyOnFirstMove: newAllowOnlyOnFirstMove }),
		clearAllowOnlyOnFirstMove: () => set({ allowOnlyOnFirstMove: null }),

		commitToDraft: (keys) => {
			const movementEditorChanges = get().movementsEditorChanges;
			const movementRulesDraft =
				useVariantDraftStore.getState().movementRulesDraft;
			const pieceRulesetDraft =
				useVariantDraftStore.getState().pieceRulesetDraft;

			if (!movementRulesDraft) return;
			if (!pieceRulesetDraft) return;

			const updatedMovementRulesDraft =
				structuredClone(movementRulesDraft);
			const updatedPieceRulesetDraft = structuredClone(pieceRulesetDraft);

			const originalMovementName = get().activeMovementName;
			if (!originalMovementName) return;

			const originalMovementInfo =
				movementRulesDraft[originalMovementName];
			if (!originalMovementInfo) return;

			const moveDefinitionChangeKeys: (keyof MoveDefinitionChanges)[] = [
				"moveStopConditions",
				"offsetY",
				"offsetX",
				"range",
			];

			const numericConstraintsConfig: NumericFieldConstraints = {
				range: { min: 1, max: null },
				offsetX: { min: null, max: null },
				offsetY: { min: null, max: null },
			};

			const updateMovementRulesDraft =
				useVariantDraftStore.getState().updateMovementRulesDraft;
			const updatePieceRulesetDraft =
				useVariantDraftStore.getState().updatePieceRulesetDraft;

			if (!keys) {
				const nonNameChanges = Object.fromEntries(
					Object.entries(movementEditorChanges).filter(
						([key]) => key !== "movementName",
					),
				);

				const topLevelChanges = Object.fromEntries(
					Object.entries(nonNameChanges).filter(
						([key]) =>
							!moveDefinitionChangeKeys.includes(
								key as keyof MoveDefinitionChanges,
							),
					).map(([key, value]) => {
						if (key === "allowOnlyOnFirstMove") {
							return ["conditions", value ? ["has_not_moved"] : []];
						}

						return [key, value];
					}),
				);

				const moveDefinitionChanges = Object.fromEntries(
					Object.entries(nonNameChanges).filter(([key]) =>
						moveDefinitionChangeKeys.includes(
							key as keyof MoveDefinitionChanges,
						),
					),
				);

				const filteredMoveDefinitionChanges = Object.fromEntries(
					Object.entries(moveDefinitionChanges).filter(
						([key, value]) => {
							if (
								!Object.keys(numericConstraintsConfig).includes(
									key as keyof MovementsEditorChanges,
								)
							) {
								return true;
							}

							if (key === "range" && value === "inf") return true;
							if (Number.isNaN(value)) return false;
							if (!Number.isFinite(value)) return false;

							return true;
						},
					),
				);

				const changesToRevert = Object.fromEntries(
					Object.entries(moveDefinitionChanges)
						.filter(([key, value]) => {
							if (
								!Object.keys(numericConstraintsConfig).includes(
									key as keyof MovementsEditorChanges,
								)
							) {
								return false;
							}

							if (key === "range" && value === "inf") return false;
							if (Number.isNaN(value)) return true;
							if (!Number.isFinite(value)) return true;

							return false;
						})
						.map(([key]) => {
							return [
								key,
								movementRulesDraft[originalMovementName]
									.moveDefinition[
									key as keyof MoveDefinition
								],
							];
						}),
				);

				const newMovementInfo = {
					...originalMovementInfo,
					...topLevelChanges,

					moveDefinition: {
						...originalMovementInfo.moveDefinition,
						...filteredMoveDefinitionChanges,
					},
				};

				newMovementInfo.moveDefinition = {
					...newMovementInfo.moveDefinition,
					...changesToRevert,
				};

				updatedMovementRulesDraft[originalMovementName] =
					newMovementInfo;

				if (
					Object.keys(movementEditorChanges).includes("movementName")
				) {
					if (!movementEditorChanges.movementName) return;

					delete updatedMovementRulesDraft[originalMovementName];
					updatedMovementRulesDraft[
						movementEditorChanges.movementName
					] = newMovementInfo;

					handleMovementNameUpdate(
						updatedPieceRulesetDraft,
						originalMovementName,
						movementEditorChanges.movementName,
					);
				}

				get().clearMovementsEditorChanges();
			} else {
				const changesToCommit = Object.fromEntries(
					Object.entries(movementEditorChanges).filter(([key]) =>
						keys.includes(key as keyof MovementsEditorChanges),
					),
				);

				const nonNameChanges = Object.fromEntries(
					Object.entries(changesToCommit).filter(
						([key]) => key !== "movementName",
					),
				);

				const topLevelChanges = Object.fromEntries(
					Object.entries(nonNameChanges).filter(
						([key]) =>
							!moveDefinitionChangeKeys.includes(
								key as keyof MoveDefinitionChanges,
							),
					),
				);

				const moveDefinitionChanges = Object.fromEntries(
					Object.entries(nonNameChanges).filter(([key]) =>
						moveDefinitionChangeKeys.includes(
							key as keyof MoveDefinitionChanges,
						),
					),
				);

				const filteredMoveDefinitionChanges = Object.fromEntries(
					Object.entries(moveDefinitionChanges)
						.filter(([key, value]) => {
							if (
								!Object.keys(numericConstraintsConfig).includes(
									key as keyof MovementsEditorChanges,
								)
							) {
								return true;
							}

							if (key === "range" && value === "inf") return true;
							if (value === "") return false;
							if (Number.isNaN(Number(value))) return false;
							if (!Number.isFinite(Number(value))) return false;

							return true;
						})
						.map(([key, value]) => {
							return [key, Number(value)];
						}),
				);

				const changesToRevert = Object.fromEntries(
					Object.entries(moveDefinitionChanges)
						.filter(([key, value]) => {
							console.log(key, value);

							if (
								!Object.keys(numericConstraintsConfig).includes(
									key as keyof MovementsEditorChanges,
								)
							) {
								return false;
							}

							if (key === "range" && value === "inf") return true;
							if (value === "") return true;
							if (Number.isNaN(Number(value))) return true;
							if (!Number.isFinite(Number(value))) return true;

							if (
								(value as number) <
								(numericConstraintsConfig[key]?.min ??
									-Infinity)
							) {
								console.log("less than min");
								return true;
							}

							if (
								(value as number) >
								(numericConstraintsConfig[key]?.max ?? Infinity)
							) {
								console.log("greater than max");
								return true;
							}

							return false;
						})
						.map(([key, value]) => {
							return [
								key,
								(key === "range" && value === "inf") ? "inf" : Number(
									movementRulesDraft[originalMovementName]
										.moveDefinition[
										key as keyof MoveDefinition
									],
								),
							];
						}),
				);

				console.log(JSON.stringify(movementEditorChanges, null, 2));
				console.log(
					JSON.stringify(filteredMoveDefinitionChanges, null, 2),
				);

				const renamedMoveDefinitionChanges = Object.fromEntries(
					Object.entries(filteredMoveDefinitionChanges).map(
						([key, value]) => {
							if (key === "offsetX") {
								return ["moveX", value];
							}

							if (key === "offsetY") {
								return ["moveY", value];
							}

							return [key, value];
						},
					),
				);

				const newMovementInfo = {
					...originalMovementInfo,
					...topLevelChanges,

					moveDefinition: {
						...originalMovementInfo.moveDefinition,
						...renamedMoveDefinitionChanges,
					},
				};

				console.log(JSON.stringify(newMovementInfo, null, 2));
				console.log(
					JSON.stringify(renamedMoveDefinitionChanges, null, 2),
				);

				newMovementInfo.moveDefinition = {
					...newMovementInfo.moveDefinition,
					...changesToRevert,
				};

				updatedMovementRulesDraft[originalMovementName] =
					newMovementInfo;

				if (
					Object.keys(movementEditorChanges).includes("movementName")
				) {
					if (!movementEditorChanges.movementName) return;

					delete updatedMovementRulesDraft[originalMovementName];
					updatedMovementRulesDraft[
						movementEditorChanges.movementName
					] = newMovementInfo;

					handleMovementNameUpdate(
						updatedPieceRulesetDraft,
						originalMovementName,
						movementEditorChanges.movementName,
					);
				}

				get().removeMovementsEditorChanges(keys);
			}

			updateMovementRulesDraft(updatedMovementRulesDraft);
			updatePieceRulesetDraft(updatedPieceRulesetDraft);
		},

		resetMovementsEditorState: () => {
			set(store.getInitialState());
		},
	}),
);

export default useMovementsEditorStore;
