import { DeliveryType } from '../models/index.js';
import dbConnect from '../config/database.js';
import { successResponse, paginatedResponse, errorResponse } from '../utils/response.js';
import { validateRequiredFields } from '../middleware/validateRequest.js';

// POST /api/delivery-types → Crear tipo de entrega
export async function createDeliveryType(body) {
  await dbConnect();
  
  const { error } = validateRequiredFields(body, ['type', 'name', 'price']);
  if (error) return error;

  const deliveryType = await DeliveryType.create(body);
  
  return successResponse(null, deliveryType, 201);
}

// GET /api/delivery-types → Listar tipos de entrega
export async function listDeliveryTypes(query) {
  await dbConnect();
  
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 50;
  const skip = (page - 1) * limit;

  const filters = {};
  
  // Filtro por tipo
  if (query.type) filters.type = query.type;
  
  // Filtro por activos (por defecto solo activos)
  if (query.active !== 'false') filters.isActive = true;

  const [deliveryTypes, total] = await Promise.all([
    DeliveryType.find(filters)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit),
    DeliveryType.countDocuments(filters),
  ]);

  return paginatedResponse(null, { data: deliveryTypes, total, page, limit });
}

// GET /api/delivery-types/:id → Obtener tipo de entrega
export async function getDeliveryTypeById(id) {
  await dbConnect();
  
  const deliveryType = await DeliveryType.findById(id);
  
  if (!deliveryType) return errorResponse('Tipo de entrega no encontrado', 404);
  
  return successResponse(null, deliveryType);
}

// PUT /api/delivery-types/:id → Actualizar tipo de entrega
export async function updateDeliveryType(id, body) {
  await dbConnect();
  
  const deliveryType = await DeliveryType.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true }
  );
  
  if (!deliveryType) return errorResponse('Tipo de entrega no encontrado', 404);
  
  return successResponse(null, deliveryType);
}

// DELETE /api/delivery-types/:id → Eliminar/desactivar tipo de entrega
export async function deleteDeliveryType(id) {
  await dbConnect();
  
  const deliveryType = await DeliveryType.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );
  
  if (!deliveryType) return errorResponse('Tipo de entrega no encontrado', 404);
  
  return successResponse(null, deliveryType);
}