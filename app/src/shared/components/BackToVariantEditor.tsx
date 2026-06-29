import { Button } from "@/components/ui/button";
import { IconChevronLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

type BackButtonProps = {
	url: string;
}

function BackButton({ url }: BackButtonProps) {
	const navigate = useNavigate();

	function handleBackToVariantEditor() {
		navigate(url);
	}

	return (
		<div className="flex flex-row items-center gap-2 w-full p-3 pb-0">
			<Button
				variant="ghost"
				className="pl-1 pr-2"
				data-icon="inline-start"
				onClick={handleBackToVariantEditor}
			>
				<IconChevronLeft className="size-5" />
				<span className="text-base font-normal">Back</span>
			</Button>
		</div>
	);
}

export default BackButton;