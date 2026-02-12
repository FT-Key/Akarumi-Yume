import React from 'react';
import { User, UserCircle, Package, LogOut } from 'lucide-react';

const UserMenu = ({ user, isAuthenticated, showMenu, onClose, onLogout }) => {
  if (!isAuthenticated) {
    return (
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <div className="bg-black/90 text-white text-xs py-1 px-2 rounded">
          Iniciar Sesión
        </div>
      </div>
    );
  }

  if (!showMenu) return null;

  return (
    <div
      className="absolute top-full right-0 mt-2 w-56 rounded-xl overflow-hidden"
      style={{
        background: 'rgba(0, 0, 0, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(147, 51, 234, 0.3)',
        boxShadow: '0 10px 40px rgba(147, 51, 234, 0.3)',
      }}
      onMouseLeave={onClose}
    >
      {/* Header del menú */}
      <div className="px-4 py-3 border-b border-white/10">
        <p className="text-white font-semibold text-sm">
          {user?.firstName} {user?.lastName}
        </p>
        <p className="text-gray-400 text-xs truncate">{user?.email}</p>
      </div>

      {/* Opciones del menú */}
      <div className="py-2">
        <a
          href="/perfil"
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-pink-600/20 transition-all duration-300"
        >
          <UserCircle size={18} />
          Mi Perfil
        </a>
        <a
          href="/pedidos"
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-pink-600/20 transition-all duration-300"
        >
          <Package size={18} />
          Mis Pedidos
        </a>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-600/10 transition-all duration-300"
        >
          <LogOut size={18} />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default UserMenu;