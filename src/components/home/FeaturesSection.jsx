'use client';

import React from 'react';
import { Star } from 'lucide-react';
import HomeCarousel from '@/components/home/HomeCarousel';
import SectionSeparator from '@/components/common/SectionSeparator';

const FeaturesSection = () => {
  return (
    <section className="relative min-h-screen flex items-center py-32">
      <div
        className="absolute inset-0 bg-fixed-custom"
        style={{
          backgroundImage: "url('/images/image(12).jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/95 via-purple-900/90 to-pink-900/95"></div>
      </div>

      {/* Separadores arriba y abajo */}
      <SectionSeparator 
        type="diagonal" 
        position="bottom" 
        color="rgba(0, 0, 0, 1)"
        height={8}
        flip={true}
      />

      <div 
        className="relative z-10 w-full mx-auto grid grid-cols-1 lg:grid-cols-2 items-center" 
        style={{ maxWidth: '90rem', padding: '0 3rem', gap: '4rem' }}
      >
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
  );
};

export default FeaturesSection;