import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User, Address } from '../src/models/index.js';
import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

const users = [
  // Admin
  {
    firstName: 'Admin',
    lastName: 'Sistema',
    email: 'admin@ecommerce.com',
    password: 'Admin123!',
    phone: '+54 9 381 555-0001',
    dni: '20123456',
    role: 'ADMIN',
    isActive: true,
  },
  // Usuarios regulares
  {
    firstName: 'María',
    lastName: 'González',
    email: 'maria.gonzalez@gmail.com',
    password: 'Password123!',
    phone: '+54 9 381 555-1234',
    dni: '30456789',
    role: 'USER',
    isActive: true,
  },
  {
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan.perez@hotmail.com',
    password: 'Password123!',
    phone: '+54 9 381 555-5678',
    dni: '28765432',
    role: 'USER',
    isActive: true,
  },
  {
    firstName: 'Ana',
    lastName: 'Martínez',
    email: 'ana.martinez@yahoo.com',
    password: 'Password123!',
    phone: '+54 9 381 555-9012',
    dni: '35234567',
    role: 'USER',
    isActive: true,
  },
  {
    firstName: 'Carlos',
    lastName: 'Rodríguez',
    email: 'carlos.rodriguez@outlook.com',
    password: 'Password123!',
    phone: '+54 9 381 555-3456',
    dni: '27654321',
    role: 'USER',
    isActive: true,
  },
  {
    firstName: 'Lucía',
    lastName: 'Fernández',
    email: 'lucia.fernandez@gmail.com',
    password: 'Password123!',
    phone: '+54 9 381 555-7890',
    dni: '32876543',
    role: 'USER',
    isActive: true,
  },
  {
    firstName: 'Pedro',
    lastName: 'Sánchez',
    email: 'pedro.sanchez@gmail.com',
    password: 'Password123!',
    phone: '+54 9 381 555-2345',
    dni: '29345678',
    role: 'USER',
    isActive: true,
  },
  {
    firstName: 'Laura',
    lastName: 'López',
    email: 'laura.lopez@hotmail.com',
    password: 'Password123!',
    phone: '+54 9 381 555-6789',
    dni: '31987654',
    role: 'USER',
    isActive: true,
  },
  {
    firstName: 'Diego',
    lastName: 'García',
    email: 'diego.garcia@gmail.com',
    password: 'Password123!',
    phone: '+54 9 381 555-0123',
    dni: '33456789',
    role: 'USER',
    isActive: true,
  },
  {
    firstName: 'Sofía',
    lastName: 'Ramírez',
    email: 'sofia.ramirez@yahoo.com',
    password: 'Password123!',
    phone: '+54 9 381 555-4567',
    dni: '26789012',
    role: 'USER',
    isActive: true,
  },
  {
    firstName: 'Miguel',
    lastName: 'Torres',
    email: 'miguel.torres@outlook.com',
    password: 'Password123!',
    phone: '+54 9 381 555-8901',
    dni: '34567890',
    role: 'USER',
    isActive: true,
  },
];

