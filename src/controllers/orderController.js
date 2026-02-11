import { Order, OrderItem, DeliveryType, Address, User } from '../models/index.js';
import dbConnect from '../config/database.js';
import { successResponse, paginatedResponse, errorResponse } from '../utils/response.js';
import { validateRequiredFields } from '../middleware/validateRequest.js';

// POST /api/orders → Crear orden
export async function createOrder(body, userId) {
  await dbConnect();

  const { error } = validateRequiredFields(body, ['deliveryType', 'items']);
  if (error) return error;

  const user = await User.findById(userId);
  const deliveryType = await DeliveryType.findById(body.deliveryType);

  if (!deliveryType) return errorResponse('Tipo de entrega no encontrado', 404);

  // Si es DELIVERY, debe tener dirección de envío
  if (deliveryType.type === 'DELIVERY' && !body.shippingAddress) {
    return errorResponse('Se requiere dirección de envío para delivery', 400);
  }

  // Crear orden
  const order = await Order.create({
    user: userId,
    deliveryType: deliveryType._id,
    shippingAddress: body.shippingAddress || null,
    customerData: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      dni: user.dni,
    },
    shippingCost: deliveryType.price,
    subtotal: 0,
    total: 0,
    customerNotes: body.customerNotes,
  });

  // Crear items con snapshots
  for (const item of body.items) {
    await OrderItem.createWithSnapshot({
      orderId: order._id,
      productId: item.productId, // ✅ Ahora coincide con lo que envías
      quantity: item.quantity,
    });
  }

  // Recalcular totales
  const items = await OrderItem.find({ order: order._id });
  order.items = items;
  order.calculateTotals();
  await order.save();

  return successResponse(null, order, 201);
}

// GET /api/orders → Listar órdenes
export async function listOrders(query, userId, userRole) {
  await dbConnect();

  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;
  const skip = (page - 1) * limit;
  const filters = {};

  // Si no es admin, solo ver sus propias órdenes
  if (userRole !== 'ADMIN') filters.user = userId;
  if (query.status) filters.status = query.status;

  const [orders, total] = await Promise.all([
    Order.find(filters)
      .populate('user', 'firstName lastName email')
      .populate('deliveryType')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Order.countDocuments(filters),
  ]);

  return paginatedResponse(null, { data: orders, total, page, limit });
}

// GET /api/orders/:id → Obtener orden completa
export async function getOrderById(id) {
  await dbConnect();

  const order = await Order.findById(id)
    .populate('user', 'firstName lastName email')
    .populate('deliveryType')
    .populate('shippingAddress')
    .populate('items')
    .populate('payment')
    .populate('shipment');

  if (!order) return errorResponse('Orden no encontrada', 404);
  return successResponse(null, order);
}

// PUT /api/orders/:id → Actualizar estado de orden
export async function updateOrderStatus(id, body) {
  await dbConnect();

  const { error } = validateRequiredFields(body, ['status']);
  if (error) return error;

  const order = await Order.findById(id);
  if (!order) return errorResponse('Orden no encontrada', 404);

  await order.updateStatus(body.status, body.note || '');
  return successResponse(null, order);
}

// DELETE /api/orders/:id → Cancelar orden
export async function cancelOrder(id) {
  await dbConnect();

  const order = await Order.findById(id).populate('items');
  if (!order) return errorResponse('Orden no encontrada', 404);

  if (!order.canBeCancelled()) {
    return errorResponse('Esta orden ya no puede ser cancelada', 400);
  }

  // Restaurar stock de cada item
  for (const item of order.items) {
    await item.restoreStock();
  }

  await order.updateStatus('CANCELLED', 'Cancelada por el usuario');
  return successResponse(null, order);
}
