import api from "@/app/api";
import type { MovementRules } from "@/features/variants/common/types/movementRules";
import type { PieceRuleset } from "@/features/variants/common/types/pieceRules";
import type {
	GameState2DArray,
	SetupRules,
} from "@/features/variants/common/types/setupRules";

type CreateGameResponse = {
	gameId: string | null;
	gameState: GameState2DArray | null;
};

async function createGame(
	setupRules: SetupRules,
	pieceRuleset: PieceRuleset,
	movementRules: MovementRules,
): Promise<CreateGameResponse> {
	try {
		const response = await api.post("game/create-game/", {
			setupRules,
			pieceRuleset,
			movementRules,
		});

		console.log(response.data);

		return {
			gameId: response.data.gameId,
			gameState: response.data.gameState,
		};
	} catch (error) {
		console.error(error);

		return {
			gameId: null,
			gameState: null,
		};
	}
}

export { createGame };
