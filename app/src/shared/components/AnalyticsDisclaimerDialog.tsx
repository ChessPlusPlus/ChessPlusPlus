import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAnalyticsDisclaimerDialogStore from "@/shared/stores/analyticsDisclaimerDialog";
import posthog from "posthog-js";
import useAnalyticsPreferencesStore from "@/shared/stores/analyticsPreferences";
import { Credenza, CredenzaContent, CredenzaDescription, CredenzaFooter, CredenzaHeader, CredenzaTitle } from "@/components/ui/credenza";
import { Button } from "@/components/ui/button";

function AnalyticsDisclaimerDialog() {
	const {
		isAnalyticsDisclaimerDialogOpen,
		openAnalyticsDisclaimerDialog,
		closeAnalyticsDisclaimerDialog,
	} = useAnalyticsDisclaimerDialogStore();

	const { enableAnalytics, disableAnalytics } =
		useAnalyticsPreferencesStore();

	function handleOptIn() {
		posthog.opt_in_capturing();
		enableAnalytics();
		closeAnalyticsDisclaimerDialog();
	}

	function handleOptOut() {
		posthog.opt_out_capturing();
		disableAnalytics();
		closeAnalyticsDisclaimerDialog();
	}

	return (
		<Credenza
			open={isAnalyticsDisclaimerDialogOpen}
			onOpenChange={(open) => {
				if (open) {
					openAnalyticsDisclaimerDialog();
				} else {
					closeAnalyticsDisclaimerDialog();
				}
			}}
		>
			<CredenzaContent>
				<CredenzaHeader>
					<CredenzaTitle>Hi there!</CredenzaTitle>
					<CredenzaDescription asChild>
						<div className="text-sm text-muted-foreground">
							<span>
								Would you like to help us improve Chess++ by
								allowing us to collect anonymous usage data? You
								may change your decision at any time
							</span>

							<br />
							<br />

							<span>The data will be used for:</span>
							<ul className="list-disc list-outside pl-5">
								<li>
									Understanding feature usage patterns to
									guide product improvements
								</li>
								<li>
									Improving discoverability of underused
									features
								</li>
								<li>
									Identifying potential performance issues
								</li>
							</ul>
						</div>
					</CredenzaDescription>
				</CredenzaHeader>

				<Tabs className="px-4 md:px-0">
					<TabsList className="w-full">
						<TabsTrigger value="what-we-collect">
							What we collect
						</TabsTrigger>
						<TabsTrigger value="what-we-will-never-collect">
							What we will never collect
						</TabsTrigger>
					</TabsList>

					<TabsContent value="what-we-collect">
						<ul className="list-disc list-outside pl-5">
							<li>
								How often you perform certain actions in Chess++
							</li>
							<li>
								How much you use certain features in Chess++
							</li>
						</ul>
					</TabsContent>

					<TabsContent value="what-we-will-never-collect">
						<ul className="list-disc list-outside pl-5">
							<li>
								Information that can be used to identify you such as your email
								address, name, or other personal information
								will never be collected as part of analytics.
							</li>
							<li>
								However, your name and email address will be
								collected when you are providing feedback, if you choose to provide it.
							</li>
						</ul>
					</TabsContent>
				</Tabs>

				<CredenzaFooter className="grid grid-cols-2 gap-2">
					<Button variant="outline" onClick={handleOptOut}>
						Stay opted out
					</Button>
					<Button variant="default" onClick={handleOptIn}>
						Opt in
					</Button>
				</CredenzaFooter>
			</CredenzaContent>
		</Credenza>
	);
}

export default AnalyticsDisclaimerDialog;
