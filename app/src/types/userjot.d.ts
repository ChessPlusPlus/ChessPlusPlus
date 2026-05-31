export {};

declare global {
	interface Window {
		uj?: {
			showWidget: () => void;
			init: (projectId: string, options: {
				widget: boolean;
				theme: string;
				trigger: string;
			}) => void;
		};
	}
}
