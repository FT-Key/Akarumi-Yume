import { useAuthStore } from '@/stores/useAuthStore';

export const useAuth = () => {
  const store = useAuthStore();

  return {
    // Estado
    user: store.user,
    token: store.token,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,

    // Acciones
    setUser: store.setUser,
    setToken: store.setToken,
    login: store.login,
    logout: store.logout,
    updateUser: store.updateUser,
    setLoading: store.setLoading,

    // Helpers
    isAdmin: store.isAdmin,
    hasPermission: store.hasPermission
  };
};

export default useAuth;
