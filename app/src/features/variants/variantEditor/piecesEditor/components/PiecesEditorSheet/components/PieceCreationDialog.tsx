import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import useVariantDraftStore from "@/features/variants/variantEditor/common/stores/variantDraft";
import usePieceCreationDialogStore from "@/features/variants/variantEditor/piecesEditor/stores/pieceCreationDialog";
import { IconPencil, IconTrash, IconUpload } from "@tabler/icons-react";
import { useRef, type ChangeEvent } from "react";

function PieceCreationDialog() {
	const {
		isPieceCreationDialogOpen,
		openPieceCreationDialog,
		closePieceCreationDialog,
		pieceName,
		updatePieceName,
		updatePieceNameErrors,
		pieceNameErrors,

		pieceImage,
		updatePieceImage,
		clearPieceImage,
	} = usePieceCreationDialogStore();

	const {
		pieceRulesetDraft,
		updatePieceRulesetDraft,
		syncPieceRulesetDraftToDB,
	} = useVariantDraftStore();

	const pieceImageInputRef = useRef<HTMLInputElement>(null);

	if (!pieceRulesetDraft) return null;

	function handlePieceNameInputChange(e: ChangeEvent<HTMLInputElement>) {
		updatePieceName(e.target.value);
	}

	function handlePieceCreation() {
		if (!pieceRulesetDraft) return;

		if (pieceName.trim() === "") {
			updatePieceNameErrors(["Piece name is required"]);
			return;
		}

		if (Object.keys(pieceRulesetDraft).includes(pieceName.trim())) {
			updatePieceNameErrors(["Piece name already exists"]);
			return;
		}

		const updatedPieceRulesetDraft = structuredClone(pieceRulesetDraft);
		updatedPieceRulesetDraft[pieceName.trim()] = {
			moveset: [],
		};

		updatePieceRulesetDraft(updatedPieceRulesetDraft);
		syncPieceRulesetDraftToDB();

		closePieceCreationDialog();
	}

	function handleUploadImageButtonClick() {
		pieceImageInputRef.current?.click();
	}

	function handleRemoveImageButtonClick() {
		clearPieceImage();
		
		if (!pieceImageInputRef.current) return;
	}

	function handleEditImageButtonClick() {
		pieceImageInputRef.current?.click();
	}

	function handlePieceImageInputChange(e: ChangeEvent<HTMLInputElement>) {
		console.log("On change")

		if (!e.target.files) return;

		const file = e.target.files[0];
		if (!file) return;

		updatePieceImage(file);
		
		if (!pieceImageInputRef.current) return;
		pieceImageInputRef.current.value = "";
	}

	return (
		<Dialog
			open={isPieceCreationDialogOpen}
			onOpenChange={(open) =>
				open ? openPieceCreationDialog() : closePieceCreationDialog()
			}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create piece</DialogTitle>
				</DialogHeader>

				<Field>
					<FieldLabel htmlFor="pieceNameInput">Piece name</FieldLabel>
					<Input
						id="pieceNameInput"
						type="text"
						placeholder="Enter piece name"
						value={pieceName}
						onChange={handlePieceNameInputChange}
						data-invalid={pieceNameErrors.length > 0}
						aria-invalid={pieceNameErrors.length > 0}
					/>
					<FieldError
						errors={pieceNameErrors.map((errorMessage) => ({
							message: errorMessage,
						}))}
					/>
				</Field>

				<Field>
					<FieldLabel htmlFor="pieceImageInput">
						Piece image
					</FieldLabel>

					{pieceImage ? (
						<div className="flex flex-col gap-4">
							<div className="w-full flex flex-col items-center justify-center h-max p-4">
								<img
									className="size-16"
									src={URL.createObjectURL(pieceImage)}
									alt="Piece image"
								/>
							</div>
							<div className="w-full grid grid-cols-2 gap-2">
								<Button variant="destructive" data-icon="inline-start" onClick={handleRemoveImageButtonClick}>
									<IconTrash className="size-4" />
									Remove image
								</Button>
								<Button variant="outline" data-icon="inline-start" onClick={handleEditImageButtonClick}>
									<IconPencil className="size-4" />
									Edit image
								</Button>
							</div>
						</div>
					) : (
						<Button
							onClick={handleUploadImageButtonClick}
							variant="outline"
							className="w-full flex flex-col h-max p-4"
						>
							<IconUpload className="size-8" />
							Upload image
						</Button>
					)}

					<Input
						ref={pieceImageInputRef}
						onChange={handlePieceImageInputChange}
						id="pieceImageInput"
						type="file"
						accept="image/*"
						className="hidden"
					/>
				</Field>

				<DialogFooter>
					<Button disabled={!pieceImage || pieceName.trim() === ""} onClick={handlePieceCreation} className="w-full -mt-2">
						Create
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default PieceCreationDialog;
