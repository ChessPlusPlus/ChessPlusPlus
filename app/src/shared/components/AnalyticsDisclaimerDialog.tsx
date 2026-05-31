import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
			onOpenChange={
				(open) => {
					if (open) {
						openAnalyticsDisclaimerDialog();
					} else {
						closeAnalyticsDisclaimerDialog();
					}
				}
			}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Hi there!</AlertDialogTitle>
					<AlertDialogDescription>
						Would you like to help us improve Chess++ by allowing us
						to collect anonymous usage data?
					</AlertDialogDescription>
				</AlertDialogHeader>
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
