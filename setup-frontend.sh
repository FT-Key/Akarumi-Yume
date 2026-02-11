#!/bin/bash
# =============================================================
# E-Commerce Frontend - Setup de estructura completa
# Ejecutar desde la raíz del proyecto (donde está src/)
# Uso: bash setup-frontend.sh
# =============================================================

echo "🎨 Creando estructura Frontend E-Commerce..."
echo ""

# ─── PÁGINAS (Next.js App Router) ────────────────────────────

# Auth routes
mkdir -p "src/app/(auth)/iniciar-sesion"
mkdir -p "src/app/(auth)/registrarse"
mkdir -p "src/app/(auth)/recuperar-contraseña"
mkdir -p "src/app/(auth)/restablecer-contraseña/[token]"

# Shop routes
mkdir -p "src/app/(shop)/productos"
mkdir -p "src/app/(shop)/productos/[slug]"
mkdir -p "src/app/(shop)/categorias/[slug]"
mkdir -p "src/app/(shop)/carrito"
mkdir -p "src/app/(shop)/checkout"
mkdir -p "src/app/(shop)/checkout/pago"
mkdir -p "src/app/(shop)/checkout/exito"
mkdir -p "src/app/(shop)/checkout/pendiente"
mkdir -p "src/app/(shop)/checkout/error"
mkdir -p "src/app/(shop)/buscar"

# User routes
mkdir -p "src/app/(user)/mi-perfil"
mkdir -p "src/app/(user)/mi-perfil/editar"
mkdir -p "src/app/(user)/mis-direcciones"
mkdir -p "src/app/(user)/mis-ordenes"
mkdir -p "src/app/(user)/mis-ordenes/[id]"

# Admin routes
mkdir -p src/app/admin
mkdir -p src/app/admin/productos
mkdir -p src/app/admin/productos/crear
mkdir -p "src/app/admin/productos/editar/[id]"
mkdir -p src/app/admin/categorias
mkdir -p src/app/admin/categorias/crear
mkdir -p "src/app/admin/categorias/editar/[id]"
mkdir -p src/app/admin/ordenes
mkdir -p "src/app/admin/ordenes/[id]"
mkdir -p src/app/admin/usuarios
mkdir -p "src/app/admin/usuarios/[id]"
mkdir -p src/app/admin/envios
mkdir -p "src/app/admin/envios/[id]"
mkdir -p src/app/admin/configuracion

# Institutional routes
mkdir -p src/app/sobre-nosotros
mkdir -p src/app/contacto
mkdir -p src/app/terminos-y-condiciones
mkdir -p src/app/politica-de-privacidad
mkdir -p src/app/preguntas-frecuentes

# ─── COMPONENTES ──────────────────────────────────────────────
mkdir -p src/components/layout
mkdir -p src/components/product
mkdir -p src/components/filters
mkdir -p src/components/cart
mkdir -p src/components/checkout
mkdir -p src/components/address
mkdir -p src/components/order
mkdir -p src/components/user
mkdir -p src/components/admin
mkdir -p src/components/ui

# ─── SERVICES ─────────────────────────────────────────────────
mkdir -p src/services

# ─── LIB ──────────────────────────────────────────────────────
mkdir -p src/lib

# ─── CONTEXTS ─────────────────────────────────────────────────
mkdir -p src/contexts

# ─── HOOKS ────────────────────────────────────────────────────
mkdir -p src/hooks

# ─── UTILS ────────────────────────────────────────────────────
mkdir -p src/utils

# ─────────────────────────────────────────────────────────────
# ARCHIVOS - LIB (Axios + Auth)
# ─────────────────────────────────────────────────────────────

