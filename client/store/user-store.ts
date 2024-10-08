import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";

export type UserState = {
  user: {
    firstName: string | null;
    lastName: string | null;
  };
};

export type UserActions = {
  setUser: (firstName: string, lastName: string) => void;
  clearUser: () => void;
};

export type UserStore = UserState & UserActions;

export const initUserStore = (): UserState => {
  return { user: { firstName: null, lastName: null } };
};

export const defaultInitState: UserState = {
  user: { firstName: null, lastName: null },
};

export const createUserStore = (initState: UserState = defaultInitState) => {
  return createStore<UserStore>()(
    persist(
      (set) => ({
        ...initState,
        setUser: (firstName: string, lastName: string) =>
          set({ user: { firstName, lastName } }),
        clearUser: () => set({ user: { firstName: null, lastName: null } }),
      }),
      {
        name: "user-storage", // unique name
      }
    )
  );
};
