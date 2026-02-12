import React, { useState } from 'react';
import { User } from 'lucide-react';

const UserButton = ({ user, isAuthenticated, onClick, showTooltip = true }) => {
  const [showHover, setShowHover] = useState(false);

  const getDisplayName = () => {
    if (!user) return '';
    return user.firstName || user.email?.split('@')[0] || 'Usuario';
  };

  return (
    <div className="relative">
      {isAuthenticated ? (
        // Usuario autenticado - Mostrar nombre con ancho máximo
        <button
          onClick={onClick}
          onMouseEnter={() => setShowHover(true)}
          onMouseLeave={() => setShowHover(false)}
          className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 group"
          aria-label="Menú de usuario"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <span className="text-sm font-medium max-w-[100px] truncate">
            {getDisplayName()}
          </span>
        </button>
      ) : (
        // Usuario no autenticado - Mostrar solo icono
        <button
          onClick={onClick}
          onMouseEnter={() => setShowHover(true)}
          onMouseLeave={() => setShowHover(false)}
          className="relative text-gray-300 hover:text-white transition-colors duration-300"
          aria-label="Iniciar sesión"
        >
          <User size={20} />
          
          {/* Tooltip */}
          {showTooltip && showHover && (
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap z-50">
              <div className="bg-black/90 text-white text-xs py-1 px-2 rounded shadow-lg">
                Iniciar Sesión
              </div>
            </div>
          )}
        </button>
      )}
    </div>
  );
};

export default UserButton;