cat > src/lib/axios.js << 'AXIOSLIB'
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Instancia de Axios configurada
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor de request: agregar token si existe
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de response: manejar errores globales
apiClient.interceptors.response.use(
  (response) => response.data, // Retornar solo data
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/iniciar-sesion';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export default apiClient;
AXIOSLIB

cat > src/lib/auth.js << 'AUTHLIB'
/**
 * Helpers de autenticación
 */

export const saveAuth = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const getAuth = () => {
  const token = localStorage.getItem('token');
  const user  = localStorage.getItem('user');
  return {
    token,
    user: user ? JSON.parse(user) : null,
  };
};

export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const isAdmin = () => {
  const { user } = getAuth();
  return user?.role === 'ADMIN';
};
AUTHLIB

# ─────────────────────────────────────────────────────────────
# ARCHIVOS - SERVICES
# ─────────────────────────────────────────────────────────────

cat > src/services/authService.js << 'AUTHSVC'
import apiClient from '../lib/axios';
import { saveAuth, clearAuth } from '../lib/auth';

export const authService = {
  async login(email, password) {
    const response = await apiClient.post('/auth/login', { email, password });
    saveAuth(response.token, response.user);
    return response;
  },

  async register(userData) {
    const response = await apiClient.post('/users', userData);
    return response;
  },

  logout() {
    clearAuth();
  },

  async requestPasswordReset(email) {
    return apiClient.post('/auth/forgot-password', { email });
  },

  async resetPassword(token, newPassword) {
    return apiClient.post('/auth/reset-password', { token, newPassword });
  },

  async getCurrentUser() {
    return apiClient.get('/auth/me');
  },
};
AUTHSVC

cat > src/services/userService.js << 'USERSVC'
import apiClient from '../lib/axios';

export const userService = {
  async getProfile() {
    return apiClient.get('/users/me');
  },

  async updateProfile(userId, data) {
    return apiClient.put(`/users/${userId}`, data);
  },

  async changePassword(userId, oldPassword, newPassword) {
    return apiClient.put(`/users/${userId}/password`, { oldPassword, newPassword });
  },

  async getUsers(params = {}) {
    return apiClient.get('/users', { params });
  },

  async getUserById(userId) {
    return apiClient.get(`/users/${userId}`);
  },

  async deleteUser(userId) {
    return apiClient.delete(`/users/${userId}`);
  },
};
USERSVC

cat > src/services/addressService.js << 'ADDRSVC'
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
ADDRSVC

cat > src/services/productService.js << 'PRODSVC'
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
PRODSVC

cat > src/services/categoryService.js << 'CATSVC'
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
CATSVC

cat > src/services/orderService.js << 'ORDERSVC'
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
ORDERSVC

cat > src/services/paymentService.js << 'PAYSVC'
import apiClient from '../lib/axios';

export const paymentService = {
  async createPayment(orderId) {
    return apiClient.post('/payments', { orderId });
  },

  async getPaymentById(paymentId) {
    return apiClient.get(`/payments/${paymentId}`);
  },
};
PAYSVC

cat > src/services/shipmentService.js << 'SHIPSVC'
import apiClient from '../lib/axios';

export const shipmentService = {
  async getShipmentById(shipmentId) {
    return apiClient.get(`/shipments/${shipmentId}`);
  },

  async updateShipmentStatus(shipmentId, status, location, note) {
    return apiClient.put(`/shipments/${shipmentId}`, { status, location, note });
  },
};
SHIPSVC

cat > src/services/cartService.js << 'CARTSVC'
/**
 * Servicio de carrito (localStorage)
 * No hace peticiones HTTP, gestiona estado local.
 */

const CART_KEY = 'shopping_cart';

export const cartService = {
  getCart() {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  },

  saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  },

  addItem(product, quantity = 1) {
    const cart = this.getCart();
    const existingIndex = cart.findIndex(item => item.productId === product._id);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.images?.[0]?.url || null,
        quantity,
        stock: product.stock,
      });
    }

    this.saveCart(cart);
    return cart;
  },

  removeItem(productId) {
    let cart = this.getCart();
    cart = cart.filter(item => item.productId !== productId);
    this.saveCart(cart);
    return cart;
  },

  updateQuantity(productId, quantity) {
    const cart = this.getCart();
    const item = cart.find(item => item.productId === productId);
    if (item) {
      item.quantity = quantity;
      this.saveCart(cart);
    }
    return cart;
  },

  clearCart() {
    localStorage.removeItem(CART_KEY);
    return [];
  },

  getTotal() {
    const cart = this.getCart();
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },

  getItemCount() {
    const cart = this.getCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  },
};
CARTSVC

