import { Button } from "@/components/ui/button";
import {
	DialogDescription,
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { validateJSON } from "@/features/test/services/jsonValidatorTest";
import useImportJSONDialogStore from "@/features/variants/variantEditor/json/stores/importJSONDialog";
import { readJSONFromBlob } from "@/features/variants/variantEditor/json/utils/jsonReader";
import { IconBraces, IconFileUpload, IconPencil, IconTrash } from "@tabler/icons-react";
import { useRef, type ChangeEvent } from "react";

function ImportJSONDialog() {
	const {
		isImportJSONDialogOpen,
		openImportJSONDialog,
		closeImportJSONDialog,

		jsonFile,
		updateJsonFile,
		clearJsonFile,

		jsonFileName,
		updateJsonFileName,
		clearJsonFileName,
		updateJsonFileErrors,
		clearJsonFileErrors,
		jsonFileErrors,
	} = useImportJSONDialogStore();

	const jsonFileInputRef = useRef<HTMLInputElement>(null);

	async function handleImportJSON() {
		if (!jsonFile) return;

		const json = await readJSONFromBlob(jsonFile);
		if (!json) return;

		const validationResponse = await validateJSON(json);
		if (!validationResponse) return;

		const isJsonValid = validationResponse.validation_status[0];
		if (!isJsonValid) {
			updateJsonFileErrors([validationResponse.validation_status[1]]);
		};
	}

	function handleJSONFileInputChange(e: ChangeEvent<HTMLInputElement>) {
		if (!e.target.files) return;
		const file = e.target.files[0];
		if (!file) return;

		updateJsonFile(file);
		updateJsonFileName(file.name);
	}

	function handleJSONFileEdit() {
		jsonFileInputRef.current?.click();
	}

	function handleJSONFileDelete() {
		clearJsonFile();
		clearJsonFileName();
		clearJsonFileErrors();
	}

	return (
		<Dialog
			open={isImportJSONDialogOpen}
			onOpenChange={(open) => {
				if (open) {
					openImportJSONDialog();
				} else {
					closeImportJSONDialog();
				}
			}}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Import JSON</DialogTitle>
					<DialogDescription>
						Import a JSON file to the current variant.
					</DialogDescription>
				</DialogHeader>

				<Field>
					<FieldLabel>JSON File</FieldLabel>

					{jsonFile ? (
						<div className="grid grid-cols-[2fr_24fr_2fr] items-center bg-muted p-2 rounded-md">
							<IconBraces className="size-4" />
							<span>{jsonFileName}</span>

							<div className="flex flex-row gap-2">
								<Button
									onClick={handleJSONFileEdit}
									variant="ghost"
									data-icon="inline-start"
									size="icon-xs"
								>
									<IconPencil className="size-4" />
								</Button>

								<Button onClick={handleJSONFileDelete} size="icon-xs" variant="ghost" data-icon="inline-start">
									<IconTrash className="size-4 stroke-destructive" />
								</Button>
							</div>
						</div>
					) : (
						<Button
							className="w-full h-max p-4 flex flex-col gap-2"
							variant="outline"
							data-icon="inline-start"
							onClick={() => jsonFileInputRef.current?.click()}
						>
							<IconFileUpload className="size-8" />
							Upload JSON File
						</Button>
					)}

					<Input
						type="file"
						accept=".json"
						ref={jsonFileInputRef}
						onChange={handleJSONFileInputChange}
						className="hidden"
					/>

					<FieldError errors={jsonFileErrors.map((error) => ({ message: error }))} />
				</Field>

				<DialogFooter>
					<Button className="w-full" onClick={handleImportJSON}>
						Import
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default ImportJSONDialog;
