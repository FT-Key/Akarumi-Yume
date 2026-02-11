import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import crypto from 'crypto';

// NOTA: Necesitarás agregar estos campos al modelo User:
// passwordResetToken: String,
// passwordResetExpires: Date

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { email } = body;

    // Validar email
    if (!email) {
      return NextResponse.json(
        { message: 'Email es requerido' },
        { status: 400 }
      );
    }

    // Buscar usuario
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Por seguridad, no revelamos si el email existe o no
      return NextResponse.json(
        { message: 'Si el email existe, recibirás instrucciones para restablecer tu contraseña' },
        { status: 200 }
      );
    }

    // Generar token de reseteo
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Guardar token hasheado en BD (expira en 1 hora)
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 3600000; // 1 hora
    await user.save();

    // URL de reseteo (ajusta según tu dominio)
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/restablecer-contrasena/${resetToken}`;

    // TODO: Aquí deberías enviar un email con el resetUrl
    // Por ahora, lo devolvemos en desarrollo (ELIMINAR EN PRODUCCIÓN)
    if (process.env.NODE_ENV === 'development') {
      console.log('Reset URL:', resetUrl);
    }

    // En producción, enviarías un email aquí:
    // await sendPasswordResetEmail(user.email, resetUrl);

    return NextResponse.json(
      { 
        message: 'Si el email existe, recibirás instrucciones para restablecer tu contraseña',
        // SOLO PARA DESARROLLO - ELIMINAR EN PRODUCCIÓN
        ...(process.env.NODE_ENV === 'development' && { resetUrl })
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error en forgot-password:', error);
    return NextResponse.json(
      { message: 'Error al procesar solicitud' },
      { status: 500 }
    );
  }
}