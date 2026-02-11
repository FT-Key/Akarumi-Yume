'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Clock, AlertCircle, Sparkles } from 'lucide-react';

export default function CheckoutPending() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Gradient Mesh de fondo */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl bg-yellow-500/30 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl bg-orange-500/20" />
      </div>

      <div className="max-w-2xl w-full relative">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 text-center">
          {/* Icono de pendiente con animación */}
          <div className="relative inline-block mb-8">
            <div
              className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-500/20 via-orange-500/20 to-amber-500/20 flex items-center justify-center"
              style={{
                boxShadow: '0 0 60px rgba(234, 179, 8, 0.3)',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            >
              <Clock className="text-yellow-400" size={64} />
            </div>
            <Sparkles
              className="absolute -top-2 -right-2 text-orange-400 animate-spin"
              style={{ animationDuration: '3s' }}
              size={24}
            />
          </div>

          {/* Título */}
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Pago Pendiente
          </h1>

          <p className="text-xl text-gray-300 mb-8">
            Tu pago está siendo procesado
          </p>

          {/* Información del pedido */}
          {orderId && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
              <p className="text-sm text-gray-400 mb-2">Número de Orden</p>
              <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                #{orderId}
              </p>
            </div>
          )}

          {/* Mensaje informativo */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-5 mb-8">
            <div className="flex items-start gap-3 mb-3">
              <AlertCircle className="text-yellow-400 flex-shrink-0 mt-0.5" size={20} />
              <div className="text-left">
                <p className="text-yellow-400 font-semibold mb-2">
                  ¿Qué significa esto?
                </p>
                <p className="text-yellow-300/80 text-sm">
                  Estamos esperando la confirmación de tu pago. Esto puede tardar unos minutos.
                </p>
              </div>
            </div>
            <div className="text-left ml-8">
              <p className="text-yellow-300/80 text-sm">
                Te enviaremos un email cuando tu pago sea confirmado y tu pedido comience a procesarse.
              </p>
            </div>
          </div>

          {/* Instrucciones */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-8">
            <p className="text-gray-300 text-sm mb-3">
              <strong className="text-white">Importante:</strong>
            </p>
            <ul className="text-left text-gray-400 text-sm space-y-2">
              <li className="flex gap-2">
                <span className="text-purple-400">•</span>
                No cierres esta pestaña hasta que recibas confirmación
              </li>
              <li className="flex gap-2">
                <span className="text-purple-400">•</span>
                Revisa tu email (incluyendo spam) para más información
              </li>
              <li className="flex gap-2">
                <span className="text-purple-400">•</span>
                Puedes revisar el estado en "Mis Pedidos"
              </li>
            </ul>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => router.push('/pedidos')}
              className="flex-1 py-4 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-bold rounded-xl transition-all hover:scale-105"
            >
              Ver mis Pedidos
            </button>
            <button
              onClick={() => router.push('/')}
              className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-all"
            >
              Volver al Inicio
            </button>
          </div>

          {/* Loader decorativo */}
          <div className="mt-8 flex justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-yellow-400"
                style={{
                  animation: `bounce 1.5s ease-in-out infinite`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}