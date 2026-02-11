'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Package, Sparkles } from 'lucide-react';

export default function CheckoutSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const paymentId = searchParams.get('payment_id');

  useEffect(() => {
    // Aquí podrías hacer una validación adicional del pago si es necesario
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Gradient Mesh de fondo */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl bg-green-500/30 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl bg-purple-500/20" />
      </div>

      <div className="max-w-2xl w-full relative">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 text-center">
          {/* Icono de éxito con animación */}
          <div className="relative inline-block mb-8">
            <div
              className="w-32 h-32 rounded-full bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-teal-500/20 flex items-center justify-center"
              style={{
                boxShadow: '0 0 60px rgba(34, 197, 94, 0.3)',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            >
              <CheckCircle className="text-green-400" size={64} />
            </div>
            <Sparkles
              className="absolute -top-2 -right-2 text-yellow-400 animate-bounce"
              size={24}
            />
          </div>

          {/* Título */}
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            ¡Pago Exitoso!
          </h1>

          <p className="text-xl text-gray-300 mb-8">
            Tu pedido ha sido confirmado y está siendo procesado
          </p>

          {/* Información del pedido */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Package className="text-purple-400" size={24} />
              <h2 className="text-xl font-bold text-white">Detalles del Pedido</h2>
            </div>

            {orderId && (
              <div className="mb-3">
                <p className="text-sm text-gray-400 mb-1">Número de Orden</p>
                <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  #{orderId}
                </p>
              </div>
            )}

            {paymentId && (
              <div>
                <p className="text-sm text-gray-400 mb-1">ID de Pago</p>
                <p className="text-sm font-mono text-gray-300">{paymentId}</p>
              </div>
            )}
          </div>

          {/* Mensaje informativo */}
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-8">
            <p className="text-green-400 text-sm">
              📧 Recibirás un email de confirmación con los detalles de tu pedido y el seguimiento del envío.
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => router.push('/pedidos')}
              className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all hover:scale-105"
            >
              Ver mis Pedidos
            </button>
            <button
              onClick={() => router.push('/productos')}
              className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-all"
            >
              Seguir Comprando
            </button>
          </div>

          {/* Decoración inferior */}
          <div className="mt-8 flex justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-green-400/30"
                style={{
                  animation: `float ${2 + i * 0.5}s ease-in-out infinite`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}