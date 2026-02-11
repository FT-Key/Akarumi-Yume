"use client";

/**
 * Re-exporta los stores de Zustand para facilitar imports desde la app
 * Los stores son custom hooks globales que NO requieren Provider
 * 
 * Uso:
 * import { useAuthStore, useCartStore } from '@/app/providers';
 * 
 * O importa directamente desde @/stores:
 * import { useAuthStore } from '@/stores';
 */

export { useAuthStore, useCartStore, useFavoritesStore, useUIStore } from '@/stores';
