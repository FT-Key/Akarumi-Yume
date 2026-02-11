import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

// Generar JWT token
function generateToken(userId) {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    { expiresIn: '7d' }
  );
}

export async function POST(request) {
  try {
    console.log('🔹 [LOGIN] Request recibida');

    await dbConnect();
    console.log('✅ [LOGIN] DB conectada');

    const body = await request.json();
    console.log('📦 [LOGIN] Body recibido:', body);

    const { email, password } = body;

    if (!email || !password) {
      console.log('❌ [LOGIN] Faltan credenciales');
      return NextResponse.json(
        { message: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    console.log('🔍 [LOGIN] Buscando usuario:', email.toLowerCase());

    const user = await User
      .findOne({ email: email.toLowerCase() })
      .select('+password');

    if (!user) {
      console.log('❌ [LOGIN] Usuario NO encontrado');
      return NextResponse.json(
        { message: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    console.log('✅ [LOGIN] Usuario encontrado:', {
      id: user._id.toString(),
      isActive: user.isActive,
      hasPassword: !!user.password
    });

    if (!user.isActive) {
      console.log('⛔ [LOGIN] Usuario inactivo');
      return NextResponse.json(
        { message: 'Cuenta desactivada. Contacta al administrador' },
        { status: 403 }
      );
    }

    console.log('🔐 [LOGIN] Comparando password...');
    const isPasswordValid = await user.comparePassword(password);

    console.log('🔐 [LOGIN] Resultado password:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('❌ [LOGIN] Password inválido');
      return NextResponse.json(
        { message: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    console.log('🎉 [LOGIN] Login correcto, generando token');

    const token = generateToken(user._id);

    const response = NextResponse.json(
      {
        message: 'Inicio de sesión exitoso',
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          email: user.email,
          dni: user.dni,
          phone: user.phone,
          role: user.role
        },
        token
      },
      { status: 200 }
    );

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    });

    console.log('🍪 [LOGIN] Cookie seteada correctamente');

    return response;

  } catch (error) {
    console.error('💥 [LOGIN] Error inesperado:', error);
    return NextResponse.json(
      { message: 'Error al iniciar sesión' },
      { status: 500 }
    );
  }
}