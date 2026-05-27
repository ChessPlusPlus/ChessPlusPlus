import {
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { IconFileExport, IconFileImport } from "@tabler/icons-react";

function JSONOptionsMenu() {
	return (
		<DropdownMenuContent side="left" sideOffset={8} className="w-max">
			<DropdownMenuItem>
				<IconFileImport className="size-4" />
				Import JSON
			</DropdownMenuItem>
			<DropdownMenuItem>
				<IconFileExport className="size-4" />
				Export JSON
			</DropdownMenuItem>
		</DropdownMenuContent>
	);
}

export default JSONOptionsMenu;
