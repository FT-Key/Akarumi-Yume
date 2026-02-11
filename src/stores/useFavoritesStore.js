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
