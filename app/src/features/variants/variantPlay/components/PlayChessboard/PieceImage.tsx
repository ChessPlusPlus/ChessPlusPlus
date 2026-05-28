import { useDraggable } from "@dnd-kit/react";


type PieceImageProps = {
	imageUrl: string | null;
	piece: string;
	file: number;
	rank: number;
};

function PieceImage({ imageUrl, piece, file, rank }: PieceImageProps) {
	const { ref } = useDraggable({
		id: `${file}-${rank}-${piece}`,
		data: {
			startLocation: [file, rank],
			piece,
		}
	});

	if (!imageUrl) return null;

	return <img ref={ref} src={imageUrl} alt={piece} draggable={false}/>;
}

export default PieceImage;