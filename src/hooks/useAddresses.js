import { useState, useEffect } from 'react';
import apiClient from '@/lib/axios';

/**
 * Hook para gestionar direcciones del usuario
 */
export const useAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar direcciones
  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/addresses');
      
      // Ordenar: primero la predeterminada, luego por fecha
      const sorted = response.sort((a, b) => {
        if (a.isDefault) return -1;
        if (b.isDefault) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      
      setAddresses(sorted);
    } catch (err) {
      console.error('Error al cargar direcciones:', err);
      setError(err.message || 'Error al cargar direcciones');
    } finally {
      setLoading(false);
    }
  };

  // Agregar dirección
  const addAddress = async (addressData) => {
    try {
      const response = await apiClient.post('/addresses', addressData);
      await fetchAddresses(); // Recargar lista
      return response;
    } catch (err) {
      console.error('Error al agregar dirección:', err);
      throw err;
    }
  };

  // Actualizar dirección
  const updateAddress = async (id, addressData) => {
    try {
      const response = await apiClient.put(`/addresses/${id}`, addressData);
      await fetchAddresses(); // Recargar lista
      return response;
    } catch (err) {
      console.error('Error al actualizar dirección:', err);
      throw err;
    }
  };

  // Eliminar dirección
  const deleteAddress = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta dirección?')) {
      return;
    }

    try {
      await apiClient.delete(`/addresses/${id}`);
      await fetchAddresses(); // Recargar lista
    } catch (err) {
      console.error('Error al eliminar dirección:', err);
      alert('Error al eliminar la dirección');
    }
  };

  // Establecer dirección predeterminada
  const setDefaultAddress = async (id) => {
    try {
      await apiClient.patch(`/addresses/${id}/default`);
      await fetchAddresses(); // Recargar lista
    } catch (err) {
      console.error('Error al establecer dirección predeterminada:', err);
      alert('Error al actualizar la dirección');
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  return {
    addresses,
    loading,
    error,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    refetch: fetchAddresses,
  };
};