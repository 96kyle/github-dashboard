import { create } from "zustand";

interface UserStore {
  username: string;
  setUsername: (name: string) => void;
  reset: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  username: "",
  setUsername: (name: string) => set({ username: name }),
  reset: () => set({ username: "" }),
}));
