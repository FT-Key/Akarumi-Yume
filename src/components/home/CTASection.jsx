'use client';

import React from 'react';
import SectionSeparator from '@/components/common/SectionSeparator';

const CTASection = () => {
  return (
    <section className="relative h-screen flex items-center justify-center">
      <div
        className="absolute inset-0 bg-fixed-custom"
        style={{
          backgroundImage: "url('/images/image(18).jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-purple-900/70 to-black/80"></div>
      </div>

      {/* Separador superior tipo arrow */}
      <SectionSeparator 
        type="arrow" 
        position="bottom" 
        color="rgba(0, 0, 0, 1)"
        height={10}
        flip={true}
      />

      <div 
        className="relative z-10 text-center text-white" 
        style={{ maxWidth: '80rem', padding: '0 1rem', margin: '0 auto' }}
      >
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
  );
};

export default CTASection;