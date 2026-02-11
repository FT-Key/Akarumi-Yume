import mongoose, { Schema } from 'mongoose';
import { SHIPMENT_STATUS } from '../utils/constants.js';

const shipmentSchema = new Schema(
  {
    order:            { type: Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
    shippingAddress:  { type: Schema.Types.ObjectId, ref: 'Address' },
    recipient:        { firstName: String, lastName: String, dni: String, phone: String },
    status:           { type: String, enum: Object.values(SHIPMENT_STATUS), default: SHIPMENT_STATUS.PENDING },
    statusHistory:    [{
      status:   { type: String, required: true },
      location: { type: String },
      note:     { type: String },
      date:     { type: Date, default: Date.now },
    }],
    carrier:          {
      name:        { type: String },                                         // "Correo Argentino", "OCA"
      trackingNum: { type: String },
      trackingUrl: { type: String },
    },
    estimatedDelivery:{ type: Date },
    shippedAt:        { type: Date },
    deliveredAt:      { type: Date },
    package:          { weight: Number, dimensions: { length: Number, width: Number, height: Number } },
    shippingCost:     { type: Number, min: 0 },
    deliveryProof:    { type: String },                                      // URL de foto de entrega
    deliveryAttempts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Método: actualizar estado del envío
shipmentSchema.methods.updateStatus = async function (newStatus, location, note) {
  this.status = newStatus;
  this.statusHistory.push({ status: newStatus, location, note, date: new Date() });

  if (newStatus === SHIPMENT_STATUS.SHIPPED) this.shippedAt = new Date();
  if (newStatus === SHIPMENT_STATUS.DELIVERED) this.deliveredAt = new Date();

  await this.save();

  // Sincronizar estado en la orden
  const Order = mongoose.model('Order');
  const order = await Order.findById(this.order);
  if (newStatus === SHIPMENT_STATUS.SHIPPED) {
    await order.updateStatus('SHIPPED', 'Envío despachado');
  } else if (newStatus === SHIPMENT_STATUS.DELIVERED) {
    await order.updateStatus('DELIVERED', 'Entregado');
  }
};

// Método estático: crear envío desde orden
shipmentSchema.statics.createFromOrder = async function (order, address, deliveryType) {
  const today = new Date();
  const estimatedDelivery = new Date(today);
  estimatedDelivery.setDate(today.getDate() + (deliveryType.estimatedDays?.max || 7));

  return this.create({
    order:            order._id,
    shippingAddress:  address._id,
    recipient: {
      firstName: order.customerData.firstName,
      lastName:  order.customerData.lastName,
      dni:       order.customerData.dni,
      phone:     order.customerData.phone,
    },
    estimatedDelivery,
    shippingCost: deliveryType.price,
  });
};

export default mongoose.models.Shipment || mongoose.model('Shipment', shipmentSchema);
