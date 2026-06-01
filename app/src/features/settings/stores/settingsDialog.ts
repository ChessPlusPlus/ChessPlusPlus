import { create } from "zustand";

type SettingsDialogStore = {
	isSettingsDialogOpen: boolean;
	openSettingsDialog: () => void;
	closeSettingsDialog: () => void;

	nameDraft: string;
	updateNameDraft: (nameDraft: string) => void;

	emailDraft: string;
	updateEmailDraft: (emailDraft: string) => void;

	emailDraftErrors: string[];
	updateEmailDraftErrors: (emailDraftErrors: string[]) => void;
	clearEmailDraftErrors: () => void;
}

const useSettingsDialogStore = create<SettingsDialogStore>((set) => ({
	isSettingsDialogOpen: false,
	openSettingsDialog: () => set({ isSettingsDialogOpen: true }),
	closeSettingsDialog: () => set({ isSettingsDialogOpen: false }),

	nameDraft: "",
	updateNameDraft: (nameDraft) => set({ nameDraft }),

	emailDraft: "",
	updateEmailDraft: (emailDraft) => set({ emailDraft }),

	emailDraftErrors: [],
	updateEmailDraftErrors: (emailDraftErrors) => set({ emailDraftErrors }),
	clearEmailDraftErrors: () => set({ emailDraftErrors: [] }),
}));

export default useSettingsDialogStore;