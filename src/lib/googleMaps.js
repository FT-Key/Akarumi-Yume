/**
 * Wrapper de Google Maps Geocoding API
 * Valida y geocodifica direcciones.
 */

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

/**
 * Geocodificar una dirección (texto → coordenadas + place ID)
 * @param {string} address - Texto de dirección
 * @returns {{ coordinates: {lat, lng}, formattedAddress: string, placeId: string } | null}
 */
export async function geocodeAddress(address) {
  if (!API_KEY) throw new Error('Falta GOOGLE_MAPS_API_KEY');

  const encoded = encodeURIComponent(address);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}&key=${API_KEY}&region=ar`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.status !== 'OK' || !data.results?.length) {
    return null; // No se encontró la dirección
  }

  const result = data.results[0];
  return {
    coordinates: {
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng,
    },
    formattedAddress: result.formatted_address,
    placeId: result.place_id,
  };
}

/**
 * Obtener detalles de un lugar por Place ID
 * @param {string} placeId
 * @returns {object} Datos del lugar
 */
export async function getPlaceDetails(placeId) {
  if (!API_KEY) throw new Error('Falta GOOGLE_MAPS_API_KEY');

  const url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.status !== 'OK') return null;
  return data.result;
}
