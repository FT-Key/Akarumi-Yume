'use client';

import React, { useState, useEffect } from 'react';
import { X, MapPin, Home, Building2, Navigation } from 'lucide-react';

const PROVINCES = [
  'Buenos Aires',
  'Catamarca',
  'Chaco',
  'Chubut',
  'Córdoba',
  'Corrientes',
  'Entre Ríos',
  'Formosa',
  'Jujuy',
  'La Pampa',
  'La Rioja',
  'Mendoza',
  'Misiones',
  'Neuquén',
  'Río Negro',
  'Salta',
  'San Juan',
  'San Luis',
  'Santa Cruz',
  'Santa Fe',
  'Santiago del Estero',
  'Tierra del Fuego',
  'Tucumán',
];

const AddressFormModal = ({ address, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    alias: '',
    street: '',
    streetNumber: '',
    floor: '',
    apartment: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'Argentina',
    reference: '',
    isDefault: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (address) {
      setFormData({
        alias: address.alias || '',
        street: address.street || '',
        streetNumber: address.streetNumber || '',
        floor: address.floor || '',
        apartment: address.apartment || '',
        city: address.city || '',
        province: address.province || '',
        postalCode: address.postalCode || '',
        country: address.country || 'Argentina',
        reference: address.reference || '',
        isDefault: address.isDefault || false,
      });
    }
  }, [address]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.street.trim()) {
      newErrors.street = 'La calle es requerida';
    }

    if (!formData.streetNumber.trim()) {
      newErrors.streetNumber = 'El número es requerido';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'La ciudad es requerida';
    }

    if (!formData.province) {
      newErrors.province = 'La provincia es requerida';
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'El código postal es requerido';
    } else if (!/^[A-Z]?\d{4}[A-Z]?$/.test(formData.postalCode.toUpperCase())) {
      newErrors.postalCode = 'Código postal inválido (ej: 1234, A1234, 1234B)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar error del campo al modificarlo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Normalizar código postal
      const normalizedData = {
        ...formData,
        postalCode: formData.postalCode.toUpperCase(),
      };
      
      await onSubmit(normalizedData);
    } catch (error) {
      console.error('Error al guardar dirección:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickAliases = [
    { name: 'Casa', icon: Home },
    { name: 'Trabajo', icon: Building2 },
    { name: 'Oficina', icon: Building2 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(10, 0, 21, 0.98) 0%, rgba(20, 0, 40, 0.98) 100%)',
          border: '2px solid rgba(147, 51, 234, 0.3)',
          boxShadow: '0 20px 60px rgba(147, 51, 234, 0.4)',
        }}
      >
        {/* Header */}
        <div 
          className="sticky top-0 z-10 flex items-center justify-between p-6 border-b"
          style={{
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(10px)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="p-3 rounded-xl"
              style={{ background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)' }}
            >
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-wide">
                {address ? 'EDITAR DIRECCIÓN' : 'NUEVA DIRECCIÓN'}
              </h2>
              <p className="text-gray-400 text-sm">
                {address ? 'Modifica los datos de tu dirección' : 'Completa los datos para agregar una dirección'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Alias con quick buttons */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Nombre de la dirección (opcional)
            </label>
            <div className="flex gap-2 mb-3">
              {quickAliases.map(({ name, icon: Icon }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, alias: name }))}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    formData.alias === name
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {name}
                </button>
              ))}
            </div>
            <input
              type="text"
              name="alias"
              value={formData.alias}
              onChange={handleChange}
              placeholder="Ej: Casa, Oficina, etc."
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-all"
            />
          </div>

          {/* Calle y Número */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-white font-semibold mb-2">
                Calle <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="Av. Corrientes"
                className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-gray-500 focus:outline-none transition-all ${
                  errors.street 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-white/10 focus:border-purple-500'
                }`}
              />
              {errors.street && (
                <p className="text-red-400 text-sm mt-1">{errors.street}</p>
              )}
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Número <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="streetNumber"
                value={formData.streetNumber}
                onChange={handleChange}
                placeholder="1234"
                className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-gray-500 focus:outline-none transition-all ${
                  errors.streetNumber 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-white/10 focus:border-purple-500'
                }`}
              />
              {errors.streetNumber && (
                <p className="text-red-400 text-sm mt-1">{errors.streetNumber}</p>
              )}
            </div>
          </div>

          {/* Piso y Departamento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-semibold mb-2">
                Piso (opcional)
              </label>
              <input
                type="text"
                name="floor"
                value={formData.floor}
                onChange={handleChange}
                placeholder="5"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Departamento (opcional)
              </label>
              <input
                type="text"
                name="apartment"
                value={formData.apartment}
                onChange={handleChange}
                placeholder="A"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Ciudad y Provincia */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-semibold mb-2">
                Ciudad <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Buenos Aires"
                className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-gray-500 focus:outline-none transition-all ${
                  errors.city 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-white/10 focus:border-purple-500'
                }`}
              />
              {errors.city && (
                <p className="text-red-400 text-sm mt-1">{errors.city}</p>
              )}
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Provincia <span className="text-red-400">*</span>
              </label>
              <select
                name="province"
                value={formData.province}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white focus:outline-none transition-all appearance-none cursor-pointer ${
                  errors.province 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-white/10 focus:border-purple-500'
                }`}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                }}
              >
                <option value="">Selecciona una provincia</option>
                {PROVINCES.map(province => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
              {errors.province && (
                <p className="text-red-400 text-sm mt-1">{errors.province}</p>
              )}
            </div>
          </div>

          {/* Código Postal */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Código Postal <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="1234 o A1234ABC"
              maxLength={8}
              className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-gray-500 focus:outline-none transition-all ${
                errors.postalCode 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-white/10 focus:border-purple-500'
              }`}
            />
            {errors.postalCode && (
              <p className="text-red-400 text-sm mt-1">{errors.postalCode}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              Formato: 1234, A1234 o 1234ABC
            </p>
          </div>

          {/* Referencia */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Referencia adicional (opcional)
            </label>
            <textarea
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              placeholder="Ej: Casa blanca con portón negro, al lado del supermercado..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-all resize-none"
            />
          </div>

          {/* Checkbox Default */}
          <div 
            className="flex items-start gap-3 p-4 rounded-xl"
            style={{ background: 'rgba(255, 215, 0, 0.1)' }}
          >
            <input
              type="checkbox"
              id="isDefault"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
              className="mt-1 w-5 h-5 rounded border-2 border-yellow-500 bg-transparent checked:bg-yellow-500 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-0 cursor-pointer"
            />
            <label htmlFor="isDefault" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold">
                  Establecer como dirección predeterminada
                </span>
                <Navigation className="w-4 h-4 text-yellow-400" />
              </div>
              <p className="text-gray-400 text-sm mt-1">
                Esta será la dirección que se usará por defecto en tus compras
              </p>
            </label>
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-6 rounded-xl font-bold text-white bg-white/10 hover:bg-white/20 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? 'Guardando...' : address ? 'Guardar Cambios' : 'Agregar Dirección'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressFormModal;