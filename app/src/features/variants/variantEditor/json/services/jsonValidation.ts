import api from "@/app/api";
import { AxiosError } from "axios";

async function validateJSON(json: Record<string, unknown>) {
	try {
		const response = await api.post("/json-validator-test", {
			jsonToValidate: json,
		});

		return response.data;
	} catch (error) {
		if (error instanceof AxiosError) {
			console.error(error.response);
		}
	}
}

export { validateJSON };
