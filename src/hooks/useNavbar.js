import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore, useCartStore, useFavoritesStore, useUIStore } from '@/stores';
import { categoryService } from '@/services/categoryService';

export const useNavbar = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);
  const cartHoverRef = useRef(null);
  const favoritesHoverRef = useRef(null);

  const isHome = pathname === '/';

  // Zustand stores
  const { user, isAuthenticated, logout } = useAuthStore();
  const { totalItems, clearCart } = useCartStore();
  const { getCount, clearFavorites } = useFavoritesStore();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore();

  const favoritesCount = getCount();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Cargar categorías
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await categoryService.getCategories();
        setCategories(response.data || []);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
        setCategories([
          {
            name: 'Figuras',
            slug: 'figuras',
            description: 'Figuras coleccionables de anime',
            subcategories: [
              { name: 'Nendoroid', slug: 'nendoroid' },
              { name: 'Scale Figures', slug: 'scale' },
              { name: 'Pop Up Parade', slug: 'popup' },
              { name: 'Figma', slug: 'figma' }
            ]
          },
          {
            name: 'Manga',
            slug: 'manga',
            description: 'Manga y novelas ligeras',
            subcategories: [
              { name: 'Shonen', slug: 'shonen' },
              { name: 'Seinen', slug: 'seinen' },
              { name: 'Shojo', slug: 'shojo' },
              { name: 'Light Novels', slug: 'light-novels' }
            ]
          },
          {
            name: 'Ropa',
            slug: 'ropa',
            description: 'Ropa y accesorios de anime',
            subcategories: [
              { name: 'Camisetas', slug: 'camisetas' },
              { name: 'Hoodies', slug: 'hoodies' },
              { name: 'Cosplay', slug: 'cosplay' }
            ]
          },
          {
            name: 'Comida',
            slug: 'comida',
            description: 'Comida japonesa auténtica',
            subcategories: [
              { name: 'Ramen', slug: 'ramen' },
              { name: 'Snacks', slug: 'snacks' },
              { name: 'Bebidas', slug: 'bebidas' },
              { name: 'Té', slug: 'te' }
            ]
          },
          {
            name: 'Accesorios',
            slug: 'accesorios',
            description: 'Accesorios y coleccionables',
            subcategories: [
              { name: 'Llaveros', slug: 'llaveros' },
              { name: 'Posters', slug: 'posters' },
              { name: 'Peluches', slug: 'peluches' }
            ]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Manejar scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar dropdowns al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
        setShowAllCategories(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cerrar menú mobile al cambiar de ruta
  useEffect(() => {
    closeMobileMenu();
    setActiveDropdown(null);
    setShowAllCategories(false);
    setShowUserMenu(false);
  }, [pathname, closeMobileMenu]);

  const handleLogout = () => {
    // Limpiar todos los stores
    clearCart();
    clearFavorites();
    logout();
    setShowUserMenu(false);
  };

  const toggleDropdown = (name) => {
    if (activeDropdown === name) {
      setActiveDropdown(null);
      setShowAllCategories(false);
    } else {
      setActiveDropdown(name);
      setShowAllCategories(false);
    }
  };

  const INITIAL_CATEGORIES_LIMIT = 4;
  const displayedCategories = showAllCategories 
    ? categories 
    : categories.slice(0, INITIAL_CATEGORIES_LIMIT);
  const hasMoreCategories = categories.length > INITIAL_CATEGORIES_LIMIT;

  return {
    // Estados
    isScrolled,
    activeDropdown,
    showUserMenu,
    categories,
    loading,
    showAllCategories,
    mounted,
    isHome,
    pathname,
    
    // Refs
    dropdownRef,
    userMenuRef,
    cartHoverRef,
    favoritesHoverRef,
    
    // Datos del usuario
    user,
    isAuthenticated,
    totalItems,
    favoritesCount,
    isMobileMenuOpen,
    
    // Categorías
    displayedCategories,
    hasMoreCategories,
    
    // Funciones
    handleLogout,
    toggleDropdown,
    setShowAllCategories,
    setActiveDropdown,
    setShowUserMenu,
    toggleMobileMenu,
    closeMobileMenu
  };
};