"use client";

import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useUIStore } from '@/stores/useUIStore';

export function CartButton() {
  const { totalItems } = useCart();
  const { openCartDrawer } = useUIStore();

  return (
    <button
      onClick={openCartDrawer}
      className="relative p-2 hover:bg-gray-100 rounded-full"
      aria-label="Abrir carrito"
    >
      <ShoppingCart className="w-6 h-6" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {totalItems > 9 ? '9+' : totalItems}
        </span>
      )}
    </button>
  );
}
