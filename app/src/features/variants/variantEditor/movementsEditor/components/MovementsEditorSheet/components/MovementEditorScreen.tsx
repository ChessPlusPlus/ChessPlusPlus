import useMovementsEditorStore from "@/features/variants/variantEditor/movementsEditor/stores/movementsEditor";
import useMovementsEditorSheetStore from "@/features/variants/variantEditor/movementsEditor/stores/movementsEditorSheet";
import {
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { IconChevronLeft } from "@tabler/icons-react";
import {
	Field,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useRef, type ChangeEvent } from "react";
import { isNullOrUndefined } from "@/shared/utils/typeChecks";
import useVariantDraftStore from "@/features/variants/variantEditor/common/stores/variantDraft";
import MovementDeletionAlert from "@/features/variants/variantEditor/movementsEditor/components/MovementsEditorSheet/components/MovementDeletionAlert";
import useDeleteMovementAlertStore from "@/features/variants/variantEditor/movementsEditor/stores/deleteMovementAlert";

export function MovementEditorScreen() {
	const {
		activeMovementName,

		movementName,
		updateMovementName,
		forMovement,
		updateForMovement,
		toggleForMovement,
		forCapture,
		updateForCapture,
		toggleForCapture,
		range,
		updateRange,
		offsetX,
		updateOffsetX,
		offsetY,
		updateOffsetY,

		addMovementsEditorChanges,
		commitToDraft,
	} = useMovementsEditorStore();
	const { updateCurrentMode } = useMovementsEditorSheetStore();
	const {
		movementRulesDraft,
		syncMovementRulesDraftToDB,
		syncPieceRulesetDraftToDB,
	} = useVariantDraftStore();

	const { openDeleteMovementAlert, updateMovementToDelete } =
		useDeleteMovementAlertStore();

	const previousRangeInputRef = useRef<number | null>(null);

	useEffect(() => {
		if (!movementRulesDraft) return;
		if (!activeMovementName) return;

		const initialMovement = movementRulesDraft[activeMovementName];

		if (!initialMovement) return;

		const initialRange = initialMovement.moveDefinition.range;
		const initialOffsetX = initialMovement.moveDefinition.moveX;
		const initialOffsetY = initialMovement.moveDefinition.moveY;
		const initialForMovement = initialMovement.forMovement;
		const initialForCapture = initialMovement.forCapture;

		updateMovementName(activeMovementName);
		updateRange(initialRange);
		updateOffsetX(initialOffsetX);
		updateOffsetY(initialOffsetY);
		updateForMovement(initialForMovement);
		updateForCapture(initialForCapture);
	}, [
		activeMovementName,
		movementRulesDraft,
		updateRange,
		updateOffsetX,
		updateOffsetY,
		updateForMovement,
		updateForCapture,
		updateMovementName,
	]);

	if (!activeMovementName) return null;
	if (!movementName) return null;
	if (isNullOrUndefined(forMovement)) return null;
	if (isNullOrUndefined(forCapture)) return null;
	if (isNullOrUndefined(range)) return null;
	if (isNullOrUndefined(offsetX)) return null;
	if (isNullOrUndefined(offsetY)) return null;

	function handleDeleteMovementButtonClick() {
		if (!activeMovementName) return;

		updateMovementToDelete(activeMovementName);
		openDeleteMovementAlert();
	}

	function handleBackClick() {
		updateCurrentMode("movementSelection");

		commitToDraft();
		syncMovementRulesDraftToDB();
		syncPieceRulesetDraftToDB();
	}

	function handleMovementNameInputChange(e: ChangeEvent<HTMLInputElement>) {
		updateMovementName(e.target.value);
		addMovementsEditorChanges({ movementName: e.target.value });
	}

	function handleForMovementInputChange(checked: boolean) {
		toggleForMovement();
		addMovementsEditorChanges({ forMovement: checked });
	}

	function handleForCaptureInputChange(checked: boolean) {
		toggleForCapture();
		addMovementsEditorChanges({ forCapture: checked });
	}

	function handleRangeInputChange(e: ChangeEvent<HTMLInputElement>) {
		const newRange = e.target.valueAsNumber;
		if (Number.isNaN(newRange)) return;
		if (!Number.isFinite(newRange)) return;

		updateRange(newRange);
		previousRangeInputRef.current = newRange;
		addMovementsEditorChanges({ range: newRange });
	}

	function handleUnlimitedRangeInputChange(checked: boolean) {
		updateRange(checked ? "inf" : (previousRangeInputRef.current ?? 1));
		addMovementsEditorChanges({
			range: checked ? "inf" : (previousRangeInputRef.current ?? 1),
		});
	}

	function handleOffsetXInputChange(e: ChangeEvent<HTMLInputElement>) {
		const newOffsetX = e.target.valueAsNumber;
		if (Number.isNaN(newOffsetX)) return;
		if (!Number.isFinite(newOffsetX)) return;

		updateOffsetX(newOffsetX);
		addMovementsEditorChanges({ offsetX: newOffsetX });
	}

	function handleOffsetYInputChange(e: ChangeEvent<HTMLInputElement>) {
		const newOffsetY = e.target.valueAsNumber;
		if (Number.isNaN(newOffsetY)) return;
		if (!Number.isFinite(newOffsetY)) return;

		updateOffsetY(newOffsetY);
		addMovementsEditorChanges({ offsetY: newOffsetY });
	}

	function handleMovementNameInputBlur() {
		commitToDraft(["movementName"]);
	}

	function handleForMovementInputBlur() {
		commitToDraft(["forMovement"]);
	}

	function handleForCaptureInputBlur() {
		commitToDraft(["forCapture"]);
	}

	function handleRangeInputBlur() {
		commitToDraft(["range"]);
	}

	function handleOffsetXInputBlur() {
		commitToDraft(["offsetX"]);
	}

	function handleOffsetYInputBlur() {
		commitToDraft(["offsetY"]);
	}

	function handleUnlimitedRangeInputBlur() {
		commitToDraft(["range"]);
	}

	return (
		<>
			<>
				<SheetHeader>
					<div className="flex flex-row gap-2 items-center">
						<Button
							className="p-0 hover:bg-(--sidebar-primary-hover)"
							variant="ghost"
							onClick={handleBackClick}
						>
							<IconChevronLeft className="size-5" />
						</Button>

						<SheetTitle>Movement editor</SheetTitle>
					</div>

					<SheetDescription>
						You are currently editing the movement rule "
						{activeMovementName}". Click on the back arrow to change
						your selection.
					</SheetDescription>
				</SheetHeader>

				<div className="px-4 flex flex-col gap-4">
					<FieldSet>
						<FieldLegend>Basic information</FieldLegend>
						<Field
							className="grid grid-cols-2 items-center"
							orientation="horizontal"
						>
							<FieldLabel htmlFor="movementNameInput">
								Name
							</FieldLabel>
							<Input
								className="bg-background"
								id="movementNameInput"
								type="text"
								placeholder="Movement name"
								value={movementName}
								onChange={handleMovementNameInputChange}
								onBlur={handleMovementNameInputBlur}
							/>
						</Field>
					</FieldSet>

					<FieldSet>
						<FieldLegend>Allowed move types</FieldLegend>

						<div className="flex flex-col gap-2">
							<Field orientation="horizontal">
								<Checkbox
									className="bg-background"
									id="isMovementAllowed"
									checked={forMovement ?? false}
									onCheckedChange={
										handleForMovementInputChange
									}
									onBlur={handleForMovementInputBlur}
								/>
								<FieldLabel htmlFor="isMovementAllowed">
									Movement
								</FieldLabel>
							</Field>
							<Field orientation="horizontal">
								<Checkbox
									className="bg-background"
									id="isCaptureAllowed"
									checked={forCapture ?? false}
									onCheckedChange={
										handleForCaptureInputChange
									}
									onBlur={handleForCaptureInputBlur}
								/>
								<FieldLabel htmlFor="isCaptureAllowed">
									Capture
								</FieldLabel>
							</Field>
						</div>
					</FieldSet>

					<FieldSet>
						<div className="grid grid-cols-[2fr_1fr_1fr] gap-2 items-center">
							<FieldLegend className="mb-0">Move definition</FieldLegend>
							<span>X</span>
							<span>Y</span>
							<span>Vector</span>
							<Input
								type="number"
								value={offsetX}
								onChange={handleOffsetXInputChange}
								onBlur={handleOffsetXInputBlur}
								className="bg-background"
							/>
							<Input
								type="number"
								value={offsetY}
								onChange={handleOffsetYInputChange}
								onBlur={handleOffsetYInputBlur}
								className="bg-background"
							/>
						</div>

						<FieldSet className="gap-2">
							<FieldLegend className="data-[variant=legend]:text-sm">
								Range settings
							</FieldLegend>
							<Field
								className="grid grid-cols-2 items-center"
								orientation="horizontal"
							>
								<FieldLabel htmlFor="movementRangeInput">
									Range
								</FieldLabel>
								<Input
									className="bg-background"
									id="movementRangeInput"
									type="number"
									placeholder="Range"
									value={range === "inf" ? "" : range}
									onChange={handleRangeInputChange}
									disabled={range === "inf"}
									aria-disabled={range === "inf"}
									onBlur={handleRangeInputBlur}
								/>
							</Field>

							<Field orientation="horizontal">
								<Checkbox
									className="bg-background"
									id="hasUnlimitedRange"
									checked={range === "inf"}
									onCheckedChange={
										handleUnlimitedRangeInputChange
									}
									onBlur={handleUnlimitedRangeInputBlur}
								/>
								<FieldLabel htmlFor="hasUnlimitedRange">
									Unlimited
								</FieldLabel>
							</Field>
						</FieldSet>
					</FieldSet>
				</div>

				<SheetFooter>
					<Button
						onClick={handleDeleteMovementButtonClick}
						variant="destructive"
					>
						Delete movement
					</Button>
				</SheetFooter>
			</>

			<MovementDeletionAlert />
		</>
	);
}
