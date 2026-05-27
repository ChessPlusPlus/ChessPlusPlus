import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import useSidebarStore from "@/features/variants/variantEditor/common/stores/sidebar";
import { IconLogin2, IconLogout2 } from "@tabler/icons-react";

function JSONOptionsMenu() {
	const { currentOpenMenu, updateCurrentOpenMenu, clearCurrentOpenMenu } = useSidebarStore();
	
	return (
		<DropdownMenu open={currentOpenMenu === "jsonOptions"} onOpenChange={(open) => {
			if (open) {
				updateCurrentOpenMenu("jsonOptions");
			} else {
				clearCurrentOpenMenu();
			}
		}}>
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