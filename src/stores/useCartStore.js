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
