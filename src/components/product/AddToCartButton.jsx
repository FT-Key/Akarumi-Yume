"use client";

import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuthStore } from '@/stores/useAuthStore';

export function AddToCartButton({ 
  product, 
  quantity = 1,
  characteristics = [],
  variant = 'primary', 
  className = "" 
}) {
  const { isAuthenticated } = useAuthStore();
  const { addItem, isLoading } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    setAdding(true);
    try {
      await addItem(product, quantity, characteristics);
    } finally {
      setAdding(false);
    }
  };

  const isDisabled = !product.isActive || product.stock === 0 || isLoading || adding;

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'border border-blue-600 text-blue-600 hover:bg-blue-50',
    outline: 'border border-gray-300 hover:border-blue-600 hover:text-blue-600'
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isDisabled}
      className={\`\${variants[variant]} \${className} px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2\`}
    >
      <ShoppingCart className="w-5 h-5" />
      {adding ? 'Agregando...' : product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
    </button>
  );
}
