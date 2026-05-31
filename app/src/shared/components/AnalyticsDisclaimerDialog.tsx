import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

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
					<AlertDialogAction>
						<Button>Stay opted out</Button>
					</AlertDialogAction>
					<AlertDialogAction>
						<Button>Opt in</Button>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export default AnalyticsDisclaimerDialog;
