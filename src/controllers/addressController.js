import { Address } from '../models/index.js';
import { geocodeAddress } from '../lib/googleMaps.js';
import dbConnect from '../config/database.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { validateRequiredFields } from '../middleware/validateRequest.js';

// POST /api/addresses → Crear dirección
export async function createAddress(body, userId) {
  await dbConnect();

  const { error } = validateRequiredFields(body, ['street', 'streetNumber', 'city', 'province', 'postalCode']);
  if (error) return error;

  const address = await Address.create({ ...body, user: userId });
  return successResponse(null, address, 201);
}

// GET /api/addresses/:id → Obtener dirección
export async function getAddressById(id) {
  await dbConnect();
  const address = await Address.findById(id);
  if (!address) return errorResponse('Dirección no encontrada', 404);
  return successResponse(null, address);
}

// PUT /api/addresses/:id → Actualizar dirección
export async function updateAddress(id, body) {
  await dbConnect();
  const address = await Address.findByIdAndUpdate(id, body, { new: true, runValidators: true });
  if (!address) return errorResponse('Dirección no encontrada', 404);
  return successResponse(null, address);
}

// DELETE /api/addresses/:id → Eliminar dirección
export async function deleteAddress(id) {
  await dbConnect();
  const address = await Address.findByIdAndDelete(id);
  if (!address) return errorResponse('Dirección no encontrada', 404);
  return successResponse(null, { message: 'Dirección eliminada' });
}

// POST /api/addresses/:id/validate → Validar con Google Maps
export async function validateAddress(id) {
  await dbConnect();
  const address = await Address.findById(id);
  if (!address) return errorResponse('Dirección no encontrada', 404);

  const query = address.getGoogleMapsQuery();
  const result = await geocodeAddress(query);

  if (!result) {
    return errorResponse('No se pudo validar la dirección con Google Maps', 422);
  }

  address.coordinates     = result.coordinates;
  address.formattedAddress = result.formattedAddress;
  address.googlePlaceId   = result.placeId;
  address.isValidated     = true;
  await address.save();

  return successResponse(null, address);
}

// GET /api/users/:id/addresses → Direcciones de un usuario
export async function getAddressesByUser(userId) {
  await dbConnect();
  const addresses = await Address.find({ user: userId }).sort({ isDefault: -1, createdAt: -1 });
  return successResponse(null, addresses);
}
