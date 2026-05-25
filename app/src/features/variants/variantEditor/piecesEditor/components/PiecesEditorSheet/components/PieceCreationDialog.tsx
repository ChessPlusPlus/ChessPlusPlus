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
import { IconUpload } from "@tabler/icons-react";
import { useRef, type ChangeEvent } from "react";

function PieceCreationDialog() {
	const {
		isPieceCreationDialogOpen,
		openPieceCreationDialog,
		closePieceCreationDialog,
		pieceName,
		updatePieceName,
		updatePieceImage,
		updatePieceNameErrors,
		pieceNameErrors,
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

	function handlePieceImageInputChange(e: ChangeEvent<HTMLInputElement>) {
		if (!e.target.files) return;

		const file = e.target.files[0];
		if (!file) return;
		
		updatePieceImage(file);
	};
	
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
					<FieldLabel htmlFor="pieceImageInput">Piece image</FieldLabel>
					<Button
						onClick={handleUploadImageButtonClick}
						variant="outline"
						className="w-full flex flex-col h-max p-4"
					>
						<IconUpload className="size-8" />
						Upload image
					</Button>
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
					<Button onClick={handlePieceCreation} className="px-4">
						Create
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default PieceCreationDialog;
