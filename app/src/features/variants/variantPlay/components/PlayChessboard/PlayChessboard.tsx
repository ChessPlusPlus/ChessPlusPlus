import usePieceImagesStore from "@/features/variants/common/stores/pieceImages";
import useVariantsStore from "@/features/variants/common/stores/variantsStore";
import { generateNumberSequence } from "@/features/variants/variantEditor/common/utils/boardGeneration";
import Square from "@/features/variants/variantPlay/components/PlayChessboard/Square";
import useGameplayStore from "@/features/variants/variantPlay/stores/gameplay";
import { TupleKeyedMap } from "@itwin/core-bentley";
import { useParams } from "react-router-dom";

function PlayChessboard() {
	const { isBoardFlipped, gameBoardState, legalMoves } = useGameplayStore();
	const { variantId } = useParams();
	const { variants, hasHydrated: hasVariantsHydrated } = useVariantsStore();
	const { images, hasHydrated: hasImagesHydrated } = usePieceImagesStore();

	if (!hasVariantsHydrated) return null;
	if (!hasImagesHydrated) return null;

	const selectedVariant = variants[variantId ?? ""];
	if (!selectedVariant) return null;

	const pieceRulesetDraft = selectedVariant.variantRules.pieces;
	if (!pieceRulesetDraft) return null;

	const boardXSize = selectedVariant.variantRules.setup.boardXSize;
	const boardYSize = selectedVariant.variantRules.setup.boardYSize;

	const boardStateMap = new TupleKeyedMap<[number, number], string>(
		gameBoardState ?? [],
	);

	const gridWidth = `min(100%, calc(100% * ${boardXSize} / 8), calc(28rem * ${boardXSize} / ${boardYSize}))`;

	const ranks = isBoardFlipped
		? generateNumberSequence(boardYSize)
		: generateNumberSequence(boardYSize).reverse();
	const files = isBoardFlipped
		? generateNumberSequence(boardXSize).reverse()
		: generateNumberSequence(boardXSize);

	function getImageUrl(imageId: string) {
		if (!variantId) return null;

		const imageBlob = images[imageId][variantId] ?? images[imageId].image;
		const imageUrl = URL.createObjectURL(imageBlob);

		return imageUrl;
	}

	return (
		<div className="w-full max-w-md">
			<div
				className="grid min-w-0"
				style={{
					width: gridWidth,
					gridTemplateColumns: `repeat(${boardXSize}, minmax(0, 1fr))`,
				}}
			>
				{ranks.map((rank) =>
					files.map((file) => {
						const foundSquare = boardStateMap.get([file, rank]);
						const imageId =
							pieceRulesetDraft[foundSquare ?? ""]?.imageId;

						const imageUrl = imageId ? getImageUrl(imageId) : null;

						return (
							<Square
								key={`${file}-${rank}`}
								file={file}
								rank={rank}
								imageUrl={imageUrl ?? null}
								piece={foundSquare ?? ""}
								isFlipped={isBoardFlipped}
								boardXSize={boardXSize}
								boardYSize={boardYSize}
								isLegal={
									legalMoves?.some(
										([legalFile, legalRank]) =>
											legalFile === file &&
											legalRank === rank,
									) ?? false
								}
							/>
						);
					}),
				)}
			</div>
		</div>
	);
}

export default PlayChessboard;
