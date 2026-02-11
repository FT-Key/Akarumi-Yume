'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores';

function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="text-center">
        {/* Logo animado */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div
            className="absolute inset-0 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 animate-pulse"
            style={{
              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
              boxShadow: '0 0 40px rgba(147, 51, 234, 0.8)',
            }}
          />
        </div>

        {/* Texto */}
        <h2
          className="text-3xl font-black mb-2"
          style={{
            background: 'linear-gradient(135deg, #a78bfa 0%, #ec4899 50%, #06b6d4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          AKARUMI YUME
        </h2>
        <p className="text-gray-500 text-sm font-light tracking-wider">明るみ夢</p>

        {/* Spinner */}
        <div className="mt-8 flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-purple-500"
              style={{
                animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export function StoreInitializer({ children }) {
  const [mounted, setMounted] = useState(false);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const markHydrated = useAuthStore((s) => s.markHydrated);

  // 1️⃣ Evita mismatch SSR
  useEffect(() => {
    setMounted(true);
  }, []);

  // 2️⃣ Marca hidratación (SIEMPRE se ejecuta)
  useEffect(() => {
    markHydrated();
  }, [markHydrated]);

  if (!mounted || !hasHydrated) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}

export default StoreInitializer;
