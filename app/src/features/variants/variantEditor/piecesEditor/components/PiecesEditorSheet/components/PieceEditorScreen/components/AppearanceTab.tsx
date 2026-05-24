import usePiecesEditorStore from "@/features/variants/variantEditor/piecesEditor/stores/piecesEditor";
import { useRef, type ChangeEvent } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconUpload } from "@tabler/icons-react";
import { TabsContent } from "@/components/ui/tabs";
import usePieceImagesStore from "@/features/variants/common/stores/pieceImages";
import useVariantDraftStore from "@/features/variants/variantEditor/common/stores/variantDraft";
import { isNullOrUndefined } from "@/shared/utils/typeChecks";

export function AppearanceTab() {
	const { pieceName, updatePieceName, pieceImageId, addPieceEditorChanges, commitToDraft } = usePiecesEditorStore();
	const { images, updateImageForVariantId } = usePieceImagesStore();
	const { currentVariantId } = useVariantDraftStore();
	const fileUploadInputRef = useRef<HTMLInputElement>(null);

	if (isNullOrUndefined(pieceName)) return null;
	if (!images) return null;
	
	function getPieceImageToDisplay() {
		if (!pieceImageId) return;
		if (!currentVariantId) return;

		return images[pieceImageId][currentVariantId] ?? images[pieceImageId].image 
	}

	function handlePieceNameInputChange(e: ChangeEvent<HTMLInputElement>) {
		updatePieceName(e.target.value);
		addPieceEditorChanges({ pieceName: e.target.value });
	}

	function handlePieceNameInputBlur() {
		commitToDraft(["pieceName"]);
	}
	
	function handleUploadImageButtonClick() {
		if (!fileUploadInputRef.current) return;

		fileUploadInputRef.current.click();
	}

	function handleFileUploadInputChange(e: ChangeEvent<HTMLInputElement>) {
		if (!e.target.files) return;

		const file = e.target.files[0];
		if (!file) return;

		if (!pieceImageId) return;
		if (!currentVariantId) return;

		updateImageForVariantId(pieceImageId, currentVariantId, file);
	}

	return (
		<TabsContent className="flex flex-col gap-4" value="appearance">
			<Field className="grid grid-cols-2 gap-4">
				<FieldLabel htmlFor="pieceNameInput">Piece name</FieldLabel>
				<Input
					id="pieceNameInput"
					type="text"
					placeholder="Piece name"
					className="bg-background"
					value={pieceName}
					onChange={handlePieceNameInputChange}
					onBlur={handlePieceNameInputBlur}
				/>
			</Field>

			<div className="grid grid-cols-2 gap-4">
				<p>Piece image</p>
				<Button
					data-icon="inline-start"
					variant="outline"
					onClick={handleUploadImageButtonClick}
				>
					<IconUpload className="size-5" />
					<span>Upload image</span>
				</Button>

				<Input
					accept="image/*"
					type="file"
					ref={fileUploadInputRef}
					className="hidden"
					onChange={handleFileUploadInputChange}
				/>
			</div>

			{pieceImageId && (
				<div className="flex items-center justify-center">
					<img
						src={URL.createObjectURL(getPieceImageToDisplay()!)}
						alt={pieceName}
						className="w-1/2 select-none"
					/>
				</div>
			)}
		</TabsContent>
	);
}
