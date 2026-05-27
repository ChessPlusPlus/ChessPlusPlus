import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import useExportJSONDialogStore from "@/features/variants/variantEditor/json/stores/exportJSONDialog";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";

function ExportJSONDialog() {
	const {
		isExportJSONDialogOpen,
		openExportJSONDialog,
		closeExportJSONDialog,

		fileName,
		updateFileName,

		exportCasing,
		updateExportCasing,
	} = useExportJSONDialogStore();

	return (
		<Dialog
			open={isExportJSONDialogOpen}
			onOpenChange={(open) => {
				if (open) {
					openExportJSONDialog();
				} else {
					closeExportJSONDialog();
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
					/>
				</Field>

				<Field>
					<FieldLabel>Casing</FieldLabel>
					<Select
						value={exportCasing}
						onValueChange={(value) => updateExportCasing(value as "camel" | "snake")}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select casing" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="camel">Camel case</SelectItem>
							<SelectItem value="snake">Snake case</SelectItem>
						</SelectContent>
					</Select>
				</Field>
			</DialogContent>
		</Dialog>
	);
}

export default ExportJSONDialog;