# ─────────────────────────────────────────────────────────────
# ARCHIVOS - CONTEXTS
# ─────────────────────────────────────────────────────────────

cat > src/contexts/AuthContext.jsx << 'AUTHCTX'
'use client';
import { createContext, useState, useEffect } from 'react';
import { getAuth, saveAuth, clearAuth } from '../lib/auth';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { user: storedUser } = getAuth();
    setUser(storedUser);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    setUser(response.user);
    return response;
  };

  const register = async (userData) => {
    return authService.register(userData);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    saveAuth(getAuth().token, updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
AUTHCTX

cat > src/contexts/CartContext.jsx << 'CARTCTX'
'use client';
import { createContext, useState, useEffect } from 'react';
import { cartService } from '../services/cartService';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    setCart(cartService.getCart());
  }, []);

  const addItem = (product, quantity = 1) => {
    const updatedCart = cartService.addItem(product, quantity);
    setCart(updatedCart);
    setIsDrawerOpen(true);
  };

  const removeItem = (productId) => {
    const updatedCart = cartService.removeItem(productId);
    setCart(updatedCart);
  };

  const updateQuantity = (productId, quantity) => {
    const updatedCart = cartService.updateQuantity(productId, quantity);
    setCart(updatedCart);
  };

  const clearCart = () => {
    const updatedCart = cartService.clearCart();
    setCart(updatedCart);
  };

  const total = cartService.getTotal();
  const itemCount = cartService.getItemCount();

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount,
        isDrawerOpen,
        setIsDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
CARTCTX

cat > src/contexts/UIContext.jsx << 'UICTX'
'use client';
import { createContext, useState } from 'react';

export const UIContext = createContext();

export function UIProvider({ children }) {
  const [modalState, setModalState] = useState({ isOpen: false, content: null });
  const [toasts, setToasts] = useState([]);

  const openModal = (content) => {
    setModalState({ isOpen: true, content });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, content: null });
  };

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <UIContext.Provider
      value={{
        modalState,
        openModal,
        closeModal,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}
UICTX

# ─────────────────────────────────────────────────────────────
# ARCHIVOS - HOOKS
# ─────────────────────────────────────────────────────────────

cat > src/hooks/useAuth.js << 'USEAUTH'
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
USEAUTH

cat > src/hooks/useCart.js << 'USECART'
import { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
}
USECART

cat > src/hooks/useDebounce.js << 'USEDEBOUNCE'
import { useState, useEffect } from 'react';

export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
USEDEBOUNCE

cat > src/hooks/useLocalStorage.js << 'USELOCALSTORAGE'
import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}
USELOCALSTORAGE

cat > src/hooks/useMediaQuery.js << 'USEMEDIA'
import { useState, useEffect } from 'react';

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}
USEMEDIA

cat > src/hooks/useProducts.js << 'USEPRODUCTS'
import { useState, useEffect } from 'react';
import { productService } from '../services/productService';

export function useProducts(filters = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await productService.getProducts(filters);
        setProducts(response.data || []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [JSON.stringify(filters)]);

  return { products, loading, error };
}
USEPRODUCTS

cat > src/hooks/useInfiniteScroll.js << 'USEINFINITE'
import { useState, useEffect, useRef } from 'react';

export function useInfiniteScroll(callback, hasMore) {
  const [isFetching, setIsFetching] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetching) {
          setIsFetching(true);
          callback();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isFetching, callback]);

  useEffect(() => {
    if (isFetching) {
      setIsFetching(false);
    }
  }, [isFetching]);

  return observerRef;
}
USEINFINITE

