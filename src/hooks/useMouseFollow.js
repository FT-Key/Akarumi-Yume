import { useState, useEffect, useRef } from 'react';

/**
 * Hook personalizado para seguir el movimiento del mouse
 * y calcular posición 3D para efectos de perspectiva
 * 
 * @param {number} sensitivity - Sensibilidad del movimiento (default: 20)
 * @returns {Object} { ref, position }
 */
export const useMouseFollow = (sensitivity = 20) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const elementRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / sensitivity;
        const y = (e.clientY - rect.top - rect.height / 2) / sensitivity;
        setPosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [sensitivity]);

  return { ref: elementRef, position };
};