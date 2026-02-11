"use client";

import { useCart } from '@/hooks/useCart';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { 
    items, 
    subtotal, 
    totalItems, 
    isLoading, 
    updateQuantity, 
    removeItem,
    isEmpty 
  } = useCart();

  if (isEmpty) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Tu carrito está vacío</h1>
        <p className="text-gray-600 mb-6">
          Agrega productos para comenzar tu compra
        </p>
        <button
          onClick={() => router.push('/productos')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Ir a la tienda
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Carrito de Compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white border rounded-lg p-4 flex gap-4"
            >
              {/* Imagen */}
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={item?.productSnapshot?.primaryImage || '/placeholder.png'}
                  alt={item?.productSnapshot?.name}
                  fill
                  className="object-cover rounded"
                />
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">
                  {item?.productSnapshot?.name}
                </h3>
                
                {/* Características */}
                {item.selectedCharacteristics?.length > 0 && (
                  <div className="text-sm text-gray-600 mb-2">
                    {item.selectedCharacteristics.map((char, i) => (
                      <span key={i}>
                        {char.label}: {char.value}
                        {i < item.selectedCharacteristics.length - 1 && ' | '}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-lg font-bold text-blue-600">
                  ${item?.productSnapshot?.price?.toLocaleString()}
                </p>

                {/* Controles de cantidad */}
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center border rounded">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      disabled={isLoading}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      disabled={isLoading}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item._id)}
                    disabled={isLoading}
                    className="text-red-600 hover:text-red-700 disabled:opacity-50"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Subtotal del item */}
              <div className="text-right">
                <p className="text-sm text-gray-600">Subtotal</p>
                <p className="text-xl font-bold">
                  ${((item?.productSnapshot?.price || 0) * (item?.quantity || 0)).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen */}
        <div className="lg:col-span-1">
          <div className="bg-white border rounded-lg p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Resumen del Pedido</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Productos ({totalItems})</span>
                <span className="font-semibold">
                  ${subtotal?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Envío</span>
                <span className="text-gray-600">A calcular</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">
                    ${subtotal?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              Proceder al Checkout
            </button>

            <button
              onClick={() => router.push('/productos')}
              className="w-full mt-3 border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50"
            >
              Seguir Comprando
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
