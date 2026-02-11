import { NextResponse } from 'next/server';
import { FavoriteService } from '@/services/favoriteService';
import connectDB from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

/**
 * GET /api/favorites
 * Obtener favoritos del usuario autenticado
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

    const favorites = await FavoriteService.getOrCreateFavorites(user.id);

    return NextResponse.json({
      success: true,
      data: favorites
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/favorites
 * Toggle producto en favoritos
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

    const { productId } = await request.json();

    const favorites = await FavoriteService.toggleProduct(user.id, productId);

    return NextResponse.json({
      success: true,
      data: favorites
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/favorites
 * Limpiar favoritos
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

    const favorites = await FavoriteService.clearFavorites(user.id);

    return NextResponse.json({
      success: true,
      data: favorites,
      message: 'Favoritos limpiados'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
