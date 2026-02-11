import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Cart from '@/models/Cart';
import Favorite from '@/models/Favorite';

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { firstName, lastName, email, password, phone, dni } = body;

    // Validaciones básicas
    if (!firstName || !lastName || !email || !password || !dni) {
      return NextResponse.json(
        { message: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Email inválido' },
        { status: 400 }
      );
    }

    // Validar longitud de contraseña
    if (password.length < 8) {
      return NextResponse.json(
        { message: 'La contraseña debe tener al menos 8 caracteres' },
        { status: 400 }
      );
    }

    // Validar formato de DNI (7-8 dígitos)
    const dniRegex = /^\d{7,8}$/;
    if (!dniRegex.test(dni)) {
      return NextResponse.json(
        { message: 'DNI inválido. Debe tener 7 u 8 dígitos' },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({
      $or: [{ email }, { dni }]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json(
          { message: 'El email ya está registrado' },
          { status: 409 }
        );
      }
      if (existingUser.dni === dni) {
        return NextResponse.json(
          { message: 'El DNI ya está registrado' },
          { status: 409 }
        );
      }
    }

    // Crear nuevo usuario
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone: phone || undefined,
      dni,
      role: 'USER',
      isActive: true
    });

    // Crear carrito y favoritos vacíos para el usuario
    await Promise.all([
      Cart.create({ user: user._id, items: [] }),
      Favorite.create({ user: user._id, products: [] })
    ]);

    // Respuesta exitosa (sin password)
    return NextResponse.json(
      {
        message: 'Usuario registrado exitosamente',
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          dni: user.dni,
          phone: user.phone,
          role: user.role
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error en registro:', error);

    // Manejar errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { message: messages.join(', ') },
        { status: 400 }
      );
    }

    // Manejar errores de duplicado
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { message: `El ${field} ya está en uso` },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: 'Error al registrar usuario' },
      { status: 500 }
    );
  }
}