import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

// Función auxiliar para obtener el token
function getToken(request) {
  // Intentar obtener de Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Intentar obtener de cookie
  const cookies = request.cookies;
  return cookies.get('auth-token')?.value;
}

// Función auxiliar para verificar token
function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
  } catch (error) {
    return null;
  }
}

export async function GET(request) {
  try {
    await dbConnect();

    // Obtener token
    const token = getToken(request);

    if (!token) {
      return NextResponse.json(
        { message: 'No autorizado. Token no proporcionado' },
        { status: 401 }
      );
    }

    // Verificar token
    const decoded = verifyToken(token);

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { message: 'Token inválido o expirado' },
        { status: 401 }
      );
    }

    // Buscar usuario
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return NextResponse.json(
        { message: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si el usuario está activo
    if (!user.isActive) {
      return NextResponse.json(
        { message: 'Cuenta desactivada' },
        { status: 403 }
      );
    }

    // Retornar datos del usuario
    return NextResponse.json(
      {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          email: user.email,
          dni: user.dni,
          phone: user.phone,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error al obtener usuario actual:', error);
    return NextResponse.json(
      { message: 'Error al obtener información del usuario' },
      { status: 500 }
    );
  }
}