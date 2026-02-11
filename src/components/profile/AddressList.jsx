'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Star, Edit2, Trash2, Home, Building2, Plus } from 'lucide-react';

const AddressList = ({ addresses, onEdit, onDelete, onSetDefault, onAdd }) => {
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Función para generar URL del iframe de Google Maps
  const getMapEmbedUrl = (address) => {
    const query = [
      address.street,
      address.streetNumber,
      address.floor ? `Piso ${address.floor}` : '',
      address.apartment ? `Depto ${address.apartment}` : '',
      address.city,
      address.province,
      address.postalCode,
      address.country || 'Argentina'
    ].filter(Boolean).join(', ');

    const encodedQuery = encodeURIComponent(query);
    return `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodedQuery}&zoom=17`;
  };

  // Función alternativa sin API key (usando iframe normal)
  const getMapUrl = (address) => {
    const query = [
      address.street,
      address.streetNumber,
      address.floor ? `Piso ${address.floor}` : '',
      address.apartment ? `Depto ${address.apartment}` : '',
      address.city,
      address.province,
      address.postalCode,
      address.country || 'Argentina'
    ].filter(Boolean).join(', ');

    const encodedQuery = encodeURIComponent(query);
    return `https://maps.google.com/maps?q=${encodedQuery}&t=&z=17&ie=UTF8&iwloc=&output=embed`;
  };

  const formatAddress = (address) => {
    const parts = [
      `${address.street} ${address.streetNumber}`,
      address.floor && `Piso ${address.floor}`,
      address.apartment && `Depto ${address.apartment}`,
    ].filter(Boolean);
    
    return parts.join(', ');
  };

  const getAddressIcon = (alias) => {
    if (alias?.toLowerCase().includes('casa')) return Home;
    if (alias?.toLowerCase().includes('oficina') || alias?.toLowerCase().includes('trabajo')) return Building2;
    return MapPin;
  };

  return (
    <div className="space-y-6">
      {/* Header con botón agregar */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-white tracking-wider">
            MIS DIRECCIONES
          </h2>
          <p className="text-gray-400 mt-2">Gestiona tus direcciones de envío</p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all transform hover:scale-105"
          style={{ padding: '0.75rem 1.5rem' }}
        >
          <Plus className="w-5 h-5" />
          Agregar Dirección
        </button>
      </div>

      {/* Lista de direcciones */}
      {addresses.length === 0 ? (
        <div 
          className="text-center py-16 rounded-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '2px dashed rgba(255, 255, 255, 0.2)',
          }}
        >
          <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-500" />
          <h3 className="text-xl font-bold text-gray-400 mb-2">
            No tienes direcciones guardadas
          </h3>
          <p className="text-gray-500 mb-6">
            Agrega una dirección para facilitar tus compras
          </p>
          <button
            onClick={onAdd}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold rounded-xl transition-all"
            style={{ padding: '0.75rem 2rem' }}
          >
            Agregar Primera Dirección
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {addresses.map((address) => {
            const isDefault = address.isDefault;
            const Icon = getAddressIcon(address.alias);

            return (
              <div
                key={address._id}
                className="relative group transition-all duration-300"
                style={{
                  transform: isDefault ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                {/* Borde animado para dirección default */}
                {isDefault && (
                  <div 
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      padding: '3px',
                      background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 25%, #ffd700 50%, #ffed4e 75%, #ffd700 100%)',
                      backgroundSize: '300% 300%',
                      animation: 'gradient-shift 4s ease infinite',
                      zIndex: 0,
                    }}
                  >
                    <div 
                      className="w-full h-full rounded-2xl"
                      style={{ background: '#0a0015' }}
                    />
                  </div>
                )}

                {/* Card principal */}
                <div 
                  className="relative rounded-2xl overflow-hidden"
                  style={{
                    background: isDefault 
                      ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(147, 51, 234, 0.1) 100%)'
                      : 'rgba(255, 255, 255, 0.05)',
                    border: isDefault 
                      ? '2px solid rgba(255, 215, 0, 0.3)' 
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    zIndex: 1,
                  }}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                    {/* Información de la dirección */}
                    <div className="space-y-4">
                      {/* Header con alias y badge default */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="p-3 rounded-xl"
                            style={{
                              background: isDefault 
                                ? 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)'
                                : 'rgba(147, 51, 234, 0.2)',
                            }}
                          >
                            <Icon className={`w-6 h-6 ${isDefault ? 'text-black' : 'text-purple-400'}`} />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">
                              {address.alias || 'Sin nombre'}
                            </h3>
                            {isDefault && (
                              <div className="flex items-center gap-1 mt-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs font-bold text-yellow-400 tracking-wide">
                                  PREDETERMINADA
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Acciones */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => onEdit(address)}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-cyan-400 transition-all transform hover:scale-110"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {!isDefault && (
                            <button
                              onClick={() => onDelete(address._id)}
                              className="p-2 rounded-lg bg-white/10 hover:bg-red-500/20 text-red-400 transition-all transform hover:scale-110"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Dirección completa */}
                      <div className="space-y-2">
                        <div>
                          <p className="text-white font-semibold text-lg">
                            {formatAddress(address)}
                          </p>
                          <p className="text-gray-400">
                            {address.city}, {address.province}
                          </p>
                          <p className="text-gray-400">
                            CP: {address.postalCode}
                          </p>
                        </div>

                        {address.reference && (
                          <div 
                            className="mt-3 p-3 rounded-lg"
                            style={{ background: 'rgba(6, 182, 212, 0.1)' }}
                          >
                            <p className="text-sm text-cyan-300">
                              <span className="font-semibold">Referencia:</span> {address.reference}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Botón para establecer como default */}
                      {!isDefault && (
                        <button
                          onClick={() => onSetDefault(address._id)}
                          className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold rounded-xl transition-all transform hover:scale-105"
                          style={{ padding: '0.75rem' }}
                        >
                          <Star className="w-5 h-5" />
                          Establecer como Predeterminada
                        </button>
                      )}

                      {/* Validación de dirección */}
                      <div className="flex items-center gap-2 mt-4">
                        {address.isValidated ? (
                          <div className="flex items-center gap-2 text-green-400 text-sm">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span>Dirección validada</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-yellow-400 text-sm">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                            <span>Pendiente de validación</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Mapa de Google */}
                    <div 
                      className="relative rounded-xl overflow-hidden"
                      style={{
                        height: isDefault ? '350px' : '300px',
                        border: '2px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <iframe
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        style={{ border: 0 }}
                        src={getMapUrl(address)}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                      
                      {/* Overlay con info */}
                      <div 
                        className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm text-white rounded-lg"
                        style={{ padding: '0.5rem 0.75rem' }}
                      >
                        <p className="text-xs font-semibold flex items-center gap-2">
                          <MapPin className="w-3 h-3" />
                          Vista de mapa
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AddressList;