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

const queryClient = new QueryClient();

function App() {
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
					</BrowserRouter>
				</TooltipProvider>
			</QueryClientProvider>
		</PostHogProvider>
	);
}

export default App;
