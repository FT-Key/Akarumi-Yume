import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Payment from '@/models/Payment';
import { withAuth } from '@/middleware/auth';

export async function GET(request, { params }) {
  return withAuth(request, async (req, user) => {
    try {
      await dbConnect();

      const { id } = params;
      
      // Buscar primero por _id del payment
      let payment = await Payment.findById(id)
        .populate({
          path: 'order',
          populate: {
            path: 'user',
            select: 'firstName lastName email'
          }
        });

      // Si no se encuentra por _id, buscar por orderId
      if (!payment) {
        payment = await Payment.findOne({ order: id })
          .populate({
            path: 'order',
            populate: {
              path: 'user',
              select: 'firstName lastName email'
            }
          });
      }

      if (!payment) {
        return NextResponse.json(
          { message: 'Pago no encontrado' },
          { status: 404 }
        );
      }

      // Verificar que el pago pertenece al usuario o es admin
      const isOwner = payment.order.user._id.toString() === user._id.toString();
      const isAdmin = user.role === 'ADMIN';

      if (!isOwner && !isAdmin) {
        return NextResponse.json(
          { message: 'No autorizado' },
          { status: 403 }
        );
      }

      return NextResponse.json({
        payment: {
          id: payment._id,
          orderId: payment.order._id,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
          mercadopago: {
            preferenceId: payment.mercadopago.preferenceId,
            paymentId: payment.mercadopago.paymentId,
            status: payment.mercadopago.status,
            paymentType: payment.mercadopago.paymentType
          },
          initPoint: payment.initPoint,
          sandboxInitPoint: payment.sandboxInitPoint,
          payer: payment.payer,
          paidAt: payment.paidAt,
          createdAt: payment.createdAt,
          updatedAt: payment.updatedAt
        }
      });

    } catch (error) {
      console.error('Error al obtener pago:', error);
      return NextResponse.json(
        { message: 'Error al obtener información del pago' },
        { status: 500 }
      );
    }
  });
}