const addressesData = [
  // Direcciones para María González
  {
    userEmail: 'maria.gonzalez@gmail.com',
    addresses: [
      {
        alias: 'Casa',
        street: 'Av. Mate de Luna',
        streetNumber: '1234',
        floor: '5',
        apartment: 'B',
        city: 'San Miguel de Tucumán',
        province: 'Tucumán',
        postalCode: 'T4000',
        reference: 'Edificio blanco con portón negro',
        coordinates: { lat: -26.8083, lng: -65.2176 },
        formattedAddress: 'Av. Mate de Luna 1234, Piso 5 Apto B, T4000 San Miguel de Tucumán, Tucumán',
        isDefault: true,
        isValidated: true,
      },
      {
        alias: 'Oficina',
        street: '25 de Mayo',
        streetNumber: '567',
        city: 'San Miguel de Tucumán',
        province: 'Tucumán',
        postalCode: 'T4000',
        reference: 'Edificio comercial, piso 3',
        coordinates: { lat: -26.8241, lng: -65.2226 },
        formattedAddress: '25 de Mayo 567, T4000 San Miguel de Tucumán, Tucumán',
        isDefault: false,
        isValidated: true,
      },
    ],
  },
  // Direcciones para Juan Pérez
  {
    userEmail: 'juan.perez@hotmail.com',
    addresses: [
      {
        alias: 'Casa',
        street: 'Av. Aconquija',
        streetNumber: '2890',
        city: 'Yerba Buena',
        province: 'Tucumán',
        postalCode: 'T4107',
        reference: 'Casa quinta con portón de madera',
        coordinates: { lat: -26.8167, lng: -65.3167 },
        formattedAddress: 'Av. Aconquija 2890, T4107 Yerba Buena, Tucumán',
        isDefault: true,
        isValidated: true,
      },
    ],
  },
  // Direcciones para Ana Martínez
  {
    userEmail: 'ana.martinez@yahoo.com',
    addresses: [
      {
        alias: 'Casa',
        street: 'San Martín',
        streetNumber: '450',
        floor: '2',
        apartment: 'A',
        city: 'San Miguel de Tucumán',
        province: 'Tucumán',
        postalCode: 'T4000',
        reference: 'Frente a la plaza',
        coordinates: { lat: -26.8283, lng: -65.2095 },
        formattedAddress: 'San Martín 450, Piso 2 Apto A, T4000 San Miguel de Tucumán, Tucumán',
        isDefault: true,
        isValidated: true,
      },
      {
        alias: 'Casa de mis padres',
        street: 'Las Heras',
        streetNumber: '890',
        city: 'San Miguel de Tucumán',
        province: 'Tucumán',
        postalCode: 'T4000',
        reference: 'Casa con rejas verdes',
        coordinates: { lat: -26.8210, lng: -65.2140 },
        formattedAddress: 'Las Heras 890, T4000 San Miguel de Tucumán, Tucumán',
        isDefault: false,
        isValidated: true,
      },
    ],
  },
  // Direcciones para Carlos Rodríguez
  {
    userEmail: 'carlos.rodriguez@outlook.com',
    addresses: [
      {
        alias: 'Casa',
        street: 'Laprida',
        streetNumber: '1567',
        city: 'San Miguel de Tucumán',
        province: 'Tucumán',
        postalCode: 'T4000',
        reference: 'Casa de dos pisos, portón marrón',
        coordinates: { lat: -26.8290, lng: -65.2050 },
        formattedAddress: 'Laprida 1567, T4000 San Miguel de Tucumán, Tucumán',
        isDefault: true,
        isValidated: true,
      },
    ],
  },
  // Direcciones para Lucía Fernández
  {
    userEmail: 'lucia.fernandez@gmail.com',
    addresses: [
      {
        alias: 'Casa',
        street: 'Monteagudo',
        streetNumber: '678',
        floor: '8',
        apartment: 'C',
        city: 'San Miguel de Tucumán',
        province: 'Tucumán',
        postalCode: 'T4000',
        reference: 'Torre alta con ascensor',
        coordinates: { lat: -26.8305, lng: -65.2065 },
        formattedAddress: 'Monteagudo 678, Piso 8 Apto C, T4000 San Miguel de Tucumán, Tucumán',
        isDefault: true,
        isValidated: true,
      },
    ],
  },
  // Direcciones para Pedro Sánchez
  {
    userEmail: 'pedro.sanchez@gmail.com',
    addresses: [
      {
        alias: 'Casa',
        street: 'Av. Sáenz Peña',
        streetNumber: '3456',
        city: 'San Miguel de Tucumán',
        province: 'Tucumán',
        postalCode: 'T4000',
        reference: 'Cerca del parque 9 de Julio',
        coordinates: { lat: -26.8250, lng: -65.2180 },
        formattedAddress: 'Av. Sáenz Peña 3456, T4000 San Miguel de Tucumán, Tucumán',
        isDefault: true,
        isValidated: true,
      },
      {
        alias: 'Departamento',
        street: 'Junín',
        streetNumber: '234',
        floor: '4',
        apartment: 'D',
        city: 'San Miguel de Tucumán',
        province: 'Tucumán',
        postalCode: 'T4000',
        reference: 'Edificio con portero eléctrico',
        coordinates: { lat: -26.8270, lng: -65.2100 },
        formattedAddress: 'Junín 234, Piso 4 Apto D, T4000 San Miguel de Tucumán, Tucumán',
        isDefault: false,
        isValidated: true,
      },
    ],
  },
  // Direcciones para Laura López
  {
    userEmail: 'laura.lopez@hotmail.com',
    addresses: [
      {
        alias: 'Casa',
        street: 'Crisóstomo Álvarez',
        streetNumber: '789',
        city: 'San Miguel de Tucumán',
        province: 'Tucumán',
        postalCode: 'T4000',
        reference: 'Casa con jardín al frente',
        coordinates: { lat: -26.8200, lng: -65.2120 },
        formattedAddress: 'Crisóstomo Álvarez 789, T4000 San Miguel de Tucumán, Tucumán',
        isDefault: true,
        isValidated: true,
      },
    ],
  },
  // Direcciones para Diego García
  {
    userEmail: 'diego.garcia@gmail.com',
    addresses: [
      {
        alias: 'Casa',
        street: 'Av. Soldati',
        streetNumber: '4567',
        city: 'San Miguel de Tucumán',
        province: 'Tucumán',
        postalCode: 'T4000',
        reference: 'Barrio cerrado Los Lapachos',
        coordinates: { lat: -26.8100, lng: -65.2300 },
        formattedAddress: 'Av. Soldati 4567, T4000 San Miguel de Tucumán, Tucumán',
        isDefault: true,
        isValidated: true,
      },
    ],
  },
  // Direcciones para Sofía Ramírez
  {
    userEmail: 'sofia.ramirez@yahoo.com',
    addresses: [
      {
        alias: 'Casa',
        street: 'Belgrano',
        streetNumber: '1234',
        floor: '6',
        apartment: 'A',
        city: 'San Miguel de Tucumán',
        province: 'Tucumán',
        postalCode: 'T4000',
        reference: 'Edificio moderno con seguridad',
        coordinates: { lat: -26.8260, lng: -65.2070 },
        formattedAddress: 'Belgrano 1234, Piso 6 Apto A, T4000 San Miguel de Tucumán, Tucumán',
        isDefault: true,
        isValidated: true,
      },
    ],
  },
  // Direcciones para Miguel Torres
  {
    userEmail: 'miguel.torres@outlook.com',
    addresses: [
      {
        alias: 'Casa',
        street: 'Av. Roca',
        streetNumber: '5678',
        city: 'Tafí Viejo',
        province: 'Tucumán',
        postalCode: 'T4103',
        reference: 'Condominio El Molino',
        coordinates: { lat: -26.7333, lng: -65.2667 },
        formattedAddress: 'Av. Roca 5678, T4103 Tafí Viejo, Tucumán',
        isDefault: true,
        isValidated: true,
      },
    ],
  },
];

