import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAnalyticsDisclaimerDialogStore from "@/shared/stores/analyticsDisclaimerDialog";

function AnalyticsDisclaimerDialog() {
	const {
		isAnalyticsDisclaimerDialogOpen,
		openAnalyticsDisclaimerDialog,
		closeAnalyticsDisclaimerDialog,
	} = useAnalyticsDisclaimerDialogStore();

	return (
		<AlertDialog
			open={isAnalyticsDisclaimerDialogOpen}
			onOpenChange={(open) => {
				if (open) {
					openAnalyticsDisclaimerDialog();
				} else {
					closeAnalyticsDisclaimerDialog();
				}
			}}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Hi there!</AlertDialogTitle>
					<AlertDialogDescription>
						<span>
							Would you like to help us improve Chess++ by
							allowing us to collect anonymous usage data?
						</span>

						<br />
						<br />

						<span>The data will be used for:</span>
						<ul className="list-disc list-outside pl-5">
							<li>
								Understanding which features are used most to
								guide product improvements
							</li>
							<li>
								Improving discoverability of underused features
							</li>
							<li>Identifying potential performance issues</li>
						</ul>
					</AlertDialogDescription>
				</AlertDialogHeader>

				<Tabs>
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
								Sensitive information such as your email
								address, name, or other personal information
							</li>
						</ul>
					</TabsContent>
				</Tabs>

				<AlertDialogFooter className="grid grid-cols-2 gap-2">
					<AlertDialogAction variant="outline">
						Stay opted out
					</AlertDialogAction>
					<AlertDialogAction variant="default">
						Opt in
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export default AnalyticsDisclaimerDialog;
