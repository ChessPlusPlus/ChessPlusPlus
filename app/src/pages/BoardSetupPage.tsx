import usePieceImagesStore from "@/features/variants/common/stores/pieceImages";
import useVariantsStore from "@/features/variants/common/stores/variantsStore";
import useVariantDraftStore from "@/features/variants/variantEditor/common/stores/variantDraft";
import SetupChessboard from "@/features/variants/variantEditor/setupEditor/components/SetupChessboard/SetupChessboard";
import SetupMenu from "@/features/variants/variantEditor/setupEditor/components/SetupMenu";
import SetupToolbar from "@/features/variants/variantEditor/setupEditor/components/SetupToolbar";
import { Button } from "@/components/ui/button";
import { DragDropProvider } from "@dnd-kit/react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IconChevronLeft } from "@tabler/icons-react";
import useSetupMenuStore from "@/features/variants/variantEditor/setupEditor/stores/setupMenu";

type OnDragEnd = React.ComponentProps<typeof DragDropProvider>["onDragEnd"];

function BoardSetupPage() {
	const {
		setupRulesDraft,
		updateSetupRulesDraft,
		updateCurrentVariantId,
		updateMovementRulesDraft,
		updatePieceRulesetDraft,

	} = useVariantDraftStore();

	const { images, hasHydrated } = usePieceImagesStore();
	const { variants } = useVariantsStore();
	const { variantId } = useParams();
	const { originalBoardXSize, originalBoardYSize, updateOriginalBoardXSize, updateOriginalBoardYSize } = useSetupMenuStore();

	const navigate = useNavigate();

	useEffect(() => {
		if (!hasHydrated) return;
		if (!variantId) return;

		const selectedVariant = variants[variantId];
		if (!selectedVariant) return;

		updateCurrentVariantId(variantId);
		updateSetupRulesDraft(selectedVariant.variantRules.setupRules);
		updateMovementRulesDraft(selectedVariant.variantRules.movementRules);
		updatePieceRulesetDraft(selectedVariant.variantRules.pieceRuleset);
	}, [
		updateCurrentVariantId,
		updateMovementRulesDraft,
		updatePieceRulesetDraft,
		updateSetupRulesDraft,
		variantId,
		variants,
		images,
		hasHydrated,
	]);

	if (!setupRulesDraft) return null;

	function handleDragEnd(...args: Parameters<NonNullable<OnDragEnd>>) {
		if (!setupRulesDraft) return;

		const [event] = args;

		if (event.operation.canceled) return;

		const targetSquareId = event.operation.target?.id;
		const [file, rank] = (targetSquareId as string)?.split("-") ?? [];

		if (!file) return;
		if (!rank) return;

		const [identifier, piece] =
			(event.operation.source?.id as string).split("-") ?? [];

		if (!identifier) return;
		if (!piece) return;

		const currentSetupRulesDraft = useVariantDraftStore.getState().setupRulesDraft;
		if (!currentSetupRulesDraft) return;

		const updatedSetupRulesDraft = structuredClone(currentSetupRulesDraft);
		console.log(updatedSetupRulesDraft);

		const startLocation = event.operation.source?.data.startLocation;

		if (startLocation) {
			updatedSetupRulesDraft.startingPosition =
				updatedSetupRulesDraft.startingPosition.filter(
					([[file, rank]]) =>
						file !== Number(startLocation[0]) ||
						rank !== Number(startLocation[1]),
				);
		}

		updatedSetupRulesDraft.startingPosition = [
			...updatedSetupRulesDraft.startingPosition,
			[[Number(file), Number(rank)], piece],
		];

		updateSetupRulesDraft(updatedSetupRulesDraft);

		if (originalBoardXSize !== updatedSetupRulesDraft.boardXSize) {
			updateOriginalBoardXSize(updatedSetupRulesDraft.boardXSize);
		}
		if (originalBoardYSize !== updatedSetupRulesDraft.boardYSize) {
			updateOriginalBoardYSize(updatedSetupRulesDraft.boardYSize);
		}
	}

	function handleBackToVariantEditor() {
		navigate(`/variants/${variantId}`);
	}

	return (
		<div className="flex flex-col w-full h-full">
			<div className="flex flex-row items-center gap-2 w-full p-3 pb-0">
				<Button variant="ghost" className="pl-1 pr-2" data-icon="inline-start" onClick={handleBackToVariantEditor}>
					<IconChevronLeft className="size-5" />
					<span className="text-base font-normal">Back</span>
				</Button>
			</div>
			
			<div className="flex flex-row items-center justify-center w-full h-full">
				<DragDropProvider onDragEnd={handleDragEnd}>
					<div className="flex flex-row w-full h-full items-center justify-center gap-4">
						<SetupChessboard />
						<SetupToolbar />
						<SetupMenu />
					</div>
				</DragDropProvider>
			</div>
		</div>
	);
}

export default BoardSetupPage;
