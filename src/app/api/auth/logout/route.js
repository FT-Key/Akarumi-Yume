import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: 'Sesión cerrada exitosamente' },
      { status: 200 }
    );

    // Eliminar cookie de autenticación
    response.cookies.delete('auth-token');

    return response;

  } catch (error) {
    console.error('Error en logout:', error);
    return NextResponse.json(
      { message: 'Error al cerrar sesión' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Permitir logout por GET también (para enlaces de cierre de sesión)
  return POST();
}