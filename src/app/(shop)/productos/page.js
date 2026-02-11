'use client';

import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/product/ProductCard';

export default function ProductsPage() {
  const { products, loading } = useProducts();

  if (loading) return <div>Cargando productos...</div>;

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-8 text-gradient-sunset">
        Productos
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
