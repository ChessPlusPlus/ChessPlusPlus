import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function AnalyticsDisclaimerDialog() {
	return (
		<AlertDialog>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Hi there!</AlertDialogTitle>
					<AlertDialogDescription>
						Would you like to help us improve Chess++ by allowing us
						to collect anonymous usage data?
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
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
