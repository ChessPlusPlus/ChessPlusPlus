import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { IconLogin2, IconLogout2 } from "@tabler/icons-react";

function JSONOptionsMenu() {
	return (
		<DropdownMenu>
			<DropdownMenuContent>
				<DropdownMenuItem>
					<IconLogin2 />
					Import JSON
				</DropdownMenuItem>
				<DropdownMenuItem>
					<IconLogout2 />
					Export JSON
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default JSONOptionsMenu;