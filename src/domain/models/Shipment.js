import mongoose from 'mongoose';

const shipmentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: [true, 'La orden es requerida'],
      unique: true, // Una orden solo puede tener un envío
      index: true
    },
    // Dirección de envío (snapshot de Address)
    shippingAddress: {
      street: {
        type: String,
        required: true
      },
      streetNumber: {
        type: String,
        required: true
      },
      floor: String,
      apartment: String,
      city: {
        type: String,
        required: true
      },
      province: {
        type: String,
        required: true
      },
      postalCode: {
        type: String,
        required: true
      },
      country: {
        type: String,
        default: 'Argentina'
      },
      reference: String,
      coordinates: {
        lat: Number,
        lng: Number
      },
      fullAddress: String
    },
    // Datos del destinatario
    recipient: {
      firstName: {
        type: String,
        required: true
      },
      lastName: {
        type: String,
        required: true
      },
      phone: {
        type: String,
        required: true
      },
      email: String,
      dni: String
    },
    // Estado del envío
    status: {
      type: String,
      enum: [
        'PENDING',           // Pendiente de preparación
        'PROCESSING',        // En preparación
        'READY_TO_SHIP',     // Listo para enviar
        'SHIPPED',           // Enviado
        'IN_TRANSIT',        // En tránsito
        'OUT_FOR_DELIVERY',  // En reparto
        'DELIVERED',         // Entregado
        'FAILED_DELIVERY',   // Intento de entrega fallido
        'RETURNED',          // Devuelto
        'CANCELLED'          // Cancelado
      ],
      default: 'PENDING',
      index: true
    },
    // Historial de estados
    statusHistory: [{
      status: {
        type: String,
        enum: [
          'PENDING',
          'PROCESSING',
          'READY_TO_SHIP',
          'SHIPPED',
          'IN_TRANSIT',
          'OUT_FOR_DELIVERY',
          'DELIVERED',
          'FAILED_DELIVERY',
          'RETURNED',
          'CANCELLED'
        ]
      },
      date: {
        type: Date,
        default: Date.now
      },
      location: String,
      note: String
    }],
    // Información del transportista
    carrier: {
      name: String,      // Nombre de la empresa de envío
      service: String,   // Tipo de servicio (standard, express, etc.)
      trackingNumber: {  // Número de seguimiento
        type: String,
        index: true
      },
      trackingUrl: String // URL para tracking externo
    },
    // Fechas importantes
    estimatedDeliveryDate: {
      min: Date,
      max: Date
    },
    shippedAt: Date,
    deliveredAt: Date,
    // Información del paquete
    package: {
      weight: Number,        // Peso en kg
      dimensions: {
        length: Number,
        width: Number,
        height: Number,
        unit: {
          type: String,
          default: 'cm'
        }
      },
      itemsCount: Number,    // Cantidad de items
      description: String    // Descripción del contenido
    },
    // Costo de envío
    shippingCost: {
      type: Number,
      required: true,
      min: [0, 'El costo de envío no puede ser negativo']
    },
    // Proof of delivery
    deliveryProof: {
      signature: String,        // URL de imagen de firma
      photo: String,            // URL de foto del paquete entregado
      receivedBy: String,       // Nombre de quien recibió
      notes: String
    },
    // Intentos de entrega
    deliveryAttempts: [{
      attemptDate: {
        type: Date,
        default: Date.now
      },
      status: String,
      reason: String,
      note: String
    }],
    // Notas internas
    internalNotes: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Índices compuestos
shipmentSchema.index({ order: 1 });
shipmentSchema.index({ status: 1, createdAt: -1 });
shipmentSchema.index({ 'carrier.trackingNumber': 1 });

// Método para actualizar estado con tracking
shipmentSchema.methods.updateStatus = function (newStatus, location = '', note = '') {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    date: new Date(),
    location,
    note
  });
  
  // Actualizar fechas según estado
  if (newStatus === 'SHIPPED' && !this.shippedAt) {
    this.shippedAt = new Date();
  }
  
  if (newStatus === 'DELIVERED' && !this.deliveredAt) {
    this.deliveredAt = new Date();
  }
  
  return this.save();
};

// Método para registrar intento de entrega
shipmentSchema.methods.addDeliveryAttempt = function (status, reason = '', note = '') {
  this.deliveryAttempts.push({
    attemptDate: new Date(),
    status,
    reason,
    note
  });
  
  if (status === 'failed') {
    this.status = 'FAILED_DELIVERY';
  }
  
  return this.save();
};

// Método para crear envío desde orden y dirección
shipmentSchema.statics.createFromOrder = async function (order, address, deliveryType) {
  const User = mongoose.model('User');
  
  // Obtener datos del usuario
  const user = await User.findById(order.user);
  
  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  
  // Calcular fecha estimada de entrega
  const today = new Date();
  const estimatedMin = new Date(today);
  const estimatedMax = new Date(today);
  
  estimatedMin.setDate(today.getDate() + (deliveryType.estimatedDays?.min || 3));
  estimatedMax.setDate(today.getDate() + (deliveryType.estimatedDays?.max || 7));
  
  // Crear envío
  const shipment = new this({
    order: order._id,
    shippingAddress: {
      street: address.street,
      streetNumber: address.streetNumber,
      floor: address.floor,
      apartment: address.apartment,
      city: address.city,
      province: address.province,
      postalCode: address.postalCode,
      country: address.country,
      reference: address.reference,
      coordinates: address.coordinates,
      fullAddress: address.fullAddress
    },
    recipient: {
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      email: user.email,
      dni: user.dni
    },
    shippingCost: order.shippingCost,
    estimatedDeliveryDate: {
      min: estimatedMin,
      max: estimatedMax
    },
    package: {
      itemsCount: order.items?.length || 0,
      description: `Orden ${order.orderNumber}`
    }
  });
  
  await shipment.save();
  return shipment;
};

// Virtual para obtener días hasta entrega estimada
shipmentSchema.virtual('daysUntilDelivery').get(function () {
  if (!this.estimatedDeliveryDate?.max) return null;
  
  const today = new Date();
  const deliveryDate = new Date(this.estimatedDeliveryDate.max);
  const diffTime = deliveryDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
});

const Shipment = mongoose.models.Shipment || mongoose.model('Shipment', shipmentSchema);

export default Shipment;