cat > src/hooks/useToast.js << 'USETOAST'
import { useContext } from 'react';
import { UIContext } from '../contexts/UIContext';

export function useToast() {
  const { addToast } = useContext(UIContext);

  return {
    success: (message) => addToast(message, 'success'),
    error: (message) => addToast(message, 'error'),
    info: (message) => addToast(message, 'info'),
    warning: (message) => addToast(message, 'warning'),
  };
}
USETOAST

# ─────────────────────────────────────────────────────────────
# ARCHIVOS - UTILS
# ─────────────────────────────────────────────────────────────

cat > src/utils/constants.js << 'CONSTANTS'
export const ORDER_STATUS = {
  PENDING: 'PENDING',
  PAYMENT_PENDING: 'PAYMENT_PENDING',
  PAID: 'PAID',
  PROCESSING: 'PROCESSING',
  READY_FOR_PICKUP: 'READY_FOR_PICKUP',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
};

export const ORDER_STATUS_LABELS = {
  PENDING: 'Pendiente',
  PAYMENT_PENDING: 'Esperando pago',
  PAID: 'Pagado',
  PROCESSING: 'En preparación',
  READY_FOR_PICKUP: 'Listo para retiro',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
  REFUNDED: 'Reembolsado',
};

export const SHIPMENT_STATUS = {
  PENDING: 'PENDING',
  SHIPPED: 'SHIPPED',
  IN_TRANSIT: 'IN_TRANSIT',
  DELIVERED: 'DELIVERED',
  FAILED: 'FAILED',
  RETURNED: 'RETURNED',
};

export const SHIPMENT_STATUS_LABELS = {
  PENDING: 'Pendiente',
  SHIPPED: 'Despachado',
  IN_TRANSIT: 'En tránsito',
  DELIVERED: 'Entregado',
  FAILED: 'Fallido',
  RETURNED: 'Devuelto',
};

export const DELIVERY_TYPES = {
  PICKUP: 'PICKUP',
  DELIVERY: 'DELIVERY',
};
CONSTANTS

cat > src/utils/formatters.js << 'FORMATTERS'
/**
 * Formatear precio en pesos argentinos
 */
export function formatPrice(price) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(price);
}

/**
 * Formatear fecha
 */
export function formatDate(date, options = {}) {
  return new Intl.DateTimeFormat('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(new Date(date));
}

/**
 * Formatear fecha relativa (hace 2 días)
 */
export function formatRelativeTime(date) {
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} días`;
  if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
  return formatDate(date);
}

/**
 * Truncar texto
 */
export function truncate(text, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
FORMATTERS

cat > src/utils/validators.js << 'VALIDATORS'
/**
 * Validar email
 */
export function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Validar DNI argentino
 */
export function isValidDNI(dni) {
  const cleaned = dni.replace(/\D/g, '');
  return cleaned.length >= 7 && cleaned.length <= 8;
}

/**
 * Validar teléfono argentino
 */
export function isValidPhone(phone) {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10;
}

/**
 * Validar password
 */
export function isValidPassword(password) {
  return password.length >= 8;
}

/**
 * Validar código postal argentino
 */
export function isValidPostalCode(code) {
  // Formatos: 4000, T4000, T4000ABC
  const re = /^[A-Z]?\d{4}[A-Z]{0,3}$/;
  return re.test(code);
}
VALIDATORS

cat > src/utils/localStorage.js << 'LOCALSTORAGE'
/**
 * Guardar en localStorage de forma segura
 */
export function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error guardando en localStorage:', error);
  }
}

/**
 * Obtener de localStorage
 */
export function getItem(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error leyendo de localStorage:', error);
    return defaultValue;
  }
}

/**
 * Eliminar de localStorage
 */
export function removeItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error eliminando de localStorage:', error);
  }
}

/**
 * Limpiar todo localStorage
 */
export function clear() {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error limpiando localStorage:', error);
  }
}
LOCALSTORAGE

cat > src/utils/seo.js << 'SEO'
/**
 * Generar meta tags dinámicos
 */
export function generateMetaTags({
  title,
  description,
  image,
  url,
  type = 'website',
}) {
  const siteName = 'Mi E-Commerce';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ejemplo.com';

  return {
    title: `${title} | ${siteName}`,
    description,
    openGraph: {
      type,
      url: `${baseUrl}${url}`,
      title,
      description,
      images: image ? [{ url: image }] : [],
      siteName,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

/**
 * Generar structured data (JSON-LD) para producto
 */
export function generateProductSchema(product) {
  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images?.[0]?.url,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: 'Mi E-Commerce',
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'ARS',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };
}
SEO

# ─────────────────────────────────────────────────────────────
# ARCHIVOS - COMPONENTES UI (esqueletos)
# ─────────────────────────────────────────────────────────────

cat > src/components/ui/Button.jsx << 'BUTTON'
export default function Button({ children, variant = 'primary', ...props }) {
  const baseStyles = 'px-4 py-2 rounded-lg font-semibold transition-colors';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <button className={`${baseStyles} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
}
BUTTON

