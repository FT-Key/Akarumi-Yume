import apiClient from '../lib/axios';

export const userService = {
  async getProfile() {
    return apiClient.get('/users/me');
  },

  async updateProfile(userId, data) {
    return apiClient.put(`/users/${userId}`, data);
  },

  async changePassword(userId, oldPassword, newPassword) {
    return apiClient.put(`/users/${userId}/password`, { oldPassword, newPassword });
  },

  async getUsers(params = {}) {
    return apiClient.get('/users', { params });
  },

  async getUserById(userId) {
    return apiClient.get(`/users/${userId}`);
  },

  async deleteUser(userId) {
    return apiClient.delete(`/users/${userId}`);
  },
};
