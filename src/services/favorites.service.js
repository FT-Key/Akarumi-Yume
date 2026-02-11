import apiClient from '@/lib/axios';

export const favoritesService = {
  /**
   * Obtener favoritos del usuario
   */
  async getFavorites() {
    return await apiClient.get('/favorites');
  },

  /**
   * Toggle producto en favoritos
   */
  async toggleProduct(productId) {
    return await apiClient.post('/favorites', { productId });
  },

  /**
   * Verificar si un producto está en favoritos
   */
  async isFavorite(productId) {
    return await apiClient.get(`/favorites/${productId}`);
  },

  /**
   * Remover producto de favoritos
   */
  async removeProduct(productId) {
    return await apiClient.delete(`/favorites/${productId}`);
  },

  /**
   * Limpiar favoritos
   */
  async clearFavorites() {
    return await apiClient.delete('/favorites');
  }
};

export default favoritesService;
