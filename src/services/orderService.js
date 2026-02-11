import apiClient from '../lib/axios';

export const orderService = {
  async createOrder(data) {
    return apiClient.post('/orders', data);
  },

  async getOrders(params = {}) {
    return apiClient.get('/orders', { params });
  },

  async getOrderById(orderId) {
    return apiClient.get(`/orders/${orderId}`);
  },

  async updateOrderStatus(orderId, status, note) {
    return apiClient.put(`/orders/${orderId}`, { status, note });
  },

  async cancelOrder(orderId) {
    return apiClient.delete(`/orders/${orderId}`);
  },
};