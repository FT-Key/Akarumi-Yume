import mongoose, { Schema } from 'mongoose';
import { PAYMENT_STATUS } from '../utils/constants.js';

const paymentSchema = new Schema(
  {
    order:       { type: Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
    mercadopago: {
      preferenceId:      { type: String },
      paymentId:         { type: String },
      externalReference: { type: String },
      status:            { type: String },                                   // Estado según MP
      paymentType:       { type: String },                                   // credit_card, account_money, etc.
    },
    amount:          { type: Number, required: true },
    currency:        { type: String, default: 'ARS' },
    status:          { type: String, enum: Object.values(PAYMENT_STATUS), default: PAYMENT_STATUS.PENDING },
    merchantFee:     { type: Number },
    netAmount:       { type: Number },
    initPoint:       { type: String },                                       // URL de checkout MP
    sandboxInitPoint:{ type: String },
    paidAt:          { type: Date },
    payer:           { email: String, id: String },
    webhookData:     [{ type: Schema.Types.Mixed }],                         // Log de webhooks recibidos
  },
  { timestamps: true }
);

paymentSchema.index({ 'mercadopago.preferenceId': 1 });
paymentSchema.index({ 'mercadopago.paymentId': 1 });
paymentSchema.index({ order: 1 }, { unique: true });

// Método: actualizar desde webhook
paymentSchema.methods.updateFromWebhook = async function (webhookData) {
  this.webhookData.push({ ...webhookData, receivedAt: new Date() });

  if (webhookData.type === 'payment') {
    return true; // Señal para hacer fetch completo del pago en MP
  }
  return false;
};

// Método: actualizar desde datos completos del pago de MP
paymentSchema.methods.updateFromPaymentData = async function (paymentData) {
  const statusMap = {
    approved: PAYMENT_STATUS.PAID,
    pending:  PAYMENT_STATUS.PENDING,
    rejected: PAYMENT_STATUS.FAILED,
    cancelled:PAYMENT_STATUS.CANCELLED,
    refunded: PAYMENT_STATUS.REFUNDED,
  };

  this.mercadopago.paymentId  = paymentData.id?.toString();
  this.mercadopago.status     = paymentData.status;
  this.mercadopago.paymentType= paymentData.payment_method_id;
  this.status                 = statusMap[paymentData.status] || this.status;
  this.merchantFee            = paymentData.fee_detail?.find(f => f.type === 'merchant')?.amount;
  this.netAmount              = paymentData.transaction_amount_refunded
    ? paymentData.transaction_amount - paymentData.transaction_amount_refunded
    : paymentData.transaction_amount;

  if (paymentData.payer) {
    this.payer = { email: paymentData.payer.email, id: paymentData.payer.id?.toString() };
  }

  if (this.status === PAYMENT_STATUS.PAID) this.paidAt = new Date();

  await this.save();

  // Si se pagó, actualizar estado de la orden
  if (this.status === PAYMENT_STATUS.PAID) {
    const Order = mongoose.model('Order');
    const order = await Order.findById(this.order);
    await order.updateStatus('PAID', 'Pago confirmado por MercadoPago');
  }
};

export default mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
