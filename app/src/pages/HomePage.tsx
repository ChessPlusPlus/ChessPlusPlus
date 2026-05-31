import { Button } from "@/components/ui/button";
import {
	IconBrandGithub,
	IconChess,
	IconFileImport,
	IconFolder,
	IconHelpCircle,
	IconPlus,
	IconSettings,
} from "@tabler/icons-react";
import CreateVariantDialog from "@/features/variants/variantCreation/components/CreateVariantDialog";
import useCreateVariantDialogStore from "@/features/variants/variantCreation/stores/createVariantDialog";
import MyVariantsDialog from "@/features/variants/variantListing/components/MyVariantsDialog";
import useMyVariantsDialogStore from "@/features/variants/variantListing/stores/myVariantsDialog";
import useVariantPlaySelectionDialogStore from "@/features/variants/variantPlay/stores/variantPlaySelectionDialog";
import VariantPlaySelectionDialog from "@/features/variants/variantPlay/components/VariantPlaySelectionDialog";
import useImportJSONDialogStore from "@/features/variants/variantEditor/json/stores/importJSONDialog";
import ImportJSONDialog from "@/features/variants/variantEditor/json/components/ImportJSONDialog";
import { Link } from "react-router-dom";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import SettingsDialog from "@/features/settings/components/SettingsDialog";
import useSettingsDialogStore from "@/features/settings/stores/settingsDialog";
import ResetAllDataAlert from "@/features/settings/components/ResetAllDataAlert";
import MessagePencilIcon from "@/shared/icons/MessagePencilIcon";

const githubUrl = "https://github.com/ChessPlusPlus/ChessPlusPlus";
const docsUrl = "https://chpp.gitbook.io/docs";

function HomePage() {
	const { openDialog: openCreateVariantDialog } =
		useCreateVariantDialogStore();
	const { openDialog: openMyVariantsDialog } = useMyVariantsDialogStore();
	const { openVariantPlaySelectionDialog } =
		useVariantPlaySelectionDialogStore();
	const { openImportJSONDialog } = useImportJSONDialogStore();
	const { openSettingsDialog } = useSettingsDialogStore();
	return (
		<>
			<div className="flex flex-col items-center justify-center w-full h-full gap-2 bg-linear-to-b from-white to-purple-400">
				<h1 className="text-6xl font-bold">Chess++</h1>
				<p>Create and play with your own custom chess pieces</p>

				<div className="flex flex-row gap-4">
					<Button onClick={openCreateVariantDialog} className="px-4">
						<IconPlus />
						Create variant
					</Button>
					<Button onClick={openImportJSONDialog} className="px-4">
						<IconFileImport />
						Import variant
					</Button>
					<Button onClick={openMyVariantsDialog} className="px-4">
						<IconFolder />
						My variants
					</Button>
					<Button
						onClick={openVariantPlaySelectionDialog}
						className="px-4"
					>
						<IconChess />
						Play variant
					</Button>
				</div>
			</div>

			<div className="fixed bottom-2 right-2 flex flex-row gap-2 items-center">
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							onClick={openSettingsDialog}
							className="p-1 hover:bg-gray-100 rounded-md"
						>
							<IconSettings className="size-6" strokeWidth={1.5} />
						</Button>
					</TooltipTrigger>

					<TooltipContent side="top">Settings</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Link
							to={githubUrl}
							target="_blank"
							className="hover:bg-gray-100 rounded-md p-1"
						>
							<IconBrandGithub
								className="size-6"
								strokeWidth={1.5}
							/>
						</Link>
					</TooltipTrigger>
					<TooltipContent side="top">GitHub repo</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Link
							to={docsUrl}
							target="_blank"
							className="hover:bg-gray-100 rounded-md p-1"
						>
							<IconHelpCircle
								className="size-6"
								strokeWidth={1.5}
							/>
						</Link>
					</TooltipTrigger>
					<TooltipContent side="top">
						Help (documentation)
					</TooltipContent>
				</Tooltip>
			</div>

			<div className="fixed left-2 bottom-2">
				<Button variant="ghost" size="icon">
					<MessagePencilIcon className="size-6" />
				</Button>
			</div>

			<CreateVariantDialog />
			<MyVariantsDialog />
			<VariantPlaySelectionDialog />
			<ImportJSONDialog />
			<SettingsDialog />
			<ResetAllDataAlert />
		</>
	);
}

export default HomePage;
