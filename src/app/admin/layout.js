'use client';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.push('/iniciar-sesion');
    }
  }, [user, loading, router]);

  if (loading || !user) return <div>Cargando...</div>;

  return (
    <div className="flex">
      <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
        <nav className="space-y-2">
          <a href="/admin" className="block py-2 hover:bg-gray-700 rounded">Dashboard</a>
          <a href="/admin/productos" className="block py-2 hover:bg-gray-700 rounded">Productos</a>
          <a href="/admin/categorias" className="block py-2 hover:bg-gray-700 rounded">Categorías</a>
          <a href="/admin/ordenes" className="block py-2 hover:bg-gray-700 rounded">Órdenes</a>
          <a href="/admin/usuarios" className="block py-2 hover:bg-gray-700 rounded">Usuarios</a>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
