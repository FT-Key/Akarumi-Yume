import { NextResponse } from 'next/server';
import { CartService } from '@/services/cartService';
import connectDB from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

/**
 * GET /api/cart
 * Obtener carrito del usuario autenticado
 */
export async function GET(request) {
  try {
    await connectDB();

    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    const cart = await CartService.getOrCreateCart(user.id);

    return NextResponse.json({
      success: true,
      data: cart
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cart
 * Agregar producto al carrito
 */
export async function POST(request) {
  try {
    await connectDB();

    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    const { productId, quantity, characteristics } = await request.json();

    const cart = await CartService.addItem(
      user.id,
      productId,
      quantity || 1,
      characteristics || []
    );

    return NextResponse.json({
      success: true,
      data: cart,
      message: 'Producto agregado al carrito'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/cart
 * Vaciar carrito
 */
export async function DELETE(request) {
  try {
    await connectDB();

    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    const cart = await CartService.clearCart(user.id);

    return NextResponse.json({
      success: true,
      data: cart,
      message: 'Carrito vaciado'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
