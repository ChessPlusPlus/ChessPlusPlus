import api from "@/app/api";
import { AxiosError } from "axios";

type JSONNormalisationResponse = {
	normalisedJSON: Record<string, unknown>;
};

async function normaliseJSON(json: Record<string, unknown>): Promise<JSONNormalisationResponse | null> {
	try {
		const response = await api.post("/json/normalise-json", {
			simpleJSON: json,
		});

		return {
			normalisedJSON: response.data.normalisedJson,
		};
	} catch (error) {
		if (error instanceof AxiosError) {
			console.error(error.response);
		}

		return null;
	}
}

export { normaliseJSON };