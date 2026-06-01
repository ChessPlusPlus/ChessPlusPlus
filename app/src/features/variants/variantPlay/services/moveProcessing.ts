import api from "@/app/api";
import type { GameState2DArray } from "@/features/variants/common/types/setupRules";
import { AxiosError } from "axios";

type GenerateLegalMovesResponse = {
	legalMoves: [number, number][] | null;
};

type ProcessMoveResponse = {
	validMove: boolean;
	newGameState: GameState2DArray | null;
};

async function generateLegalMoves(
	gameId: string,
	currentPos: [number, number],
): Promise<GenerateLegalMovesResponse> {
	try {
		const response = await api.post("game/generate-legal-moves/", {
			gameId,
			currentPos,
		});

		console.log(response.data);

		return { legalMoves: response.data.legalMoves };
	}
	catch (error) {
		console.log("error occured");

		if (error instanceof AxiosError) {
			console.log(error.response);
		}

		return { legalMoves: null };
	}
}

async function processMove(
	gameId: string,
	pieceStartPos: [number, number],
	pieceEndPos: [number, number],
): Promise<ProcessMoveResponse> {
	try {
		const response = await api.post("game/process-move/", {
			gameId,
			pieceStartPos,
			pieceEndPos,
		})

		return { validMove: response.data.validMove, newGameState: response.data.newGameState };
	} catch (error) {
		if (error instanceof AxiosError) {
			console.log(error.response);
		}

		return { validMove: false, newGameState: null };
	}
}

export { generateLegalMoves, processMove };