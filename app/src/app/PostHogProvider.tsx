import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
	api_host: import.meta.env.VITE_POSTHOG_HOST,
	person_profiles: "identified_only",
	opt_out_capturing_by_default: true,
});

posthog.register({
	environment: import.meta.env.VITE_CURRENT_ENV,
});

function PostHogPageviewTracker() {
	const location = useLocation();

	useEffect(() => {
		posthog.capture("$pageview", { $current_url: window.location.href });
	}, [location]);

	return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
	return <PHProvider client={posthog}>{children}</PHProvider>;
}

export { PostHogPageviewTracker };
