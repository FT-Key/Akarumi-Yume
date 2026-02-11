import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment as MPPayment } from 'mercadopago';
import dbConnect from '@/lib/mongodb';
import Payment from '@/models/Payment';

// Configurar MercadoPago
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN 
});

export async function POST(request) {
  try {
    await dbConnect();

    // Obtener datos del webhook
    const body = await request.json();
    const searchParams = request.nextUrl.searchParams;
    
    console.log('Webhook recibido:', {
      body,
      params: Object.fromEntries(searchParams)
    });

    // MercadoPago envía diferentes tipos de notificaciones
    const { type, action, data } = body;

    // Solo procesar notificaciones de pago
    if (type !== 'payment' && action !== 'payment.created' && action !== 'payment.updated') {
      return NextResponse.json({ message: 'Evento no procesado' });
    }

    // Obtener el ID del pago desde los datos
    const paymentId = data?.id;

    if (!paymentId) {
      console.error('No se encontró ID de pago en webhook');
      return NextResponse.json({ message: 'ID de pago no encontrado' }, { status: 400 });
    }

    // Consultar detalles del pago en MercadoPago
    const mpPaymentClient = new MPPayment(client);
    const paymentData = await mpPaymentClient.get({ id: paymentId });

    console.log('Datos del pago de MP:', paymentData);

    // Buscar el pago en nuestra BD usando external_reference (orderId)
    const externalReference = paymentData.external_reference;
    
    if (!externalReference) {
      console.error('No se encontró external_reference en el pago');
      return NextResponse.json({ message: 'Referencia externa no encontrada' }, { status: 400 });
    }

    let payment = await Payment.findOne({ 
      order: externalReference 
    });

    if (!payment) {
      // Si no existe, crear uno nuevo (edge case)
      payment = new Payment({
        order: externalReference,
        amount: paymentData.transaction_amount,
        currency: 'ARS',
        status: 'PENDING'
      });
    }

    // Guardar datos del webhook
    await payment.updateFromWebhook({
      type,
      action,
      paymentId,
      receivedAt: new Date()
    });

    // Actualizar con los datos completos del pago
    await payment.updateFromPaymentData(paymentData);

    return NextResponse.json({ 
      message: 'Webhook procesado correctamente',
      paymentStatus: payment.status
    });

  } catch (error) {
    console.error('Error procesando webhook:', error);
    
    // No retornar error 500 a MercadoPago para evitar reintentos
    // MercadoPago reintenta si recibe error
    return NextResponse.json({ 
      message: 'Error procesado internamente',
      error: error.message 
    });
  }
}

// GET para verificar que el endpoint está activo
export async function GET() {
  return NextResponse.json({ 
    message: 'Webhook endpoint activo',
    timestamp: new Date().toISOString()
  });
}