cat > src/components/ui/Input.jsx << 'INPUT'
export default function Input({ label, error, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <input
        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        {...props}
      />
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
}
INPUT

cat > src/components/ui/Modal.jsx << 'MODAL'
'use client';
export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4 z-10">
        {children}
      </div>
    </div>
  );
}
MODAL

cat > src/components/ui/Spinner.jsx << 'SPINNER'
export default function Spinner({ size = 'md' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`${sizes[size]} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin`} />
  );
}
SPINNER

cat > src/components/ui/SEO.jsx << 'SEOCOMP'
import Head from 'next/head';

export default function SEO({ title, description, image, url }) {
  const siteName = 'Mi E-Commerce';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ejemplo.com';

  return (
    <Head>
      <title>{title} | {siteName}</title>
      <meta name="description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${baseUrl}${url}`} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
    </Head>
  );
}
SEOCOMP

# ─────────────────────────────────────────────────────────────
# PÁGINAS - Esqueletos básicos
# ─────────────────────────────────────────────────────────────

cat > "src/app/(auth)/iniciar-sesion/page.js" << 'LOGINPAGE'
'use client';
import { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push('/');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Iniciar Sesión</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded"
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Ingresar
        </button>
      </form>
    </div>
  );
}
LOGINPAGE

cat > "src/app/(auth)/registrarse/page.js" << 'REGISTERPAGE'
'use client';
export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Registrarse</h1>
        <p>Formulario de registro (TODO)</p>
      </div>
    </div>
  );
}
REGISTERPAGE

cat > "src/app/(shop)/productos/page.js" << 'PRODUCTSPAGE'
'use client';
import { useProducts } from '../../../hooks/useProducts';

export default function ProductsPage() {
  const { products, loading } = useProducts();

  if (loading) return <div>Cargando productos...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Productos</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product._id} className="border rounded-lg p-4">
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-gray-600">${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
PRODUCTSPAGE

cat > "src/app/(shop)/carrito/page.js" << 'CARTPAGE'
'use client';
import { useCart } from '../../../hooks/useCart';

export default function CartPage() {
  const { cart, total, removeItem } = useCart();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Mi Carrito</h1>
      {cart.length === 0 ? (
        <p>Tu carrito está vacío</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item.productId} className="flex justify-between border-b py-4">
              <div>
                <h3>{item.name}</h3>
                <p>Cantidad: {item.quantity}</p>
              </div>
              <button onClick={() => removeItem(item.productId)} className="text-red-600">
                Eliminar
              </button>
            </div>
          ))}
          <div className="mt-6">
            <p className="text-xl font-bold">Total: ${total}</p>
          </div>
        </div>
      )}
    </div>
  );
}
CARTPAGE

