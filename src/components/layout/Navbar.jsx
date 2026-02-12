'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, Search, ChevronDown, Sparkles, ChevronRight } from 'lucide-react';
import { useNavbar } from '@/hooks/useNavbar';
import UserButton from './navbar/UserButton';
import UserMenu from './navbar/UserMenu';
import CartButton from './navbar/CartButton';
import FavoritesButton from './navbar/FavoritesButton';

const Navbar = () => {
  const router = useRouter();
  const {
    isScrolled,
    activeDropdown,
    showUserMenu,
    loading,
    showAllCategories,
    mounted,
    isHome,
    dropdownRef,
    userMenuRef,
    user,
    isAuthenticated,
    totalItems,
    favoritesCount,
    isMobileMenuOpen,
    displayedCategories,
    hasMoreCategories,
    handleLogout,
    toggleDropdown,
    setShowAllCategories,
    setActiveDropdown,
    setShowUserMenu,
    toggleMobileMenu,
    closeMobileMenu,
    categories
  } = useNavbar();

  // Estructura de navegación principal
  const navLinks = [
    {
      name: 'Categorías',
      type: 'dropdown',
      icon: '📚',
      ariaLabel: 'Ver todas las categorías de productos'
    },
    {
      name: 'Figuras',
      href: '/productos?categoria=figuras',
      type: 'link',
      icon: '🎎',
      ariaLabel: 'Ver colección de figuras anime'
    },
    {
      name: 'Ropa',
      href: '/productos?categoria=ropa',
      type: 'link',
      icon: '👕',
      ariaLabel: 'Ver ropa y accesorios anime'
    },
    {
      name: 'Comida',
      href: '/productos?categoria=comida',
      type: 'link',
      icon: '🍜',
      ariaLabel: 'Ver comida japonesa'
    },
    {
      name: 'Ofertas',
      href: '/ofertas',
      type: 'link',
      icon: '🔥',
      ariaLabel: 'Ver ofertas y descuentos'
    },
    {
      name: 'Conócenos',
      href: '/sobre-nosotros',
      type: 'link',
      icon: '✨',
      ariaLabel: 'Conoce más sobre nuestra tienda'
    },
    {
      name: 'Contacto',
      href: '/contacto',
      type: 'link',
      icon: '📧',
      ariaLabel: 'Contáctanos'
    }
  ];

  return (
    <nav
      className={` ${isHome ? 'fixed' : 'sticky'} top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'py-3' : 'py-6'}`}
      role="navigation"
      aria-label="Navegación principal"
    >
      <div className={`mx-auto transition-all duration-500 ${isScrolled ? 'max-w-7xl px-2 lg:px-0' : 'max-w-full px-0 lg:px-8'}`}>
        <div className={`relative transition-all duration-500 ${isScrolled ? 'rounded-2xl shadow-2xl' : 'rounded-none'}`}>
          {/* Fondo con glassmorphism */}
          <div className={`absolute inset-0 transition-all duration-500 ${isScrolled ? 'bg-black/40 backdrop-blur-xl border border-purple-500/30' : 'bg-black'}`}>
            {!isScrolled && (
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: "url('/images/image(19).jpg')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center -150px',
                }}
              />
            )}
            {isScrolled && (
              <div
                className="absolute top-0 left-0 right-0 h-0.5"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, #9333ea 20%, #ec4899 50%, #06b6d4 80%, transparent 100%)',
                  backgroundSize: '200% 100%',
                  animation: 'gradient-shift 3s ease infinite',
                }}
              />
            )}
          </div>

          {/* Contenido del navbar */}
          <div className="relative px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <a href="/" className="flex items-center gap-3 group" aria-label="Ir al inicio - Akarumi Yume Tienda Anime">
                <div className={`relative transition-all duration-500 ${isScrolled ? 'w-12 h-12' : 'w-16 h-16'}`}>
                  <div
                    className="absolute inset-0 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 transform group-hover:rotate-180 transition-transform duration-700"
                    style={{
                      clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                      boxShadow: '0 0 30px rgba(147, 51, 234, 0.8)',
                    }}
                  />
                  <Sparkles className="absolute inset-0 m-auto text-white" size={isScrolled ? 24 : 32} />
                </div>
                <div className={`transition-all duration-500 ${isScrolled ? 'scale-90' : 'scale-100'}`}>
                  <h1
                    className="font-black tracking-tight leading-none"
                    style={{
                      fontSize: isScrolled ? '1.25rem' : '1.5rem',
                      background: 'linear-gradient(135deg, #a78bfa 0%, #ec4899 50%, #06b6d4 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '0 0 30px rgba(147, 51, 234, 0.5)',
                    }}
                  >
                    AKARUMI YUME
                  </h1>
                  <p className="text-gray-400 font-light tracking-wider" style={{ fontSize: isScrolled ? '0.6rem' : '0.7rem' }}>
                    明るみ夢
                  </p>
                </div>
              </a>

              {/* Links desktop */}
              <div className="hidden lg:flex items-center gap-6">
                {loading ? (
                  <>
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-5 w-20 bg-white/10 rounded animate-pulse" />
                    ))}
                  </>
                ) : (
                  navLinks.map((link) => (
                    <div key={link.name} className="relative" ref={link.type === 'dropdown' ? dropdownRef : null}>
                      {link.type === 'dropdown' ? (
                        <button
                          onClick={() => toggleDropdown(link.name)}
                          className="text-white font-semibold tracking-wide hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-400 transition-all duration-300 flex items-center gap-1.5 text-sm"
                          aria-label={link.ariaLabel}
                          aria-expanded={activeDropdown === link.name}
                          aria-haspopup="true"
                        >
                          <span className="text-base">{link.icon}</span>
                          {link.name}
                          <ChevronDown size={16} className={`transition-transform duration-300 ${activeDropdown === link.name ? 'rotate-180' : ''}`} />
                        </button>
                      ) : (
                        <a
                          href={link.href}
                          className="text-white font-semibold tracking-wide hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-400 transition-all duration-300 flex items-center gap-1.5 text-sm"
                          aria-label={link.ariaLabel}
                        >
                          <span className="text-base">{link.icon}</span>
                          {link.name}
                        </a>
                      )}

                      <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-purple-500 to-pink-500 hover:w-full transition-all duration-300" style={{ boxShadow: '0 0 10px rgba(236, 72, 153, 0.8)' }} />

                      {/* Dropdown mega menu de categorías */}
                      {link.type === 'dropdown' && activeDropdown === link.name && (
                        <div
                          className="absolute top-full left-0 mt-3 w-[720px] rounded-xl overflow-hidden p-5"
                          style={{
                            background: 'rgba(0, 0, 0, 0.97)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(147, 51, 234, 0.3)',
                            boxShadow: '0 20px 60px rgba(147, 51, 234, 0.4)',
                          }}
                          role="menu"
                        >
                          <div className="mb-4 pb-3 border-b border-white/10">
                            <h3 className="text-white font-bold text-base">Explora nuestras categorías</h3>
                            <p className="text-gray-400 text-xs mt-1">Descubre productos de anime y cultura japonesa</p>
                          </div>

                          <div className="grid grid-cols-4 gap-3">
                            {displayedCategories.map((category) => (
                              <a
                                key={category.slug}
                                href={`/productos?categoria=${category.slug}`}
                                className="group p-3 rounded-lg bg-white/5 hover:bg-gradient-to-br hover:from-purple-600/20 hover:to-pink-600/20 transition-all duration-300 border border-transparent hover:border-purple-500/30"
                                role="menuitem"
                                onClick={() => {
                                  setActiveDropdown(null);
                                  setShowAllCategories(false);
                                }}
                              >
                                <div className="flex flex-col h-full">
                                  <h4 className="font-bold text-white text-sm mb-1 group-hover:text-pink-400 transition-colors">
                                    {category.name}
                                  </h4>
                                  <p className="text-gray-400 text-xs mb-2 line-clamp-2">
                                    {category.description}
                                  </p>
                                  {category.subcategories && category.subcategories.length > 0 && (
                                    <div className="mt-auto space-y-0.5">
                                      {category.subcategories.slice(0, 3).map((sub) => (
                                        <div key={sub.slug} className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors flex items-center gap-1">
                                          <ChevronRight size={10} />
                                          {sub.name}
                                        </div>
                                      ))}
                                      {category.subcategories.length > 3 && (
                                        <div className="text-xs text-purple-400">+{category.subcategories.length - 3} más</div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </a>
                            ))}
                          </div>

                          {hasMoreCategories && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowAllCategories(!showAllCategories);
                              }}
                              className="w-full mt-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-600/30 to-pink-600/30 hover:from-purple-600/50 hover:to-pink-600/50 text-white text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 border border-purple-500/30"
                            >
                              {showAllCategories ? (
                                <>
                                  Mostrar menos
                                  <ChevronDown size={16} className="rotate-180" />
                                </>
                              ) : (
                                <>
                                  Ver todas las categorías ({categories.length})
                                  <ChevronDown size={16} />
                                </>
                              )}
                            </button>
                          )}

                          <a
                            href="/productos"
                            className="block mt-3 py-2 text-center text-sm text-purple-400 hover:text-pink-400 transition-colors font-medium"
                            onClick={() => {
                              setActiveDropdown(null);
                              setShowAllCategories(false);
                            }}
                          >
                            Ver todos los productos →
                          </a>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Iconos de acciones */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push('/buscar')}
                  className="hidden md:block text-gray-300 hover:text-white transition-colors duration-300"
                  aria-label="Buscar productos"
                >
                  <Search size={20} />
                </button>

                <div className="hidden md:block">
                  <FavoritesButton favoritesCount={favoritesCount} mounted={mounted} />
                </div>

                <div className="hidden md:block">
                  <CartButton totalItems={totalItems} mounted={mounted} />
                </div>

                <div className="hidden md:block relative" ref={userMenuRef}>
                  <UserButton
                    user={user}
                    isAuthenticated={isAuthenticated}
                    onClick={() => {
                      if (isAuthenticated) {
                        setShowUserMenu(!showUserMenu);
                      } else {
                        router.push('/iniciar-sesion');
                      }
                    }}
                  />
                  <UserMenu
                    user={user}
                    isAuthenticated={isAuthenticated}
                    showMenu={showUserMenu}
                    onClose={() => setShowUserMenu(false)}
                    onLogout={handleLogout}
                  />
                </div>

                <button
                  className="lg:hidden text-white"
                  onClick={toggleMobileMenu}
                  aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                  aria-expanded={isMobileMenuOpen}
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu - CÓDIGO EXISTENTE AQUÍ */}
      </div>
    </nav>
  );
};

export default Navbar;