import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { DeliveryType } from '../src/models/index.js';

dotenv.config();

const deliveryTypes = [
  {
    type: 'DELIVERY',
    name: 'Envío a domicilio',
    description: 'Recibí tu pedido en la comodidad de tu hogar',
    price: 1500,
    estimatedDays: { min: 3, max: 7 },
    isActive: true,
    order: 1
  },
  {
    type: 'DELIVERY',
    name: 'Envío Express',
    description: 'Recibí tu pedido en 24-48hs',
    price: 3000,
    estimatedDays: { min: 1, max: 2 },
    isActive: true,
    order: 2
  },
  {
    type: 'PICKUP',
    name: 'Retiro en tienda',
    description: 'Retirá tu pedido en nuestro local',
    price: 0,
    estimatedDays: { min: 0, max: 1 },
    pickupAddress: {
      street: 'Av. Corrientes',
      streetNumber: '1234',
      city: 'Buenos Aires',
      province: 'CABA',
      postalCode: '1043',
      reference: 'Entre callao y Uruguay',
      coordinates: { lat: -34.603722, lng: -58.381592 }
    },
    businessHours: {
      monday: { open: '09:00', close: '18:00', isOpen: true },
      tuesday: { open: '09:00', close: '18:00', isOpen: true },
      wednesday: { open: '09:00', close: '18:00', isOpen: true },
      thursday: { open: '09:00', close: '18:00', isOpen: true },
      friday: { open: '09:00', close: '18:00', isOpen: true },
      saturday: { open: '10:00', close: '14:00', isOpen: true },
      sunday: { isOpen: false }
    },
    isActive: true,
    order: 3
  }
];

async function seedDeliveryTypes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Limpiar tipos de entrega existentes
    await DeliveryType.deleteMany({});
    console.log('🗑️  Tipos de entrega eliminados');

    // Crear nuevos tipos de entrega
    const created = await DeliveryType.insertMany(deliveryTypes);
    console.log(`✅ ${created.length} tipos de entrega creados:`);
    created.forEach(dt => {
      console.log(`   - ${dt.name} (${dt.type}) - $${dt.price}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedDeliveryTypes();