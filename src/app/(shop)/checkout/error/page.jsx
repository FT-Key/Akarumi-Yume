'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { XCircle, RefreshCw, Home, Sparkles } from 'lucide-react';

export default function CheckoutError() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = () => {
    switch (error) {
      case 'payment_rejected':
        return 'El pago fue rechazado. Por favor, verifica tu método de pago e intenta nuevamente.';
      case 'insufficient_funds':
        return 'Fondos insuficientes. Intenta con otro método de pago.';
      case 'invalid_card':
        return 'Tarjeta inválida. Verifica los datos ingresados.';
      case 'timeout':
        return 'La sesión expiró. Por favor, intenta nuevamente.';
      default:
        return 'Hubo un problema al procesar tu pago. Por favor, intenta nuevamente.';
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Gradient Mesh de fondo */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl bg-red-500/30" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl bg-pink-500/20" />
      </div>

      <div className="max-w-2xl w-full relative">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 text-center">
          {/* Icono de error con animación */}
          <div className="relative inline-block mb-8">
            <div
              className="w-32 h-32 rounded-full bg-gradient-to-br from-red-500/20 via-pink-500/20 to-rose-500/20 flex items-center justify-center"
              style={{
                boxShadow: '0 0 60px rgba(239, 68, 68, 0.3)',
                animation: 'shake 0.5s ease-in-out',
              }}
            >
              <XCircle className="text-red-400" size={64} />
            </div>
            <Sparkles
              className="absolute -top-2 -right-2 text-red-400"
              size={24}
            />
          </div>

          {/* Título */}
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Error en el Pago
          </h1>

          <p className="text-xl text-gray-300 mb-8">
            No se pudo completar tu transacción
          </p>

          {/* Mensaje de error */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 mb-8">
            <p className="text-red-400 mb-4">
              {getErrorMessage()}
            </p>
            
            {error && (
              <p className="text-xs text-red-400/60 font-mono">
                Código de error: {error}
              </p>
            )}
          </div>

          {/* Razones comunes */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-8 text-left">
            <h3 className="text-white font-semibold mb-3">Razones comunes:</h3>
            <ul className="text-gray-400 text-sm space-y-2">
              <li className="flex gap-2">
                <span className="text-red-400">•</span>
                Datos de tarjeta incorrectos o incompletos
              </li>
              <li className="flex gap-2">
                <span className="text-red-400">•</span>
                Fondos insuficientes en la cuenta
              </li>
              <li className="flex gap-2">
                <span className="text-red-400">•</span>
                Tarjeta bloqueada o vencida
              </li>
              <li className="flex gap-2">
                <span className="text-red-400">•</span>
                Límite de compra excedido
              </li>
              <li className="flex gap-2">
                <span className="text-red-400">•</span>
                Problemas de conexión durante el proceso
              </li>
            </ul>
          </div>

          {/* Información de ayuda */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-8">
            <p className="text-purple-300 text-sm">
              💡 <strong>Consejo:</strong> Si el problema persiste, contacta a tu banco o prueba con otro método de pago.
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => router.push('/checkout')}
              className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <RefreshCw size={20} />
              Reintentar Pago
            </button>
            <button
              onClick={() => router.push('/')}
              className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Home size={20} />
              Volver al Inicio
            </button>
          </div>

          {/* Soporte */}
          <div className="mt-8">
            <p className="text-gray-500 text-sm">
              ¿Necesitas ayuda?{' '}
              <a href="/contacto" className="text-purple-400 hover:text-purple-300 transition-colors">
                Contacta a soporte
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}