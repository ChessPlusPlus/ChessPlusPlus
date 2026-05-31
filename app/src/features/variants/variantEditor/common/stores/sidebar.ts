import { create } from "zustand";

type SidebarStore = {
    currentOpenMenu: "boardSettings" | "pieces" | "movements" | "jsonOptions" | null;
    updateCurrentOpenMenu: (openMenu: "boardSettings" | "pieces" | "movements" | "jsonOptions") => void;
    clearCurrentOpenMenu: () => void;

    resetSidebarState: () => void;
}

const useSidebarStore = create<SidebarStore>((set, _get, store) => ({
    currentOpenMenu: null,
    updateCurrentOpenMenu: (openMenu) => set({ currentOpenMenu: openMenu }),
    clearCurrentOpenMenu: () => set({ currentOpenMenu: null }),

    resetSidebarState: () => {
        set(store.getInitialState())
    },
}))

export default useSidebarStore;