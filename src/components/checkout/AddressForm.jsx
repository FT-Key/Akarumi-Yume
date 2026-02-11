'use client';

import React from 'react';

const PROVINCES = [
  'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba',
  'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja',
  'Mendoza', 'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan',
  'San Luis', 'Santa Cruz', 'Santa Fe', 'Santiago del Estero',
  'Tierra del Fuego', 'Tucumán'
];

const AddressForm = ({ address, onChange, onSubmit, onCancel, loading }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  const handleChange = (field, value) => {
    onChange({ ...address, [field]: value });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      {/* Alias */}
      <input
        type="text"
        placeholder="Alias (Casa, Oficina, etc.)"
        value={address.alias}
        onChange={(e) => handleChange('alias', e.target.value)}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
      />

      {/* Calle y Número */}
      <div className="grid md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Calle *"
          value={address.street}
          onChange={(e) => handleChange('street', e.target.value)}
          required
          className="md:col-span-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Número *"
          value={address.streetNumber}
          onChange={(e) => handleChange('streetNumber', e.target.value)}
          required
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
        />
      </div>

      {/* Piso y Departamento */}
      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Piso"
          value={address.floor}
          onChange={(e) => handleChange('floor', e.target.value)}
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Departamento"
          value={address.apartment}
          onChange={(e) => handleChange('apartment', e.target.value)}
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
        />
      </div>

      {/* Ciudad y Provincia */}
      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Ciudad *"
          value={address.city}
          onChange={(e) => handleChange('city', e.target.value)}
          required
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
        />
        <select
          value={address.province}
          onChange={(e) => handleChange('province', e.target.value)}
          required
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-purple-500 focus:outline-none"
        >
          <option value="">Seleccionar Provincia *</option>
          {PROVINCES.map(prov => (
            <option key={prov} value={prov}>{prov}</option>
          ))}
        </select>
      </div>

      {/* Código Postal */}
      <input
        type="text"
        placeholder="Código Postal (ej: 1234, B1234ABC) *"
        value={address.postalCode}
        onChange={(e) => handleChange('postalCode', e.target.value)}
        required
        pattern="^[A-Z]?\d{4}[A-Z]?$"
        title="Código postal inválido. Ejemplos: 1234, B1234ABC"
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
      />

      {/* Referencia */}
      <input
        type="text"
        placeholder="Referencia (Edificio blanco, portón verde, etc.)"
        value={address.reference}
        onChange={(e) => handleChange('reference', e.target.value)}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
      />

      {/* Checkbox predeterminada */}
      <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
        <input
          type="checkbox"
          checked={address.isDefault}
          onChange={(e) => handleChange('isDefault', e.target.checked)}
          className="w-4 h-4 rounded border-white/20 bg-white/5 text-purple-500"
        />
        <span className="text-sm">Usar como dirección predeterminada</span>
      </label>

      {/* Botones */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Guardar Dirección'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all disabled:opacity-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default AddressForm;