import apiClient from '../lib/axios';

export const categoryService = {
  async getCategories() {
    return apiClient.get('/categories');
  },

  async getCategoryById(categoryId) {
    return apiClient.get(`/categories/${categoryId}`);
  },

  async getCategoryBySlug(slug) {
    const categories = await apiClient.get('/categories');
    return categories.data?.find(cat => cat.slug === slug) || null;
  },

  async getProductsByCategory(categoryId) {
    return apiClient.get(`/categories/${categoryId}/products`);
  },

  async createCategory(data) {
    return apiClient.post('/categories', data);
  },

  async updateCategory(categoryId, data) {
    return apiClient.put(`/categories/${categoryId}`, data);
  },

  async deleteCategory(categoryId) {
    return apiClient.delete(`/categories/${categoryId}`);
  },
};
