import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// Función para obtener el token del request
export function getToken(request) {
  // Intentar obtener de Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Intentar obtener de cookie
  const cookies = request.cookies;
  return cookies.get('auth-token')?.value;
}

// Función para verificar token
export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
  } catch (error) {
    return null;
  }
}

// Middleware principal de autenticación
export async function authMiddleware(request) {
  try {
    await dbConnect();

    // Obtener token
    const token = getToken(request);

    if (!token) {
      return {
        error: NextResponse.json(
          { message: 'No autorizado. Token no proporcionado' },
          { status: 401 }
        )
      };
    }

    // Verificar token
    const decoded = verifyToken(token);

    if (!decoded || !decoded.userId) {
      return {
        error: NextResponse.json(
          { message: 'Token inválido o expirado' },
          { status: 401 }
        )
      };
    }

    // Buscar usuario
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return {
        error: NextResponse.json(
          { message: 'Usuario no encontrado' },
          { status: 404 }
        )
      };
    }

    // Verificar si el usuario está activo
    if (!user.isActive) {
      return {
        error: NextResponse.json(
          { message: 'Cuenta desactivada' },
          { status: 403 }
        )
      };
    }

    // Retornar usuario autenticado
    return { user };

  } catch (error) {
    console.error('Error en authMiddleware:', error);
    return {
      error: NextResponse.json(
        { message: 'Error de autenticación' },
        { status: 500 }
      )
    };
  }
}

// Middleware para verificar rol de admin
export async function adminMiddleware(request) {
  const authResult = await authMiddleware(request);

  if (authResult.error) {
    return authResult;
  }

  if (authResult.user.role !== 'ADMIN') {
    return {
      error: NextResponse.json(
        { message: 'Acceso denegado. Se requieren permisos de administrador' },
        { status: 403 }
      )
    };
  }

  return authResult;
}

// Función helper para usar en las rutas
export async function withAuth(request, handler) {
  const authResult = await authMiddleware(request);
  
  if (authResult.error) {
    return authResult.error;
  }

  // Ejecutar el handler con el usuario autenticado
  return handler(request, authResult.user);
}

// Función helper para rutas de admin
export async function withAdmin(request, handler) {
  const authResult = await adminMiddleware(request);
  
  if (authResult.error) {
    return authResult.error;
  }

  // Ejecutar el handler con el usuario admin autenticado
  return handler(request, authResult.user);
}

// Exportar authMiddleware como authenticate para consistencia en las rutas
export { authMiddleware as authenticate };