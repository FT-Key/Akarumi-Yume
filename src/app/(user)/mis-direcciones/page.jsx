'use client';

import React, { useState } from 'react';
import { useAddresses } from '@/hooks/useAddresses';
import AddressList from '@/components/profile/AddressList';
import AddressFormModal from '@/components/profile/AddressFormModal';

const AddressesPage = () => {
  const {
    addresses,
    loading,
    error,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  } = useAddresses();

  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const handleAdd = () => {
    setEditingAddress(null);
    setShowModal(true);
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setShowModal(true);
  };

  const handleSubmit = async (addressData) => {
    try {
      if (editingAddress) {
        await updateAddress(editingAddress._id, addressData);
      } else {
        await addAddress(addressData);
      }
      setShowModal(false);
      setEditingAddress(null);
    } catch (err) {
      console.error('Error al guardar dirección:', err);
      alert('Error al guardar la dirección');
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Fondo decorativo */}
      <div 
        className="absolute inset-0 bg-fixed-custom"
        style={{
          backgroundImage: "url('/images/image(14).jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/95 via-black/95 to-pink-900/95"></div>
      </div>

      {/* Contenido */}
      <div className="relative z-10" style={{ padding: '4rem 2rem' }}>
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-white mt-4">Cargando direcciones...</p>
            </div>
          ) : error ? (
            <div 
              className="text-center py-20 rounded-2xl"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '2px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              <p className="text-red-400 text-lg">{error}</p>
            </div>
          ) : (
            <AddressList
              addresses={addresses}
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={deleteAddress}
              onSetDefault={setDefaultAddress}
            />
          )}
        </div>
      </div>

      {/* Modal de formulario */}
      {showModal && (
        <AddressFormModal
          address={editingAddress}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowModal(false);
            setEditingAddress(null);
          }}
        />
      )}
    </div>
  );
};

export default AddressesPage;