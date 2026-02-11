import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HomeCarousel = ({ carouselStyle = 'random' }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState(carouselStyle || 'sakura');

  // Seleccionar estilo aleatorio solo en el cliente
  useEffect(() => {
    if (carouselStyle === 'random') {
      const styles = ['sakura', 'wave', 'origami', 'zen'];
      setSelectedStyle(styles[Math.floor(Math.random() * styles.length)]);
    } else if (carouselStyle) {
      setSelectedStyle(carouselStyle);
    }
  }, [carouselStyle]);

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

  const styles = {
    sakura: {
      cardBg: 'linear-gradient(135deg, #fff5f7 0%, #ffffff 50%, #fff0f5 100%)',
      cardBorder: '1px solid rgba(251, 113, 133, 0.2)',
      accentColor: '#fb7185',
      topBar: 'linear-gradient(to right, #fda4af 0%, #fb7185 50%, #fda4af 100%)',
      badgeBg: 'rgba(255, 255, 255, 0.9)',
      buttonBg: '#fb7185',
      buttonHover: '#f43f5e',
      shadow: '0 20px 40px rgba(251, 113, 133, 0.15)'
    },
    wave: {
      cardBg: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #eff6ff 100%)',
      cardBorder: '1px solid rgba(56, 189, 248, 0.2)',
      accentColor: '#38bdf8',
      topBar: 'linear-gradient(to right, #7dd3fc 0%, #38bdf8 50%, #7dd3fc 100%)',
      badgeBg: 'rgba(255, 255, 255, 0.9)',
      buttonBg: '#38bdf8',
      buttonHover: '#0ea5e9',
      shadow: '0 20px 40px rgba(56, 189, 248, 0.15)'
    },
    origami: {
      cardBg: 'linear-gradient(135deg, #fef3c7 0%, #ffffff 40%, #fef3c7 100%)',
      cardBorder: '1px solid rgba(251, 191, 36, 0.3)',
      accentColor: '#fbbf24',
      topBar: 'linear-gradient(to right, #fde68a 0%, #fbbf24 50%, #fde68a 100%)',
      badgeBg: 'rgba(255, 255, 255, 0.9)',
      buttonBg: '#fbbf24',
      buttonHover: '#f59e0b',
      shadow: '0 20px 40px rgba(251, 191, 36, 0.15)'
    },
    zen: {
      cardBg: 'linear-gradient(135deg, #f5f5f4 0%, #ffffff 50%, #fafaf9 100%)',
      cardBorder: '1px solid rgba(168, 162, 158, 0.2)',
      accentColor: '#78716c',
      topBar: 'linear-gradient(to right, #d6d3d1 0%, #a8a29e 50%, #d6d3d1 100%)',
      badgeBg: 'rgba(255, 255, 255, 0.9)',
      buttonBg: '#78716c',
      buttonHover: '#57534e',
      shadow: '0 20px 40px rgba(120, 113, 108, 0.15)'
    }
  };

  const currentStyle = styles[selectedStyle] || styles.sakura;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  // Renderizar patrón según el estilo
  const renderPattern = () => {
    switch (selectedStyle) {
      case 'sakura':
        return (
          <div className="absolute inset-0 opacity-25 pointer-events-none overflow-hidden">
            {/* Flores de cerezo con 5 pétalos - posicionadas en la parte inferior */}
            {[
              { top: '72%', left: '12%', size: 32, rotation: 15 },
              { top: '78%', right: '18%', size: 28, rotation: -30 },
              { top: '85%', left: '25%', size: 35, rotation: 45 },
              { top: '75%', right: '15%', size: 24, rotation: 60 },
              { top: '90%', left: '15%', size: 30, rotation: -15 },
              { top: '80%', left: '45%', size: 20, rotation: 90 },
              { top: '88%', right: '30%', size: 26, rotation: -45 }
            ].map((flower, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  ...flower,
                  width: `${flower.size}px`,
                  height: `${flower.size}px`,
                  transform: `rotate(${flower.rotation}deg)`
                }}
              >
                {/* Pétalos */}
                {[0, 72, 144, 216, 288].map((angle, j) => (
                  <div
                    key={j}
                    className="absolute"
                    style={{
                      width: `${flower.size * 0.4}px`,
                      height: `${flower.size * 0.5}px`,
                      background: i % 2 === 0 ? '#fda4af' : '#fbb6ce',
                      borderRadius: '50% 50% 50% 0',
                      top: '50%',
                      left: '50%',
                      transformOrigin: 'bottom left',
                      transform: `rotate(${angle}deg) translateY(-${flower.size * 0.35}px)`,
                    }}
                  />
                ))}
                {/* Centro de la flor */}
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    width: `${flower.size * 0.25}px`,
                    height: `${flower.size * 0.25}px`,
                    background: '#fbbf24'
                  }}
                />
              </div>
            ))}
          </div>
        );

      case 'wave':
        return (
          <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <path d="M0,360 Q35,340 70,360 T140,360 T210,360 T280,360 T350,360" stroke="#38bdf8" strokeWidth="3" fill="none" />
              <path d="M0,380 Q35,360 70,380 T140,380 T210,380 T280,380 T350,380" stroke="#7dd3fc" strokeWidth="3" fill="none" />
              <path d="M0,400 Q35,380 70,400 T140,400 T210,400 T280,400 T350,400" stroke="#38bdf8" strokeWidth="2.5" fill="none" />
              <path d="M0,420 Q35,400 70,420 T140,420 T210,420 T280,420 T350,420" stroke="#7dd3fc" strokeWidth="2" fill="none" />
              <path d="M0,440 Q35,420 70,440 T140,440 T210,440 T280,440 T350,440" stroke="#38bdf8" strokeWidth="2" fill="none" />
              <path d="M0,460 Q35,440 70,460 T140,460 T210,460 T280,460 T350,460" stroke="#7dd3fc" strokeWidth="2" fill="none" />
              <path d="M0,480 Q35,460 70,480 T140,480 T210,480 T280,480 T350,480" stroke="#38bdf8" strokeWidth="2" fill="none" />
            </svg>
          </div>
        );

      case 'origami':
        return (
          <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
            {/* Triángulos - posicionados en la parte inferior */}
            <div
              className="absolute"
              style={{
                top: '75%',
                left: '12%',
                width: 0,
                height: 0,
                borderLeft: '30px solid transparent',
                borderRight: '30px solid transparent',
                borderBottom: '52px solid #fbbf24',
                transform: 'rotate(15deg)'
              }}
            />
            <div
              className="absolute"
              style={{
                top: '85%',
                left: '16%',
                width: 0,
                height: 0,
                borderLeft: '25px solid transparent',
                borderRight: '25px solid transparent',
                borderBottom: '43px solid #fde68a',
                transform: 'rotate(-30deg)'
              }}
            />
            <div
              className="absolute"
              style={{
                top: '78%',
                left: '35%',
                width: 0,
                height: 0,
                borderLeft: '20px solid transparent',
                borderRight: '20px solid transparent',
                borderBottom: '35px solid #fbbf24',
                transform: 'rotate(60deg)'
              }}
            />

            {/* Cuadrados rotados - posicionados en la parte inferior */}
            <div
              className="absolute"
              style={{
                top: '73%',
                right: '20%',
                width: '40px',
                height: '40px',
                background: '#fde68a',
                transform: 'rotate(45deg)'
              }}
            />
            <div
              className="absolute"
              style={{
                top: '88%',
                right: '12%',
                width: '35px',
                height: '35px',
                background: '#fbbf24',
                transform: 'rotate(30deg)'
              }}
            />
            <div
              className="absolute"
              style={{
                top: '80%',
                right: '35%',
                width: '28px',
                height: '28px',
                background: '#fde68a',
                transform: 'rotate(60deg)'
              }}
            />
          </div>
        );

      case 'zen':
        return (
          <div className="absolute inset-0 opacity-15 pointer-events-none overflow-hidden">
            {/* Líneas verticales y horizontales - posicionadas en la parte inferior */}
            <div className="absolute" style={{ top: '72%', left: '16%', width: '1px', height: '80px', background: '#78716c' }} />
            <div className="absolute" style={{ top: '72%', left: '16%', width: '80px', height: '1px', background: '#78716c' }} />

            <div className="absolute" style={{ top: '88%', right: '16%', width: '1px', height: '50px', background: '#78716c' }} />
            <div className="absolute" style={{ top: '88%', right: '16%', width: '80px', height: '1px', background: '#78716c' }} />

            <div className="absolute" style={{ top: '78%', right: '40%', width: '1px', height: '60px', background: '#a8a29e' }} />
            <div className="absolute" style={{ top: '78%', right: '40%', width: '60px', height: '1px', background: '#a8a29e' }} />

            {/* Círculos concéntricos - centrados en la parte de texto */}
            <div className="absolute" style={{ top: '82%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              <div className="w-28 h-28 rounded-full border-2 border-stone-400" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-2 border-stone-400" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-stone-400" />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 py-12">
      {/* Decoración japonesa sutil superior */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-px" style={{ background: `linear-gradient(to right, transparent, ${currentStyle.accentColor}, transparent)` }}></div>
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currentStyle.accentColor }}></div>
          <div className="w-12 h-px" style={{ background: `linear-gradient(to right, transparent, ${currentStyle.accentColor}, transparent)` }}></div>
        </div>
      </div>

      <div className="relative flex justify-center items-center" style={{ height: '600px' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          {carouselItems.map((item, index) => {
            const offset = (index - currentSlide + carouselItems.length) % carouselItems.length;
            const isActive = offset === 0;

            return (
              <div
                key={index}
                className="absolute transition-all duration-500 ease-out"
                style={{
                  transform: `
                    translateX(${offset * 60}px) 
                    translateZ(${-offset * 100}px) 
                    scale(${1 - offset * 0.1})
                  `,
                  opacity: offset < 3 ? 1 - offset * 0.3 : 0,
                  zIndex: carouselItems.length - offset,
                  pointerEvents: isActive ? 'auto' : 'none',
                }}
              >
                <div
                  className="rounded-lg overflow-hidden transition-all duration-500 relative"
                  style={{
                    width: '350px',
                    height: '500px',
                    background: currentStyle.cardBg,
                    border: currentStyle.cardBorder,
                    boxShadow: isActive ? currentStyle.shadow : '0 10px 20px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {/* Patrón de fondo */}
                  {renderPattern()}

                  {/* Barra superior decorativa */}
                  <div className="relative h-1" style={{ background: currentStyle.topBar }}></div>

                  {/* Imagen */}
                  <div className="relative overflow-hidden bg-gray-100" style={{ height: '350px' }}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700"
                      style={{
                        transform: isActive ? 'scale(1)' : 'scale(1.05)',
                        filter: isActive ? 'grayscale(0)' : 'grayscale(0.3)',
                        objectPosition: 'center center'
                      }}
                    />

                    {/* Género badge minimalista */}
                    <div
                      className="absolute top-3 right-3 backdrop-blur-sm px-3 py-1 rounded-full"
                      style={{ background: currentStyle.badgeBg }}
                    >
                      <span className="text-xs font-medium text-gray-700">{item.genre}</span>
                    </div>

                    {/* Gradiente inferior suave */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
                      style={{
                        background: 'linear-gradient(to top, rgba(255, 255, 255, 0.5), transparent)'
                      }}
                    ></div>
                  </div>

                  {/* Contenido */}
                  <div className="p-5 relative z-10" style={{ height: '150px' }}>
                    {/* Título */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-2.5">
                      {item.title}
                    </h3>

                    {/* Separador decorativo */}
                    <div className="flex items-center gap-2 mb-2.5">
                      <div className="flex-1 h-px bg-gray-200"></div>
                      <div className="w-1 h-1 rounded-full" style={{ backgroundColor: currentStyle.accentColor }}></div>
                      <div className="flex-1 h-px bg-gray-200"></div>
                    </div>

                    {/* Precio y botón */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Precio</p>
                        <p className="text-2xl font-bold" style={{ color: currentStyle.accentColor }}>{item.price}</p>
                      </div>

                      {isActive && (
                        <button
                          className="text-white px-6 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105 active:scale-95"
                          style={{
                            backgroundColor: currentStyle.buttonBg,
                            boxShadow: `0 4px 12px ${currentStyle.accentColor}40`
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = currentStyle.buttonHover}
                          onMouseLeave={(e) => e.target.style.backgroundColor = currentStyle.buttonBg}
                        >
                          Ver más
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Controles del carrusel */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-gray-50 text-gray-700 rounded-full p-3 transition-all transform hover:scale-110 active:scale-95"
          style={{
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-gray-50 text-gray-700 rounded-full p-3 transition-all transform hover:scale-110 active:scale-95"
          style={{
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Indicadores de puntos */}
      <div className="flex justify-center gap-2 mt-8">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className="transition-all duration-300"
            style={{
              width: currentSlide === index ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              backgroundColor: currentSlide === index ? currentStyle.accentColor : '#e5e7eb',
            }}
          />
        ))}
      </div>

      {/* Decoración japonesa sutil inferior */}
      <div className="flex justify-center mt-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-px" style={{ background: `linear-gradient(to right, transparent, ${currentStyle.accentColor}, transparent)` }}></div>
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currentStyle.accentColor }}></div>
          <div className="w-12 h-px" style={{ background: `linear-gradient(to right, transparent, ${currentStyle.accentColor}, transparent)` }}></div>
        </div>
      </div>
    </div>
  );
};

export default HomeCarousel;