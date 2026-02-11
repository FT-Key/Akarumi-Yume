"use client";

import { useFavorites } from '@/hooks/useFavorites';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

export default function FavoritesPage() {
  const router = useRouter();
  const { products, isLoading, removeProduct, isEmpty } = useFavorites();
  const { addItem } = useCart();

  const handleAddToCart = async (product) => {
    await addItem(product);
  };

  if (isEmpty) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Heart className="w-24 h-24 mx-auto text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold mb-2">No tienes favoritos</h1>
        <p className="text-gray-600 mb-6">
          Guarda productos que te gusten para verlos más tarde
        </p>
        <button
          onClick={() => router.push('/productos')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Explorar Productos
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Mis Favoritos</h1>
        <span className="text-gray-600">
          {products.length} {products.length === 1 ? 'producto' : 'productos'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Imagen */}
            <div className="relative aspect-square">
              <Image
                src={product.images?.[0]?.url || '/placeholder.png'}
                alt={product.name}
                fill
                className="object-cover"
              />
              
              {/* Botón remover */}
              <button
                onClick={() => removeProduct(product._id)}
                disabled={isLoading}
                className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 className="w-5 h-5 text-red-600" />
              </button>

              {/* Badge sin stock */}
              {product.stock === 0 && (
                <div className="absolute top-2 left-2 bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold">
                  Sin Stock
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-4">
              <h3
                onClick={() => router.push(`/productos/${product.slug}`)}
                className="font-semibold text-lg mb-2 hover:text-blue-600 cursor-pointer line-clamp-2"
              >
                {product.name}
              </h3>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    ${product.price.toLocaleString()}
                  </p>
                  {product.compareAtPrice && (
                    <p className="text-sm text-gray-500 line-through">
                      ${product.compareAtPrice.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              {/* Botón agregar al carrito */}
              <button
                onClick={() => handleAddToCart(product)}
                disabled={!product.isActive || product.stock === 0 || isLoading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                {product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
