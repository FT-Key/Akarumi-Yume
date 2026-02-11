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
