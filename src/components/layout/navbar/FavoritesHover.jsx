import React from 'react';
import { Heart, X } from 'lucide-react';
import { useFavoritesStore } from '@/stores';

const FavoritesHover = ({ onClose, onNavigate }) => {
  const { products } = useFavoritesStore();
  console.log(products)
  const displayProducts = products.slice(0, 3); // Mostrar máximo 3 productos

  if (products.length === 0) {
    return (
      <div className="p-4 text-center w-80">
        <Heart className="mx-auto mb-2 text-gray-400" size={32} />
        <p className="text-gray-400 text-sm">No tienes favoritos</p>
        <p className="text-gray-500 text-xs mt-1">¡Guarda tus productos favoritos aquí!</p>
      </div>
    );
  }

  return (
    <div className="w-80">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h3 className="text-white font-bold text-sm">
          Mis Favoritos ({products.length})
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="Cerrar"
        >
          <X size={18} />
        </button>
      </div>

      {/* Products */}
      <div className="max-h-80 overflow-y-auto">
        {displayProducts.map((product) => (
          <a
            key={product._id}
            href={`/productos/${product.slug}`}
            className="flex gap-3 p-3 border-b border-white/5 hover:bg-white/5 transition-colors"
            onClick={onClose}
          >
            {/* Imagen */}
            <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-white/5">
              {product.images?.[0] ? (
                <img
                  src={product.images[0].url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Heart size={20} className="text-gray-600" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-white text-sm font-medium truncate">
                {product.name}
              </h4>
              {product.stock > 0 ? (
                <p className="text-green-400 text-xs mt-0.5">
                  En stock
                </p>
              ) : (
                <p className="text-red-400 text-xs mt-0.5">
                  Sin stock
                </p>
              )}
              <p className="text-pink-400 text-sm font-bold mt-1">
                ${product.price.toLocaleString()}
              </p>
            </div>
          </a>
        ))}

        {/* Mostrar más productos indicator */}
        {products.length > 3 && (
          <div className="p-3 text-center border-b border-white/5">
            <p className="text-gray-400 text-xs">
              +{products.length - 3} productos más
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={onNavigate}
          className="w-full py-2.5 rounded-lg bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white font-bold text-sm transition-all duration-300"
        >
          Ver Todos los Favoritos
        </button>
      </div>
    </div>
  );
};

export default FavoritesHover;