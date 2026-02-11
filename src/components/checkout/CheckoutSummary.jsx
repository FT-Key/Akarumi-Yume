'use client';
import React from 'react';
import { ShoppingBag, Truck, Check } from 'lucide-react';
import Image from 'next/image';

const CheckoutSummary = ({ 
  items, 
  subtotal, 
  shippingCost, 
  total,
  deliveryTypes = [],
  selectedDeliveryType,
  onSelectDeliveryType
}) => {
  const selectedDelivery = deliveryTypes.find(dt => dt._id === selectedDeliveryType);

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sticky top-24">
      <div className="flex items-center gap-3 mb-6">
        <ShoppingBag className="text-purple-400" size={24} />
        <h2 className="text-2xl font-bold text-white">Resumen</h2>
      </div>

      {/* Método de envío seleccionado */}
      {selectedDelivery && (
        <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
          <div className="flex items-start gap-3">
            <Truck className="text-purple-400 flex-shrink-0 mt-1" size={20} />
            <div className="flex-1">
              <p className="text-white font-semibold">{selectedDelivery.name}</p>
              <p className="text-gray-400 text-sm mt-1">{selectedDelivery.description}</p>
              {selectedDelivery.estimatedDays && (
                <p className="text-gray-500 text-xs mt-1">
                  {selectedDelivery.estimatedDays.min}-{selectedDelivery.estimatedDays.max} días
                </p>
              )}
            </div>
            <Check className="text-green-400 flex-shrink-0" size={20} />
          </div>
        </div>
      )}

      {/* Productos */}
      <div className="mb-6">
        <h3 className="text-white font-semibold mb-3 text-sm">
          Productos ({items.length})
        </h3>
        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
          {items.map((item) => (
            <div key={item.product._id} className="flex gap-3">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                {item.product.images[0]?.url && (
                  <Image
                    src={item.product.images[0]?.url}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm line-clamp-2">{item.product.name}</p>
                <p className="text-gray-400 text-xs mt-1">Cant: {item.quantity}</p>
                <p className="text-purple-400 text-sm font-bold mt-1">
                  ${(item.product.price * item.quantity).toLocaleString('es-AR')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totales */}
      <div className="border-t border-white/10 pt-4 space-y-3">
        <div className="flex justify-between text-gray-400">
          <span>Subtotal</span>
          <span>${subtotal.toLocaleString('es-AR')}</span>
        </div>
        <div className="flex justify-between text-gray-400">
          <span>Envío</span>
          <span className={shippingCost === 0 ? 'text-green-400 font-semibold' : ''}>
            {shippingCost === 0 ? '¡Gratis!' : `$${shippingCost.toLocaleString('es-AR')}`}
          </span>
        </div>
        <div className="flex justify-between text-white text-xl font-bold pt-3 border-t border-white/10">
          <span>Total</span>
          <span className="text-purple-400">${total.toLocaleString('es-AR')}</span>
        </div>
      </div>

      {/* Info adicional */}
      <div className="mt-4 p-3 bg-white/5 rounded-lg">
        <p className="text-gray-400 text-xs text-center">
          💳 Pago seguro con MercadoPago
        </p>
      </div>
    </div>
  );
};

export default CheckoutSummary;