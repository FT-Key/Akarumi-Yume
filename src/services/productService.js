import apiClient from '../lib/axios';

export const productService = {
  async getProducts(params = {}) {
    return apiClient.get('/products', { params });
  },

  async getProductBySlug(slug) {
    // Asumiendo que tienes un endpoint que acepta slug
    const response = await apiClient.get('/products', { params: { slug } });
    return response.data?.[0] || null;
  },

  async getProductById(productId) {
    return apiClient.get(`/products/${productId}`);
  },

  async createProduct(data) {
    return apiClient.post('/products', data);
  },

  async updateProduct(productId, data) {
    return apiClient.put(`/products/${productId}`, data);
  },

  async deleteProduct(productId) {
    return apiClient.delete(`/products/${productId}`);
  },

  async addImage(productId, formData) {
    return apiClient.post(`/products/${productId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  async deleteImage(productId, imageId) {
    return apiClient.delete(`/products/${productId}/images/${imageId}`);
  },

  async addCharacteristic(productId, data) {
    return apiClient.post(`/products/${productId}/characteristics`, data);
  },

  async deleteCharacteristic(productId, charId) {
    return apiClient.delete(`/products/${productId}/characteristics/${charId}`);
  },

  async searchProducts(query) {
    return apiClient.get('/products', { params: { search: query } });
  },
};
