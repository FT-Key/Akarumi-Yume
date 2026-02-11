'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { useMouseFollow } from '@/hooks/useMouseFollow';
import SectionSeparator from '@/components/common/SectionSeparator';

const HeroSection = () => {
  const { ref, position } = useMouseFollow(20);

  return (
    <section
      ref={ref}
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

      {/* Separador inferior */}
      <SectionSeparator 
        type="wave" 
        position="bottom" 
        color="rgba(0, 0, 0, 1)"
        height={12}
        flip={true}
      />

      <div className="relative z-10 text-center text-white px-4 max-w-6xl">
        <div className="mb-8 flex justify-center">
          <Sparkles className="w-12 h-12 text-yellow-400 animate-pulse" />
        </div>
        
        <h1
          className="text-7xl md:text-9xl font-black mb-8 tracking-tight"
          style={{
            transform: `perspective(1000px) rotateX(${position.y}deg) rotateY(${position.x}deg)`,
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
    </section>
  );
};

export default HeroSection;