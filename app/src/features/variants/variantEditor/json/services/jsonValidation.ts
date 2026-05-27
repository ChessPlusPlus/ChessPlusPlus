import api from "@/app/api";
import { AxiosError } from "axios";

type JSONValidationResponse = {
	validationStatus: boolean;
	validationMessage: string;
};

async function validateJSON(json: Record<string, unknown>): Promise<JSONValidationResponse | null> {
	try {
		const response = await api.post("/json-validator-test", {
			jsonToValidate: json,
		});

		return {
			validationStatus: response.data.validationStatus[0],
			validationMessage: response.data.validationStatus[1],
		};
	} catch (error) {
		if (error instanceof AxiosError) {
			console.error(error.response);
		}

		return null;
	}
}

export { validateJSON };
