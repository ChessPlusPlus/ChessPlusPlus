import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useCreateVariantDialogStore from "@/features/variants/variantCreation/stores/createVariantDialog";
import type { ChangeEvent, SyntheticEvent } from "react";
import { Label } from "@/components/ui/label";
import useVariantsStore from "@/features/variants/common/stores/variantsStore";
import type {
	VariantInfo,
	VariantRules,
} from "@/features/variants/common/types/variants";
import { defaultVariantRules } from "@/features/variants/variantCreation/constants/newVariantDefaults";
import { defaultPieceImages } from "@/features/variants/variantCreation/constants/defaultPieceImages";
import usePieceImagesStore from "@/features/variants/common/stores/pieceImages";
import { useNavigate } from "react-router-dom";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

function CreateVariantDialog() {
	const {
		isOpen,
		openDialog,
		closeDialog,
		variantName,
		updateVariantName,
		clearVariantName,
		templateType,
		updateTemplateType,
		variantNameErrors,
		updateVariantNameErrors,
		clearVariantNameErrors,
	} = useCreateVariantDialogStore();

	const { createVariant, hasHydrated, variants } = useVariantsStore();
	const { defaultImagesCreated, markAsDefaultImagesCreated, updateImages } =
		usePieceImagesStore();

	const navigate = useNavigate();

	if (!hasHydrated) return null;

	function handleVariantNameOnChange(e: ChangeEvent<HTMLInputElement>) {
		updateVariantName((e.target as HTMLInputElement).value);
	}

	function handleCreateVariantFormSubmit(e: SyntheticEvent<HTMLFormElement>) {
		e.preventDefault();

		if (variantName.trim() === "") {
			updateVariantNameErrors(["Variant name cannot be empty"]);
			return;
		}

		const createdVariants = Object.entries(variants).map(
			([, variantInfo]) => variantInfo.variantName.trim(),
		);

		if (createdVariants.includes(variantName.trim())) {
			updateVariantNameErrors(["Variant name already exists"]);
			return;
		}

		const submitter = (e.nativeEvent as SubmitEvent)
			.submitter as HTMLButtonElement | null;
		const submitAction = submitter?.value ?? "create-and-open";

		clearVariantNameErrors();

		const blankTemplateRules: VariantRules = {
			setupRules: {
				pieceOwnership: {},
				boardXSize: 8,
				boardYSize: 8,
				startingPosition: [],
			},

			pieceRuleset: {},
			movementRules: {},
		};

		const chessPresetRules = structuredClone(defaultVariantRules);

		const defaultVariant: VariantInfo = {
			variantName: variantName,
			variantRules:
				templateType === "start-from-scratch"
					? blankTemplateRules
					: chessPresetRules,
		};

		const variantId = createVariant(defaultVariant);

		clearVariantName();
		closeDialog();

		if (!defaultImagesCreated) {
			updateImages(defaultPieceImages);
			markAsDefaultImagesCreated();
		}

		if (submitAction === "create-and-open") {
			navigate(`/variants/${variantId}`);
		}
	}

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(open) => (open ? openDialog() : closeDialog())}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create variant</DialogTitle>
				</DialogHeader>

				<form
					onSubmit={handleCreateVariantFormSubmit}
					className="flex flex-col gap-4"
				>
					<Field className="flex flex-col gap-2">
						<FieldLabel htmlFor="variantNameInput">
							Variant name
						</FieldLabel>
						<Input
							id="variantNameInput"
							type="text"
							placeholder="Variant name"
							onChange={handleVariantNameOnChange}
							value={variantName}
						/>

						{variantNameErrors.length > 0 && (
							<FieldError
								errors={variantNameErrors.map((error) => ({
									message: error,
								}))}
							/>
						)}
					</Field>

					<div className="flex flex-col gap-2">
						<Label htmlFor="templateTypeSelect">
							Template type
						</Label>
						<Select
							value={templateType}
							onValueChange={updateTemplateType}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select template type" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="start-from-scratch">
									Start from scratch
								</SelectItem>
								<SelectItem value="chess-preset">
									Chess preset
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<DialogFooter>
						<Button
							type="submit"
							value="create-and-open"
							className="px-4"
						>
							Create and open
						</Button>
						<Button
							type="submit"
							value="create"
							className="px-4"
							variant="outline"
						>
							Create
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default CreateVariantDialog;
