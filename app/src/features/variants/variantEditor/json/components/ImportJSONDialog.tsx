import _ from "lodash";

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
import { validateJSON } from "@/features/variants/variantEditor/json/services/jsonValidation";
import useImportJSONDialogStore from "@/features/variants/variantEditor/json/stores/importJSONDialog";
import { readJSONFromBlob } from "@/features/variants/variantEditor/json/utils/jsonReader";
import useVariantsStore from "@/features/variants/common/stores/variantsStore";
import {
	IconBraces,
	IconFileUpload,
	IconPencil,
	IconTrash,
} from "@tabler/icons-react";
import { useRef, type ChangeEvent } from "react";
import { serialiseJSONForImport } from "@/features/variants/variantEditor/json/utils/importSerialiser";
import usePieceImagesStore from "@/features/variants/common/stores/pieceImages";
import { defaultPieceImages } from "@/features/variants/variantCreation/constants/defaultPieceImages";
import { useNavigate } from "react-router-dom";
import posthog from "posthog-js";
import { normaliseJSON } from "@/features/variants/variantEditor/json/services/jsonNormalisation";

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

		variantName,
		updateVariantName,
		clearVariantName,
		variantNameErrors,
		updateVariantNameErrors,
		clearVariantNameErrors,
	} = useImportJSONDialogStore();

	const { variants, createVariant } = useVariantsStore();
	const {
		images,
		defaultImagesCreated,
		markAsDefaultImagesCreated,
		updateImages,
	} = usePieceImagesStore();

	const navigate = useNavigate();

	const jsonFileInputRef = useRef<HTMLInputElement>(null);

	async function handleImportJSON(shouldOpen: boolean) {
		if (!jsonFile) return;

		const trimmedVariantName = variantName.trim();
		if (trimmedVariantName === "") {
			updateVariantNameErrors(["Variant name cannot be empty"]);
			return;
		}

		const createdVariants = Object.entries(variants).map(
			([, variantInfo]) => variantInfo.variantName.trim(),
		);

		if (createdVariants.includes(trimmedVariantName)) {
			updateVariantNameErrors(["Variant name already exists"]);
			return;
		}

		clearVariantNameErrors();

		let jsonToUse: Record<string, unknown> | null = null;

		const json = await readJSONFromBlob(jsonFile);
		if (!json) return;

		const initialValidationStatus = await validateJSON(json);
		if (initialValidationStatus?.validationStatus) {
			jsonToUse = structuredClone(json);
		} else {
			const normalisedJSON = (await normaliseJSON(json))?.normalisedJSON;
			if (!normalisedJSON) return;

			jsonToUse = structuredClone(normalisedJSON);

			const validationResponse = await validateJSON(normalisedJSON);
			if (!validationResponse) return;

			const isJsonValid = validationResponse.validationStatus;
			if (!isJsonValid) {
				updateJsonFileErrors([validationResponse.validationMessage]);
				return;
			}
		}

		clearJsonFileErrors();

		const serialisedVariantRules = serialiseJSONForImport(
			jsonToUse! as Record<string, Record<string, unknown>>,
		);

		const variantId = createVariant({
			variantName: trimmedVariantName,
			variantRules: serialisedVariantRules,
		});

		if (!_.isEqual(images, defaultPieceImages) || !defaultImagesCreated) {
			updateImages(defaultPieceImages);
			markAsDefaultImagesCreated();
		}

		closeImportJSONDialog();
		clearJsonFile();
		clearJsonFileName();
		clearJsonFileErrors();
		clearVariantName();
		clearVariantNameErrors();

		posthog.capture("variant_created", {
			creation_method: "json_import",
		});

		if (shouldOpen) {
			posthog.capture("variant_opened", {
				source: "post_json_import",
			});
			navigate(`/variants/${variantId}`);
		}
	}

	function handleJSONFileInputChange(e: ChangeEvent<HTMLInputElement>) {
		if (!e.target.files) return;
		const file = e.target.files[0];
		if (!file) return;

		updateJsonFile(file);
		updateJsonFileName(file.name);
		clearJsonFileErrors();

		if (!jsonFileInputRef.current) return;
		jsonFileInputRef.current.value = "";
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
					clearJsonFileErrors();
					clearJsonFile();
					clearJsonFileName();
					clearVariantName();
					clearVariantNameErrors();
				}
			}}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Import JSON</DialogTitle>
					<DialogDescription>
						Create a variant from a JSON file configuration.
					</DialogDescription>
				</DialogHeader>

				<Field>
					<FieldLabel>Variant Name</FieldLabel>
					<Input
						type="text"
						value={variantName}
						onChange={(e) => updateVariantName(e.target.value)}
						data-invalid={variantNameErrors.length > 0}
						aria-invalid={variantNameErrors.length > 0}
					/>
					<FieldError
						errors={variantNameErrors.map((error) => ({
							message: error,
						}))}
					/>
				</Field>

				<Field>
					<FieldLabel>JSON File</FieldLabel>

					{jsonFile ? (
						<div
							data-invalid={jsonFileErrors.length > 0}
							aria-invalid={jsonFileErrors.length > 0}
							className="grid grid-cols-[2fr_24fr_2fr] items-center bg-muted p-2 rounded-md aria-invalid:ring-3 aria-invalid:ring-destructive/20"
						>
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

								<Button
									onClick={handleJSONFileDelete}
									size="icon-xs"
									variant="ghost"
									data-icon="inline-start"
								>
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

					<FieldError
						errors={jsonFileErrors.map((error) => ({
							message: error,
						}))}
					/>
				</Field>

				<DialogFooter>
					<Button
						disabled={variantName === "" || !jsonFile}
						className="px-4"
						onClick={() => handleImportJSON(true)}
					>
						Import and open
					</Button>
					<Button
						variant="outline"
						disabled={variantName === "" || !jsonFile}
						className="px-4"
						onClick={() => handleImportJSON(false)}
					>
						Import
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default ImportJSONDialog;
