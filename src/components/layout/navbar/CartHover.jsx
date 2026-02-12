import React from 'react';
import { ShoppingCart, X } from 'lucide-react';
import { useCartStore } from '@/stores';

const CartHover = ({ onClose, onNavigate }) => {
  const { items, subtotal } = useCartStore();
  console.log(items)
  const displayItems = items.slice(0, 3);

  if (items.length === 0) {
    return (
      <div className="p-4 text-center w-80">
        <ShoppingCart className="mx-auto mb-2 text-gray-400" size={32} />
        <p className="text-gray-400 text-sm">Tu carrito está vacío</p>
        <p className="text-gray-500 text-xs mt-1">¡Agrega productos para comenzar!</p>
      </div>
    );
  }

  return (
    <div className="w-80">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h3 className="text-white font-bold text-sm">
          Mi Carrito ({items.length})
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="Cerrar"
        >
          <X size={18} />
        </button>
      </div>

      {/* Items */}
      <div className="max-h-80 overflow-y-auto">
        {displayItems.map((item) => (
          <div
            key={item.productSnapshot?._id}
            className="flex gap-3 p-3 border-b border-white/5 hover:bg-white/5 transition-colors"
          >
            {/* Imagen */}
            <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-white/5">
              {item.productSnapshot?.images?.[0] ? (
                <img
                  src={item.productSnapshot.images[0].url}
                  alt={item.productSnapshot.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingCart size={20} className="text-gray-600" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-white text-sm font-medium truncate">
                {item.productSnapshot?.name || 'Producto'}
              </h4>
              <p className="text-gray-400 text-xs mt-0.5">
                Cantidad: {item.quantity}
              </p>
              <p className="text-pink-400 text-sm font-bold mt-1">
                ${((item.productSnapshot?.price || 0) * item.quantity).toLocaleString()}
              </p>
            </div>
          </div>
        ))}

        {/* Mostrar más items indicator */}
        {items.length > 3 && (
          <div className="p-3 text-center border-b border-white/5">
            <p className="text-gray-400 text-xs">
              +{items.length - 3} productos más
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-400 text-sm">Subtotal:</span>
          <span className="text-white font-bold text-lg">
            ${subtotal.toLocaleString()}
          </span>
        </div>
        <button
          onClick={onNavigate}
          className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-sm transition-all duration-300"
        >
          Ver Carrito Completo
        </button>
      </div>
    </div>
  );
};

export default CartHover;