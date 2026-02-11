import { NextResponse } from 'next/server';
import { CartService } from '@/services/cartService';
import connectDB from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

/**
 * PUT /api/cart/:itemId
 * Actualizar cantidad de un item
 */
export async function PUT(request, { params }) {
  try {
    await connectDB();

    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    const { itemId } = await params;
    const { quantity } = await request.json();

    const cart = await CartService.updateItemQuantity(user.id, itemId, quantity);

    return NextResponse.json({
      success: true,
      data: cart,
      message: 'Cantidad actualizada'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/cart/:itemId
 * Remover item del carrito
 */
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    const { itemId } = await params;

    const cart = await CartService.removeItem(user.id, itemId);

    return NextResponse.json({
      success: true,
      data: cart,
      message: 'Producto removido del carrito'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
