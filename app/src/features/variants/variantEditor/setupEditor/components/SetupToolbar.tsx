import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import useVariantDraftStore from "@/features/variants/variantEditor/common/stores/variantDraft";
import useSetupBoardStore from "@/features/variants/variantEditor/setupEditor/stores/setupBoard";
import { IconRepeat, IconTrash } from "@tabler/icons-react";

function SetupToolbar() {
	const { setupRulesDraft, updateSetupRulesDraft, syncSetupRulesDraftToDB } =
		useVariantDraftStore();
	const { toggleBoardFlip } = useSetupBoardStore();
	if (!setupRulesDraft) return null;

	function handleClearBoard() {
		if (!setupRulesDraft) return;
		const updatedSetupRulesDraft = structuredClone(setupRulesDraft);

		updatedSetupRulesDraft.startingPosition = [];
		updateSetupRulesDraft(updatedSetupRulesDraft);
		syncSetupRulesDraftToDB();
	}

	function handleFlipBoard() {
		toggleBoardFlip();
	}

	return (
		<div className="flex flex-row md:flex-col justify-center gap-2 bg-white shadow-md shadow-gray-400 rounded-md py-2 px-1">
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						onClick={handleClearBoard}
						variant="ghost"
						className="hover:bg-gray-300 p-1"
					>
						<IconTrash className="size-6" />
					</Button>
				</TooltipTrigger>

				<TooltipContent side="right">Clear board</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger asChild>
					<Button onClick={handleFlipBoard} variant="ghost" className="hover:bg-gray-300 p-1">
						<IconRepeat className="size-6" />
					</Button>
				</TooltipTrigger>

				<TooltipContent side="right">Flip board</TooltipContent>
			</Tooltip>
		</div>
	);
}

export default SetupToolbar;
