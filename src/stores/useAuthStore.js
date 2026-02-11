import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      hasHydrated: false,

      setUser: (user) =>
        set({ user, isAuthenticated: !!user }),

      setToken: (token) => set({ token }),

      login: (user, token) =>
        set({ user, token, isAuthenticated: true }),

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem('auth-storage');
      },

      markHydrated: () => set({ hasHydrated: true }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;
