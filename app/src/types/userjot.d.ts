export {};

type UserJotIdentifyOptions = {
	id: string;
	email?: string;
	firstName?: string;	
}

type UserJotRedirectOptions = {
	to: "feedback" | "updates";
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
			identify: (options: UserJotIdentifyOptions | null) => void;
			redirect: (options?: UserJotRedirectOptions) => void;
		};
	}
}
