import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";

export type UserState = {
  user: {
    id: string | null;
    firstName: string | null;
    lastName: string | null;
  };
};

export type UserActions = {
  setUser: (id: string, firstName: string, lastName: string) => void;
  clearUser: () => void;
};

export type UserStore = UserState & UserActions;

export const initUserStore = (): UserState => {
  return { user: { id: null, firstName: null, lastName: null } };
};

export const defaultInitState: UserState = {
  user: { id: null, firstName: null, lastName: null },
};

export const createUserStore = (initState: UserState = defaultInitState) => {
  return createStore<UserStore>()(
    persist(
      (set) => ({
        ...initState,
        setUser: (id: string, firstName: string, lastName: string) =>
          set({ user: { id, firstName, lastName } }),
        clearUser: () =>
          set({ user: { id: null, firstName: null, lastName: null } }),
      }),
      {
        name: "user-storage", // unique name
      }
    )
  );
};
