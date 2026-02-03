import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: [true, 'La orden es requerida'],
      unique: true, // Una orden solo puede tener un pago
      index: true
    },
    // Datos de MercadoPago
    mercadopago: {
      // ID de la preferencia de pago
      preferenceId: {
        type: String,
        required: true,
        index: true
      },
      // ID del pago (cuando se completa)
      paymentId: {
        type: String,
        index: true,
        sparse: true
      },
      // ID de la colección (merchant_order_id)
      collectionId: String,
      // ID del comerciante externo
      externalReference: String,
      // Status de MercadoPago
      status: {
        type: String,
        enum: [
          'pending',          // Pendiente
          'approved',         // Aprobado
          'authorized',       // Autorizado
          'in_process',       // En proceso
          'in_mediation',     // En mediación
          'rejected',         // Rechazado
          'cancelled',        // Cancelado
          'refunded',         // Reembolsado
          'charged_back'      // Contracargo
        ],
        default: 'pending',
        index: true
      },
      // Detalle del status
      statusDetail: String,
      // Tipo de pago
      paymentType: {
        type: String,
        enum: [
          'credit_card',
          'debit_card',
          'bank_transfer',
          'ticket',
          'atm',
          'digital_currency',
          'digital_wallet',
          'voucher_card',
          'crypto_transfer'
        ]
      },
      // Método de pago específico (visa, master, etc.)
      paymentMethod: String,
      // Cuotas
      installments: {
        type: Number,
        default: 1
      }
    },
    // Montos
    amount: {
      type: Number,
      required: [true, 'El monto es requerido'],
      min: [0, 'El monto no puede ser negativo']
    },
    currency: {
      type: String,
      default: 'ARS',
      enum: ['ARS', 'USD']
    },
    // Fees de MercadoPago (descontado del monto)
    merchantFee: {
      type: Number,
      default: 0
    },
    netAmount: {
      // Monto neto después de fees
      type: Number,
      default: 0
    },
    // URLs de MercadoPago
    initPoint: {
      // URL para redirección
      type: String
    },
    sandboxInitPoint: {
      // URL de sandbox
      type: String
    },
    // Fechas importantes
    paidAt: Date,
    refundedAt: Date,
    // Datos del pagador
    payer: {
      email: String,
      identification: {
        type: String,
        number: String
      },
      firstName: String,
      lastName: String
    },
    // Webhook data completo (para debugging)
    webhookData: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    // Intentos de notificación del webhook
    webhookAttempts: [{
      receivedAt: {
        type: Date,
        default: Date.now
      },
      status: String,
      data: mongoose.Schema.Types.Mixed
    }]
  },
  {
    timestamps: true
  }
);

// Índices compuestos
paymentSchema.index({ 'mercadopago.preferenceId': 1 });
paymentSchema.index({ 'mercadopago.paymentId': 1 });
paymentSchema.index({ 'mercadopago.status': 1 });
paymentSchema.index({ order: 1 });

// Método para actualizar con datos del webhook de MercadoPago
paymentSchema.methods.updateFromWebhook = async function (webhookData) {
  this.webhookAttempts.push({
    receivedAt: new Date(),
    status: webhookData.action || webhookData.type,
    data: webhookData
  });
  
  // Actualizar datos principales
  if (webhookData.data?.id) {
    this.mercadopago.paymentId = webhookData.data.id;
  }
  
  // Guardar datos completos del webhook
  this.webhookData = webhookData;
  
  await this.save();
  
  // Si el webhook contiene el ID del pago, obtener detalles completos
  if (webhookData.data?.id) {
    return true; // Indicar que se debe hacer fetch del pago
  }
  
  return false;
};

// Método para actualizar con datos completos del pago de MercadoPago
paymentSchema.methods.updateFromPaymentData = async function (paymentData) {
  const Order = mongoose.model('Order');
  
  // Actualizar datos de MercadoPago
  this.mercadopago.paymentId = paymentData.id;
  this.mercadopago.status = paymentData.status;
  this.mercadopago.statusDetail = paymentData.status_detail;
  this.mercadopago.paymentType = paymentData.payment_type_id;
  this.mercadopago.paymentMethod = paymentData.payment_method_id;
  this.mercadopago.installments = paymentData.installments;
  this.mercadopago.collectionId = paymentData.order?.id || null;
  
  // Actualizar montos
  this.amount = paymentData.transaction_amount;
  this.currency = paymentData.currency_id;
  
  if (paymentData.fee_details) {
    this.merchantFee = paymentData.fee_details.reduce((sum, fee) => sum + fee.amount, 0);
  }
  this.netAmount = this.amount - this.merchantFee;
  
  // Actualizar datos del pagador
  if (paymentData.payer) {
    this.payer = {
      email: paymentData.payer.email,
      identification: {
        type: paymentData.payer.identification?.type,
        number: paymentData.payer.identification?.number
      },
      firstName: paymentData.payer.first_name,
      lastName: paymentData.payer.last_name
    };
  }
  
  // Actualizar fecha de pago si fue aprobado
  if (paymentData.status === 'approved' && !this.paidAt) {
    this.paidAt = paymentData.date_approved || new Date();
  }
  
  await this.save();
  
  // Actualizar estado de la orden
  const order = await Order.findById(this.order);
  if (order) {
    let newOrderStatus;
    
    switch (paymentData.status) {
      case 'approved':
        newOrderStatus = 'PAID';
        break;
      case 'pending':
      case 'in_process':
      case 'authorized':
        newOrderStatus = 'PAYMENT_PENDING';
        break;
      case 'rejected':
      case 'cancelled':
        newOrderStatus = 'CANCELLED';
        break;
      case 'refunded':
        newOrderStatus = 'REFUNDED';
        break;
      default:
        newOrderStatus = order.status;
    }
    
    if (newOrderStatus !== order.status) {
      await order.updateStatus(
        newOrderStatus,
        `Actualización automática desde MercadoPago: ${paymentData.status_detail}`
      );
    }
  }
  
  return this;
};

// Método para verificar si el pago fue exitoso
paymentSchema.methods.isSuccessful = function () {
  return this.mercadopago.status === 'approved';
};

const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);

export default Payment;
