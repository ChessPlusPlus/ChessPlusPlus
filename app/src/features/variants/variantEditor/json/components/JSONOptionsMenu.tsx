import {
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import useVariantsStore from "@/features/variants/common/stores/variantsStore";
import useVariantDraftStore from "@/features/variants/variantEditor/common/stores/variantDraft";
import { IconFileExport, IconFileImport } from "@tabler/icons-react";

function JSONOptionsMenu() {
	const { currentVariantId } = useVariantDraftStore();
	const { variants } = useVariantsStore();

	function handleExportJSON() {
		if (!currentVariantId) return;

		const variant = variants[currentVariantId];
		if (!variant) return;

		const json = JSON.stringify(variant, null, 2);
		const fileName = `${variant.variantName}.json`;

		const blob = new Blob([json], { type: "application/json" });
		const objectUrl = URL.createObjectURL(blob);

		const a = document.createElement("a");
		a.href = objectUrl;
		a.download = fileName;

		a.click();
		a.remove();
		URL.revokeObjectURL(objectUrl);
	}

	return (
		<DropdownMenuContent side="left" sideOffset={8} className="w-max p-2">
			<DropdownMenuItem>
				<IconFileImport className="size-4" />
				Import JSON
			</DropdownMenuItem>
			<DropdownMenuItem onClick={handleExportJSON}>
				<IconFileExport className="size-4" />
				Export JSON
			</DropdownMenuItem>
		</DropdownMenuContent>
	);
}

export default JSONOptionsMenu;
