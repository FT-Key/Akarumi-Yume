#!/bin/bash
# =============================================================
# Migración de Context API a Zustand + Cart & Favorites
# Ejecutar desde la raíz del proyecto
# Uso: bash migrate-to-zustand.sh
# =============================================================

echo "🔄 Migrando de Context API a Zustand..."
echo "📦 Agregando Cart y Favorites como entidades..."
echo ""

# ─── LIMPIAR CONTEXTS ANTIGUOS ───────────────────────────────
echo "🗑️  Eliminando contexts antiguos..."
rm -rf src/contexts

# ─── INSTALAR ZUSTAND ─────────────────────────────────────────
echo "📦 Instalando Zustand..."
npm install zustand

# ─── CREAR CARPETA DE STORES ──────────────────────────────────
mkdir -p src/stores

# ═════════════════════════════════════════════════════════════
# BACKEND - MODELOS
# ═════════════════════════════════════════════════════════════

echo "🔧 Creando modelos de Cart y Favorites..."

# ─── Cart Model ───────────────────────────────────────────────
cat > src/models/Cart.js << 'CARTMODEL'
import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  // Snapshot del producto para mantener info si el producto cambia
  productSnapshot: {
    name: String,
    slug: String,
    price: Number,
    primaryImage: String
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'La cantidad debe ser al menos 1'],
    default: 1
  },
  // Características seleccionadas (ej: talla, color)
  selectedCharacteristics: [{
    key: String,
    label: String,
    value: mongoose.Schema.Types.Mixed
  }],
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    items: [cartItemSchema],
    // Total calculado
    subtotal: {
      type: Number,
      default: 0
    },
    // Fecha de última modificación
    lastModified: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual para cantidad total de items
cartSchema.virtual('totalItems').get(function () {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

// Middleware para actualizar subtotal y lastModified
cartSchema.pre('save', function (next) {
  this.subtotal = this.items.reduce((sum, item) => {
    return sum + (item.productSnapshot.price * item.quantity);
  }, 0);
  this.lastModified = new Date();
  next();
});

// Método para agregar item
cartSchema.methods.addItem = async function (productData, quantity = 1, characteristics = []) {
  // Buscar si el producto ya existe con las mismas características
  const existingItemIndex = this.items.findIndex(item => {
    const sameProduct = item.product.toString() === productData._id.toString();
    const sameCharacteristics = JSON.stringify(item.selectedCharacteristics) === JSON.stringify(characteristics);
    return sameProduct && sameCharacteristics;
  });

  if (existingItemIndex > -1) {
    // Incrementar cantidad
    this.items[existingItemIndex].quantity += quantity;
  } else {
    // Agregar nuevo item
    this.items.push({
      product: productData._id,
      productSnapshot: {
        name: productData.name,
        slug: productData.slug,
        price: productData.price,
        primaryImage: productData.primaryImage || null
      },
      quantity,
      selectedCharacteristics: characteristics
    });
  }

  return this.save();
};

// Método para actualizar cantidad
cartSchema.methods.updateQuantity = async function (itemId, quantity) {
  const item = this.items.id(itemId);
  if (!item) throw new Error('Item no encontrado en el carrito');
  
  if (quantity <= 0) {
    this.items.pull(itemId);
  } else {
    item.quantity = quantity;
  }
  
  return this.save();
};

// Método para remover item
cartSchema.methods.removeItem = async function (itemId) {
  this.items.pull(itemId);
  return this.save();
};

// Método para vaciar carrito
cartSchema.methods.clear = async function () {
  this.items = [];
  return this.save();
};

const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

export default Cart;
CARTMODEL

# ─── Favorite Model ───────────────────────────────────────────
cat > src/models/Favorite.js << 'FAVORITEMODEL'
import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    products: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }],
    lastModified: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Índice único compuesto: un usuario solo puede tener una lista de favoritos
favoriteSchema.index({ user: 1 }, { unique: true });

// Middleware para actualizar lastModified
favoriteSchema.pre('save', function (next) {
  this.lastModified = new Date();
  next();
});

// Método para agregar producto a favoritos
favoriteSchema.methods.addProduct = async function (productId) {
  if (!this.products.includes(productId)) {
    this.products.push(productId);
    await this.save();
  }
  return this;
};

// Método para remover producto de favoritos
favoriteSchema.methods.removeProduct = async function (productId) {
  this.products = this.products.filter(id => id.toString() !== productId.toString());
  await this.save();
  return this;
};

// Método para verificar si un producto está en favoritos
favoriteSchema.methods.hasProduct = function (productId) {
  return this.products.some(id => id.toString() === productId.toString());
};

