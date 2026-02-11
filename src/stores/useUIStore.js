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
