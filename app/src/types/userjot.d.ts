export {};

type UserJotIdentifyOptions = {
	id: string;
	email?: string;
	name?: string;	
}

declare global {
	interface Window {
		uj?: {
			showWidget: () => void;
			init: (projectId: string, options: {
				widget: boolean;
				theme: string;
				trigger: string;
				position: "left" | "right";
			}) => void;
			identify: (options: UserJotIdentifyOptions) => void;
		};
	}
}
