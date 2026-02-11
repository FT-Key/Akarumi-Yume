'use client';

import React from 'react';
import { MapPin } from 'lucide-react';
import AddressList from './AddressList';
import AddressForm from './AddressForm';

const AddressStep = ({
  addresses,
  selectedAddress,
  onSelectAddress,
  showNewAddressForm,
  onToggleForm,
  newAddress,
  onAddressChange,
  onCreateAddress,
  loading,
  onContinue
}) => {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <MapPin className="text-purple-400" size={24} />
        <h2 className="text-2xl font-bold text-white">Dirección de Envío</h2>
      </div>

      {/* Lista de direcciones guardadas */}
      <AddressList
        addresses={addresses}
        selectedAddress={selectedAddress}
        onSelectAddress={onSelectAddress}
      />

      {/* Botón para agregar nueva dirección */}
      {!showNewAddressForm && (
        <button
          onClick={onToggleForm}
          className="w-full py-3 border-2 border-dashed border-purple-500/30 rounded-xl text-purple-400 hover:bg-purple-500/5 transition-all"
        >
          + Agregar nueva dirección
        </button>
      )}

      {/* Formulario de nueva dirección */}
      {showNewAddressForm && (
        <AddressForm
          address={newAddress}
          onChange={onAddressChange}
          onSubmit={onCreateAddress}
          onCancel={onToggleForm}
          loading={loading}
        />
      )}

      {/* Botón continuar */}
      {selectedAddress && !showNewAddressForm && (
        <button
          onClick={onContinue}
          className="w-full mt-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all"
        >
          Continuar al Resumen
        </button>
      )}
    </div>
  );
};

export default AddressStep;