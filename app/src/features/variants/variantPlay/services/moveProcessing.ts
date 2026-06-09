import api from "@/app/api";
import type { GameState2DArray } from "@/features/variants/common/types/setupRules";
import { AxiosError } from "axios";

type GenerateLegalMovesResponse = {
	legalMoves: [number, number][] | null;
};

type BatchGenerateLegalMovesResponse = {
	legalMoves: [[number, number], [number, number][]][] | null;
}

type ProcessMoveResponse = {
	validMove: boolean;
	newGameState: GameState2DArray | null;
};

async function generateLegalMoves(
	gameId: string,
	currentPos: [number, number],
): Promise<GenerateLegalMovesResponse> {
	try {
		const t0 = performance.now();

		const response = await api.post("game/generate-legal-moves", {
			gameId,
			currentPos,
		});
		const t1 = performance.now();
		
		console.log(`Legal move service call took ${t1 - t0} milliseconds`);

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

async function batchGenerateLegalMoves(
	gameId: string,
): Promise<BatchGenerateLegalMovesResponse> {
	try {
		const response = await api.post("game/batch-generate-legal-moves", {
			gameId,
		});

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
		console.time("processMove");
		const response = await api.post("game/process-move", {
			gameId,
			pieceStartPos,
			pieceEndPos,
		})

		console.timeLog("processMove");
		console.timeEnd("processMove");

		return { validMove: response.data.validMove, newGameState: response.data.newGameState };
	} catch (error) {
		if (error instanceof AxiosError) {
			console.log(error.response);
		}

		return { validMove: false, newGameState: null };
	}
}

export { generateLegalMoves, batchGenerateLegalMoves, processMove };