// Método para limpiar favoritos
favoriteSchema.methods.clear = async function () {
  this.products = [];
  await this.save();
  return this;
};

const Favorite = mongoose.models.Favorite || mongoose.model('Favorite', favoriteSchema);

export default Favorite;
FAVORITEMODEL

# Actualizar index de modelos
cat > src/models/index.js << 'MODELSINDEX'
export { default as User } from './User.js';
export { default as Address } from './Address.js';
export { default as Category } from './Category.js';
export { default as Product } from './Product.js';
export { default as ProductImage } from './ProductImage.js';
export { default as ProductCharacteristic } from './ProductCharacteristic.js';
export { default as DeliveryType } from './DeliveryType.js';
export { default as Order } from './Order.js';
export { default as OrderItem } from './OrderItem.js';
export { default as Payment } from './Payment.js';
export { default as Shipment } from './Shipment.js';
export { default as Cart } from './Cart.js';
export { default as Favorite } from './Favorite.js';
MODELSINDEX

# ═════════════════════════════════════════════════════════════
# BACKEND - SERVICIOS
# ═════════════════════════════════════════════════════════════

echo "🔧 Creando servicios backend de Cart y Favorites..."

# ─── Cart Service ─────────────────────────────────────────────
cat > src/services/cartService.js << 'CARTSERVICE'
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
CARTSERVICE

# ─── Favorite Service ─────────────────────────────────────────
cat > src/services/favoriteService.js << 'FAVORITESERVICE'
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
FAVORITESERVICE

# ═════════════════════════════════════════════════════════════
# BACKEND - API ROUTES
# ═════════════════════════════════════════════════════════════

echo "🔧 Creando rutas API de Cart y Favorites..."

# ─── Cart Routes ──────────────────────────────────────────────
mkdir -p src/app/api/cart

cat > src/app/api/cart/route.js << 'CARTROUTE'
import { NextResponse } from 'next/server';
import { CartService } from '@/services/cartService';
import connectDB from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

/**
 * GET /api/cart
 * Obtener carrito del usuario autenticado
 */
