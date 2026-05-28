import ChessboardGridIcon from "@/features/variants/common/icons/ChessboardGridIcon";
import { ChessKnightIcon } from "lucide-react";
import { IconArrowsMove, IconBraces } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import useVariantDraftStore from "@/features/variants/variantEditor/common/stores/variantDraft";
import MovementsEditorSheet from "@/features/variants/variantEditor/movementsEditor/components/MovementsEditorSheet/MovementsEditorSheet";
import useSidebarStore from "@/features/variants/variantEditor/common/stores/sidebar";
import PiecesEditorSheet from "@/features/variants/variantEditor/piecesEditor/components/PiecesEditorSheet/PiecesEditorSheet";
import { useNavigate } from "react-router-dom";
import JSONOptionsMenu from "@/features/variants/variantEditor/json/components/JSONOptionsMenu";
import {
	DropdownMenu,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Sidebar() {
	const { updateCurrentOpenMenu, clearCurrentOpenMenu, currentOpenMenu } =
		useSidebarStore();

	const { currentVariantId } = useVariantDraftStore();

	const navigate = useNavigate();

	function handleBoardSettingsButtonClick() {
		if (!currentVariantId) return;
		navigate(`/variants/${currentVariantId}/setup`);
	}

	return (
		<>
			<div className="flex flex-col gap-4 items-center absolute right-0 top-0 h-screen bg-sidebar-primary-foreground p-3">
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							onClick={handleBoardSettingsButtonClick}
							variant="ghost"
							className="p-1 hover:bg-(--sidebar-primary-hover)"
							aria-label="Board settings"
						>
							<ChessboardGridIcon className="size-5" />
						</Button>
					</TooltipTrigger>

					<TooltipContent side="left" sideOffset={8}>
						Board settings
					</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							className="p-1 hover:bg-(--sidebar-primary-hover)"
							aria-label="Pieces"
							onClick={() => updateCurrentOpenMenu("pieces")}
						>
							<ChessKnightIcon
								strokeWidth={1.5}
								className="size-6"
							/>
						</Button>
					</TooltipTrigger>
					<TooltipContent side="left" sideOffset={8}>
						Pieces
					</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							className="p-1 hover:bg-(--sidebar-primary-hover)"
							aria-label="Movements"
							onClick={() => updateCurrentOpenMenu("movements")}
						>
							<IconArrowsMove
								strokeWidth={1.5}
								className="size-6"
							/>
						</Button>
					</TooltipTrigger>
					<TooltipContent side="left" sideOffset={8}>
						Movements
					</TooltipContent>
				</Tooltip>

				<DropdownMenu
					open={currentOpenMenu === "jsonOptions"}
					onOpenChange={(open) => {
						if (open) {
							updateCurrentOpenMenu("jsonOptions");
						} else {
							clearCurrentOpenMenu();
						}
					}}
				>
					<Tooltip>
						<TooltipTrigger asChild>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="p-1 hover:bg-(--sidebar-primary-hover) aria-expanded:bg-sidebar-primary-muted"
									aria-label="JSON options"
									onClick={() =>
										updateCurrentOpenMenu("jsonOptions")
									}
								>
									<IconBraces
										strokeWidth={1.5}
										className="size-6"
									/>
								</Button>
							</DropdownMenuTrigger>
						</TooltipTrigger>

						<TooltipContent side="left" sideOffset={8}>
							JSON options
						</TooltipContent>
					</Tooltip>

					<JSONOptionsMenu />
				</DropdownMenu>
			</div>

			<MovementsEditorSheet />
			<PiecesEditorSheet />
		</>
	);
}

export default Sidebar;
