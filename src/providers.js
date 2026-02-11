"use client";

import { Toaster } from 'sonner';

/**
 * Providers simplificado sin Context API
 * Zustand no necesita providers, funciona globalmente
 */
export function Providers({ children }) {
  return (
    <>
      {children}
      {/* Toast notifications */}
      <Toaster position="top-right" richColors />
    </>
  );
}
