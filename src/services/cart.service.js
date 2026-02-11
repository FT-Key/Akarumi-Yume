import apiClient from '@/lib/axios';

export const cartService = {
  /**
   * Obtener carrito del usuario
   */
  async getCart() {
    return await apiClient.get('/cart');
  },

  /**
   * Agregar producto al carrito
   */
  async addItem(productId, quantity = 1, characteristics = []) {
    return await apiClient.post('/cart', {
      productId,
      quantity,
      characteristics
    });
  },

  /**
   * Actualizar cantidad de un item
   */
  async updateItemQuantity(itemId, quantity) {
    return await apiClient.put(`/cart/${itemId}`, { quantity });
  },

  /**
   * Remover item del carrito
   */
  async removeItem(itemId) {
    return await apiClient.delete(`/cart/${itemId}`);
  },

  /**
   * Vaciar carrito
   */
  async clearCart() {
    return await apiClient.delete('/cart');
  }
};

export default cartService;
