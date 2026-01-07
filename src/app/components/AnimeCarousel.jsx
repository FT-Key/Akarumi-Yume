'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function AnimeCarousel({ carouselItems }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? carouselItems.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === carouselItems.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="relative flex justify-center items-center h-[650px] overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        {carouselItems.map((item, index) => {
          const offset =
            (index - currentSlide + carouselItems.length) %
            carouselItems.length;

          const isActive = offset === 0;

          return (
            <div
              key={index}
              className="absolute transition-all duration-700 ease-out"
              style={{
                transform: `
                  translateX(${offset * 70}px)
                  translateZ(${-offset * 120}px)
                  scale(${1 - offset * 0.08})
                `,
                opacity: offset < 3 ? 1 - offset * 0.3 : 0,
                zIndex: carouselItems.length - offset,
                pointerEvents: isActive ? 'auto' : 'none',
              }}
            >
              {/* Card */}
              <div
                className="relative overflow-hidden"
                style={{
                  width: '24rem',
                  height: '34rem',
                  background: '#0b0b0b',
                  borderRadius: '1.25rem',
                  boxShadow: isActive
                    ? '0 30px 60px rgba(0,0,0,0.6)'
                    : '0 15px 35px rgba(0,0,0,0.5)',
                  transition: 'all 0.6s ease',
                  clipPath: 'polygon(0 0, 100% 0, 100% 96%, 0 100%)',
                }}
              >
                {/* Imagen */}
                <div className="h-[65%] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-all duration-700"
                    style={{
                      transform: isActive ? 'scale(1.05)' : 'scale(1)',
                      filter: isActive
                        ? 'brightness(1)'
                        : 'brightness(0.85)',
                    }}
                  />
                </div>

                {/* Info */}
                <div className="h-[35%] p-6 flex flex-col justify-between bg-black">
                  <div>
                    <h3 className="text-white text-xl font-semibold mb-1">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Figura oficial · Importada
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-white text-lg font-medium">
                      {item.price}
                    </span>

                    {isActive && (
                      <button
                        className="px-5 py-2 rounded-full text-sm text-white transition-all"
                        style={{
                          background: 'rgba(255,255,255,0.08)',
                          backdropFilter: 'blur(6px)',
                        }}
                      >
                        Ver producto
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controles */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition"
      >
        <ChevronLeft size={36} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition"
      >
        <ChevronRight size={36} />
      </button>
    </div>
  );
}
