import { Shipment, Order, Address, DeliveryType } from '../models/index.js';
import dbConnect from '../config/database.js';
import { successResponse, errorResponse } from '../utils/response.js';

// GET /api/shipments/:id → Obtener envío
export async function getShipmentById(id) {
  await dbConnect();

  const shipment = await Shipment.findById(id)
    .populate('order')
    .populate('shippingAddress');

  if (!shipment) return errorResponse('Envío no encontrado', 404);
  return successResponse(null, shipment);
}

// PUT /api/shipments/:id → Actualizar estado de envío
export async function updateShipmentStatus(id, body) {
  await dbConnect();

  const shipment = await Shipment.findById(id);
  if (!shipment) return errorResponse('Envío no encontrado', 404);

  await shipment.updateStatus(body.status, body.location, body.note);
  return successResponse(null, shipment);
}

// Crear envío desde orden (se llama internamente cuando se confirma pago + delivery)
export async function createShipmentFromOrder(orderId) {
  await dbConnect();

  const order = await Order.findById(orderId)
    .populate('shippingAddress')
    .populate('deliveryType');

  if (!order) return errorResponse('Orden no encontrada', 404);
  if (order.deliveryType.type !== 'DELIVERY') return null;

  const shipment = await Shipment.createFromOrder(order, order.shippingAddress, order.deliveryType);
  return shipment;
}
