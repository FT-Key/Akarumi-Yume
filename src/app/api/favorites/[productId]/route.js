import { NextResponse } from 'next/server';
import { FavoriteService } from '@/services/favoriteService';
import connectDB from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

/**
 * GET /api/favorites/:productId
 * Verificar si un producto está en favoritos
 */
export async function GET(request, { params }) {
  try {
    await connectDB();

    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    const { productId } = await params;

    const isFavorite = await FavoriteService.isFavorite(user.id, productId);

    return NextResponse.json({
      success: true,
      data: { isFavorite }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/favorites/:productId
 * Remover producto de favoritos
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

    const { productId } = await params;

    const favorites = await FavoriteService.removeProduct(user.id, productId);

    return NextResponse.json({
      success: true,
      data: favorites,
      message: 'Producto removido de favoritos'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
