import apiClient from '../lib/axios';

export const deliveryTypeService = {
  async getDeliveryTypes(params = {}) {
    return apiClient.get('/delivery-types', { params });
  },

  async getDeliveryTypeById(id) {
    return apiClient.get(`/delivery-types/${id}`);
  },

  async createDeliveryType(data) {
    return apiClient.post('/delivery-types', data);
  },

  async updateDeliveryType(id, data) {
    return apiClient.put(`/delivery-types/${id}`, data);
  },

  async deleteDeliveryType(id) {
    return apiClient.delete(`/delivery-types/${id}`);
  },
};