export async function GET(request) {
  try {
    await connectDB();

    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    const cart = await CartService.getOrCreateCart(user.id);

    return NextResponse.json({
      success: true,
      data: cart
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cart
 * Agregar producto al carrito
 */
export async function POST(request) {
  try {
    await connectDB();

    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    const { productId, quantity, characteristics } = await request.json();

    const cart = await CartService.addItem(
      user.id,
      productId,
      quantity || 1,
      characteristics || []
    );

    return NextResponse.json({
      success: true,
      data: cart,
      message: 'Producto agregado al carrito'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/cart
 * Vaciar carrito
 */
export async function DELETE(request) {
  try {
    await connectDB();

    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    const cart = await CartService.clearCart(user.id);

    return NextResponse.json({
      success: true,
      data: cart,
      message: 'Carrito vaciado'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
CARTROUTE

mkdir -p "src/app/api/cart/[itemId]"

cat > "src/app/api/cart/[itemId]/route.js" << 'CARTITEMROUTE'
import { NextResponse } from 'next/server';
import { CartService } from '@/services/cartService';
import connectDB from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

/**
 * PUT /api/cart/:itemId
 * Actualizar cantidad de un item
 */
export async function PUT(request, { params }) {
  try {
    await connectDB();

    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    const { itemId } = await params;
    const { quantity } = await request.json();

    const cart = await CartService.updateItemQuantity(user.id, itemId, quantity);

    return NextResponse.json({
      success: true,
      data: cart,
      message: 'Cantidad actualizada'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/cart/:itemId
 * Remover item del carrito
 */
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    const { itemId } = await params;

    const cart = await CartService.removeItem(user.id, itemId);

    return NextResponse.json({
      success: true,
      data: cart,
      message: 'Producto removido del carrito'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
CARTITEMROUTE

# ─── Favorite Routes ──────────────────────────────────────────
mkdir -p src/app/api/favorites

cat > src/app/api/favorites/route.js << 'FAVORITEROUTE'
import { NextResponse } from 'next/server';
import { FavoriteService } from '@/services/favoriteService';
import connectDB from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

/**
 * GET /api/favorites
 * Obtener favoritos del usuario autenticado
 */
export async function GET(request) {
  try {
    await connectDB();

    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    const favorites = await FavoriteService.getOrCreateFavorites(user.id);

    return NextResponse.json({
      success: true,
      data: favorites
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/favorites
 * Toggle producto en favoritos
 */
export async function POST(request) {
  try {
    await connectDB();

    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    const { productId } = await request.json();

    const favorites = await FavoriteService.toggleProduct(user.id, productId);

    return NextResponse.json({
      success: true,
      data: favorites
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/favorites
 * Limpiar favoritos
 */
export async function DELETE(request) {
  try {
    await connectDB();

    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    const favorites = await FavoriteService.clearFavorites(user.id);

    return NextResponse.json({
      success: true,
      data: favorites,
      message: 'Favoritos limpiados'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
FAVORITEROUTE

mkdir -p "src/app/api/favorites/[productId]"

cat > "src/app/api/favorites/[productId]/route.js" << 'FAVORITEPRODUCTROUTE'
import { NextResponse } from 'next/server';
import { FavoriteService } from '@/services/favoriteService';
import connectDB from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

/**
 * GET /api/favorites/:productId
 * Verificar si un producto está en favoritos
 */
export async function GET(request, { params }) {
  try {
    await connectDB();

    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    const { productId } = await params;

    const isFavorite = await FavoriteService.isFavorite(user.id, productId);

    return NextResponse.json({
      success: true,
      data: { isFavorite }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/favorites/:productId
 * Remover producto de favoritos
 */
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    const { productId } = await params;

    const favorites = await FavoriteService.removeProduct(user.id, productId);

    return NextResponse.json({
      success: true,
      data: favorites,
      message: 'Producto removido de favoritos'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
FAVORITEPRODUCTROUTE

echo "✅ Backend completado: Modelos, Servicios y Rutas API"
echo ""

# Continuará en la siguiente parte...
MIGRATE_TO_ZUSTAND_SCRIPT

chmod +x migrate-to-zustand.sh

echo "✅ Script creado: migrate-to-zustand.sh"
echo "📝 Ejecuta: bash migrate-to-zustand.sh"
#!/bin/bash
# =============================================================
# Parte 2: Zustand Stores y Servicios Frontend
# =============================================================

echo "🎨 Creando Zustand Stores..."
echo ""

# ═════════════════════════════════════════════════════════════
# ZUSTAND STORES
# ═════════════════════════════════════════════════════════════

# ─── Auth Store ───────────────────────────────────────────────
cat > src/stores/useAuthStore.js << 'AUTHSTORE'
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // Estado
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Acciones
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setToken: (token) => set({ token }),
      
      login: (user, token) => set({ 
        user, 
        token, 
        isAuthenticated: true 
      }),
      
      logout: () => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        });
        // Limpiar localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      },
      
      updateUser: (userData) => set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null
      })),

      setLoading: (isLoading) => set({ isLoading }),

      // Helpers
      isAdmin: () => {
        const { user } = get();
        return user?.role === 'ADMIN';
      },

      hasPermission: (permission) => {
        const { user } = get();
        // Implementar lógica de permisos según necesites
        return user?.permissions?.includes(permission) || false;
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;
AUTHSTORE

# ─── Cart Store ───────────────────────────────────────────────
cat > src/stores/useCartStore.js << 'CARTSTORE'
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      // Estado
      items: [],
      subtotal: 0,
      totalItems: 0,
      isLoading: false,
      lastSync: null,

      // Acciones
      setCart: (cartData) => {
        set({
          items: cartData.items || [],
          subtotal: cartData.subtotal || 0,
          totalItems: cartData.totalItems || 0,
          lastSync: new Date().toISOString()
        });
      },

      addItem: (item) => {
        const { items } = get();
        const existingIndex = items.findIndex(
          i => i.product._id === item.product._id &&
          JSON.stringify(i.selectedCharacteristics) === JSON.stringify(item.selectedCharacteristics)
        );

        if (existingIndex > -1) {
          // Incrementar cantidad
          const newItems = [...items];
          newItems[existingIndex].quantity += item.quantity || 1;
          set({ items: newItems });
        } else {
          // Agregar nuevo item
          set({ items: [...items, item] });
        }

        get().calculateTotals();
      },

      updateQuantity: (itemId, quantity) => {
        const { items } = get();
        if (quantity <= 0) {
          set({ items: items.filter(item => item._id !== itemId) });
        } else {
          const newItems = items.map(item =>
            item._id === itemId ? { ...item, quantity } : item
          );
          set({ items: newItems });
        }
        get().calculateTotals();
      },

      removeItem: (itemId) => {
        const { items } = get();
        set({ items: items.filter(item => item._id !== itemId) });
        get().calculateTotals();
      },

      clearCart: () => {
        set({
          items: [],
          subtotal: 0,
          totalItems: 0
        });
      },

      calculateTotals: () => {
        const { items } = get();
        const subtotal = items.reduce((sum, item) => {
          return sum + (item.productSnapshot.price * item.quantity);
        }, 0);
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        set({ subtotal, totalItems });
      },

      setLoading: (isLoading) => set({ isLoading }),

      // Helpers
      getItemCount: () => {
        const { totalItems } = get();
        return totalItems;
      },

      hasItem: (productId) => {
        const { items } = get();
        return items.some(item => item.product._id === productId);
      },

      getItem: (productId) => {
        const { items } = get();
        return items.find(item => item.product._id === productId);
      }
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      // No persistir isLoading
      partialize: (state) => ({
        items: state.items,
        subtotal: state.subtotal,
        totalItems: state.totalItems,
        lastSync: state.lastSync
      })
    }
  )
);

export default useCartStore;
CARTSTORE

# ─── Favorites Store ──────────────────────────────────────────
cat > src/stores/useFavoritesStore.js << 'FAVORITESSTORE'
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      // Estado
      products: [],
      isLoading: false,
      lastSync: null,

      // Acciones
      setFavorites: (productsData) => {
        set({
          products: productsData || [],
          lastSync: new Date().toISOString()
        });
      },

      addProduct: (product) => {
        const { products } = get();
        if (!products.find(p => p._id === product._id)) {
          set({ products: [...products, product] });
        }
      },

      removeProduct: (productId) => {
        const { products } = get();
        set({ products: products.filter(p => p._id !== productId) });
      },

      toggleProduct: (product) => {
        const { products } = get();
        const exists = products.find(p => p._id === product._id);
        
        if (exists) {
          get().removeProduct(product._id);
        } else {
          get().addProduct(product);
        }
      },

      clearFavorites: () => {
        set({ products: [] });
      },

      setLoading: (isLoading) => set({ isLoading }),

      // Helpers
      isFavorite: (productId) => {
        const { products } = get();
        return products.some(p => p._id === productId);
      },

      getCount: () => {
        const { products } = get();
        return products.length;
      }
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        products: state.products,
        lastSync: state.lastSync
      })
    }
  )
);

export default useFavoritesStore;
FAVORITESSTORE

# ─── UI Store ─────────────────────────────────────────────────
cat > src/stores/useUIStore.js << 'UISTORE'
import { create } from 'zustand';

export const useUIStore = create((set) => ({
  // Estado
  isSidebarOpen: false,
  isCartDrawerOpen: false,
  isMobileMenuOpen: false,
  isFilterDrawerOpen: false,
  notification: null,
  loading: {
    global: false,
    components: {}
  },

  // Sidebar
  openSidebar: () => set({ isSidebarOpen: true }),
  closeSidebar: () => set({ isSidebarOpen: false }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  // Cart Drawer
  openCartDrawer: () => set({ isCartDrawerOpen: true }),
  closeCartDrawer: () => set({ isCartDrawerOpen: false }),
  toggleCartDrawer: () => set((state) => ({ isCartDrawerOpen: !state.isCartDrawerOpen })),

  // Mobile Menu
  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

  // Filter Drawer
  openFilterDrawer: () => set({ isFilterDrawerOpen: true }),
  closeFilterDrawer: () => set({ isFilterDrawerOpen: false }),
  toggleFilterDrawer: () => set((state) => ({ isFilterDrawerOpen: !state.isFilterDrawerOpen })),

  // Notifications
  showNotification: (notification) => set({ notification }),
  hideNotification: () => set({ notification: null }),

  // Loading
  setGlobalLoading: (loading) => set((state) => ({
    loading: { ...state.loading, global: loading }
  })),
  
  setComponentLoading: (componentId, loading) => set((state) => ({
    loading: {
      ...state.loading,
      components: {
        ...state.loading.components,
        [componentId]: loading
      }
    }
  })),

  // Reset
  resetUI: () => set({
    isSidebarOpen: false,
    isCartDrawerOpen: false,
    isMobileMenuOpen: false,
    isFilterDrawerOpen: false,
    notification: null,
    loading: {
      global: false,
      components: {}
    }
  })
}));

export default useUIStore;
UISTORE

# ─── Index de Stores ──────────────────────────────────────────
cat > src/stores/index.js << 'STORESINDEX'
export { useAuthStore } from './useAuthStore';
export { useCartStore } from './useCartStore';
export { useFavoritesStore } from './useFavoritesStore';
export { useUIStore } from './useUIStore';
STORESINDEX

echo "✅ Zustand Stores creados"
echo ""

# ═════════════════════════════════════════════════════════════
# SERVICIOS FRONTEND
# ═════════════════════════════════════════════════════════════

echo "🎨 Creando servicios frontend..."

# ─── Cart Service (Frontend) ──────────────────────────────────
cat > src/services/cart.service.js << 'CARTSERVICEFRONT'
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
    return await apiClient.put(\`/cart/\${itemId}\`, { quantity });
  },

  /**
   * Remover item del carrito
   */
  async removeItem(itemId) {
    return await apiClient.delete(\`/cart/\${itemId}\`);
  },

  /**
   * Vaciar carrito
   */
  async clearCart() {
    return await apiClient.delete('/cart');
  }
};

export default cartService;
CARTSERVICEFRONT

# ─── Favorites Service (Frontend) ─────────────────────────────
cat > src/services/favorites.service.js << 'FAVORITESSERVICEFRONT'
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
    return await apiClient.get(\`/favorites/\${productId}\`);
  },

  /**
   * Remover producto de favoritos
   */
  async removeProduct(productId) {
    return await apiClient.delete(\`/favorites/\${productId}\`);
  },

  /**
   * Limpiar favoritos
   */
  async clearFavorites() {
    return await apiClient.delete('/favorites');
  }
};

export default favoritesService;
FAVORITESSERVICEFRONT

echo "✅ Servicios frontend creados"
echo ""

# ═════════════════════════════════════════════════════════════
# HOOKS PERSONALIZADOS
# ═════════════════════════════════════════════════════════════

echo "🎨 Creando hooks personalizados..."

mkdir -p src/hooks

# ─── useCart Hook ─────────────────────────────────────────────
cat > src/hooks/useCart.js << 'USECARTHOOK'
import { useEffect } from 'react';
import { useCartStore } from '@/stores/useCartStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { cartService } from '@/services/cart.service';
import { toast } from 'sonner';

export const useCart = () => {
  const { isAuthenticated } = useAuthStore();
  const {
    items,
    subtotal,
    totalItems,
    isLoading,
    setCart,
    addItem: addItemStore,
    updateQuantity: updateQuantityStore,
    removeItem: removeItemStore,
    clearCart: clearCartStore,
    setLoading,
    calculateTotals,
    getItemCount,
    hasItem,
    getItem
  } = useCartStore();

  // Sincronizar con el servidor cuando el usuario inicia sesión
  useEffect(() => {
    if (isAuthenticated) {
      syncCart();
    }
  }, [isAuthenticated]);

  // Sincronizar carrito desde el servidor
  const syncCart = async () => {
    try {
      setLoading(true);
      const response = await cartService.getCart();
      if (response.success) {
        setCart(response.data);
      }
    } catch (error) {
      console.error('Error syncing cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // Agregar producto al carrito
  const addItem = async (product, quantity = 1, characteristics = []) => {
    try {
      setLoading(true);

      if (isAuthenticated) {
        // Si está autenticado, agregar en el servidor
        const response = await cartService.addItem(
          product._id,
          quantity,
          characteristics
        );
        
        if (response.success) {
          setCart(response.data);
          toast.success('Producto agregado al carrito');
        }
      } else {
        // Si no está autenticado, agregar localmente
        const item = {
          _id: \`local-\${Date.now()}\`,
          product: {
            _id: product._id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            stock: product.stock,
            isActive: product.isActive
          },
          productSnapshot: {
            name: product.name,
            slug: product.slug,
            price: product.price,
            primaryImage: product.primaryImage
          },
          quantity,
          selectedCharacteristics: characteristics,
          addedAt: new Date()
        };
        
        addItemStore(item);
        toast.success('Producto agregado al carrito');
      }
    } catch (error) {
      toast.error(error.message || 'Error al agregar producto');
    } finally {
      setLoading(false);
    }
  };

  // Actualizar cantidad
  const updateQuantity = async (itemId, quantity) => {
    try {
      setLoading(true);

      if (isAuthenticated) {
        const response = await cartService.updateItemQuantity(itemId, quantity);
        if (response.success) {
          setCart(response.data);
          toast.success('Cantidad actualizada');
        }
      } else {
        updateQuantityStore(itemId, quantity);
        toast.success('Cantidad actualizada');
      }
    } catch (error) {
      toast.error(error.message || 'Error al actualizar cantidad');
    } finally {
      setLoading(false);
    }
  };

  // Remover item
  const removeItem = async (itemId) => {
    try {
      setLoading(true);

      if (isAuthenticated) {
        const response = await cartService.removeItem(itemId);
        if (response.success) {
          setCart(response.data);
          toast.success('Producto removido');
        }
      } else {
        removeItemStore(itemId);
        toast.success('Producto removido');
      }
    } catch (error) {
      toast.error(error.message || 'Error al remover producto');
    } finally {
      setLoading(false);
    }
  };

  // Vaciar carrito
  const clearCart = async () => {
    try {
      setLoading(true);

      if (isAuthenticated) {
        const response = await cartService.clearCart();
        if (response.success) {
          clearCartStore();
          toast.success('Carrito vaciado');
        }
      } else {
        clearCartStore();
        toast.success('Carrito vaciado');
      }
    } catch (error) {
      toast.error(error.message || 'Error al vaciar carrito');
    } finally {
      setLoading(false);
    }
  };

  return {
    // Estado
    items,
    subtotal,
    totalItems,
    isLoading,

    // Acciones
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    syncCart,

    // Helpers
    getItemCount,
    hasItem,
    getItem,
    isEmpty: items.length === 0
  };
};

export default useCart;
USECARTHOOK

# ─── useFavorites Hook ────────────────────────────────────────
cat > src/hooks/useFavorites.js << 'USEFAVORITESHOOK'
import { useEffect } from 'react';
import { useFavoritesStore } from '@/stores/useFavoritesStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { favoritesService } from '@/services/favorites.service';
import { toast } from 'sonner';

export const useFavorites = () => {
  const { isAuthenticated } = useAuthStore();
  const {
    products,
    isLoading,
    setFavorites,
    addProduct: addProductStore,
    removeProduct: removeProductStore,
    toggleProduct: toggleProductStore,
    clearFavorites: clearFavoritesStore,
    setLoading,
    isFavorite,
    getCount
  } = useFavoritesStore();

  // Sincronizar con el servidor cuando el usuario inicia sesión
  useEffect(() => {
    if (isAuthenticated) {
      syncFavorites();
    }
  }, [isAuthenticated]);

  // Sincronizar favoritos desde el servidor
  const syncFavorites = async () => {
    try {
      setLoading(true);
      const response = await favoritesService.getFavorites();
      if (response.success) {
        setFavorites(response.data.products);
      }
    } catch (error) {
      console.error('Error syncing favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle producto en favoritos
  const toggleProduct = async (product) => {
    try {
      setLoading(true);

      if (isAuthenticated) {
        const response = await favoritesService.toggleProduct(product._id);
        if (response.success) {
          setFavorites(response.data.products);
          
          const wasFavorite = isFavorite(product._id);
          toast.success(
            wasFavorite 
              ? 'Removido de favoritos' 
              : 'Agregado a favoritos'
          );
        }
      } else {
        toggleProductStore(product);
        const wasFavorite = isFavorite(product._id);
        toast.success(
          wasFavorite 
            ? 'Agregado a favoritos' 
            : 'Removido de favoritos'
        );
      }
    } catch (error) {
      toast.error(error.message || 'Error al actualizar favoritos');
    } finally {
      setLoading(false);
    }
  };

  // Remover producto
  const removeProduct = async (productId) => {
    try {
      setLoading(true);

      if (isAuthenticated) {
        const response = await favoritesService.removeProduct(productId);
        if (response.success) {
          setFavorites(response.data.products);
          toast.success('Removido de favoritos');
        }
      } else {
        removeProductStore(productId);
        toast.success('Removido de favoritos');
      }
    } catch (error) {
      toast.error(error.message || 'Error al remover de favoritos');
    } finally {
      setLoading(false);
    }
  };

  // Limpiar favoritos
  const clearFavorites = async () => {
    try {
      setLoading(true);

      if (isAuthenticated) {
        const response = await favoritesService.clearFavorites();
        if (response.success) {
          clearFavoritesStore();
          toast.success('Favoritos limpiados');
        }
      } else {
        clearFavoritesStore();
        toast.success('Favoritos limpiados');
      }
    } catch (error) {
      toast.error(error.message || 'Error al limpiar favoritos');
    } finally {
      setLoading(false);
    }
  };

  return {
    // Estado
    products,
    isLoading,

    // Acciones
    toggleProduct,
    removeProduct,
    clearFavorites,
    syncFavorites,

    // Helpers
    isFavorite,
    getCount,
    isEmpty: products.length === 0
  };
};

export default useFavorites;
USEFAVORITESHOOK

echo "✅ Hooks personalizados creados"
echo ""

echo "📝 Continuará con Providers y componentes..."
#!/bin/bash
# =============================================================
# Parte 3: Providers, Páginas y Componentes
# =============================================================

echo "🎨 Actualizando Providers..."
echo ""

# ═════════════════════════════════════════════════════════════
# PROVIDERS ACTUALIZADOS
# ═════════════════════════════════════════════════════════════

cat > src/providers.js << 'PROVIDERS'
"use client";

import { Toaster } from 'sonner';

/**
 * Providers simplificado sin Context API
 * Zustand no necesita providers, funciona globalmente
 */
export function Providers({ children }) {
  return (
    <>
      {children}
      {/* Toast notifications */}
      <Toaster position="top-right" richColors />
    </>
  );
}
PROVIDERS

echo "✅ Providers actualizado"
echo ""

# ═════════════════════════════════════════════════════════════
# PÁGINAS
# ═════════════════════════════════════════════════════════════

echo "🎨 Creando páginas de Cart y Favorites..."

# ─── Cart Page ────────────────────────────────────────────────
cat > "src/app/(shop)/carrito/page.jsx" << 'CARTPAGE'
"use client";

import { useCart } from '@/hooks/useCart';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { 
    items, 
    subtotal, 
    totalItems, 
    isLoading, 
    updateQuantity, 
    removeItem,
    isEmpty 
  } = useCart();

  if (isEmpty) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Tu carrito está vacío</h1>
        <p className="text-gray-600 mb-6">
          Agrega productos para comenzar tu compra
        </p>
        <button
          onClick={() => router.push('/productos')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Ir a la tienda
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Carrito de Compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white border rounded-lg p-4 flex gap-4"
            >
              {/* Imagen */}
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={item.productSnapshot.primaryImage || '/placeholder.png'}
                  alt={item.productSnapshot.name}
                  fill
                  className="object-cover rounded"
                />
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">
                  {item.productSnapshot.name}
                </h3>
                
                {/* Características */}
                {item.selectedCharacteristics?.length > 0 && (
                  <div className="text-sm text-gray-600 mb-2">
                    {item.selectedCharacteristics.map((char, i) => (
                      <span key={i}>
                        {char.label}: {char.value}
                        {i < item.selectedCharacteristics.length - 1 && ' | '}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-lg font-bold text-blue-600">
                  \${item.productSnapshot.price.toLocaleString()}
                </p>

                {/* Controles de cantidad */}
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center border rounded">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      disabled={isLoading}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      disabled={isLoading}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item._id)}
                    disabled={isLoading}
                    className="text-red-600 hover:text-red-700 disabled:opacity-50"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Subtotal del item */}
              <div className="text-right">
                <p className="text-sm text-gray-600">Subtotal</p>
                <p className="text-xl font-bold">
                  \${(item.productSnapshot.price * item.quantity).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen */}
        <div className="lg:col-span-1">
          <div className="bg-white border rounded-lg p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Resumen del Pedido</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Productos ({totalItems})</span>
                <span className="font-semibold">
                  \${subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Envío</span>
                <span className="text-gray-600">A calcular</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">
                    \${subtotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              Proceder al Checkout
            </button>

            <button
              onClick={() => router.push('/productos')}
              className="w-full mt-3 border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50"
            >
              Seguir Comprando
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
CARTPAGE

# ─── Favorites Page ───────────────────────────────────────────
mkdir -p "src/app/(user)/favoritos"

cat > "src/app/(user)/favoritos/page.jsx" << 'FAVORITESPAGE'
"use client";

import { useFavorites } from '@/hooks/useFavorites';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

export default function FavoritesPage() {
  const router = useRouter();
  const { products, isLoading, removeProduct, isEmpty } = useFavorites();
  const { addItem } = useCart();

  const handleAddToCart = async (product) => {
    await addItem(product);
  };

  if (isEmpty) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Heart className="w-24 h-24 mx-auto text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold mb-2">No tienes favoritos</h1>
        <p className="text-gray-600 mb-6">
          Guarda productos que te gusten para verlos más tarde
        </p>
        <button
          onClick={() => router.push('/productos')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Explorar Productos
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Mis Favoritos</h1>
        <span className="text-gray-600">
          {products.length} {products.length === 1 ? 'producto' : 'productos'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Imagen */}
            <div className="relative aspect-square">
              <Image
                src={product.images?.[0]?.url || '/placeholder.png'}
                alt={product.name}
                fill
                className="object-cover"
              />
              
              {/* Botón remover */}
              <button
                onClick={() => removeProduct(product._id)}
                disabled={isLoading}
                className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 className="w-5 h-5 text-red-600" />
              </button>

              {/* Badge sin stock */}
              {product.stock === 0 && (
                <div className="absolute top-2 left-2 bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold">
                  Sin Stock
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-4">
              <h3
                onClick={() => router.push(\`/productos/\${product.slug}\`)}
                className="font-semibold text-lg mb-2 hover:text-blue-600 cursor-pointer line-clamp-2"
              >
                {product.name}
              </h3>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    \${product.price.toLocaleString()}
                  </p>
                  {product.compareAtPrice && (
                    <p className="text-sm text-gray-500 line-through">
                      \${product.compareAtPrice.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              {/* Botón agregar al carrito */}
              <button
                onClick={() => handleAddToCart(product)}
                disabled={!product.isActive || product.stock === 0 || isLoading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                {product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
FAVORITESPAGE

echo "✅ Páginas creadas"
echo ""

# ═════════════════════════════════════════════════════════════
# COMPONENTES
# ═════════════════════════════════════════════════════════════

echo "🎨 Creando componentes..."

# ─── FavoriteButton Component ─────────────────────────────────
cat > src/components/product/FavoriteButton.jsx << 'FAVORITEBUTTON'
"use client";

import { Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';

export function FavoriteButton({ product, className = "" }) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { isFavorite, toggleProduct, isLoading } = useFavorites();

  const favorite = isFavorite(product._id);

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isAuthenticated) {
      router.push('/iniciar-sesion');
      return;
    }

    toggleProduct(product);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={\`\${className} disabled:opacity-50\`}
      aria-label={favorite ? 'Remover de favoritos' : 'Agregar a favoritos'}
    >
      <Heart
        className={\`w-6 h-6 transition-colors \${
          favorite
            ? 'fill-red-500 text-red-500'
            : 'text-gray-600 hover:text-red-500'
        }\`}
      />
    </button>
  );
}
FAVORITEBUTTON

# ─── CartButton Component ─────────────────────────────────────
cat > src/components/cart/CartButton.jsx << 'CARTBUTTON'
"use client";

import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useUIStore } from '@/stores/useUIStore';

export function CartButton() {
  const { totalItems } = useCart();
  const { openCartDrawer } = useUIStore();

  return (
    <button
      onClick={openCartDrawer}
      className="relative p-2 hover:bg-gray-100 rounded-full"
      aria-label="Abrir carrito"
    >
      <ShoppingCart className="w-6 h-6" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {totalItems > 9 ? '9+' : totalItems}
        </span>
      )}
    </button>
  );
}
CARTBUTTON

# ─── AddToCartButton Component ────────────────────────────────
cat > src/components/product/AddToCartButton.jsx << 'ADDTOCARTBUTTON'
"use client";

import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuthStore } from '@/stores/useAuthStore';

export function AddToCartButton({ 
  product, 
  quantity = 1,
  characteristics = [],
  variant = 'primary', 
  className = "" 
}) {
  const { isAuthenticated } = useAuthStore();
  const { addItem, isLoading } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    setAdding(true);
    try {
      await addItem(product, quantity, characteristics);
    } finally {
      setAdding(false);
    }
  };

  const isDisabled = !product.isActive || product.stock === 0 || isLoading || adding;

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'border border-blue-600 text-blue-600 hover:bg-blue-50',
    outline: 'border border-gray-300 hover:border-blue-600 hover:text-blue-600'
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isDisabled}
      className={\`\${variants[variant]} \${className} px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2\`}
    >
      <ShoppingCart className="w-5 h-5" />
      {adding ? 'Agregando...' : product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
    </button>
  );
}
ADDTOCARTBUTTON

echo "✅ Componentes creados"
echo ""

# ═════════════════════════════════════════════════════════════
# ACTUALIZAR LIB/AUTH
# ═════════════════════════════════════════════════════════════

cat > src/lib/auth.js << 'AUTHLIB'
import jwt from 'jsonwebtoken';

/**
 * Verificar token JWT en el servidor
 */
export async function verifyToken(request) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    return {
      id: decoded.userId,
      role: decoded.role
    };
  } catch (error) {
    return null;
  }
}

export default verifyToken;
AUTHLIB

echo "✅ Lib/auth actualizado"
echo ""

# ═════════════════════════════════════════════════════════════
# INSTALAR DEPENDENCIAS NECESARIAS
# ═════════════════════════════════════════════════════════════

echo "📦 Instalando dependencias adicionales..."
npm install sonner lucide-react

echo ""
echo "✅ ¡Migración completada!"
echo ""
echo "📝 Resumen de cambios:"
echo "  ✅ Contexts eliminados"
echo "  ✅ Zustand stores creados (auth, cart, favorites, ui)"
echo "  ✅ Modelos Cart y Favorite agregados al backend"
echo "  ✅ Servicios backend creados"
echo "  ✅ Rutas API creadas (/api/cart, /api/favorites)"
echo "  ✅ Servicios frontend creados"
echo "  ✅ Hooks personalizados creados (useCart, useFavorites)"
echo "  ✅ Providers actualizado (sin contexts)"
echo "  ✅ Páginas de Cart y Favorites creadas"
echo "  ✅ Componentes reutilizables creados"
echo ""
echo "🚀 Próximos pasos:"
echo "  1. Actualizar componentes existentes para usar Zustand"
echo "  2. Probar la funcionalidad de cart y favorites"
echo "  3. Ajustar estilos según tu diseño"
echo ""