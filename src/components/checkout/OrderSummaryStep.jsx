'use client';
import React from 'react';
import { Package, CreditCard, Sparkles, Truck } from 'lucide-react';
import Image from 'next/image';

const OrderSummaryStep = ({ 
  items, 
  onBack, 
  onContinue, 
  loading,
  deliveryTypes = [],
  selectedDeliveryType,
  onSelectDeliveryType
}) => {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <Package className="text-purple-400" size={24} />
        <h2 className="text-2xl font-bold text-white">Resumen de Compra</h2>
      </div>

      {/* Selector de tipo de envío */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-white text-sm font-semibold mb-3">
          <Truck size={18} className="text-purple-400" />
          Método de envío
        </label>
        <div className="space-y-2">
          {deliveryTypes.map((dt) => (
            <button
              key={dt._id}
              onClick={() => onSelectDeliveryType(dt._id)}
              disabled={loading}
              className={`w-full p-4 rounded-xl border transition-all text-left ${
                selectedDeliveryType === dt._id
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-white font-semibold">{dt.name}</p>
                  {dt.description && (
                    <p className="text-gray-400 text-sm mt-1">{dt.description}</p>
                  )}
                  {dt.estimatedDays && (
                    <p className="text-gray-500 text-xs mt-1">
                      Entrega estimada: {dt.estimatedDays.min === dt.estimatedDays.max 
                        ? `${dt.estimatedDays.min} día${dt.estimatedDays.min !== 1 ? 's' : ''}`
                        : `${dt.estimatedDays.min}-${dt.estimatedDays.max} días`
                      }
                    </p>
                  )}
                  {dt.type === 'PICKUP' && dt.pickupAddress && (
                    <p className="text-gray-500 text-xs mt-1">
                      📍 {dt.pickupAddress.street} {dt.pickupAddress.streetNumber}, {dt.pickupAddress.city}
                    </p>
                  )}
                </div>
                <div className="ml-4 flex-shrink-0">
                  <p className="text-purple-400 font-bold text-lg">
                    {dt.price === 0 ? 'Gratis' : `$${dt.price.toLocaleString('es-AR')}`}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
        {deliveryTypes.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-4">
            No hay métodos de envío disponibles
          </p>
        )}
      </div>

      {/* Lista de productos */}
      <div className="mb-6">
        <h3 className="text-white font-semibold mb-3">Productos ({items.length})</h3>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {items.map((item) => (
            <div key={item?.product?._id} className="flex gap-4 p-4 bg-white/5 rounded-xl">
              {/* Imagen del producto */}
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                {item.product?.primaryImage ? (
                  <Image
                    src={item.product.primaryImage}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <Sparkles className="absolute inset-0 m-auto text-purple-400" size={24} />
                )}
              </div>
              {/* Info del producto */}
              <div className="flex-1">
                <h3 className="text-white font-semibold line-clamp-2">
                  {item.product?.name}
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  Cantidad: {item.quantity}
                </p>
                <p className="text-purple-400 font-bold mt-1">
                  ${(item.product?.price * item.quantity).toLocaleString('es-AR')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botones de navegación */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          disabled={loading}
          className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all disabled:opacity-50"
        >
          Volver
        </button>
        <button
          onClick={onContinue}
          disabled={loading || !selectedDeliveryType}
          className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            'Procesando...'
          ) : (
            <>
              <CreditCard size={20} />
              Proceder al Pago
            </>
          )}
        </button>
      </div>
      
      {!selectedDeliveryType && (
        <p className="text-yellow-400 text-sm text-center mt-3">
          ⚠️ Selecciona un método de envío para continuar
        </p>
      )}
    </div>
  );
};

export default OrderSummaryStep;