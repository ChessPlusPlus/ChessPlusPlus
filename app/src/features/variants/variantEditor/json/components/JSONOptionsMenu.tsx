import {
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import ExportJSONDialog from "@/features/variants/variantEditor/json/components/ExportJSONDialog";
import useExportJSONDialogStore from "@/features/variants/variantEditor/json/stores/exportJSONDialog";
import { IconFileExport, IconFileImport } from "@tabler/icons-react";

function JSONOptionsMenu() {
	const { openExportJSONDialog } = useExportJSONDialogStore();

	return (
		<>
			<DropdownMenuContent
				side="left"
				sideOffset={8}
				className="w-max p-2"
			>
				<DropdownMenuItem>
					<IconFileImport className="size-4" />
					Import JSON
				</DropdownMenuItem>
				<DropdownMenuItem onClick={openExportJSONDialog}>
					<IconFileExport className="size-4" />
					Export JSON
				</DropdownMenuItem>
			</DropdownMenuContent>

			<ExportJSONDialog />
		</>
	);
}

export default JSONOptionsMenu;
