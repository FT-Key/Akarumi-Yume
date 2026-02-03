import mongoose from 'mongoose';

const deliveryTypeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'El tipo de entrega es requerido'],
      enum: {
        values: ['PICKUP', 'DELIVERY'],
        message: 'El tipo debe ser PICKUP o DELIVERY'
      },
      uppercase: true
    },
    name: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    // Costo de envío (0 para pickup)
    price: {
      type: Number,
      required: [true, 'El precio es requerido'],
      min: [0, 'El precio no puede ser negativo'],
      default: 0
    },
    // Tiempo estimado de entrega
    estimatedDays: {
      min: {
        type: Number,
        min: [0, 'Los días mínimos no pueden ser negativos'],
        default: 0
      },
      max: {
        type: Number,
        min: [0, 'Los días máximos no pueden ser negativos'],
        default: 0
      }
    },
    // Dirección de pickup (solo si es PICKUP)
    pickupAddress: {
      street: String,
      streetNumber: String,
      city: String,
      province: String,
      postalCode: String,
      reference: String,
      coordinates: {
        lat: Number,
        lng: Number
      }
    },
    // Horarios de atención (solo si es PICKUP)
    businessHours: {
      monday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
      tuesday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
      wednesday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
      thursday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
      friday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
      saturday: { open: String, close: String, isOpen: { type: Boolean, default: false } },
      sunday: { open: String, close: String, isOpen: { type: Boolean, default: false } }
    },
    // Estado
    isActive: {
      type: Boolean,
      default: true
    },
    // Orden de visualización
    order: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Índices
deliveryTypeSchema.index({ type: 1, isActive: 1 });
deliveryTypeSchema.index({ order: 1 });

// Virtual para dirección completa de pickup
deliveryTypeSchema.virtual('fullPickupAddress').get(function () {
  if (this.type !== 'PICKUP' || !this.pickupAddress) return null;
  
  const addr = this.pickupAddress;
  return `${addr.street} ${addr.streetNumber}, ${addr.city}, ${addr.province}, ${addr.postalCode}`;
});

// Método para verificar si está abierto en un día/hora específica
deliveryTypeSchema.methods.isOpenAt = function (dayOfWeek, time) {
  if (this.type !== 'PICKUP' || !this.businessHours) return false;
  
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayName = days[dayOfWeek];
  const hours = this.businessHours[dayName];
  
  if (!hours || !hours.isOpen) return false;
  
  // Comparar tiempo (formato HH:MM)
  return time >= hours.open && time <= hours.close;
};

// Validación: PICKUP debe tener dirección
deliveryTypeSchema.pre('save', function (next) {
  if (this.type === 'PICKUP' && !this.pickupAddress) {
    return next(new Error('Las opciones de PICKUP deben tener una dirección'));
  }
  
  if (this.type === 'PICKUP') {
    this.price = 0; // PICKUP siempre es gratis
  }
  
  next();
});

/**
 * Ejemplo de uso:
 * 
 * PICKUP:
 * {
 *   type: 'PICKUP',
 *   name: 'Retiro en local',
 *   description: 'Retirá tu pedido en nuestro local',
 *   price: 0,
 *   estimatedDays: { min: 1, max: 2 },
 *   pickupAddress: {
 *     street: 'Av. San Martín',
 *     streetNumber: '1234',
 *     city: 'San Miguel de Tucumán',
 *     province: 'Tucumán',
 *     postalCode: 'T4000',
 *     reference: 'Local con cartel rojo'
 *   },
 *   businessHours: {
 *     monday: { open: '09:00', close: '18:00', isOpen: true },
 *     // ...
 *   }
 * }
 * 
 * DELIVERY:
 * {
 *   type: 'DELIVERY',
 *   name: 'Envío a domicilio',
 *   description: 'Recibí tu pedido en tu casa',
 *   price: 500,
 *   estimatedDays: { min: 3, max: 7 }
 * }
 */

const DeliveryType = mongoose.models.DeliveryType || 
  mongoose.model('DeliveryType', deliveryTypeSchema);

export default DeliveryType;
