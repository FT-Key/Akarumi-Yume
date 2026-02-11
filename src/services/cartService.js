import Cart from '@/models/Cart';
import Product from '@/models/Product';
import ProductImage from '@/models/ProductImage';

export class CartService {
  /**
   * Obtener o crear carrito del usuario
   */
  static async getOrCreateCart(userId) {
    let cart = await Cart.findOne({ user: userId })
      .populate({
        path: 'items.product',
        select: 'name slug price stock isActive'
      });

    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    return cart;
  }

  /**
   * Agregar producto al carrito
   */
  static async addItem(userId, productId, quantity = 1, characteristics = []) {
    // Obtener producto con imagen principal
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    if (!product.isActive) {
      throw new Error('El producto no está disponible');
    }

    // Verificar stock
    if (product.trackInventory && product.stock < quantity) {
      throw new Error(`Stock insuficiente. Solo hay ${product.stock} unidades disponibles`);
    }

    // Obtener imagen principal
    const primaryImage = await ProductImage.findOne({
      product: productId,
      isPrimary: true
    });

    const productData = {
      ...product.toObject(),
      primaryImage: primaryImage?.url || null
    };

    // Obtener o crear carrito
    const cart = await this.getOrCreateCart(userId);

    // Agregar item
    await cart.addItem(productData, quantity, characteristics);

    // Repoblar y retornar
    return await cart.populate({
      path: 'items.product',
      select: 'name slug price stock isActive'
    });
  }

  /**
   * Actualizar cantidad de un item
   */
  static async updateItemQuantity(userId, itemId, quantity) {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    const item = cart.items.id(itemId);
    if (!item) {
      throw new Error('Item no encontrado en el carrito');
    }

    // Verificar stock del producto
    const product = await Product.findById(item.product);
    if (product?.trackInventory && product.stock < quantity) {
      throw new Error(`Stock insuficiente. Solo hay ${product.stock} unidades disponibles`);
    }

    await cart.updateQuantity(itemId, quantity);

    return await cart.populate({
      path: 'items.product',
      select: 'name slug price stock isActive'
    });
  }

  /**
   * Remover item del carrito
   */
  static async removeItem(userId, itemId) {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    await cart.removeItem(itemId);

    return await cart.populate({
      path: 'items.product',
      select: 'name slug price stock isActive'
    });
  }

  /**
   * Vaciar carrito
   */
  static async clearCart(userId) {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    await cart.clear();
    return cart;
  }

  /**
   * Sincronizar carrito después de checkout
   */
  static async syncAfterCheckout(userId, orderItems) {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return;

    // Remover items que fueron comprados
    const orderProductIds = orderItems.map(item => item.product.toString());
    cart.items = cart.items.filter(
      item => !orderProductIds.includes(item.product.toString())
    );

    await cart.save();
    return cart;
  }
}

export default CartService;
