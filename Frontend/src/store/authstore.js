import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      role: null,
      accessToken: null,

      setUser: (user) => {
        console.log("Setting user:", user); // DEBUG
        set({
          user: user || null,
          isAuthenticated: !!user,        // <-- true if user exists
          role: user?.role ?? "user",     // <-- default to "user"
          accessToken: user?.accessToken ?? null,
        });
      },

      clearUser: () => {
        console.log("Clearing user"); // DEBUG
        set({
          user: null,
          isAuthenticated: false,
          role: null,
          accessToken: null,
        });
      },
    }),
    { name: "auth-storage" }
  )
);

export default useAuthStore;
