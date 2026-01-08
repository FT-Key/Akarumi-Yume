'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mail, Star, Sparkles } from 'lucide-react';
import HomeCarousel from './components/HomeCarousel';

const HomePage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [email, setEmail] = useState('');
  const heroRef = useRef(null);

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
          <HomeCarousel />
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