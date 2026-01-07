'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart, Search, User, Heart, ChevronDown, Sparkles } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    {
      name: 'Figuras',
      href: '#figuras',
      submenu: ['Nendoroid', 'Scale Figures', 'Pop Up Parade', 'Bishoujo']
    },
    {
      name: 'Manga',
      href: '#manga',
      submenu: ['Shonen', 'Seinen', 'Shojo', 'Ediciones Especiales']
    },
    {
      name: 'Ropa',
      href: '#ropa',
      submenu: ['Camisetas', 'Hoodies', 'Sudaderas', 'Accesorios']
    },
    { name: 'Ofertas', href: '#ofertas' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'py-3' : 'py-6'
        }`}
    >
      {/* Contenedor principal con clip-path dinámico */}
      <div
        className={`mx-auto transition-all duration-500 ${isScrolled ? 'max-w-7xl' : 'max-w-full px-8'
          }`}
      >
        <div
          className={`relative transition-all duration-500 ${isScrolled
              ? 'rounded-2xl shadow-2xl'
              : 'rounded-none'
            }`}
          style={{
            clipPath: isScrolled
              ? 'polygon(2% 0, 98% 0, 100% 20%, 100% 80%, 98% 100%, 2% 100%, 0 80%, 0 20%)'
              : 'none',
          }}
        >
          {/* Fondo con glassmorphism */}
          <div
            className={`absolute inset-0 transition-all duration-500 ${isScrolled
                ? 'bg-black/40 backdrop-blur-xl border border-purple-500/30'
                : 'bg-black'
              }`}
          >
            {/* Imagen de fondo anime (solo cuando no hay scroll) */}
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

            {/* Borde animado superior */}
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
              <a href="/" className="flex items-center gap-3 group">
                <div
                  className={`relative transition-all duration-500 ${isScrolled ? 'w-12 h-12' : 'w-16 h-16'
                    }`}
                >
                  {/* Placeholder para logo - estrella con gradiente */}
                  <div
                    className="absolute inset-0 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 transform group-hover:rotate-180 transition-transform duration-700"
                    style={{
                      clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                      boxShadow: '0 0 30px rgba(147, 51, 234, 0.8)',
                    }}
                  />
                  <Sparkles
                    className="absolute inset-0 m-auto text-white"
                    size={isScrolled ? 24 : 32}
                  />
                </div>

                {/* Texto del logo */}
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
                  <p
                    className="text-gray-400 font-light tracking-wider"
                    style={{ fontSize: isScrolled ? '0.6rem' : '0.7rem' }}
                  >
                    明るみ夢
                  </p>
                </div>
              </a>

              {/* Links desktop */}
              <div className="hidden lg:flex items-center gap-8">
                {navLinks.map((link) => (
                  <div
                    key={link.name}
                    className="relative group"
                    onMouseEnter={() => link.submenu && setActiveDropdown(link.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <a
                      href={link.href}
                      className="text-white font-semibold tracking-wide hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-400 transition-all duration-300 flex items-center gap-1 text-sm"
                    >
                      {link.name}
                      {link.submenu && (
                        <ChevronDown
                          size={16}
                          className="transition-transform duration-300 group-hover:rotate-180"
                        />
                      )}
                    </a>

                    {/* Línea inferior animada */}
                    <div
                      className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"
                      style={{ boxShadow: '0 0 10px rgba(236, 72, 153, 0.8)' }}
                    />

                    {/* Dropdown menu */}
                    {link.submenu && activeDropdown === link.name && (
                      <div
                        className="absolute top-full left-0 mt-2 w-48 rounded-xl overflow-hidden"
                        style={{
                          background: 'rgba(0, 0, 0, 0.9)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(147, 51, 234, 0.3)',
                          boxShadow: '0 10px 40px rgba(147, 51, 234, 0.3)',
                        }}
                      >
                        {link.submenu.map((item, idx) => (
                          <a
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-pink-600/20 transition-all duration-300"
                            style={{
                              borderBottom: idx < link.submenu.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                            }}
                          >
                            {item}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Iconos de acciones */}
              <div className="flex items-center gap-4">
                <button
                  className="hidden md:block text-gray-300 hover:text-white transition-colors duration-300"
                  aria-label="Buscar"
                >
                  <Search size={20} />
                </button>

                <button
                  className="hidden md:block text-gray-300 hover:text-pink-400 transition-colors duration-300"
                  aria-label="Favoritos"
                >
                  <Heart size={20} />
                </button>

                <button
                  className="hidden md:block text-gray-300 hover:text-white transition-colors duration-300"
                  aria-label="Cuenta"
                >
                  <User size={20} />
                </button>

                <button
                  className="relative text-gray-300 hover:text-white transition-colors duration-300"
                  aria-label="Carrito"
                >
                  <ShoppingCart size={20} />
                  <span
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs flex items-center justify-center font-bold"
                    style={{ boxShadow: '0 0 10px rgba(236, 72, 153, 0.8)' }}
                  >
                    3
                  </span>
                </button>

                {/* Botón mobile menu */}
                <button
                  className="lg:hidden text-white"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label="Menú"
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden mt-4 rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(0, 0, 0, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(147, 51, 234, 0.3)',
              clipPath: 'polygon(0 3%, 100% 0, 100% 97%, 0 100%)',
            }}
          >
            <div className="px-6 py-4 space-y-3">
              {navLinks.map((link) => (
                <div key={link.name}>
                  <a
                    href={link.href}
                    className="block text-white font-semibold py-2 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-400 transition-all duration-300"
                  >
                    {link.name}
                  </a>
                  {link.submenu && (
                    <div className="pl-4 space-y-2 mt-2">
                      {link.submenu.map((item) => (
                        <a
                          key={item}
                          href={`#${item.toLowerCase()}`}
                          className="block text-sm text-gray-400 hover:text-white py-1 transition-colors duration-300"
                        >
                          {item}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Botón buscar en mobile */}
              <button className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-2">
                <Search size={18} />
                Buscar
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;