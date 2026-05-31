export {};

declare global {
	interface Window {
		uj?: (...args: unknown[]) => void;
	}
}
