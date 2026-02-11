import Favorite from '@/models/Favorite';
import Product from '@/models/Product';

export class FavoriteService {
  /**
   * Obtener o crear lista de favoritos del usuario
   */
  static async getOrCreateFavorites(userId) {
    let favorites = await Favorite.findOne({ user: userId })
      .populate({
        path: 'products',
        select: 'name slug price compareAtPrice stock isActive',
        populate: {
          path: 'images',
          match: { isPrimary: true }
        }
      });

    if (!favorites) {
      favorites = await Favorite.create({ user: userId, products: [] });
    }

    return favorites;
  }

  /**
   * Agregar producto a favoritos
   */
  static async addProduct(userId, productId) {
    // Verificar que el producto exista
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    // Obtener o crear favoritos
    const favorites = await this.getOrCreateFavorites(userId);

    // Agregar producto
    await favorites.addProduct(productId);

    // Repoblar y retornar
    return await favorites.populate({
      path: 'products',
      select: 'name slug price compareAtPrice stock isActive',
      populate: {
        path: 'images',
        match: { isPrimary: true }
      }
    });
  }

  /**
   * Remover producto de favoritos
   */
  static async removeProduct(userId, productId) {
    const favorites = await Favorite.findOne({ user: userId });
    if (!favorites) {
      throw new Error('Lista de favoritos no encontrada');
    }

    await favorites.removeProduct(productId);

    return await favorites.populate({
      path: 'products',
      select: 'name slug price compareAtPrice stock isActive',
      populate: {
        path: 'images',
        match: { isPrimary: true }
      }
    });
  }

  /**
   * Toggle producto (agregar/remover)
   */
  static async toggleProduct(userId, productId) {
    const favorites = await this.getOrCreateFavorites(userId);

    if (favorites.hasProduct(productId)) {
      await favorites.removeProduct(productId);
    } else {
      await favorites.addProduct(productId);
    }

    return await favorites.populate({
      path: 'products',
      select: 'name slug price compareAtPrice stock isActive',
      populate: {
        path: 'images',
        match: { isPrimary: true }
      }
    });
  }

  /**
   * Verificar si un producto está en favoritos
   */
  static async isFavorite(userId, productId) {
    const favorites = await Favorite.findOne({ user: userId });
    if (!favorites) return false;
    
    return favorites.hasProduct(productId);
  }

  /**
   * Limpiar favoritos
   */
  static async clearFavorites(userId) {
    const favorites = await Favorite.findOne({ user: userId });
    if (!favorites) {
      throw new Error('Lista de favoritos no encontrada');
    }

    await favorites.clear();
    return favorites;
  }
}

export default FavoriteService;
