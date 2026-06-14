import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./global.css";
import TestPage from "@/pages/TestPage";
import JSONValidatorTestPage from "@/pages/JSONValidatorTestPage";

import VariantEditorPage from "@/pages/VariantEditorPage";
import { TooltipProvider } from "@/components/ui/tooltip";
import HomePage from "@/pages/HomePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BoardSetupPage from "@/pages/BoardSetupPage";
import VariantPlayPage from "@/pages/VariantPlayPage";
import { PostHogProvider, PostHogPageviewTracker } from "./PostHogProvider";
import { useEffect } from "react";
import useAnalyticsPreferencesStore from "@/shared/stores/analyticsPreferences";
import useAnalyticsDisclaimerDialogStore from "@/shared/stores/analyticsDisclaimerDialog";
import AnalyticsDisclaimerDialog from "@/shared/components/AnalyticsDisclaimerDialog";
import posthog from "posthog-js";
import usePieceImagesStore from "@/features/variants/common/stores/pieceImages";
import { defaultPieceImages } from "@/features/variants/variantCreation/constants/defaultPieceImages";

const queryClient = new QueryClient();

function App() {
	const { analyticsEnabled } = useAnalyticsPreferencesStore();
	const { openAnalyticsDisclaimerDialog } = useAnalyticsDisclaimerDialogStore();
	const { images, addImage } = usePieceImagesStore();
	
	useEffect(() => {
		if (analyticsEnabled === null) {
			openAnalyticsDisclaimerDialog();
			return;
		}

		if (analyticsEnabled === false) {
			posthog.opt_out_capturing();
			return;
		}

		if (analyticsEnabled === true) {
			posthog.opt_in_capturing();
		}
	}, [analyticsEnabled, openAnalyticsDisclaimerDialog]);

	useEffect(() => {
		if (window.uj) {
			window.uj.init(import.meta.env.VITE_USERJOT_PROJECT_ID, {
				widget: true,
				theme: "auto",
				trigger: "custom",
				position: "left"
			})
		}
	}, []);

	useEffect(() => {
		if (!images) return;

		if (!Object.keys(images).includes("movement_preview")) {
			addImage(defaultPieceImages.movement_preview.image);
		}
	}, [images, addImage]);
	
	return (
		<PostHogProvider>
			<QueryClientProvider client={queryClient}>
				<TooltipProvider>
					<BrowserRouter>
						<PostHogPageviewTracker />
						<Routes>
							<Route path="/" element={<HomePage />} />
							<Route
								path="/variants/:variantId"
								element={<VariantEditorPage />}
							/>
							<Route path="/variants/:variantId/setup" element={<BoardSetupPage />} />
							<Route path="/variants/:variantId/play" element={<VariantPlayPage />} />
							<Route path="/test" element={<TestPage />} />
							<Route
								path="/json-validator-test"
								element={<JSONValidatorTestPage />}
							/>
						</Routes>
						<AnalyticsDisclaimerDialog />
					</BrowserRouter>
				</TooltipProvider>
			</QueryClientProvider>
		</PostHogProvider>
	);
}

export default App;
