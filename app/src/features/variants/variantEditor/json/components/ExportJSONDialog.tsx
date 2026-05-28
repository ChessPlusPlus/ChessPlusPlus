import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import useExportJSONDialogStore from "@/features/variants/variantEditor/json/stores/exportJSONDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useVariantsStore from "@/features/variants/common/stores/variantsStore";
import useVariantDraftStore from "@/features/variants/variantEditor/common/stores/variantDraft";
import { serialiseJSONForExport } from "@/features/variants/variantEditor/json/utils/exportSerialiser";
import isValidFileName from "valid-filename";

function ExportJSONDialog() {
	const {
		isExportJSONDialogOpen,
		openExportJSONDialog,
		closeExportJSONDialog,

		fileName,
		updateFileName,
		clearFileName,

		fileNameErrors,
		updateFileNameErrors,
		clearFileNameErrors,
	} = useExportJSONDialogStore();

	const { currentVariantId } = useVariantDraftStore();
	const { variants } = useVariantsStore();

	function handleExportJSON() {
		if (!currentVariantId) return;

		const variant = variants[currentVariantId];
		if (!variant) return;

		const trimmedFileName = fileName.trim();

		if (trimmedFileName === "") {
			updateFileNameErrors(["File name cannot be empty"]);
			return;
		}

		if (!isValidFileName(trimmedFileName)) {
			updateFileNameErrors(["File name contains invalid characters"]);
			return;
		}

		const json = JSON.stringify(serialiseJSONForExport(variant), null, 2);
		const exportedFileName = `${trimmedFileName}.json`;

		const blob = new Blob([json], { type: "application/json" });
		const objectUrl = URL.createObjectURL(blob);

		const a = document.createElement("a");
		a.href = objectUrl;
		a.download = exportedFileName;

		a.click();
		a.remove();
		URL.revokeObjectURL(objectUrl);

		closeExportJSONDialog();
		clearFileNameErrors();
		clearFileName();
	}

	return (
		<Dialog
			open={isExportJSONDialogOpen}
			onOpenChange={(open) => {
				if (open) {
					openExportJSONDialog();
				} else {
					closeExportJSONDialog();
					clearFileNameErrors();
					clearFileName();
				}
			}}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Export JSON</DialogTitle>
					<DialogDescription>
						Export the current variant as a JSON file.
					</DialogDescription>
				</DialogHeader>

				<Field>
					<FieldLabel htmlFor="fileNameInput">File name</FieldLabel>
					<Input
						id="fileNameInput"
						type="text"
						value={fileName}
						onChange={(e) => updateFileName(e.target.value)}
						data-invalid={fileNameErrors.length > 0}
						aria-invalid={fileNameErrors.length > 0}
					/>
					<FieldError errors={fileNameErrors.map((error) => ({ message: error }))} />
				</Field>

				<DialogFooter>
					<Button className="w-full" onClick={handleExportJSON} disabled={fileName === ""}>Export</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default ExportJSONDialog;
