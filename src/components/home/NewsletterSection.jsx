'use client';

import React from 'react';
import { Mail } from 'lucide-react';
import { useNewsletter } from '@/hooks/useNewsletter';
import SectionSeparator from '@/components/common/SectionSeparator';

const FEATURES = ['Envío Gratis', 'Devoluciones', 'Pago Seguro', 'Soporte 24/7'];

const NewsletterSection = () => {
  const { email, setEmail, handleSubmit, isSubmitting } = useNewsletter();

  return (
    <section className="relative min-h-screen flex items-center py-32">
      <div
        className="absolute inset-0 bg-fixed-custom"
        style={{
          backgroundImage: "url('/images/image(9).jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/95 via-blue-900/95 to-purple-900/95"></div>
      </div>

      {/* Separadores tipo curve arriba y abajo */}
      <SectionSeparator 
        type="curve" 
        position="bottom" 
        color="rgba(0, 0, 0, 1)"
        height={12}
        flip={true}
      />

      <div 
        className="relative z-10 w-full mx-auto text-center text-white" 
        style={{ maxWidth: '70rem', padding: '0 3rem' }}
      >
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
          <div 
            className="flex flex-col md:flex-row bg-white/10 backdrop-blur-md rounded-2xl" 
            style={{ gap: '1rem', padding: '0.75rem' }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              disabled={isSubmitting}
              className="flex-1 rounded-xl bg-white/20 text-white placeholder-gray-300 border-2 border-transparent focus:border-cyan-400 focus:outline-none disabled:opacity-50"
              style={{ padding: '1rem 1.5rem', fontSize: '1.125rem' }}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-xl whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}
            >
              {isSubmitting ? 'Enviando...' : 'Suscribirme'}
            </button>
          </div>
        </form>

        <div 
          className="mt-16 grid grid-cols-2 md:grid-cols-4 mx-auto" 
          style={{ gap: '2rem', maxWidth: '60rem' }}
        >
          {FEATURES.map((feature) => (
            <div key={feature} className="text-center">
              <div style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>✨</div>
              <div className="font-semibold" style={{ fontSize: '0.875rem' }}>{feature}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;