'use client';

import React from 'react';
import { MapPin, Star, CheckCircle } from 'lucide-react';

const AddressList = ({ addresses, selectedAddress, onSelectAddress }) => {
  // Función para generar URL del iframe de Google Maps
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
    return `https://maps.google.com/maps?q=${encodedQuery}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
  };

  if (!addresses || addresses.length === 0) {
    return (
      <div 
        className="text-center py-12 rounded-2xl mb-6"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '2px dashed rgba(255, 255, 255, 0.2)',
        }}
      >
        <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-500" />
        <p className="text-gray-400 font-semibold">No tienes direcciones guardadas</p>
        <p className="text-gray-500 text-sm mt-2">Agrega una nueva dirección para continuar</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 mb-6">
      {addresses.map((addr) => {
        const isSelected = selectedAddress?._id === addr._id;
        const isDefault = addr.isDefault;

        return (
          <div
            key={addr._id}
            className="relative group"
          >
            {/* Borde especial para dirección seleccionada */}
            {isSelected && (
              <div 
                className="absolute inset-0 rounded-2xl"
                style={{
                  padding: '2px',
                  background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 50%, #06b6d4 100%)',
                  zIndex: 0,
                }}
              >
                <div 
                  className="w-full h-full rounded-2xl"
                  style={{ background: '#0a0015' }}
                />
              </div>
            )}

            <button
              onClick={() => onSelectAddress(addr)}
              className="relative w-full text-left rounded-2xl transition-all overflow-hidden"
              style={{
                background: isSelected 
                  ? 'linear-gradient(135deg, rgba(147, 51, 234, 0.15) 0%, rgba(236, 72, 153, 0.1) 100%)'
                  : 'rgba(255, 255, 255, 0.05)',
                border: isSelected 
                  ? '2px solid rgba(147, 51, 234, 0.3)' 
                  : '1px solid rgba(255, 255, 255, 0.1)',
                zIndex: 1,
              }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-4 p-5">
                {/* Información de la dirección */}
                <div className="space-y-3">
                  {/* Header con alias y badges */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1">
                      {/* Icono */}
                      <div 
                        className="p-2.5 rounded-lg flex-shrink-0"
                        style={{
                          background: isSelected 
                            ? 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)'
                            : 'rgba(147, 51, 234, 0.2)',
                        }}
                      >
                        <MapPin className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-purple-400'}`} />
                      </div>

                      {/* Alias y badges */}
                      <div className="flex-1">
                        {addr.alias && (
                          <p className={`font-bold ${isSelected ? 'text-purple-300' : 'text-purple-400'}`}>
                            {addr.alias}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          {isDefault && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full font-semibold">
                              <Star className="w-3 h-3 fill-yellow-400" />
                              Predeterminada
                            </span>
                          )}
                          {addr.isValidated && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full font-semibold">
                              <CheckCircle className="w-3 h-3" />
                              Validada
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Radio button */}
                    <div
                      className={`w-6 h-6 rounded-full border-2 transition-all flex-shrink-0 flex items-center justify-center ${
                        isSelected
                          ? 'border-purple-500 bg-purple-500 shadow-lg shadow-purple-500/50'
                          : 'border-gray-600 group-hover:border-purple-400'
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2.5 h-2.5 bg-white rounded-full" />
                      )}
                    </div>
                  </div>

                  {/* Dirección completa */}
                  <div className="pl-12">
                    <p className={`font-semibold ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                      {addr.street} {addr.streetNumber}
                      {addr.floor && `, Piso ${addr.floor}`}
                      {addr.apartment && `, Depto ${addr.apartment}`}
                    </p>
                    
                    <p className="text-gray-400 text-sm mt-1">
                      {addr.city}, {addr.province} - CP {addr.postalCode}
                    </p>

                    {/* Referencia */}
                    {addr.reference && (
                      <div 
                        className="mt-2 p-2 rounded-lg"
                        style={{ background: 'rgba(6, 182, 212, 0.1)' }}
                      >
                        <p className="text-cyan-300 text-xs">
                          <span className="font-semibold">Referencia:</span> {addr.reference}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mapa de Google - Solo visible en desktop */}
                <div className="hidden lg:block">
                  <div 
                    className="relative rounded-xl overflow-hidden"
                    style={{
                      height: '180px',
                      border: isSelected 
                        ? '2px solid rgba(147, 51, 234, 0.3)' 
                        : '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      style={{ border: 0 }}
                      src={getMapUrl(addr)}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                    
                    {/* Overlay sutil para que no interfiera con el click */}
                    <div 
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%)',
                      }}
                    />

                    {/* Badge en el mapa */}
                    <div 
                      className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white rounded-md pointer-events-none"
                      style={{ padding: '0.25rem 0.5rem' }}
                    >
                      <p className="text-xs font-semibold flex items-center gap-1.5">
                        <MapPin className="w-3 h-3" />
                        Ubicación
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Indicador de selección en la parte inferior */}
              {isSelected && (
                <div 
                  className="h-1"
                  style={{
                    background: 'linear-gradient(90deg, #9333ea 0%, #ec4899 50%, #06b6d4 100%)',
                  }}
                />
              )}
            </button>

            {/* Mapa expandido para móvil cuando está seleccionada */}
            {isSelected && (
              <div className="lg:hidden mt-3">
                <div 
                  className="relative rounded-xl overflow-hidden"
                  style={{
                    height: '200px',
                    border: '2px solid rgba(147, 51, 234, 0.3)',
                  }}
                >
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={getMapUrl(addr)}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  
                  <div 
                    className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white rounded-md"
                    style={{ padding: '0.25rem 0.5rem' }}
                  >
                    <p className="text-xs font-semibold flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" />
                      Ubicación de entrega
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AddressList;