async function seedUsers() {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB\n');

    // Limpiar colecciones existentes
    console.log('🗑️  Limpiando usuarios y direcciones existentes...');
    await User.deleteMany({});
    await Address.deleteMany({});
    console.log('✅ Colecciones limpiadas\n');

    // Crear usuarios
    console.log('👥 Creando usuarios...');
    const createdUsers = [];
    
    for (const userData of users) {
      const user = await User.create({
        ...userData,
      });
      createdUsers.push(user);
      console.log(`   ✓ ${user.role === 'ADMIN' ? '👑' : '👤'} ${user.fullName} (${user.email})`);
    }
    console.log(`\n✅ ${createdUsers.length} usuarios creados\n`);

    // Crear direcciones
    console.log('📍 Creando direcciones...');
    let totalAddresses = 0;

    for (const addressGroup of addressesData) {
      const user = createdUsers.find(u => u.email === addressGroup.userEmail);
      if (!user) {
        console.log(`   ⚠️  Usuario no encontrado para ${addressGroup.userEmail}`);
        continue;
      }

      for (const addressData of addressGroup.addresses) {
        await Address.create({
          ...addressData,
          user: user._id,
        });
        totalAddresses++;
        console.log(`   ✓ ${addressData.alias} para ${user.fullName}`);
      }
    }
    console.log(`\n✅ ${totalAddresses} direcciones creadas\n`);

    // Resumen
    console.log('📊 RESUMEN:');
    console.log('═══════════════════════════════════════════');
    console.log(`   Usuarios totales:    ${createdUsers.length}`);
    console.log(`   - Admins:            ${createdUsers.filter(u => u.role === 'ADMIN').length}`);
    console.log(`   - Usuarios:          ${createdUsers.filter(u => u.role === 'USER').length}`);
    console.log(`   Direcciones totales: ${totalAddresses}`);
    console.log('═══════════════════════════════════════════\n');

    console.log('🔑 CREDENCIALES DE PRUEBA:');
    console.log('═══════════════════════════════════════════');
    console.log('   👑 Admin:');
    console.log('      Email:    admin@ecommerce.com');
    console.log('      Password: Admin123!');
    console.log('');
    console.log('   👤 Usuario ejemplo:');
    console.log('      Email:    maria.gonzalez@gmail.com');
    console.log('      Password: Password123!');
    console.log('═══════════════════════════════════════════\n');

    console.log('✨ Seeder completado exitosamente!\n');
  } catch (error) {
    console.error('❌ Error ejecutando seeder:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
    process.exit(0);
  }
}

// Ejecutar seeder
seedUsers();
