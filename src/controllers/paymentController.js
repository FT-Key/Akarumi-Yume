import { Payment, Order } from '../models/index.js';
import { createPreference, getPayment } from '../lib/mercadopago.js';
import dbConnect from '../config/database.js';
import { successResponse, errorResponse } from '../utils/response.js';

// POST /api/payments → Crear preferencia de pago
export async function createPayment(body) {
  await dbConnect();

  const order = await Order.findById(body.orderId);
  if (!order) return errorResponse('Orden no encontrada', 404);

  // Crear preferencia en MercadoPago
  const preference = await createPreference({
    items: [{
      title:      `Orden ${order.orderNumber}`,
      quantity:   1,
      unit_price: order.total,
      currency_id: 'ARS',
    }],
    back_urls: {
      success:  `${process.env.FRONTEND_URL}/checkout/success`,
      failure:  `${process.env.FRONTEND_URL}/checkout/failure`,
      pending:  `${process.env.FRONTEND_URL}/checkout/pending`,
    },
    auto_return:       'approved',
    external_reference: order._id.toString(),
    notification_url:  `${process.env.BACKEND_URL}/api/payments/webhook`,
  });

  // Guardar registro de pago
  const payment = await Payment.create({
    order:       order._id,
    mercadopago: {
      preferenceId:      preference.id,
      externalReference: order._id.toString(),
    },
    amount:          order.total,
    initPoint:       preference.init_point,
    sandboxInitPoint: preference.sandbox_init_point,
  });

  // Actualizar estado de orden
  await order.updateStatus('PAYMENT_PENDING', 'Redirigiendo a MercadoPago');

  return successResponse(null, {
    payment,
    initPoint: preference.init_point,
    sandboxInitPoint: preference.sandbox_init_point,
  }, 201);
}

// GET /api/payments/:id → Obtener estado del pago
export async function getPaymentById(id) {
  await dbConnect();
  const payment = await Payment.findById(id).populate('order');
  if (!payment) return errorResponse('Pago no encontrado', 404);
  return successResponse(null, payment);
}

// POST /api/payments/webhook → Procesar webhook de MercadoPago
export async function processWebhook(body) {
  await dbConnect();

  // Buscar pago por preferenceId
  const payment = await Payment.findOne({
    'mercadopago.preferenceId': body.data?.preference_id,
  });

  if (!payment) {
    // Intentar por paymentId (MercadoPago puede enviar payment.id en lugar)
    if (body.data?.id) {
      const paymentData = await getPayment(body.data.id);
      const payByRef = await Payment.findOne({
        'mercadopago.externalReference': paymentData?.external_reference,
      });
      if (payByRef) {
        await payByRef.updateFromPaymentData(paymentData);
        return successResponse(null, { message: 'Webhook procesado' });
      }
    }
    return errorResponse('Pago no encontrado', 404);
  }

  const shouldFetch = await payment.updateFromWebhook(body);
  await payment.save();

  if (shouldFetch && body.data?.id) {
    const paymentData = await getPayment(body.data.id);
    await payment.updateFromPaymentData(paymentData);
  }

  return successResponse(null, { message: 'Webhook procesado' });
}
