import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

function SaveSetupConfirmationDialog() {
	return (
		<AlertDialog>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Leave setup page?</AlertDialogTitle>
					<AlertDialogDescription>
						You have unsaved changes. Are you sure you want to
						leave?
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogAction variant="default" className="px-4">Save and leave</AlertDialogAction>
					<AlertDialogAction variant="destructive" className="px-4">Leave without saving</AlertDialogAction>
					<AlertDialogCancel className="px-4">Cancel</AlertDialogCancel>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export default SaveSetupConfirmationDialog;