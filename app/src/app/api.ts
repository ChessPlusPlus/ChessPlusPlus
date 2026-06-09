import axios from "axios";

const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
	console.log("=== AXIOS REQUEST ===");
	console.log("baseURL:", config.baseURL);
	console.log("url:", config.url);
	console.log("method:", config.method);
	console.log("full:", (config.baseURL || "") + (config.url || ""));
	console.log("=====================");

	return config;
});

export default api;
