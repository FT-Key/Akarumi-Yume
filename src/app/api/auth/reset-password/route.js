import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import crypto from 'crypto';

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { token, newPassword } = body;

    // Validaciones
    if (!token || !newPassword) {
      return NextResponse.json(
        { message: 'Token y nueva contraseña son requeridos' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { message: 'La contraseña debe tener al menos 8 caracteres' },
        { status: 400 }
      );
    }

    // Hashear el token recibido para comparar
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Buscar usuario con el token válido y no expirado
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Token inválido o expirado' },
        { status: 400 }
      );
    }

    // Actualizar contraseña
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return NextResponse.json(
      { message: 'Contraseña restablecida exitosamente' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error en reset-password:', error);
    return NextResponse.json(
      { message: 'Error al restablecer contraseña' },
      { status: 500 }
    );
  }
}