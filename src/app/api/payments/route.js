import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import dbConnect from '@/lib/mongodb';
import Payment from '@/models/Payment';
import Order from '@/models/Order';
import OrderItem from '@/models/OrderItem';
import { withAuth } from '@/middleware/auth';

// Configurar MercadoPago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
});

const isProduction = process.env.NODE_ENV === 'production';

export async function POST(request) {
  return withAuth(request, async (req, user) => {
    try {
      await dbConnect();

      const body = await req.json();
      const { orderId } = body;

      if (!orderId) {
        return NextResponse.json(
          { message: 'ID de orden requerido' },
          { status: 400 }
        );
      }

      // Buscar la orden Y POBLAR LOS ITEMS (esto es crítico)
      const order = await Order.findById(orderId)
        .populate('user')
        .populate('deliveryType');

      console.log("Orden encontrada:", order);

      if (!order) {
        return NextResponse.json(
          { message: 'Orden no encontrada' },
          { status: 404 }
        );
      }

      // Verificar que la orden pertenece al usuario
      if (order.user._id.toString() !== user._id.toString()) {
        return NextResponse.json(
          { message: 'No autorizado para esta orden' },
          { status: 403 }
        );
      }

      // Verificar que la orden no esté ya pagada
      if (order.status === 'PAID') {
        return NextResponse.json(
          { message: 'Esta orden ya ha sido pagada' },
          { status: 400 }
        );
      }

      // Buscar los items de la orden (ya que es un virtual)
      const orderItems = await OrderItem.find({ order: orderId }).populate('product');

      console.log("Items encontrados:", orderItems.length);

      if (!orderItems || orderItems.length === 0) {
        return NextResponse.json(
          { message: 'No se encontraron items en la orden' },
          { status: 400 }
        );
      }

      // Verificar si ya existe un pago para esta orden
      let payment = await Payment.findOne({ order: orderId });

      // Si ya existe una preferencia válida, retornarla
      if (payment && payment.mercadopago.preferenceId) {
        return NextResponse.json({
          payment: {
            id: payment._id,
            preferenceId: payment.mercadopago.preferenceId,
            initPoint: payment.initPoint,
            sandboxInitPoint: payment.sandboxInitPoint,
            status: payment.status
          }
        });
      }

      // Crear items para MercadoPago desde los OrderItems
      const items = orderItems.map(item => ({
        id: item.product._id.toString(),
        title: item.productSnapshot.name,
        description: item.productSnapshot.description || item.productSnapshot.name,
        picture_url: item.productSnapshot.imageUrl || undefined,
        category_id: 'others',
        quantity: item.quantity,
        unit_price: item.price, // Precio unitario guardado en el snapshot
        currency_id: 'ARS'
      }));

      console.log("Items para MercadoPago:", items);

      // Crear preferencia en MercadoPago
      const preference = new Preference(client);
      const preferenceData = {
        items,
        payer: {
          name: order.user.firstName,
          surname: order.user.lastName,
          email: order.user.email,
          phone: {
            number: order.user.phone || ''
          },
          identification: {
            type: 'DNI',
            number: order.user.dni
          }
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/pedidos/${orderId}/exito`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}/pedidos/${orderId}/fallo`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL}/pedidos/${orderId}/pendiente`
        },
        external_reference: orderId.toString(),
        notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/webhook`,
        statement_descriptor: 'AKARUMI YUME',
        metadata: {
          order_id: orderId.toString(),
          user_id: user._id.toString()
        },

        ...(isProduction && { auto_return: 'approved' })
      };

      console.log("Creando preferencia en MercadoPago...");
      const mpResponse = await preference.create({ body: preferenceData });
      console.log('🟢 Preferencia creada:', {
        id: mpResponse.id,
        init_point: mpResponse.init_point,
        sandbox_init_point: mpResponse.sandbox_init_point
      });

      // Crear o actualizar el pago en la base de datos
      if (!payment) {
        console.log('🟡 No existía pago, creando nuevo Payment');
        payment = new Payment({
          order: orderId,
          amount: order.total,
          currency: 'ARS',
          status: 'PENDING'
        });
      } else {
        console.log('🟡 Payment existente encontrado:', payment._id.toString());
      }

      payment.mercadopago.preferenceId = mpResponse.id;
      payment.mercadopago.externalReference = orderId.toString();
      payment.initPoint = mpResponse.init_point;
      payment.sandboxInitPoint = mpResponse.sandbox_init_point;

      console.log('🟡 Payment antes de guardar:', payment.toObject());

      await payment.save();
      console.log('✅ Payment guardado correctamente:', payment._id.toString());

      // Actualizar orden
      console.log('🟡 Actualizando estado de orden:', order._id.toString());

      order.status = 'PAYMENT_PENDING';

      await order.save();

      console.log('✅ Orden actualizada correctamente');

      const responsePayload = {
        message: 'Preferencia de pago creada',
        payment: {
          id: payment._id,
          preferenceId: payment.mercadopago.preferenceId,
          initPoint: payment.initPoint,
          sandboxInitPoint: payment.sandboxInitPoint,
          status: payment.status
        }
      };

      console.log('🚀 Retornando response al cliente:', responsePayload);

      return NextResponse.json(responsePayload);

    } catch (error) {
      console.error('Error al crear pago:', error);
      return NextResponse.json(
        {
          message: 'Error al crear preferencia de pago',
          error: error.message
        },
        { status: 500 }
      );
    }
  });
}