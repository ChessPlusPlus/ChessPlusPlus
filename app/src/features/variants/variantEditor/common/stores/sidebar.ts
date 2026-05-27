import { create } from "zustand";

type SidebarStore = {
    currentOpenMenu: "boardSettings" | "pieces" | "movements" | "jsonOptions" | null;
    updateCurrentOpenMenu: (openMenu: "boardSettings" | "pieces" | "movements" | "jsonOptions") => void;
    clearCurrentOpenMenu: () => void;
}

const useSidebarStore = create<SidebarStore>((set) => ({
    currentOpenMenu: null,
    updateCurrentOpenMenu: (openMenu) => set({ currentOpenMenu: openMenu }),
    clearCurrentOpenMenu: () => set({ currentOpenMenu: null }),
}))

export default useSidebarStore;