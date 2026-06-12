import usePieceImagesStore from "@/features/variants/common/stores/pieceImages";
import useVariantDraftStore from "@/features/variants/variantEditor/common/stores/variantDraft";
import { generateNumberSequence } from "@/features/variants/variantEditor/common/utils/boardGeneration";
import type { GameStateMap } from "@/features/variants/common/types/setupRules";

type ChessboardGridProps = {
	boardState: GameStateMap;
	displayLegalMoveComponent: (
		file: number,
		rank: number,
	) => React.ReactNode;
};

function ChessboardGrid({ boardState, displayLegalMoveComponent }: ChessboardGridProps) {
	const { images } = usePieceImagesStore();
	const { currentVariantId, setupRulesDraft, pieceRulesetDraft } =
		useVariantDraftStore();

	if (!setupRulesDraft) return null;
	if (!pieceRulesetDraft) return null;
	if (!images) return null;
	if (!currentVariantId) return null;

	const boardXSize = setupRulesDraft.boardXSize;
	const boardYSize = setupRulesDraft.boardYSize;

	const ranks = generateNumberSequence(boardYSize).reverse();
	const files = generateNumberSequence(boardXSize);

	function renderPieceImage(imageId: string, pieceName: string) {
		if (!currentVariantId) return null;

		const imageBlob =
			images[imageId]?.[currentVariantId] ?? images[imageId]?.image;
		const imageUrl = imageBlob ? URL.createObjectURL(imageBlob) : undefined;

		return (
			<div className="w-full h-full flex items-center justify-center">
				<img src={imageUrl} alt={pieceName} />
			</div>
		);
	}

	return (
		<div className="grid grid-cols-8 aspect-square max-w-md">
			{ranks.map((rank) =>
				files.map((file) => {
					const isDark = (rank + files.indexOf(file)) % 2 === 0;

					const fileNumber = files.indexOf(file);

					const foundSquare = boardState.get([fileNumber, rank]);
					const imageId =
						pieceRulesetDraft[foundSquare ?? ""]?.imageId;

					return (
						<div
							key={file}
							className={`${isDark ? "bg-chessboard-square-dark" : "bg-chessboard-square-light"} aspect-square relative`}
						>
							{foundSquare
								? renderPieceImage(
										imageId ?? "",
										foundSquare ?? "",
									)
								: null}

							<div
								key={`${rank}-${file}`}
								className="absolute top-0 left-0 flex flex-row flex-wrap gap-2 p-2"
							>
								{displayLegalMoveComponent(fileNumber, rank)}
							</div>
						</div>
					);
				}),
			)}
		</div>
	);
}

export default ChessboardGrid;
