import { clamp } from "lodash";

import usePieceImagesStore from "@/features/variants/common/stores/pieceImages";
import useVariantDraftStore from "@/features/variants/variantEditor/common/stores/variantDraft";
import { generateNumberSequence } from "@/features/variants/variantEditor/common/utils/boardGeneration";
import Square from "@/features/variants/variantEditor/setupEditor/components/SetupChessboard/Square";
import useSetupBoardStore from "@/features/variants/variantEditor/setupEditor/stores/setupBoard";
import { TupleKeyedMap } from "@itwin/core-bentley";

function SetupChessboard() {
	const { images } = usePieceImagesStore();
	const { currentVariantId, setupRulesDraft, pieceRulesetDraft } =
		useVariantDraftStore();
	const { isFlipped } = useSetupBoardStore();

	if (!setupRulesDraft) return null;
	if (!pieceRulesetDraft) return null;
	if (!images) return null;
	if (!currentVariantId) return null;

	const boardXSize = setupRulesDraft.boardXSize;
	const boardYSize = setupRulesDraft.boardYSize;

	const boardStateMap = new TupleKeyedMap<[number, number], string>(
		setupRulesDraft.startingPosition,
	);

	const clampedBoardXSize = clamp(boardXSize, 1, 32);
	const clampedBoardYSize = clamp(boardYSize, 1, 32);

	const ranks = isFlipped
		? generateNumberSequence(clampedBoardYSize)
		: generateNumberSequence(clampedBoardYSize).reverse();
	const files = isFlipped
		? generateNumberSequence(clampedBoardXSize).reverse()
		: generateNumberSequence(clampedBoardXSize);

	function getImageUrl(imageId: string) {
		if (!currentVariantId) return null;

		const imageBlob =
			images[imageId][currentVariantId] ?? images[imageId].image;
		const imageUrl = URL.createObjectURL(imageBlob);

		return imageUrl;
	}

	const gridWidth = `min(100%, calc(100% * ${clampedBoardXSize} / 8), calc(28rem * ${clampedBoardXSize} / ${clampedBoardYSize}))`;

	return (
		<div className="w-full max-w-md">
			<div
				className="grid min-w-0"
				style={{
					width: gridWidth,
					gridTemplateColumns: `repeat(${clampedBoardXSize}, minmax(0, 1fr))`,
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
								boardXSize={clampedBoardXSize}
								boardYSize={clampedBoardYSize}
								isFlipped={isFlipped}
							/>
						);
					}),
				)}
			</div>
		</div>
	);
}

export default SetupChessboard;
