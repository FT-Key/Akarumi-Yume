import { useEffect } from 'react';
import { useCartStore } from '@/stores/useCartStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { cartService } from '@/services/cart.service';
import { toast } from 'sonner';

export const useCart = () => {
  const { isAuthenticated } = useAuthStore();
  const store = useCartStore();

  // Sincronizar con el servidor cuando el usuario inicia sesión
  useEffect(() => {
    if (isAuthenticated) {
      syncCart();
    }
  }, [isAuthenticated]);

  // Sincronizar carrito desde el servidor
  const syncCart = async () => {
    try {
      store.setLoading(true);
      const response = await cartService.getCart();
      if (response.success) {
        store.setCart(response.data);
      }
    } catch (error) {
      console.error('Error syncing cart:', error);
    } finally {
      store.setLoading(false);
    }
  };

  // Agregar producto al carrito
  const addItem = async (product, quantity = 1, characteristics = []) => {
    try {
      store.setLoading(true);

      if (isAuthenticated) {
        // Si está autenticado, agregar en el servidor
        const response = await cartService.addItem(
          product._id,
          quantity,
          characteristics
        );

        if (response.success) {
          store.setCart(response.data);
          toast.success('Producto agregado al carrito');
        }
      } else {
        // Si no está autenticado, agregar localmente
        const item = {
          _id: `local-${Date.now()}`,
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

        store.addItem(item);
        toast.success('Producto agregado al carrito');
      }
    } catch (error) {
      toast.error(error.message || 'Error al agregar producto');
    } finally {
      store.setLoading(false);
    }
  };

  // Actualizar cantidad
  const updateQuantity = async (itemId, quantity) => {
    try {
      store.setLoading(true);

      if (isAuthenticated) {
        const response = await cartService.updateItemQuantity(itemId, quantity);
        if (response.success) {
          store.setCart(response.data);
          toast.success('Cantidad actualizada');
        }
      } else {
        store.updateQuantity(itemId, quantity);
        toast.success('Cantidad actualizada');
      }
    } catch (error) {
      toast.error(error.message || 'Error al actualizar cantidad');
    } finally {
      store.setLoading(false);
    }
  };

  // Remover item
  const removeItem = async (itemId) => {
    try {
      store.setLoading(true);

      if (isAuthenticated) {
        const response = await cartService.removeItem(itemId);
        if (response.success) {
          store.setCart(response.data);
          toast.success('Producto removido');
        }
      } else {
        store.removeItem(itemId);
        toast.success('Producto removido');
      }
    } catch (error) {
      toast.error(error.message || 'Error al remover producto');
    } finally {
      store.setLoading(false);
    }
  };

  // Vaciar carrito
  const clearCart = async () => {
    try {
      store.setLoading(true);

      if (isAuthenticated) {
        const response = await cartService.clearCart();
        if (response.success) {
          store.clearCart();
          toast.success('Carrito vaciado');
        }
      } else {
        store.clearCart();
        toast.success('Carrito vaciado');
      }
    } catch (error) {
      toast.error(error.message || 'Error al vaciar carrito');
    } finally {
      store.setLoading(false);
    }
  };

  return {
    // Estado
    items: store.items,
    subtotal: store.subtotal,
    totalItems: store.totalItems,
    isLoading: store.isLoading,

    // Acciones
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    syncCart,

    // Helpers
    getItemCount: store.getItemCount,
    hasItem: store.hasItem,
    getItem: store.getItem,
    isEmpty: store.items.length === 0
  };
};

export default useCart;
