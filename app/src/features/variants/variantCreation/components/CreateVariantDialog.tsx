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
import type { VariantInfo } from "@/features/variants/common/types/variants";
import { defaultVariantRules } from "@/features/variants/variantCreation/constants/newVariantDefaults";
import { defaultPieceImages } from "@/features/variants/variantCreation/constants/defaultPieceImages";
import usePieceImagesStore from "@/features/variants/common/stores/pieceImages";
import { useNavigate } from "react-router-dom";

function CreateVariantDialog() {
	const {
		isOpen,
		openDialog,
		closeDialog,
		variantName,
		updateVariantName,
		clearVariantName,
	} = useCreateVariantDialogStore();

	const { createVariant, hasHydrated } = useVariantsStore();
	const { defaultImagesCreated, markAsDefaultImagesCreated, updateImages } =
		usePieceImagesStore();

	const navigate = useNavigate();

	if (!hasHydrated) return null;

	function handleVariantNameOnChange(e: ChangeEvent<HTMLInputElement>) {
		updateVariantName((e.target as HTMLInputElement).value);
	}

	function handleCreateVariantFormSubmit(e: SyntheticEvent<HTMLFormElement>) {
		e.preventDefault();

		const submitter = (e.nativeEvent as SubmitEvent)
			.submitter as HTMLButtonElement | null;
		const submitAction = submitter?.value ?? "create-and-open";

		const clonedRules = structuredClone(defaultVariantRules);

		const defaultVariant: VariantInfo = {
			variantName: variantName,
			variantRules: clonedRules,
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
					<div className="flex flex-col gap-2">
						<Label htmlFor="variantNameInput">Variant name</Label>
						<Input
							id="variantNameInput"
							type="text"
							placeholder="Variant name"
							onChange={handleVariantNameOnChange}
							value={variantName}
						/>
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
