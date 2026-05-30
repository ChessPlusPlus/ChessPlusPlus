import { Button } from "@/components/ui/button";
import { IconBrandGithub, IconChess, IconFileImport, IconFolder, IconHelpCircle, IconPlus } from "@tabler/icons-react";
import CreateVariantDialog from "@/features/variants/variantCreation/components/CreateVariantDialog";
import useCreateVariantDialogStore from "@/features/variants/variantCreation/stores/createVariantDialog";
import MyVariantsDialog from "@/features/variants/variantListing/components/MyVariantsDialog";
import useMyVariantsDialogStore from "@/features/variants/variantListing/stores/myVariantsDialog";
import useVariantPlaySelectionDialogStore from "@/features/variants/variantPlay/stores/variantPlaySelectionDialog";
import VariantPlaySelectionDialog from "@/features/variants/variantPlay/components/VariantPlaySelectionDialog";
import useImportJSONDialogStore from "@/features/variants/variantEditor/json/stores/importJSONDialog";
import ImportJSONDialog from "@/features/variants/variantEditor/json/components/ImportJSONDialog";
import { Link } from "react-router-dom";

const githubUrl = "https://github.com/ChessPlusPlus/ChessPlusPlus";
const docsUrl = "https://chpp.gitbook.io/docs";

function HomePage() {
	const { openDialog: openCreateVariantDialog } =
		useCreateVariantDialogStore();
	const { openDialog: openMyVariantsDialog } = useMyVariantsDialogStore();
	const { openVariantPlaySelectionDialog } = useVariantPlaySelectionDialogStore();
	const { openImportJSONDialog } = useImportJSONDialogStore();

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
					<Button onClick={openVariantPlaySelectionDialog} className="px-4">
						<IconChess />
						Play variant
					</Button>
				</div>
			</div>

			<div className="fixed bottom-2 right-2 flex flex-row gap-2">
				<Link to={githubUrl} target="_blank" className="hover:bg-gray-100 rounded-md p-1">
					<IconBrandGithub className="size-6" strokeWidth={1.5} />
				</Link>

				<Link to={docsUrl} target="_blank" className="hover:bg-gray-100 rounded-md p-1">
					<IconHelpCircle className="size-6" strokeWidth={1.5} />
				</Link>
			</div>

			<CreateVariantDialog />
			<MyVariantsDialog />
			<VariantPlaySelectionDialog />
			<ImportJSONDialog />
		</>
	);
}

export default HomePage;
