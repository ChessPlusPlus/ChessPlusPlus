import { Button } from "@/components/ui/button";
import {
	DialogDescription,
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import useImportJSONDialogStore from "@/features/variants/variantEditor/json/stores/importJSONDialog";
import { IconBraces, IconFileUpload, IconPencil, IconTrash } from "@tabler/icons-react";
import { useRef, type ChangeEvent } from "react";

function ImportJSONDialog() {
	const {
		isImportJSONDialogOpen,
		openImportJSONDialog,
		closeImportJSONDialog,

		jsonFile,
		updateJsonFile,

		jsonFileName,
		updateJsonFileName,
	} = useImportJSONDialogStore();

	const jsonFileInputRef = useRef<HTMLInputElement>(null);

	function handleImportJSON() {}

	function handleJSONFileInputChange(e: ChangeEvent<HTMLInputElement>) {
		if (!e.target.files) return;
		const file = e.target.files[0];
		if (!file) return;

		updateJsonFile(file);
		updateJsonFileName(file.name);
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
									variant="ghost"
									data-icon="inline-start"
									size="icon-xs"
								>
									<IconPencil className="size-4" />
								</Button>

								<Button size="icon-xs" variant="ghost" data-icon="inline-start">
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
