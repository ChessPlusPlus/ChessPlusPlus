import {
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import ExportJSONDialog from "@/features/variants/variantEditor/json/components/ExportJSONDialog";
import ImportJSONDialog from "@/features/variants/variantEditor/json/components/ImportJSONDialog";
import useExportJSONDialogStore from "@/features/variants/variantEditor/json/stores/exportJSONDialog";
import useImportJSONDialogStore from "@/features/variants/variantEditor/json/stores/importJSONDialog";
import { IconFileExport, IconFileImport } from "@tabler/icons-react";

function JSONOptionsMenu() {
	const { openExportJSONDialog } = useExportJSONDialogStore();
	const { openImportJSONDialog } = useImportJSONDialogStore();

	return (
		<>
			<DropdownMenuContent
				side="left"
				sideOffset={8}
				className="w-max p-2"
			>
				<DropdownMenuItem onClick={openImportJSONDialog}>
					<IconFileImport className="size-4" />
					Import JSON
				</DropdownMenuItem>
				<DropdownMenuItem onClick={openExportJSONDialog}>
					<IconFileExport className="size-4" />
					Export JSON
				</DropdownMenuItem>
			</DropdownMenuContent>

			<ExportJSONDialog />
			<ImportJSONDialog />
		</>
	);
}

export default JSONOptionsMenu;
