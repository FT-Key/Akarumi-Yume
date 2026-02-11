'use client';

import Image from 'next/image';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useFavoritesStore } from '@/stores/useFavoritesStore';
import { useCartStore } from '@/stores/useCartStore';
import { useAuthStore } from '@/stores/useAuthStore';

export default function ProductCard({ product }) {
  const { toggleProduct, isFavorite } = useFavoritesStore();
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const primaryImage =
    product.images?.find(img => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    '/placeholder.png';

  const discount = product.discountPercentage > 0;

  const handleAddToCart = () => {
    addItem({
      product,
      productSnapshot: product,
      quantity: 1,
      selectedCharacteristics: {}
    });
  };

  return (
    <div className="group perspective-1000">
      <div className="
        relative h-full rounded-2xl overflow-hidden
        glass-dark border border-white/10
        transition-all duration-500
        group-hover:scale-[1.03]
        group-hover:shadow-neon-glow
      ">

        {/* Imagen */}
        <div className="relative h-56 overflow-hidden">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Holographic shine */}
          <div className="
            absolute inset-0 opacity-0 group-hover:opacity-100
            bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.3),transparent)]
            bg-[length:200%_100%]
            animate-[holographic-shine_1.5s_linear]
          " />

          {/* Discount badge */}
          {discount && (
            <span className="
              absolute top-3 left-3 px-3 py-1 text-xs font-bold
              rounded-full bg-gradient-fire text-black
              shadow-neon-orange
            ">
              -{product.discountPercentage}%
            </span>
          )}

          {/* Favorite */}
          <button
            onClick={() => toggleProduct(product)}
            className="
              absolute top-3 right-3 p-2 rounded-full
              bg-black/60 backdrop-blur
              hover:scale-110 transition
            "
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorite(product._id)
                  ? 'text-akarumi-pink fill-akarumi-pink'
                  : 'text-white'
              }`}
            />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-lg line-clamp-1 text-gradient-dream">
            {product.name}
          </h3>

          {product.shortDescription && (
            <p className="text-sm text-gray-300 line-clamp-2">
              {product.shortDescription}
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1 text-akarumi-yellow">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(product.averageRating)
                    ? 'fill-akarumi-yellow'
                    : 'opacity-30'
                }`}
              />
            ))}
            <span className="text-xs text-gray-400 ml-1">
              ({product.averageRating.toFixed(1)})
            </span>
          </div>

          {/* Precio */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-akarumi-cyan">
              ${product.price}
            </span>

            {discount && (
              <span className="text-sm text-gray-400 line-through">
                ${product.compareAtPrice}
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="text-xs">
            {product.isAvailable ? (
              <span className="text-green-400">✔ En stock</span>
            ) : (
              <span className="text-red-400">✖ Sin stock</span>
            )}
          </div>

          {/* Botón */}
          <button
            disabled={!product.isAvailable}
            onClick={handleAddToCart}
            className={`
              w-full mt-3 flex items-center justify-center gap-2
              py-2 rounded-xl font-semibold
              transition-all duration-300
              ${
                product.isAvailable
                  ? 'bg-gradient-dream hover:shadow-neon-purple'
                  : 'bg-gray-700 cursor-not-allowed opacity-50'
              }
            `}
          >
            <ShoppingCart className="w-5 h-5" />
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}
