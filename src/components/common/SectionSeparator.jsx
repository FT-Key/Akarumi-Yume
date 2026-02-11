'use client';

import React from 'react';

/**
 * SectionSeparator - Componente de separadores responsive para secciones
 * 
 * @param {string} type - Tipo de separador: 'diagonal', 'wave', 'curve', 'zigzag', 'mountains', 'angled-cut'
 * @param {string} position - Posición: 'top', 'bottom', 'both'
 * @param {string} color - Color del separador (ej: '#000000', 'rgb(0,0,0)')
 * @param {boolean} flip - Invierte el separador verticalmente
 * @param {boolean} flipHorizontal - Invierte el separador horizontalmente
 * @param {number} height - Altura del separador en viewport height (default: 10)
 */

const SectionSeparator = ({ 
  type = 'diagonal', 
  position = 'both', 
  color = 'currentColor',
  flip = false,
  flipHorizontal = false,
  height = 10 
}) => {
  const separatorHeight = `${height}vh`;

  const renderSeparator = (isTop) => {
    // Sin flip por defecto, los paths ahora empiezan desde arriba
    const flipVerticalClass = flip ? 'scale-y-[-1]' : '';
    const flipHorizontalClass = flipHorizontal ? 'scale-x-[-1]' : '';
    const combinedFlipClass = `${flipVerticalClass} ${flipHorizontalClass}`.trim();
    
    switch (type) {
      case 'diagonal':
        return (
          <div className={`absolute ${isTop ? 'top-0' : 'bottom-0'} left-0 w-full overflow-hidden ${combinedFlipClass} pointer-events-none`}
               style={{ height: separatorHeight, lineHeight: 0, zIndex: 1 }}>
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="block w-full h-full">
              <path d="M0,0 L1200,120 L1200,0 Z" fill={color}></path>
            </svg>
          </div>
        );

      case 'wave':
        return (
          <div className={`absolute ${isTop ? 'top-0' : 'bottom-0'} left-0 w-full overflow-hidden ${combinedFlipClass} pointer-events-none`}
               style={{ height: separatorHeight, lineHeight: 0, zIndex: 1 }}>
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="block w-full h-full">
              <path d="M0,0 C300,60 400,60 600,30 C800,0 900,0 1200,30 L1200,0 Z" fill={color}></path>
            </svg>
          </div>
        );

      case 'curve':
        return (
          <div className={`absolute ${isTop ? 'top-0' : 'bottom-0'} left-0 w-full overflow-hidden ${combinedFlipClass} pointer-events-none`}
               style={{ height: separatorHeight, lineHeight: 0, zIndex: 1 }}>
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="block w-full h-full">
              <path d="M0,0 Q600,120 1200,0 L1200,0 Z" fill={color}></path>
            </svg>
          </div>
        );

      case 'zigzag':
        return (
          <div className={`absolute ${isTop ? 'top-0' : 'bottom-0'} left-0 w-full overflow-hidden ${combinedFlipClass} pointer-events-none`}
               style={{ height: separatorHeight, lineHeight: 0, zIndex: 1 }}>
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="block w-full h-full">
              <path d="M0,0 L200,120 L400,0 L600,120 L800,0 L1000,120 L1200,0 L1200,0 Z" fill={color}></path>
            </svg>
          </div>
        );

      case 'mountains':
        return (
          <div className={`absolute ${isTop ? 'top-0' : 'bottom-0'} left-0 w-full overflow-hidden ${combinedFlipClass} pointer-events-none`}
               style={{ height: separatorHeight, lineHeight: 0, zIndex: 1 }}>
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="block w-full h-full">
              <path d="M0,0 L300,90 L600,30 L900,80 L1200,20 L1200,0 Z" fill={color}></path>
            </svg>
          </div>
        );

      case 'double-wave':
        return (
          <div className={`absolute ${isTop ? 'top-0' : 'bottom-0'} left-0 w-full overflow-hidden ${combinedFlipClass} pointer-events-none`}
               style={{ height: separatorHeight, lineHeight: 0, zIndex: 1 }}>
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="block w-full h-full">
              <path d="M0,0 C150,60 350,60 600,30 C850,0 1050,0 1200,30 L1200,0 Z" fill={color} opacity="0.5"></path>
              <path d="M0,20 C200,80 400,80 600,50 C800,20 1000,20 1200,50 L1200,0 L0,0 Z" fill={color}></path>
            </svg>
          </div>
        );

      case 'arrow':
        return (
          <div className={`absolute ${isTop ? 'top-0' : 'bottom-0'} left-0 w-full overflow-hidden ${combinedFlipClass} pointer-events-none`}
               style={{ height: separatorHeight, lineHeight: 0, zIndex: 1 }}>
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="block w-full h-full">
              <path d="M0,0 L600,120 L1200,0 L1200,0 Z" fill={color}></path>
            </svg>
          </div>
        );

      case 'split':
        return (
          <div className={`absolute ${isTop ? 'top-0' : 'bottom-0'} left-0 w-full overflow-hidden ${combinedFlipClass} pointer-events-none`}
               style={{ height: separatorHeight, lineHeight: 0, zIndex: 1 }}>
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="block w-full h-full">
              <path d="M0,0 L600,60 L1200,0 L1200,0 Z" fill={color}></path>
            </svg>
          </div>
        );

      case 'angled-cut':
        // Replica el polygon(0 10%, 50% 0, 100% 10%, 100% 90%, 50% 100%, 0 90%)
        // Crea cortes angulares más pronunciados: empieza en 30% a la izquierda, sube al 0% en el centro, baja al 30% a la derecha
        return (
          <div className={`absolute ${isTop ? 'top-0' : 'bottom-0'} left-0 w-full overflow-hidden ${combinedFlipClass} pointer-events-none`}
               style={{ height: separatorHeight, lineHeight: 0, zIndex: 1 }}>
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="block w-full h-full">
              <path d="M0,36 L600,0 L1200,36 L1200,0 L0,0 Z" fill={color}></path>
            </svg>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {(position === 'top' || position === 'both') && renderSeparator(true)}
      {(position === 'bottom' || position === 'both') && renderSeparator(false)}
    </>
  );
};

export default SectionSeparator;