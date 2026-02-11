'use client';

import React, { useState } from 'react';
import { Heart, Star, Sparkles } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = () => {
    if (email) {
      alert(`¡Suscripción exitosa para ${email}!`);
      setEmail('');
    }
  };

  return (
    <footer className="relative bg-black text-white overflow-hidden">
      {/* Forma superior con clip-path */}
      <div
        className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-black"
        style={{
          clipPath: 'polygon(0 50%, 25% 0, 50% 50%, 75% 0, 100% 50%, 100% 100%, 0 100%)',
        }}
      />

      {/* Fondo con imagen */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full bg-fixed-custom"
          style={{
            backgroundImage: "url('/images/image(13).jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </div>

      {/* Overlay con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-purple-950/40 to-transparent" />

      {/* Contenido */}
      <div className="relative pt-32 pb-8 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Grid principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Columna 1 - Logo y descripción */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div
                  className="relative w-14 h-14 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500"
                  style={{
                    clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                    boxShadow: '0 0 30px rgba(147, 51, 234, 0.8)',
                  }}
                >
                  <Sparkles className="absolute inset-0 m-auto text-white" size={28} />
                </div>
                <div>
                  <h3
                    className="font-black text-xl tracking-tight"
                    style={{
                      background: 'linear-gradient(135deg, #a78bfa 0%, #ec4899 50%, #06b6d4 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    AKARUMI YUME
                  </h3>
                  <p className="text-xs text-gray-500 font-light tracking-wider">明るみ夢</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Tu tienda de anime y manga de confianza. Donde los sueños brillantes cobran vida.
              </p>
              
              {/* Iconos sociales */}
              <div className="flex gap-3">
                {['twitter', 'instagram', 'discord', 'youtube'].map((social) => (
                  <a
                    key={social}
                    href={`#${social}`}
                    className="w-10 h-10 rounded-lg bg-white/5 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 flex items-center justify-center transition-all duration-300 hover:scale-110"
                    style={{
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                    aria-label={social}
                  >
                    <span className="text-xs font-bold uppercase">{social[0]}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Columna 2 - Categorías */}
            <div>
              <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Star size={18} className="text-yellow-400" />
                Categorías
              </h4>
              <ul className="space-y-3">
                {['Figuras de Colección', 'Manga & Comics', 'Ropa & Accesorios', 'Peluches', 'Decoración', 'Ofertas Especiales'].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white hover:translate-x-2 transition-all duration-300 text-sm flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Columna 3 - Información */}
            <div>
              <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Sparkles size={18} className="text-cyan-400" />
                Información
              </h4>
              <ul className="space-y-3">
                {['Sobre Nosotros', 'Envíos y Devoluciones', 'Política de Privacidad', 'Términos y Condiciones', 'Preguntas Frecuentes', 'Contacto'].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white hover:translate-x-2 transition-all duration-300 text-sm flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Columna 4 - Newsletter */}
            <div>
              <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Heart size={18} className="text-pink-400" />
                Newsletter
              </h4>
              <p className="text-gray-400 text-sm mb-4">
                Suscríbete y recibe ofertas exclusivas
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-all duration-300"
                />
                <button
                  onClick={handleSubscribe}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 font-bold transition-all duration-300 hover:scale-105"
                  style={{
                    boxShadow: '0 5px 20px rgba(236, 72, 153, 0.4)',
                  }}
                >
                  Suscribirme
                </button>
              </div>

              {/* Insignias de pago */}
              <div className="mt-6">
                <p className="text-xs text-gray-500 mb-3">Métodos de pago</p>
                <div className="flex gap-2 flex-wrap">
                  {['VISA', 'MC', 'AMEX', 'PP'].map((card) => (
                    <div
                      key={card}
                      className="px-3 py-2 rounded bg-white/5 border border-white/10 text-xs font-bold text-gray-400"
                    >
                      {card}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Separador con gradiente */}
          <div
            className="h-px mb-8"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, #9333ea 20%, #ec4899 50%, #06b6d4 80%, transparent 100%)',
            }}
          />

          {/* Footer bottom */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© 2026 Akarumi Yume. Todos los derechos reservados.</p>
            
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors duration-300">
                Política de Cookies
              </a>
              <a href="#" className="hover:text-white transition-colors duration-300">
                Privacidad
              </a>
              <a href="#" className="hover:text-white transition-colors duration-300">
                Legal
              </a>
            </div>
          </div>

          {/* Badge "Made with ❤️" */}
          <div className="text-center mt-8">
            <p className="text-xs text-gray-600">
              Hecho con{' '}
              <span className="text-pink-500 animate-pulse">❤️</span>
              {' '}por fans del anime
            </p>
          </div>
        </div>
      </div>

      {/* Decoración inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
    </footer>
  );
};

export default Footer;