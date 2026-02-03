import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    // Número de orden único y legible
    orderNumber: {
      type: String,
      unique: true,
      required: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El usuario es requerido'],
      index: true
    },
    // Estado de la orden
    status: {
      type: String,
      enum: [
        'PENDING',          // Pendiente de pago
        'PAYMENT_PENDING',  // Pago en proceso
        'PAID',             // Pagado
        'PROCESSING',       // En preparación
        'READY_FOR_PICKUP', // Listo para retirar (solo PICKUP)
        'SHIPPED',          // Enviado (solo DELIVERY)
        'DELIVERED',        // Entregado
        'CANCELLED',        // Cancelado
        'REFUNDED'          // Reembolsado
      ],
      default: 'PENDING',
      index: true
    },
    // Historial de cambios de estado
    statusHistory: [{
      status: {
        type: String,
        enum: [
          'PENDING',
          'PAYMENT_PENDING',
          'PAID',
          'PROCESSING',
          'READY_FOR_PICKUP',
          'SHIPPED',
          'DELIVERED',
          'CANCELLED',
          'REFUNDED'
        ]
      },
      date: {
        type: Date,
        default: Date.now
      },
      note: String
    }],
    // Tipo de entrega
    deliveryType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DeliveryType',
      required: [true, 'El tipo de entrega es requerido']
    },
    // Dirección de envío (solo si es DELIVERY)
    shippingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
      default: null
    },
    // Datos del cliente en el momento de la orden (snapshot)
    customerData: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      dni: String
    },
    // Montos
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'El subtotal no puede ser negativo']
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: [0, 'El costo de envío no puede ser negativo']
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'El descuento no puede ser negativo']
    },
    tax: {
      type: Number,
      default: 0,
      min: [0, 'El impuesto no puede ser negativo']
    },
    total: {
      type: Number,
      required: true,
      min: [0, 'El total no puede ser negativo']
    },
    // Código de descuento aplicado
    couponCode: {
      type: String,
      trim: true,
      uppercase: true,
      default: null
    },
    // Notas del cliente
    customerNotes: {
      type: String,
      trim: true,
      maxlength: [500, 'Las notas no pueden exceder 500 caracteres']
    },
    // Notas internas (admin)
    internalNotes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Las notas internas no pueden exceder 1000 caracteres']
    },
    // Fechas importantes
    paidAt: Date,
    shippedAt: Date,
    deliveredAt: Date,
    cancelledAt: Date,
    // Motivo de cancelación
    cancellationReason: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Índices compuestos
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });

// Virtual para items de la orden
orderSchema.virtual('items', {
  ref: 'OrderItem',
  localField: '_id',
  foreignField: 'order'
});

// Virtual para pago
orderSchema.virtual('payment', {
  ref: 'Payment',
  localField: '_id',
  foreignField: 'order',
  justOne: true
});

// Virtual para envío
orderSchema.virtual('shipment', {
  ref: 'Shipment',
  localField: '_id',
  foreignField: 'order',
  justOne: true
});

// Middleware para generar número de orden único
orderSchema.pre('save', async function (next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    
    // Buscar el último número de orden del mes
    const lastOrder = await mongoose.model('Order')
      .findOne({
        orderNumber: new RegExp(`^ORD-${year}${month}`)
      })
      .sort({ orderNumber: -1 });
    
    let sequential = 1;
    if (lastOrder) {
      const lastSequential = parseInt(lastOrder.orderNumber.split('-')[2]);
      sequential = lastSequential + 1;
    }
    
    this.orderNumber = `ORD-${year}${month}-${sequential.toString().padStart(5, '0')}`;
  }
  next();
});

// Método para cambiar estado y registrar en historial
orderSchema.methods.updateStatus = function (newStatus, note = '') {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    date: new Date(),
    note
  });
  
  // Actualizar fechas según estado
  switch (newStatus) {
    case 'PAID':
      this.paidAt = new Date();
      break;
    case 'SHIPPED':
      this.shippedAt = new Date();
      break;
    case 'DELIVERED':
      this.deliveredAt = new Date();
      break;
    case 'CANCELLED':
      this.cancelledAt = new Date();
      break;
  }
  
  return this.save();
};

// Método para verificar si la orden puede ser cancelada
orderSchema.methods.canBeCancelled = function () {
  return ['PENDING', 'PAYMENT_PENDING', 'PAID', 'PROCESSING'].includes(this.status);
};

// Método para calcular totales
orderSchema.methods.calculateTotals = function () {
  // Asume que los items ya están cargados
  if (!this.populated('items')) {
    throw new Error('Los items deben estar poblados para calcular totales');
  }
  
  this.subtotal = this.items.reduce((sum, item) => sum + item.subtotal, 0);
  this.total = this.subtotal + this.shippingCost - this.discount + this.tax;
  
  return this;
};

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;
