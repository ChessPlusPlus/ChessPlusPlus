import { create } from "zustand";

type DevModeStore = {
	devModeEnabled: boolean;
	enableDevMode: () => void;
	disableDevMode: () => void;
};

const useDevModeStore = create<DevModeStore>((set) => ({
	devModeEnabled: false,
	enableDevMode: () => set({ devModeEnabled: true }),
	disableDevMode: () => set({ devModeEnabled: false }),
}));

export default useDevModeStore;
