'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, ShoppingBag, Plus, Minus, Trash2, Sparkles } from 'lucide-react';
import { useCartStore, useUIStore } from '@/stores';
import Image from 'next/image';

const CartDrawer = () => {
  const router = useRouter();
  const { isCartDrawerOpen, closeCartDrawer } = useUIStore();
  const { items, subtotal, totalItems, updateQuantity, removeItem } = useCartStore();

  // Prevenir scroll del body cuando el drawer está abierto
  useEffect(() => {
    if (isCartDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartDrawerOpen]);

  const handleCheckout = () => {
    closeCartDrawer();
    router.push('/checkout');
  };

  const handleContinueShopping = () => {
    closeCartDrawer();
    router.push('/productos');
  };

  const handleQuantityChange = async (itemId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = async (itemId) => {
    removeItem(itemId);
  };

  return (
    <>
      {/* Overlay */}
      {isCartDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300"
          onClick={closeCartDrawer}
          style={{ animation: 'fadeIn 0.3s ease-out' }}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[480px] bg-black border-l border-purple-500/30 z-50 transform transition-transform duration-500 ease-out ${
          isCartDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          boxShadow: isCartDrawerOpen ? '-10px 0 40px rgba(147, 51, 234, 0.3)' : 'none',
        }}
      >
        {/* Header */}
        <div className="relative border-b border-white/10 p-6">
          {/* Gradiente decorativo superior */}
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{
              background: 'linear-gradient(90deg, #9333ea 0%, #ec4899 50%, #06b6d4 100%)',
            }}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 flex items-center justify-center"
                style={{
                  boxShadow: '0 0 20px rgba(147, 51, 234, 0.6)',
                }}
              >
                <ShoppingBag className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Carrito</h2>
                <p className="text-xs text-gray-400">
                  {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
                </p>
              </div>
            </div>

            <button
              onClick={closeCartDrawer}
              className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all duration-300 hover:rotate-90"
              aria-label="Cerrar carrito"
            >
              <X className="text-gray-400" size={20} />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="flex flex-col h-[calc(100%-88px)]">
          {/* Lista de productos */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              // Carrito vacío
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-cyan-500/20 flex items-center justify-center mb-6"
                  style={{
                    border: '2px dashed rgba(147, 51, 234, 0.3)',
                  }}
                >
                  <ShoppingBag className="text-purple-400" size={40} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Tu carrito está vacío</h3>
                <p className="text-gray-400 mb-6">
                  Agrega algunos productos para comenzar
                </p>
                <button
                  onClick={handleContinueShopping}
                  className="py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105"
                >
                  Explorar Productos
                </button>
              </div>
            ) : (
              // Items del carrito
              items.map((item) => (
                <div
                  key={item.product?._id}
                  className="group relative bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition-all duration-300"
                >
                  <div className="flex gap-4">
                    {/* Imagen del producto */}
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                      {item?.productSnapshot?.primaryImage ? (
                        <Image
                          src={item?.productSnapshot?.primaryImage}
                          alt={item?.productSnapshot?.name || 'Producto'}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Sparkles className="text-purple-400" size={24} />
                        </div>
                      )}
                    </div>

                    {/* Info del producto */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-sm mb-1 truncate">
                        {item?.productSnapshot?.name || 'Producto sin nombre'}
                      </h3>
                      
                      {/* Características seleccionadas */}
                      {item?.selectedCharacteristics?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {item?.selectedCharacteristics?.map((char, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30"
                            >
                              {char?.label}: {char?.value}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Precio */}
                      <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                        ${(item?.productSnapshot?.price || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Controles de cantidad */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item?._id, item?.quantity || 0, -1)}
                        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110"
                        aria-label="Disminuir cantidad"
                      >
                        <Minus className="text-gray-400" size={16} />
                      </button>

                      <span className="text-white font-bold text-sm w-8 text-center">
                        {item?.quantity || 0}
                      </span>

                      <button
                        onClick={() => handleQuantityChange(item?._id, item?.quantity || 0, 1)}
                        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus className="text-gray-400" size={16} />
                      </button>
                    </div>

                    {/* Subtotal y eliminar */}
                    <div className="flex items-center gap-3">
                      <p className="text-white font-bold">
                        ${((item?.productSnapshot?.price || 0) * (item?.quantity || 0)).toFixed(2)}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item?._id)}
                        className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                        aria-label="Eliminar producto"
                      >
                        <Trash2 className="text-red-400 group-hover:text-red-300" size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer con total y acciones */}
          {items.length > 0 && (
            <div className="border-t border-white/10 p-6 space-y-4 bg-black">
              {/* Resumen */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white font-semibold">${(subtotal || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Envío</span>
                  <span className="text-white font-semibold">Calculado en checkout</span>
                </div>
              </div>

              {/* Divisor con gradiente */}
              <div
                className="h-px"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, #9333ea 50%, transparent 100%)',
                }}
              />

              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-white font-bold text-lg">Total</span>
                <span
                  className="text-2xl font-black"
                  style={{
                    background: 'linear-gradient(135deg, #a78bfa 0%, #ec4899 50%, #06b6d4 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  ${(subtotal || 0).toFixed(2)}
                </span>
              </div>

              {/* Botones de acción */}
              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/25"
                >
                  Proceder al Pago
                </button>

                <button
                  onClick={handleContinueShopping}
                  className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-all duration-300"
                >
                  Continuar Comprando
                </button>
              </div>

              {/* Mensaje de seguridad */}
              <p className="text-center text-xs text-gray-500">
                <span className="inline-flex items-center gap-1">
                  <Sparkles size={12} />
                  Pago seguro y envío gratis en compras mayores a $50
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;