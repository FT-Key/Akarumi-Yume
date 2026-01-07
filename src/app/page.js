'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Mail, Star, Sparkles } from 'lucide-react';

const HomePage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [email, setEmail] = useState('');
  const heroRef = useRef(null);

  const carouselItems = [
    {
      title: "Naruto Shippuden",
      image: "/images/image(21).jpg",
      price: "$49.99"
    },
    {
      title: "Attack on Titan",
      image: "/images/image(24).jpg",
      price: "$59.99"
    },
    {
      title: "My Hero Academia",
      image: "/images/image(23).jpg",
      price: "$45.99"
    },
    {
      title: "Demon Slayer",
      image: "/images/image(22).jpg",
      price: "$54.99"
    },
    {
      title: "One Piece",
      image: "/images/image(5).jpg",
      price: "$52.99"
    }
  ];

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / 20;
        const y = (e.clientY - rect.top - rect.height / 2) / 20;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`¡Suscripción exitosa para ${email}!`);
    setEmail('');
  };

  return (
    <div className="relative bg-black">
      {/* Hero Section con efecto de seguimiento del mouse */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-fixed-custom"
          style={{
            backgroundImage: "url('/images/image(14).jpg')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-purple-900/40 to-black/70"></div>
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-6xl">
          <div className="mb-8 flex justify-center">
            <Sparkles className="w-12 h-12 text-yellow-400 animate-pulse" />
          </div>
          <h1
            className="text-7xl md:text-9xl font-black mb-8 tracking-tight"
            style={{
              transform: `perspective(1000px) rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg)`,
              transition: 'transform 0.1s ease-out',
              textShadow: '0 0 30px rgba(147, 51, 234, 0.8), 0 0 60px rgba(147, 51, 234, 0.5)',
            }}
          >
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              AKARUMI
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              YUME
            </span>
          </h1>
          <p className="text-2xl md:text-3xl mb-12 font-light text-gray-200">
            明るみ夢 - Donde los sueños brillantes cobran vida
          </p>
          <button
            className="group relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-full text-xl transition-all transform hover:scale-110 shadow-2xl inline-block"
            style={{
              padding: '1.5rem 3.5rem',
              fontSize: '1.25rem',
              lineHeight: '1.75rem'
            }}
          >
            <span className="relative z-10 whitespace-nowrap">Explorar Ahora</span>
            <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
          </button>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent"></div>
      </section>

      {/* Sección Carousel con clip-path diagonal */}
      <section
        className="relative min-h-screen flex items-center py-32"
        style={{ clipPath: 'polygon(0 5%, 100% 0, 100% 95%, 0 100%)' }}
      >
        <div
          className="absolute inset-0 bg-fixed-custom"
          style={{
            backgroundImage: "url('/images/image(12).jpg')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/95 via-purple-900/90 to-pink-900/95"></div>
        </div>

        <div className="relative z-10 w-full mx-auto grid grid-cols-1 lg:grid-cols-2 items-center" style={{ maxWidth: '90rem', padding: '0 3rem', gap: '4rem' }}>
          {/* Texto a la izquierda */}
          <div className="text-white space-y-6 flex flex-col justify-center" style={{ maxWidth: '100%' }}>
            <div className="inline-block">
              <Star className="w-8 h-8 text-yellow-400 mb-4" />
            </div>
            <h2 className="font-black leading-tight" style={{ fontSize: 'clamp(3rem, 8vw, 5rem)' }}>
              Figuras de
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                Colección
              </span>
            </h2>
            <p className="text-gray-300 leading-relaxed" style={{ fontSize: '1.25rem' }}>
              Colecciones exclusivas que capturan la esencia de tus personajes favoritos.
              Cada figura es una obra de arte con detalles extraordinarios y calidad premium.
            </p>
            <div className="flex gap-4" style={{ paddingTop: '1rem' }}>
              <div className="text-center">
                <div className="font-bold text-yellow-400" style={{ fontSize: '2.25rem' }}>500+</div>
                <div className="text-gray-400" style={{ fontSize: '0.875rem' }}>Productos</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-pink-400" style={{ fontSize: '2.25rem' }}>50K+</div>
                <div className="text-gray-400" style={{ fontSize: '0.875rem' }}>Clientes Felices</div>
              </div>
            </div>
          </div>

          {/* Carousel a la derecha */}
          <div className="relative flex justify-center items-center" style={{ height: '650px' }}>
            <div className="absolute inset-0 flex items-center justify-center">
              {carouselItems.map((item, index) => {
                const offset = (index - currentSlide + carouselItems.length) % carouselItems.length;
                const isActive = offset === 0;

                return (
                  <div
                    key={index}
                    className="absolute transition-all duration-700 ease-out"
                    style={{
                      transform: `
              translateX(${offset * 80}px) 
              translateZ(${-offset * 150}px) 
              rotateY(${-offset * 12}deg)
              scale(${1 - offset * 0.15})
            `,
                      opacity: offset < 3 ? 1 - offset * 0.25 : 0,
                      zIndex: carouselItems.length - offset,
                      pointerEvents: isActive ? 'auto' : 'none',
                    }}
                  >
                    {/* Container con efecto de brillo exterior */}
                    <div
                      className="relative group"
                      style={{
                        width: '26rem',
                        height: '36rem',
                        filter: isActive
                          ? 'drop-shadow(0 0 30px rgba(236, 72, 153, 0.8)) drop-shadow(0 0 60px rgba(147, 51, 234, 0.6))'
                          : 'drop-shadow(0 15px 35px rgba(0, 0, 0, 0.7))',
                        transition: 'all 0.5s ease',
                      }}
                    >
                      {/* Borde animado rainbow - estilo holográfico */}
                      <div
                        className="absolute inset-0 rounded-2xl overflow-hidden"
                        style={{
                          padding: isActive ? '4px' : '2px',
                          background: isActive
                            ? 'linear-gradient(135deg, #ff0080 0%, #ff8c00 20%, #40e0d0 40%, #9d00ff 60%, #ff0080 80%, #40e0d0 100%)'
                            : 'linear-gradient(135deg, rgba(147, 51, 234, 0.4), rgba(236, 72, 153, 0.4))',
                          backgroundSize: '300% 300%',
                          animation: isActive ? 'gradient-shift 4s ease infinite' : 'none',
                        }}
                      >
                        {/* Card principal */}
                        <div
                          className="relative w-full h-full rounded-2xl overflow-hidden"
                          style={{
                            background: 'linear-gradient(135deg, #1a0033 0%, #330033 50%, #1a0033 100%)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                          }}
                        >
                          {/* Decoraciones de esquinas estilo anime */}
                          <div className="absolute top-0 left-0 w-16 h-16 opacity-70 z-10">
                            <div className="absolute top-3 left-3 w-12 h-0.5 bg-gradient-to-r from-yellow-400 to-transparent"></div>
                            <div className="absolute top-3 left-3 w-0.5 h-12 bg-gradient-to-b from-yellow-400 to-transparent"></div>
                          </div>
                          <div className="absolute top-0 right-0 w-16 h-16 opacity-70 z-10">
                            <div className="absolute top-3 right-3 w-12 h-0.5 bg-gradient-to-l from-cyan-400 to-transparent"></div>
                            <div className="absolute top-3 right-3 w-0.5 h-12 bg-gradient-to-b from-cyan-400 to-transparent"></div>
                          </div>
                          <div className="absolute bottom-0 left-0 w-16 h-16 opacity-70 z-10">
                            <div className="absolute bottom-3 left-3 w-12 h-0.5 bg-gradient-to-r from-pink-400 to-transparent"></div>
                            <div className="absolute bottom-3 left-3 w-0.5 h-12 bg-gradient-to-t from-pink-400 to-transparent"></div>
                          </div>
                          <div className="absolute bottom-0 right-0 w-16 h-16 opacity-70 z-10">
                            <div className="absolute bottom-3 right-3 w-12 h-0.5 bg-gradient-to-l from-purple-400 to-transparent"></div>
                            <div className="absolute bottom-3 right-3 w-0.5 h-12 bg-gradient-to-t from-purple-400 to-transparent"></div>
                          </div>

                          {/* Badge LIMITED EDITION diagonal */}
                          <div
                            className="absolute top-6 -left-10 z-20 text-white font-black transform -rotate-45"
                            style={{
                              background: 'linear-gradient(90deg, #ff0000 0%, #ff6600 100%)',
                              padding: '0.4rem 3.5rem',
                              fontSize: '0.7rem',
                              letterSpacing: '0.15em',
                              boxShadow: '0 4px 15px rgba(255, 0, 0, 0.5), 0 0 30px rgba(255, 102, 0, 0.3)',
                            }}
                          >
                            LIMITED EDITION
                          </div>

                          {/* Badge de rareza SSR (estrella) */}
                          <div
                            className="absolute top-4 right-4 z-20 flex items-center justify-center"
                            style={{
                              background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
                              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                              width: '55px',
                              height: '55px',
                              boxShadow: '0 0 25px rgba(255, 215, 0, 0.9), inset 0 0 15px rgba(255, 255, 255, 0.5)',
                            }}
                          >
                            <span className="text-black font-black text-sm" style={{ marginTop: '-5px' }}>SSR</span>
                          </div>

                          {/* Área de imagen con efectos */}
                          <div className="relative w-full overflow-hidden" style={{ height: '60%' }}>
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover transition-all duration-700"
                              style={{
                                filter: isActive ? 'brightness(1.2) contrast(1.15) saturate(1.3)' : 'brightness(0.8) saturate(0.8)',
                                transform: isActive ? 'scale(1.05)' : 'scale(1)',
                              }}
                            />

                            {/* Overlay holográfico */}
                            <div
                              className="absolute inset-0 opacity-40 pointer-events-none"
                              style={{
                                background: 'linear-gradient(120deg, transparent 30%, rgba(255, 255, 255, 0.4) 50%, transparent 70%)',
                                backgroundSize: '200% 200%',
                                animation: isActive ? 'holographic-shine 3s ease-in-out infinite' : 'none',
                              }}
                            />

                            {/* Línea de escaneo cyberpunk */}
                            {isActive && (
                              <div
                                className="absolute top-0 left-0 w-full h-1 bg-cyan-400 opacity-80 z-10"
                                style={{
                                  boxShadow: '0 0 20px #00ffff, 0 0 40px #00ffff',
                                  animation: 'scan-down 4s ease-in-out infinite',
                                }}
                              />
                            )}

                            {/* Grid overlay sutil */}
                            {isActive && (
                              <div
                                className="absolute inset-0 opacity-5 pointer-events-none"
                                style={{
                                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0, 255, 255, 0.8) 3px, rgba(0, 255, 255, 0.8) 4px)',
                                }}
                              />
                            )}
                          </div>

                          {/* Sección de información */}
                          <div
                            className="relative p-6"
                            style={{
                              height: '40%',
                              background: 'linear-gradient(180deg, rgba(10, 0, 20, 0.5) 0%, rgba(0, 0, 0, 0.98) 25%, #000000 60%)',
                            }}
                          >
                            {/* Separador zigzag superior */}
                            <div
                              className="absolute -top-2 left-0 right-0 h-2 opacity-90"
                              style={{
                                background: 'linear-gradient(90deg, #ff0080 0%, #ff8c00 25%, #40e0d0 50%, #9d00ff 75%, #ff0080 100%)',
                                clipPath: 'polygon(0 0, 3% 100%, 6% 0, 9% 100%, 12% 0, 15% 100%, 18% 0, 21% 100%, 24% 0, 27% 100%, 30% 0, 33% 100%, 36% 0, 39% 100%, 42% 0, 45% 100%, 48% 0, 51% 100%, 54% 0, 57% 100%, 60% 0, 63% 100%, 66% 0, 69% 100%, 72% 0, 75% 100%, 78% 0, 81% 100%, 84% 0, 87% 100%, 90% 0, 93% 100%, 96% 0, 100% 100%)',
                              }}
                            />

                            {/* Título del anime */}
                            <h3
                              className="text-white font-black mb-3 tracking-wider leading-tight"
                              style={{
                                fontSize: '1.6rem',
                                textShadow: '0 0 20px rgba(236, 72, 153, 0.9), 0 0 40px rgba(147, 51, 234, 0.6), 0 3px 8px rgba(0, 0, 0, 0.9)',
                                textTransform: 'uppercase',
                              }}
                            >
                              {item.title}
                            </h3>

                            {/* Stats bars estilo RPG */}
                            <div className="flex gap-3 mb-3">
                              <div className="flex-1">
                                <div className="text-xs text-cyan-300 mb-1 font-bold tracking-wider">POWER LVL</div>
                                <div className="h-2 bg-gray-900 rounded-full overflow-hidden border border-cyan-900">
                                  <div
                                    className="h-full bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 relative"
                                    style={{
                                      width: '90%',
                                      boxShadow: '0 0 10px rgba(6, 182, 212, 0.8)',
                                    }}
                                  >
                                    <div className="absolute inset-0 animate-pulse bg-white opacity-20"></div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="text-xs text-pink-300 mb-1 font-bold tracking-wider">RARITY</div>
                                <div className="h-2 bg-gray-900 rounded-full overflow-hidden border border-pink-900">
                                  <div
                                    className="h-full bg-gradient-to-r from-pink-400 via-pink-300 to-purple-400 relative"
                                    style={{
                                      width: '98%',
                                      boxShadow: '0 0 10px rgba(236, 72, 153, 0.8)',
                                    }}
                                  >
                                    <div className="absolute inset-0 animate-pulse bg-white opacity-20"></div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Precio y acción */}
                            <div className="flex items-end justify-between mt-4">
                              <div>
                                <div className="text-xs text-gray-400 font-bold mb-1 tracking-wide">PRECIO</div>
                                <p
                                  className="text-yellow-400 font-black tracking-wider"
                                  style={{
                                    fontSize: '2rem',
                                    textShadow: '0 0 20px rgba(250, 204, 21, 1), 0 0 40px rgba(250, 204, 21, 0.6), 0 0 60px rgba(250, 204, 21, 0.3)',
                                    lineHeight: '1',
                                  }}
                                >
                                  {item.price}
                                </p>
                              </div>

                              {isActive && (
                                <button
                                  className="text-white font-black tracking-widest transition-all transform hover:scale-110 hover:-rotate-3 active:scale-95"
                                  style={{
                                    background: 'linear-gradient(135deg, #ff0080 0%, #9d00ff 50%, #00d4ff 100%)',
                                    padding: '0.9rem 1.8rem',
                                    fontSize: '0.95rem',
                                    clipPath: 'polygon(8% 0, 100% 0, 92% 100%, 0 100%)',
                                    boxShadow: '0 5px 25px rgba(236, 72, 153, 0.7), 0 0 40px rgba(147, 51, 234, 0.5)',
                                    letterSpacing: '0.1em',
                                  }}
                                >
                                  OBTENER
                                </button>
                              )}
                            </div>

                            {/* Rating de estrellas */}
                            <div className="flex gap-1 mt-3 justify-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-5 h-5 fill-yellow-400 text-yellow-400"
                                  style={{
                                    filter: 'drop-shadow(0 0 4px rgba(250, 204, 21, 0.9))',
                                  }}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Partículas flotantes animadas (solo en activa) */}
                          {isActive && (
                            <>
                              <div
                                className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-70 animate-float pointer-events-none"
                                style={{
                                  top: '25%',
                                  left: '20%',
                                  boxShadow: '0 0 15px rgba(250, 204, 21, 1)',
                                  animationDelay: '0s',
                                  animationDuration: '3s',
                                }}
                              />
                              <div
                                className="absolute w-2 h-2 bg-cyan-400 rounded-full opacity-70 animate-float pointer-events-none"
                                style={{
                                  top: '35%',
                                  right: '15%',
                                  boxShadow: '0 0 15px rgba(6, 182, 212, 1)',
                                  animationDelay: '1s',
                                  animationDuration: '3.5s',
                                }}
                              />
                              <div
                                className="absolute w-2 h-2 bg-pink-400 rounded-full opacity-70 animate-float pointer-events-none"
                                style={{
                                  bottom: '45%',
                                  left: '25%',
                                  boxShadow: '0 0 15px rgba(236, 72, 153, 1)',
                                  animationDelay: '2s',
                                  animationDuration: '4s',
                                }}
                              />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Controles mejorados del carousel */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 text-white rounded-full transition-all transform hover:scale-125 active:scale-95"
              style={{
                padding: '1.3rem',
                background: 'linear-gradient(135deg, #9d00ff 0%, #ff0080 100%)',
                boxShadow: '0 0 30px rgba(147, 51, 234, 0.8), 0 0 60px rgba(236, 72, 153, 0.5)',
              }}
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 text-white rounded-full transition-all transform hover:scale-125 active:scale-95"
              style={{
                padding: '1.3rem',
                background: 'linear-gradient(135deg, #ff0080 0%, #9d00ff 100%)',
                boxShadow: '0 0 30px rgba(236, 72, 153, 0.8), 0 0 60px rgba(147, 51, 234, 0.5)',
              }}
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
        </div>
      </section>

      {/* Sección con forma de punta */}
      <section
        className="relative min-h-screen flex items-center py-32"
        style={{ clipPath: 'polygon(0 10%, 50% 0, 100% 10%, 100% 90%, 50% 100%, 0 90%)' }}
      >
        <div
          className="absolute inset-0 bg-fixed-custom"
          style={{
            backgroundImage: "url('/images/image(15).jpg')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/90 via-orange-900/90 to-yellow-900/90"></div>
        </div>

        <div className="relative z-10 w-full text-center text-white" style={{ maxWidth: '80rem', padding: '0 2rem', margin: '0 auto' }}>
          <h2 className="font-black mb-8" style={{ fontSize: 'clamp(3rem, 10vw, 6rem)' }}>
            <span className="block" style={{ marginBottom: '1rem' }}>Manga</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
              Exclusivo
            </span>
          </h2>
          <p className="mb-16 mx-auto leading-relaxed" style={{ fontSize: '1.5rem', maxWidth: '48rem' }}>
            Las últimas ediciones, tomos exclusivos y colecciones completas.
            Sumérgete en las historias que amas con Akarumi Yume.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 mx-auto" style={{ gap: '2rem', maxWidth: '70rem' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 transform hover:scale-105" style={{ padding: '2rem' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="font-black text-yellow-400 mb-4" style={{ fontSize: '4rem' }}>{i}</div>
                  <h3 className="font-bold mb-2" style={{ fontSize: '1.5rem' }}>Categoría {i}</h3>
                  <p className="text-gray-300">Explora nuestra colección</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección Newsletter con forma ondulada */}
      <section
        className="relative min-h-screen flex items-center py-32"
        style={{ clipPath: 'polygon(0 15%, 100% 0, 100% 85%, 0 100%)' }}
      >
        <div
          className="absolute inset-0 bg-fixed-custom"
          style={{
            backgroundImage: "url('/images/image(9).jpg')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/95 via-blue-900/95 to-purple-900/95"></div>
        </div>

        <div className="relative z-10 w-full mx-auto text-center text-white" style={{ maxWidth: '70rem', padding: '0 3rem' }}>
          <Mail className="w-20 h-20 mx-auto mb-8 text-cyan-400" />
          <h2 className="font-black mb-8 leading-tight" style={{ fontSize: 'clamp(3rem, 10vw, 6rem)' }}>
            Suscríbete y
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
              Ahorra 20%
            </span>
          </h2>
          <p className="mb-12 text-gray-300" style={{ fontSize: '1.5rem' }}>
            Únete a la comunidad Akarumi Yume y disfruta de ofertas exclusivas,
            lanzamientos anticipados y contenido especial solo para miembros.
          </p>

          <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '50rem' }}>
            <div className="flex flex-col md:flex-row bg-white/10 backdrop-blur-md rounded-2xl" style={{ gap: '1rem', padding: '0.75rem' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="flex-1 rounded-xl bg-white/20 text-white placeholder-gray-300 border-2 border-transparent focus:border-cyan-400 focus:outline-none"
                style={{ padding: '1rem 1.5rem', fontSize: '1.125rem' }}
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-xl whitespace-nowrap"
                style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}
              >
                Suscribirme
              </button>
            </div>
          </form>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 mx-auto" style={{ gap: '2rem', maxWidth: '60rem' }}>
            {['Envío Gratis', 'Devoluciones', 'Pago Seguro', 'Soporte 24/7'].map((feature) => (
              <div key={feature} className="text-center">
                <div style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>✨</div>
                <div className="font-semibold" style={{ fontSize: '0.875rem' }}>{feature}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección Final CTA */}
      <section className="relative h-screen flex items-center justify-center">
        <div
          className="absolute inset-0 bg-fixed-custom"
          style={{
            backgroundImage: "url('/images/image(18).jpg')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-purple-900/70 to-black/80"></div>
        </div>

        <div className="relative z-10 text-center text-white" style={{ maxWidth: '80rem', padding: '0 1rem', margin: '0 auto' }}>
          <h2 className="font-black mb-8 leading-tight" style={{ fontSize: 'clamp(3.5rem, 12vw, 7rem)' }}>
            Vive el
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
              Sueño Brillante
            </span>
          </h2>
          <p className="mb-12 text-gray-300" style={{ fontSize: 'clamp(1.25rem, 3vw, 1.875rem)' }}>
            Más de 10,000 productos esperándote en Akarumi Yume
          </p>
          <button
            className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-700 hover:via-purple-700 hover:to-indigo-700 text-white font-bold rounded-full transition-all transform hover:scale-110 shadow-2xl inline-block"
            style={{ padding: '1.5rem 4rem', fontSize: '1.5rem' }}
          >
            Comprar Ahora
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;