import api from "@/app/api";
import type { MovementRules } from "@/features/variants/common/types/movementRules";
import type { PieceRuleset } from "@/features/variants/common/types/pieceRules";
import type {
	GameState2DArray,
	SetupRules,
} from "@/features/variants/common/types/setupRules";
import { AxiosError } from "axios";

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
		console.log(setupRules, pieceRuleset, movementRules);

		const response = await api.post("game/create-game", {
			setupRules,
			pieceRuleset,
			movementRules,
			serialise: import.meta.env.VITE_IS_BETA != "true",
		});

		console.log(response.data);

		return {
			gameId: response.data.gameId,
			gameState: response.data.gameState,
		};
	} catch (error) {
		if (error instanceof AxiosError) {
			console.error(error.response?.data);
		}

		return {
			gameId: null,
			gameState: null,
		};
	}
}

export { createGame };
