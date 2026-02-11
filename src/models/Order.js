import mongoose, { Schema } from 'mongoose';
import { ORDER_STATUS } from '../utils/constants.js';
import { generateOrderNumber } from '../utils/orderNumber.js';

const orderSchema = new Schema(
  {
    orderNumber:   { type: String, unique: true, default: generateOrderNumber },
    user:          { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status:        { type: String, enum: Object.values(ORDER_STATUS), default: ORDER_STATUS.PENDING },
    statusHistory: [{                                                        // Historial inmutable
      status: { type: String, required: true },
      note:   { type: String },
      date:   { type: Date, default: Date.now },
    }],
    deliveryType:  { type: Schema.Types.ObjectId, ref: 'DeliveryType', required: true },
    shippingAddress: { type: Schema.Types.ObjectId, ref: 'Address' },        // null si es PICKUP
    customerData:  {                                                         // Snapshot del cliente al momento de la compra
      firstName: String, lastName: String,
      email: String, phone: String, dni: String,
    },
    subtotal:      { type: Number, required: true, min: 0 },
    shippingCost:  { type: Number, default: 0, min: 0 },
    discount:      { type: Number, default: 0, min: 0 },
    tax:           { type: Number, default: 0, min: 0 },
    total:         { type: Number, required: true, min: 0 },
    couponCode:    { type: String, trim: true },
    customerNotes: { type: String, trim: true },
    paidAt:        { type: Date },
    shippedAt:     { type: Date },
  },
  { timestamps: true }
);

orderSchema.index({ orderNumber: 1 }, { unique: true });
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });

// Virtual: items de la orden
orderSchema.virtual('items', {
  ref: 'OrderItem',
  localField: '_id',
  foreignField: 'order',
});

// Virtual: pago
orderSchema.virtual('payment', {
  ref: 'Payment',
  localField: '_id',
  foreignField: 'order',
  justOne: true,
});

// Virtual: envío
orderSchema.virtual('shipment', {
  ref: 'Shipment',
  localField: '_id',
  foreignField: 'order',
  justOne: true,
});

// Método: agregar entrada al historial y cambiar estado
orderSchema.methods.updateStatus = async function (newStatus, note) {
  this.status = newStatus;
  this.statusHistory.push({ status: newStatus, note, date: new Date() });
  if (newStatus === ORDER_STATUS.PAID) this.paidAt = new Date();
  if (newStatus === ORDER_STATUS.SHIPPED) this.shippedAt = new Date();
  return this.save();
};

// Método: calcular totales desde los items
orderSchema.methods.calculateTotals = function () {
  const subtotal = this.items.reduce((sum, item) => sum + item.subtotal, 0);
  this.subtotal = subtotal;
  this.total = subtotal + this.shippingCost - this.discount + this.tax;
};

// Método: verificar si puede cancelarse
orderSchema.methods.canBeCancelled = function () {
  return [ORDER_STATUS.PENDING, ORDER_STATUS.PAYMENT_PENDING].includes(this.status);
};

orderSchema.set('toJSON', { virtuals: true });

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
