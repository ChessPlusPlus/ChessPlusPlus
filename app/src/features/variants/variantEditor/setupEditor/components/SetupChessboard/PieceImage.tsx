import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useDraggable } from "@dnd-kit/react";

type PieceImageProps = {
	imageUrl: string | null;
	piece: string;
	file: number;
	rank: number;
};

function PieceImage({ piece, imageUrl, file, rank }: PieceImageProps) {
	const { ref } = useDraggable({
		id: `${file}_${rank}-${piece}`,
		data: {
			startLocation: [file, rank],
		},
	});

	if (!imageUrl) return null;

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<img
					className="size-full object-contain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
					ref={ref}
					src={imageUrl}
					alt={piece}
				/>
			</TooltipTrigger>
			<TooltipContent>
				{piece}
			</TooltipContent>
		</Tooltip>
	);
}

export default PieceImage;