cat > "src/app/admin/layout.js" << 'ADMINLAYOUT'
'use client';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.push('/iniciar-sesion');
    }
  }, [user, loading, router]);

  if (loading || !user) return <div>Cargando...</div>;

  return (
    <div className="flex">
      <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
        <nav className="space-y-2">
          <a href="/admin" className="block py-2 hover:bg-gray-700 rounded">Dashboard</a>
          <a href="/admin/productos" className="block py-2 hover:bg-gray-700 rounded">Productos</a>
          <a href="/admin/categorias" className="block py-2 hover:bg-gray-700 rounded">Categorías</a>
          <a href="/admin/ordenes" className="block py-2 hover:bg-gray-700 rounded">Órdenes</a>
          <a href="/admin/usuarios" className="block py-2 hover:bg-gray-700 rounded">Usuarios</a>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
ADMINLAYOUT

cat > "src/app/admin/page.js" << 'ADMINDASHBOARD'
export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Ventas del mes</h3>
          <p className="text-3xl font-bold">$0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Órdenes pendientes</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Productos activos</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
      </div>
    </div>
  );
}
ADMINDASHBOARD

# ─── .env.example FRONTEND ────────────────────────────────────
cat > .env.local.example << 'ENVLOCAL'
# ─── Backend API ──────────────────────────────
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# ─── Base URL (para SEO) ──────────────────────
NEXT_PUBLIC_BASE_URL=https://tu-dominio.com

# ─── Google Maps (para preview de direcciones) 
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key
ENVLOCAL

# ─── RESUMEN FINAL ────────────────────────────────────────────
echo ""
echo "✅ ¡Estructura Frontend creada exitosamente!"
echo ""
echo "📂 Carpetas y archivos creados:"
echo "   📄 Services (9 archivos)   → Llamadas centralizadas al backend"
echo "   🔌 Lib (2 archivos)        → Axios + Auth helpers"
echo "   🌐 Contexts (3 archivos)   → AuthContext, CartContext, UIContext"
echo "   🪝 Hooks (8 archivos)      → Hooks personalizados reutilizables"
echo "   🛠️ Utils (5 archivos)       → Formatters, validators, SEO, etc."
echo "   🧩 Componentes UI (5)      → Button, Input, Modal, Spinner, SEO"
echo "   📄 Páginas (40+ rutas)     → Auth, Shop, User, Admin, Institucionales"
echo ""
echo "📁 Estructura de rutas:"
echo "   /iniciar-sesion"
echo "   /registrarse"
echo "   /productos"
echo "   /productos/[slug]"
echo "   /carrito"
echo "   /checkout"
echo "   /mi-perfil"
echo "   /mis-ordenes"
echo "   /admin (con layout protegido)"
echo "   /admin/productos"
echo "   /admin/categorias"
echo "   /admin/ordenes"
echo "   ... y más"
echo ""
echo "🔧 Próximos pasos:"
echo "   1. cp .env.local.example .env.local    → Configurar variables"
echo "   2. npm install                         → Si aún no instalaste dependencias"
echo "   3. npm install axios react-hook-form zod @hookform/resolvers react-hot-toast"
echo "   4. Envolver app en providers:"
echo "      - AuthProvider"
echo "      - CartProvider"
echo "      - UIProvider"
echo "   5. Ajustar Navbar y Footer existentes"
echo "   6. Desarrollar componentes según necesites"
echo ""
echo "🎨 Componentes pendientes por implementar:"
echo "   - ProductCard, ProductGrid, ProductDetail"
echo "   - ProductFilters, SearchBar"
echo "   - CartDrawer, CheckoutForm"
echo "   - AddressForm con Google Maps"
echo "   - OrderTimeline, TrackingInfo"
echo "   - Admin tables y forms"
echo ""
echo "🚀 ¡Listo para empezar a desarrollar el frontend!"
