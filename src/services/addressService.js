import apiClient from '../lib/axios';

export const addressService = {
  async getAddresses(userId) {
    return apiClient.get(`/users/${userId}/addresses`);
  },

  async getAddressById(addressId) {
    return apiClient.get(`/addresses/${addressId}`);
  },

  async createAddress(data) {
    return apiClient.post('/addresses', data);
  },

  async updateAddress(addressId, data) {
    return apiClient.put(`/addresses/${addressId}`, data);
  },

  async deleteAddress(addressId) {
    return apiClient.delete(`/addresses/${addressId}`);
  },

  async validateAddress(addressId) {
    return apiClient.post(`/addresses/${addressId}/validate`);
  },
};
