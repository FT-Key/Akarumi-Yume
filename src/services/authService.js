import apiClient from '@/lib/axios';
import { useAuthStore } from '@/stores/useAuthStore';

export const authService = {
  async login(email, password) {
    const data = await apiClient.post('/auth/login', { email, password });

    const { login } = useAuthStore.getState();
    login(data.user, data.token);

    return data;
  },

  async register(userData) {
    const data = await apiClient.post('/auth/register', userData);
    return data;
  },

  logout() {
    const { logout } = useAuthStore.getState();
    logout();
  },

  async requestPasswordReset(email) {
    const data = await apiClient.post('/auth/forgot-password', { email });
    return data;
  },

  async resetPassword(token, newPassword) {
    const data = await apiClient.post('/auth/reset-password', {
      token,
      newPassword,
    });
    return data;
  },

  async getCurrentUser() {
    const data = await apiClient.get('/auth/me');
    return data;
  },
};
