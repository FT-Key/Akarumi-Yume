"use client";

import { Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';

export function FavoriteButton({ product, className = "" }) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { isFavorite, toggleProduct, isLoading } = useFavorites();

  const favorite = isFavorite(product._id);

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isAuthenticated) {
      router.push('/iniciar-sesion');
      return;
    }

    toggleProduct(product);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={\`\${className} disabled:opacity-50\`}
      aria-label={favorite ? 'Remover de favoritos' : 'Agregar a favoritos'}
    >
      <Heart
        className={\`w-6 h-6 transition-colors \${
          favorite
            ? 'fill-red-500 text-red-500'
            : 'text-gray-600 hover:text-red-500'
        }\`}
      />
    </button>
  );
}
