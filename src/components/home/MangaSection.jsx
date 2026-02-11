'use client';

import React from 'react';
import SectionSeparator from '@/components/common/SectionSeparator';

const CATEGORIES = [
  { id: 1, name: 'Shonen' },
  { id: 2, name: 'Seinen' },
  { id: 3, name: 'Shojo' },
];

const MangaSection = () => {
  return (
    <section className="relative min-h-screen flex items-center py-32">
      <div
        className="absolute inset-0 bg-fixed-custom"
        style={{
          backgroundImage: "url('/images/image(15).jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/90 via-orange-900/90 to-yellow-900/90"></div>
      </div>

      {/* Separadores tipo montaña arriba y abajo */}
      <SectionSeparator 
        type="angled-cut" 
        position="bottom" 
        color="rgba(0, 0, 0, 1)"
        height={15}
        flip={true}
      />

      <div 
        className="relative z-10 w-full text-center text-white" 
        style={{ maxWidth: '80rem', padding: '0 2rem', margin: '0 auto' }}
      >
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
          {CATEGORIES.map((category) => (
            <div 
              key={category.id} 
              className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 transform hover:scale-105" 
              style={{ padding: '2rem' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="font-black text-yellow-400 mb-4" style={{ fontSize: '4rem' }}>
                  {category.id}
                </div>
                <h3 className="font-bold mb-2" style={{ fontSize: '1.5rem' }}>
                  {category.name}
                </h3>
                <p className="text-gray-300">Explora nuestra colección</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MangaSection;