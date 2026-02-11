#!/bin/bash
# =============================================================
# E-Commerce Next.js 16 — Setup de estructura de proyecto
# Ejecutar desde la raíz del proyecto (donde están src/ y public/)
# Uso: bash setup-structure.sh
# =============================================================

echo "🚀 Creando estructura de proyecto E-Commerce..."
echo ""

# ─── CARPETAS PRINCIPALES ────────────────────────────────────
mkdir -p src/models
mkdir -p src/controllers
mkdir -p src/services
mkdir -p src/lib
mkdir -p src/middleware
mkdir -p src/config
mkdir -p src/utils

# ─── RUTAS API (Next.js App Router) ──────────────────────────
# Users
mkdir -p src/app/api/users
mkdir -p "src/app/api/users/[id]"
mkdir -p "src/app/api/users/[id]/addresses"
mkdir -p "src/app/api/users/[id]/orders"

# Addresses
mkdir -p src/app/api/addresses
mkdir -p "src/app/api/addresses/[id]"
mkdir -p "src/app/api/addresses/[id]/validate"

# Products
mkdir -p src/app/api/products
mkdir -p "src/app/api/products/[id]"
mkdir -p "src/app/api/products/[id]/images"
mkdir -p "src/app/api/products/[id]/images/[imageId]"
mkdir -p "src/app/api/products/[id]/characteristics"
mkdir -p "src/app/api/products/[id]/characteristics/[charId]"

# Categories
mkdir -p src/app/api/categories
mkdir -p "src/app/api/categories/[id]"
mkdir -p "src/app/api/categories/[id]/products"

# Orders
mkdir -p src/app/api/orders
mkdir -p "src/app/api/orders/[id]"

# Payments
mkdir -p src/app/api/payments
mkdir -p "src/app/api/payments/[id]"
mkdir -p src/app/api/payments/webhook

# Shipments
mkdir -p "src/app/api/shipments/[id]"

# ─── MODELOS (Mongoose) ──────────────────────────────────────
cat > src/models/User.js << 'USERMODEL'
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new Schema(
  {
    firstName:  { type: String, required: true, trim: true },
    lastName:   { type: String, required: true, trim: true },
    email:      { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:   { type: String, required: true, minlength: 8 },
    phone:      { type: String, trim: true },
    dni:        { type: String, required: true, unique: true, trim: true, match: /^\d{7,8}$/ },
    role:       { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
    isActive:   { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Hash password antes de guardar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Método para comparar passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Virtual: nombre completo
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// No enviar password en responses
userSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.models.User || mongoose.model('User', userSchema);
USERMODEL

cat > src/models/Address.js << 'ADDRESSMODEL'
import mongoose, { Schema } from 'mongoose';
import { PROVINCES } from '../utils/constants.js';

const addressSchema = new Schema(
  {
    user:             { type: Schema.Types.ObjectId, ref: 'User', required: true },
    alias:            { type: String, trim: true },                          // "Casa", "Oficina"
    street:           { type: String, required: true, trim: true },
    streetNumber:     { type: String, required: true, trim: true },
    floor:            { type: String, trim: true },
    apartment:        { type: String, trim: true },
    city:             { type: String, required: true, trim: true },
    province:         { type: String, required: true, enum: PROVINCES },
    postalCode:       { type: String, required: true, match: /^[A-Z]?\d{4}[A-Z]?$/ },
    country:          { type: String, default: 'Argentina' },
    reference:        { type: String, trim: true },                          // "Edificio blanco"
    coordinates:      { lat: Number, lng: Number },                          // De Google Maps
    formattedAddress: { type: String },                                      // Dirección formattada por Google
    googlePlaceId:    { type: String },                                      // Place ID de Google
    isDefault:        { type: Boolean, default: false },
    isValidated:      { type: Boolean, default: false },                     // Validada con Google Maps
  },
  { timestamps: true }
);

// Índices compuestos
addressSchema.index({ user: 1, isDefault: 1 });
addressSchema.index({ user: 1, createdAt: -1 });

// Solo una dirección default por usuario
addressSchema.pre('save', async function (next) {
  if (this.isDefault && this.isModified('isDefault')) {
    await mongoose.model('Address').updateMany(
      { user: this.user, _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
  next();
});

// Helper para generar query de Google Maps
addressSchema.methods.getGoogleMapsQuery = function () {
  const parts = [
    `${this.street} ${this.streetNumber}`,
    this.floor ? `Piso ${this.floor}` : null,
    this.apartment ? `Apto ${this.apartment}` : null,
    this.city,
    this.province,
    this.postalCode,
    this.country,
  ];
  return parts.filter(Boolean).join(', ');
};

export default mongoose.models.Address || mongoose.model('Address', addressSchema);
ADDRESSMODEL

cat > src/models/Category.js << 'CATEGORYMODEL'
import mongoose, { Schema } from 'mongoose';
import { slugify } from '../utils/slugify.js';

const categorySchema = new Schema(
  {
    name:        { type: String, required: true, trim: true },
    slug:        { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, trim: true },
    image:       { type: String },                                           // URL de imagen
    parent:      { type: Schema.Types.ObjectId, ref: 'Category', default: null }, // Self-reference (subcategorías)
    isActive:    { type: Boolean, default: true },
    order:       { type: Number, default: 0 },                              // Orden de visualización
  },
  { timestamps: true }
);

// Auto-generar slug
categorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name);
  }
  next();
});

// Virtual: categorías hijas
categorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent',
});

// Virtual: productos de la categoría
categorySchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
});

export default mongoose.models.Category || mongoose.model('Category', categorySchema);
CATEGORYMODEL

cat > src/models/Product.js << 'PRODUCTMODEL'
import mongoose, { Schema } from 'mongoose';
import { slugify } from '../utils/slugify.js';

const productSchema = new Schema(
  {
    name:             { type: String, required: true, trim: true },
    slug:             { type: String, required: true, unique: true, lowercase: true },
    description:      { type: String, trim: true },
    shortDescription:{ type: String, trim: true },
    price:            { type: Number, required: true, min: 0 },
    compareAtPrice:   { type: Number, min: 0 },                             // Precio tachado
    stock:            { type: Number, required: true, min: 0, default: 0 },
    sku:              { type: String, unique: true, sparse: true, trim: true },
    category:         { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    trackInventory:   { type: Boolean, default: true },
    weight:           { type: Number },                                     // En kg
    dimensions:       { length: Number, width: Number, height: Number, unit: { type: String, default: 'cm' } },
    isActive:         { type: Boolean, default: true },
    isFeatured:       { type: Boolean, default: false },
    tags:             [{ type: String, lowercase: true }],
    averageRating:    { type: Number, default: 0, min: 0, max: 5 },
  },
  { timestamps: true }
);

// Índices
productSchema.index({ slug: 1 }, { unique: true });
productSchema.index({ sku: 1 }, { unique: true, sparse: true });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });  // Text search

// Auto-generar slug
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name);
  }
  next();
});

// Virtuals: relaciones
productSchema.virtual('images', {
  ref: 'ProductImage',
  localField: '_id',
  foreignField: 'product',
});

productSchema.virtual('characteristics', {
  ref: 'ProductCharacteristic',
  localField: '_id',
  foreignField: 'product',
});

// Virtual: porcentaje de descuento
productSchema.virtual('discountPercentage').get(function () {
  if (!this.compareAtPrice || this.compareAtPrice <= this.price) return 0;
  return Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
});

// Virtual: disponibilidad
productSchema.virtual('isAvailable').get(function () {
  if (!this.trackInventory) return true;
  return this.stock > 0;
});

productSchema.set('toJSON', { virtuals: true });

export default mongoose.models.Product || mongoose.model('Product', productSchema);
PRODUCTMODEL

cat > src/models/ProductImage.js << 'PRODUCTIMAGEMODEL'
import mongoose, { Schema } from 'mongoose';

const productImageSchema = new Schema(
  {
    product:     { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    url:         { type: String, required: true },                          // URL pública (Firebase)
    storagePath: { type: String, required: true },                         // Path en Firebase Storage
    altText:     { type: String, trim: true },
    isPrimary:   { type: Boolean, default: false },                        // Imagen principal
    order:       { type: Number, default: 0 },                             // Orden en galería
    dimensions:  { width: Number, height: Number },
    fileSize:    { type: Number },                                         // En bytes
  },
  { timestamps: true }
);

productImageSchema.index({ product: 1, isPrimary: 1 });
productImageSchema.index({ product: 1, order: 1 });

// Solo una imagen primary por producto
productImageSchema.pre('save', async function (next) {
  if (this.isPrimary && this.isModified('isPrimary')) {
    await mongoose.model('ProductImage').updateMany(
      { product: this.product, _id: { $ne: this._id } },
      { isPrimary: false }
    );
  }
  next();
});

export default mongoose.models.ProductImage || mongoose.model('ProductImage', productImageSchema);
PRODUCTIMAGEMODEL

cat > src/models/ProductCharacteristic.js << 'PRODUCTCHARMODEL'
import mongoose, { Schema } from 'mongoose';

const VALUE_TYPES = ['text', 'number', 'boolean', 'array', 'color'];

const productCharacteristicSchema = new Schema(
  {
    product:      { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    key:          { type: String, required: true, trim: true, lowercase: true }, // "color", "material"
    label:        { type: String, required: true, trim: true },                  // "Color", "Material"
    value:        { type: Schema.Types.Mixed, required: true },                  // Polimórfico: string, number, boolean, array
    valueType:    { type: String, enum: VALUE_TYPES, required: true },
    unit:         { type: String, trim: true },                                  // "cm", "kg" (solo si es number)
    order:        { type: Number, default: 0 },
    isFeatured:   { type: Boolean, default: false },                             // Se muestra en highlights
    isFilterable: { type: Boolean, default: false },                             // Se puede usar como filtro
  },
  { timestamps: true }
);

// Combinación única: un producto no puede tener dos veces la misma key
productCharacteristicSchema.index({ product: 1, key: 1 }, { unique: true });

export default mongoose.models.ProductCharacteristic ||
  mongoose.model('ProductCharacteristic', productCharacteristicSchema);
PRODUCTCHARMODEL

cat > src/models/DeliveryType.js << 'DELIVERYTYPEMODEL'
import mongoose, { Schema } from 'mongoose';

const DAY_HOURS = {
  open: { type: String },
  close: { type: String },
  isOpen: { type: Boolean, default: true },
};

const deliveryTypeSchema = new Schema(
  {
    type:           { type: String, enum: ['PICKUP', 'DELIVERY'], required: true },
    name:           { type: String, required: true, trim: true },
    description:    { type: String, trim: true },
    price:          { type: Number, required: true, min: 0 },
    estimatedDays:  { min: { type: Number, min: 0 }, max: { type: Number, min: 0 } },
    pickupAddress:  {                                                        // Solo si es PICKUP
      street: String, streetNumber: String, city: String,
      province: String, postalCode: String,
      reference: String,
      coordinates: { lat: Number, lng: Number },
    },
    businessHours:  {                                                        // Horarios (solo PICKUP)
      monday: DAY_HOURS, tuesday: DAY_HOURS, wednesday: DAY_HOURS,
      thursday: DAY_HOURS, friday: DAY_HOURS, saturday: DAY_HOURS, sunday: DAY_HOURS,
    },
    isActive:       { type: Boolean, default: true },
    order:          { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.DeliveryType || mongoose.model('DeliveryType', deliveryTypeSchema);
DELIVERYTYPEMODEL

cat > src/models/Order.js << 'ORDERMODEL'
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
ORDERMODEL

cat > src/models/OrderItem.js << 'ORDERITEMMODEL'
import mongoose, { Schema } from 'mongoose';

const orderItemSchema = new Schema(
  {
    order:       { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    product:     { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    productSnapshot: {                                                       // Snapshot del producto al momento de compra
      name: String,
      description: String,
      sku: String,
      imageUrl: String,                                                      // Imagen principal al momento
    },
    quantity:    { type: Number, required: true, min: 1 },
    price:       { type: Number, required: true, min: 0 },                   // Precio unitario al momento
    compareAt:   { type: Number, min: 0 },
    subtotal:    { type: Number, required: true, min: 0 },                   // price * quantity
    discount:    { type: Number, default: 0, min: 0 },
    tax:         { type: Number, default: 0, min: 0 },
    total:       { type: Number, required: true, min: 0 },                   // subtotal - discount + tax
  },
  { timestamps: true }
);

// Pre-save: calcular subtotal y total automáticamente
orderItemSchema.pre('save', function (next) {
  this.subtotal = this.price * this.quantity;
  this.total = this.subtotal - this.discount + this.tax;
  next();
});

// Método estático: crear item con snapshot del producto y reducir stock
orderItemSchema.statics.createWithSnapshot = async function ({ orderId, productId, quantity }) {
  const Product = mongoose.model('Product');
  const product = await Product.findById(productId);

  if (!product) throw new Error('Producto no encontrado');
  if (product.trackInventory && product.stock < quantity) {
    throw new Error(`Stock insuficiente para "${product.name}"`);
  }

  // Obtener imagen principal
  const ProductImage = mongoose.model('ProductImage');
  const primaryImage = await ProductImage.findOne({ product: productId, isPrimary: true });

  // Crear item con snapshot
  const item = await this.create({
    order: orderId,
    product: productId,
    productSnapshot: {
      name: product.name,
      description: product.shortDescription || product.description,
      sku: product.sku,
      imageUrl: primaryImage?.url || null,
    },
    quantity,
    price: product.price,
    compareAt: product.compareAtPrice,
    subtotal: product.price * quantity,
    total: product.price * quantity,
  });

  // Reducir stock
  if (product.trackInventory) {
    product.stock -= quantity;
    await product.save();
  }

  return item;
};

// Método: restaurar stock (al cancelar orden)
orderItemSchema.methods.restoreStock = async function () {
  const Product = mongoose.model('Product');
  const product = await Product.findById(this.product);
  if (product && product.trackInventory) {
    product.stock += this.quantity;
    await product.save();
  }
};

export default mongoose.models.OrderItem || mongoose.model('OrderItem', orderItemSchema);
ORDERITEMMODEL

cat > src/models/Payment.js << 'PAYMENTMODEL'
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
PAYMENTMODEL

cat > src/models/Shipment.js << 'SHIPMENTMODEL'
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
SHIPMENTMODEL

cat > src/models/index.js << 'MODELSINDEX'
export { default as User }                  from './User.js';
export { default as Address }               from './Address.js';
export { default as Category }              from './Category.js';
export { default as Product }               from './Product.js';
export { default as ProductImage }          from './ProductImage.js';
export { default as ProductCharacteristic } from './ProductCharacteristic.js';
export { default as DeliveryType }          from './DeliveryType.js';
export { default as Order }                 from './Order.js';
export { default as OrderItem }             from './OrderItem.js';
export { default as Payment }               from './Payment.js';
export { default as Shipment }              from './Shipment.js';
MODELSINDEX

# ─── CONFIG ──────────────────────────────────────────────────
cat > src/config/database.js << 'DBCONFIG'
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Falta la variable de entorno MONGODB_URI');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
DBCONFIG

# ─── UTILS ───────────────────────────────────────────────────
cat > src/utils/constants.js << 'CONSTANTS'
// ── Roles ─────────────────────────────────
export const ROLES = {
  USER:  'USER',
  ADMIN: 'ADMIN',
};

// ── Estado de Orden ───────────────────────
export const ORDER_STATUS = {
  PENDING:          'PENDING',
  PAYMENT_PENDING:  'PAYMENT_PENDING',
  PAID:             'PAID',
  PROCESSING:       'PROCESSING',
  READY_FOR_PICKUP: 'READY_FOR_PICKUP',
  SHIPPED:          'SHIPPED',
  DELIVERED:        'DELIVERED',
  CANCELLED:        'CANCELLED',
  REFUNDED:         'REFUNDED',
};

// ── Estado de Pago ────────────────────────
export const PAYMENT_STATUS = {
  PENDING:   'PENDING',
  PAID:      'PAID',
  FAILED:    'FAILED',
  CANCELLED: 'CANCELLED',
  REFUNDED:  'REFUNDED',
};

// ── Estado de Envío ───────────────────────
export const SHIPMENT_STATUS = {
  PENDING:    'PENDING',
  SHIPPED:    'SHIPPED',
  IN_TRANSIT: 'IN_TRANSIT',
  DELIVERED:  'DELIVERED',
  FAILED:     'FAILED',
  RETURNED:   'RETURNED',
};

// ── Tipo de Entrega ───────────────────────
export const DELIVERY_TYPES = {
  PICKUP:   'PICKUP',
  DELIVERY: 'DELIVERY',
};

// ── Provincias argentinas ─────────────────
export const PROVINCES = [
  'Buenos Aires', 'Córdoba', 'Santa Fe', 'Mendoza', 'Tucumán',
  'La Pampa', 'Entre Ríos', 'Salta', 'Chaco', 'Corrientes',
  'Misiones', 'Santiago del Estero', 'Jujuy', 'Neuquén', 'Río Negro',
  'Formosa', 'Catamarca', 'San Luis', 'La Rioja', 'Chubut',
  'Tierra del Fuego', 'San Juan', 'Patagonia', 'Mendoza', 'Ciudad Autónoma de Buenos Aires',
];
CONSTANTS

cat > src/utils/response.js << 'RESPONSE'
// Respuesta exitosa
export function successResponse(res, data, statusCode = 200) {
  return new Response(
    JSON.stringify({
      success: true,
      data,
    }),
    {
      status: statusCode,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

// Respuesta exitosa con paginación
export function paginatedResponse(res, { data, total, page, limit }) {
  return new Response(
    JSON.stringify({
      success: true,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

// Respuesta de error
export function errorResponse(message, statusCode = 400) {
  return new Response(
    JSON.stringify({
      success: false,
      error: {
        message,
        code: statusCode,
      },
    }),
    {
      status: statusCode,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
RESPONSE

cat > src/utils/slugify.js << 'SLUGIFY'
/**
 * Genera un slug único a partir de un texto.
 * Ejemplo: "Remera Básica 2024" → "remera-basica-2024"
 */
export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')                   // Separar acentos
    .replace(/[\u0300-\u036f]/g, '')    // Eliminar acentos
    .replace(/[^a-z0-9\s-]/g, '')       // Solo alfanuméricos, espacios y guiones
    .replace(/[\s]+/g, '-')            // Espacios → guiones
    .replace(/-+/g, '-')               // Multiples guiones → uno solo
    .trim();
}
SLUGIFY

cat > src/utils/orderNumber.js << 'ORDERNUMBER'
/**
 * Genera un número de orden único.
 * Formato: ORD-YYYYMMDD-XXXXX (ej: ORD-20240115-A3K2M)
 */
export function generateOrderNumber() {
  const now = new Date();
  const date = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('');

  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ORD-${date}-${random}`;
}
ORDERNUMBER

# ─── LIB (Integraciones externas) ────────────────────────────
cat > src/lib/mercadopago.js << 'MPLIB'
/**
 * Wrapper de MercadoPago SDK
 * Los services NO importan mercadopago directamente, solo este módulo.
 */

// TODO: Instalar SDK → npm install mercadopago
// import MercadoPago from 'mercadopago';

// const mp = new MercadoPago(process.env.MERCADOPAGO_ACCESS_TOKEN);

/**
 * Crear preferencia de pago (Checkout Pro)
 */
export async function createPreference(preferenceData) {
  // const response = await mp.preferences.create(preferenceData);
  // return response.body;
  throw new Error('MercadoPago no configurado aún');
}

/**
 * Obtener datos completos de un pago por ID
 */
export async function getPayment(paymentId) {
  // const response = await mp.payment.get(paymentId);
  // return response.body;
  throw new Error('MercadoPago no configurado aún');
}

/**
 * Validar notificación webhook (firma HMAC)
 */
export function validateWebhook(signature, body, secret) {
  // Implementar validación HMAC según docs de MP
  // https://developers.mercadolibre.com/developers/es/docs/mercado-pago/developer-tools/sdk/server-side/nodejs#validar-notificaciones
  console.warn('Validación webhook pendiente de implementar');
  return true;
}
MPLIB

cat > src/lib/firebase.js << 'FBLIB'
/**
 * Wrapper de Firebase Storage
 * Centraliza todas las operaciones de almacenamiento de imágenes.
 */

// TODO: Instalar SDK → npm install firebase-admin
// import admin from 'firebase-admin';

/**
 * Subir imagen al bucket de Firebase Storage
 * @param {Buffer} fileBuffer - Buffer del archivo
 * @param {string} storagePath - Ruta destino (ej: "products/remera-001.jpg")
 * @param {string} contentType - MIME type (ej: "image/jpeg")
 * @returns {{ url: string, storagePath: string }}
 */
export async function uploadImage(fileBuffer, storagePath, contentType = 'image/jpeg') {
  // const bucket = admin.storage().bucket();
  // const file = bucket.file(storagePath);
  // await file.save(fileBuffer, { contentType });
  // await file.makePublic();
  // const url = file.publicUrl();
  // return { url, storagePath };
  throw new Error('Firebase Storage no configurado aún');
}

/**
 * Eliminar imagen del bucket
 * @param {string} storagePath - Ruta del archivo a eliminar
 */
export async function deleteImage(storagePath) {
  // const bucket = admin.storage().bucket();
  // await bucket.file(storagePath).delete();
  throw new Error('Firebase Storage no configurado aún');
}

/**
 * Obtener URL pública de una imagen
 * @param {string} storagePath
 * @returns {string} URL pública
 */
export function getImageUrl(storagePath) {
  const bucketName = process.env.FIREBASE_STORAGE_BUCKET;
  return `https://storage.googleapis.com/${bucketName}/${storagePath}`;
}
FBLIB

cat > src/lib/googleMaps.js << 'GMLIB'
/**
 * Wrapper de Google Maps Geocoding API
 * Valida y geocodifica direcciones.
 */

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

/**
 * Geocodificar una dirección (texto → coordenadas + place ID)
 * @param {string} address - Texto de dirección
 * @returns {{ coordinates: {lat, lng}, formattedAddress: string, placeId: string } | null}
 */
export async function geocodeAddress(address) {
  if (!API_KEY) throw new Error('Falta GOOGLE_MAPS_API_KEY');

  const encoded = encodeURIComponent(address);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}&key=${API_KEY}&region=ar`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.status !== 'OK' || !data.results?.length) {
    return null; // No se encontró la dirección
  }

  const result = data.results[0];
  return {
    coordinates: {
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng,
    },
    formattedAddress: result.formatted_address,
    placeId: result.place_id,
  };
}

/**
 * Obtener detalles de un lugar por Place ID
 * @param {string} placeId
 * @returns {object} Datos del lugar
 */
export async function getPlaceDetails(placeId) {
  if (!API_KEY) throw new Error('Falta GOOGLE_MAPS_API_KEY');

  const url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.status !== 'OK') return null;
  return data.result;
}
GMLIB

# ─── MIDDLEWARE ───────────────────────────────────────────────
cat > src/middleware/auth.js << 'AUTHMW'
import jwt from 'jsonwebtoken';
import { errorResponse } from '../utils/response.js';
import { User } from '../models/index.js';
import dbConnect from '../config/database.js';

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware de autenticación JWT.
 * Uso: const user = await authenticate(request);
 * Si falla, retorna un Response de error.
 */
export async function authenticate(request) {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: errorResponse('Token de autenticación requerido', 401) };
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    await dbConnect();
    const user = await User.findById(decoded.id).select('-password');

    if (!user || !user.isActive) {
      return { error: errorResponse('Usuario no válido', 401) };
    }

    return { user };
  } catch (err) {
    return { error: errorResponse('Token inválido o expirado', 401) };
  }
}
AUTHMW

cat > src/middleware/roleGuard.js << 'ROLEGRD'
import { errorResponse } from '../utils/response.js';

/**
 * Verificar que el usuario tiene el rol requerido.
 * @param {object} user - Objeto usuario (ya autenticado)
 * @param {string[]} allowedRoles - Roles permitidos
 * @returns {{ error: Response | null }}
 */
export function requireRole(user, allowedRoles) {
  if (!allowedRoles.includes(user.role)) {
    return { error: errorResponse('No tienes permiso para esta acción', 403) };
  }
  return { error: null };
}
ROLEGRD

cat > src/middleware/errorHandler.js << 'ERRMW'
import { errorResponse } from '../utils/response.js';

/**
 * Wrapper para routes que captura errores automáticamente.
 * Uso:
 *   export const GET = withErrorHandler(async (req) => { ... });
 */
export function withErrorHandler(handler) {
  return async function (request, context) {
    try {
      return await handler(request, context);
    } catch (err) {
      console.error('[Error]', err);

      // Errores de validación de Mongoose
      if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((e) => e.message);
        return errorResponse(messages.join('; '), 400);
      }

      // Errores de clave duplicada (unique index)
      if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || 'campo';
        return errorResponse(`El ${field} ya existe`, 409);
      }

      // Error genérico
      return errorResponse(
        process.env.NODE_ENV === 'development' ? err.message : 'Error interno del servidor',
        500
      );
    }
  };
}
ERRMW

cat > src/middleware/validateRequest.js << 'VALMW'
import { errorResponse } from '../utils/response.js';

/**
 * Validar que los campos requeridos estén presentes en el body.
 * @param {object} body - Body parseado de la request
 * @param {string[]} requiredFields - Array de campos requeridos
 * @returns {{ error: Response | null }}
 */
export function validateRequiredFields(body, requiredFields) {
  const missing = requiredFields.filter(
    (field) => body[field] === undefined || body[field] === null || body[field] === ''
  );

  if (missing.length > 0) {
    return {
      error: errorResponse(`Campos requeridos faltantes: ${missing.join(', ')}`, 400),
    };
  }

  return { error: null };
}
VALMW

# ─── CONTROLLERS (esqueletos) ─────────────────────────────────
cat > src/controllers/userController.js << 'USERCTRL'
import { User } from '../models/index.js';
import dbConnect from '../config/database.js';
import { successResponse, paginatedResponse, errorResponse } from '../utils/response.js';
import { validateRequiredFields } from '../middleware/validateRequest.js';

// POST /api/users → Crear usuario
export async function createUser(body) {
  await dbConnect();

  const { error } = validateRequiredFields(body, ['firstName', 'lastName', 'email', 'password', 'dni']);
  if (error) return error;

  const user = await User.create(body);
  return successResponse(null, user, 201);
}

// GET /api/users/:id → Obtener usuario
export async function getUserById(id) {
  await dbConnect();
  const user = await User.findById(id).select('-password');
  if (!user) return errorResponse('Usuario no encontrado', 404);
  return successResponse(null, user);
}

// PUT /api/users/:id → Actualizar usuario
export async function updateUser(id, body) {
  await dbConnect();
  const user = await User.findByIdAndUpdate(id, body, { new: true, runValidators: true }).select('-password');
  if (!user) return errorResponse('Usuario no encontrado', 404);
  return successResponse(null, user);
}

// DELETE /api/users/:id → Eliminar usuario
export async function deleteUser(id) {
  await dbConnect();
  const user = await User.findByIdAndDelete(id);
  if (!user) return errorResponse('Usuario no encontrado', 404);
  return successResponse(null, { message: 'Usuario eliminado' });
}

// GET /api/users → Listar usuarios (admin)
export async function listUsers(query) {
  await dbConnect();
  const page  = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;
  const skip  = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find().select('-password').skip(skip).limit(limit).sort({ createdAt: -1 }),
    User.countDocuments(),
  ]);

  return paginatedResponse(null, { data: users, total, page, limit });
}
USERCTRL

cat > src/controllers/addressController.js << 'ADDRCTRL'
import { Address } from '../models/index.js';
import { geocodeAddress } from '../lib/googleMaps.js';
import dbConnect from '../config/database.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { validateRequiredFields } from '../middleware/validateRequest.js';

// POST /api/addresses → Crear dirección
export async function createAddress(body, userId) {
  await dbConnect();

  const { error } = validateRequiredFields(body, ['street', 'streetNumber', 'city', 'province', 'postalCode']);
  if (error) return error;

  const address = await Address.create({ ...body, user: userId });
  return successResponse(null, address, 201);
}

// GET /api/addresses/:id → Obtener dirección
export async function getAddressById(id) {
  await dbConnect();
  const address = await Address.findById(id);
  if (!address) return errorResponse('Dirección no encontrada', 404);
  return successResponse(null, address);
}

// PUT /api/addresses/:id → Actualizar dirección
export async function updateAddress(id, body) {
  await dbConnect();
  const address = await Address.findByIdAndUpdate(id, body, { new: true, runValidators: true });
  if (!address) return errorResponse('Dirección no encontrada', 404);
  return successResponse(null, address);
}

// DELETE /api/addresses/:id → Eliminar dirección
export async function deleteAddress(id) {
  await dbConnect();
  const address = await Address.findByIdAndDelete(id);
  if (!address) return errorResponse('Dirección no encontrada', 404);
  return successResponse(null, { message: 'Dirección eliminada' });
}

// POST /api/addresses/:id/validate → Validar con Google Maps
export async function validateAddress(id) {
  await dbConnect();
  const address = await Address.findById(id);
  if (!address) return errorResponse('Dirección no encontrada', 404);

  const query = address.getGoogleMapsQuery();
  const result = await geocodeAddress(query);

  if (!result) {
    return errorResponse('No se pudo validar la dirección con Google Maps', 422);
  }

  address.coordinates     = result.coordinates;
  address.formattedAddress = result.formattedAddress;
  address.googlePlaceId   = result.placeId;
  address.isValidated     = true;
  await address.save();

  return successResponse(null, address);
}

// GET /api/users/:id/addresses → Direcciones de un usuario
export async function getAddressesByUser(userId) {
  await dbConnect();
  const addresses = await Address.find({ user: userId }).sort({ isDefault: -1, createdAt: -1 });
  return successResponse(null, addresses);
}
ADDRCTRL

cat > src/controllers/productController.js << 'PRODCTRL'
import { Product, ProductImage, ProductCharacteristic } from '../models/index.js';
import { uploadImage, deleteImage } from '../lib/firebase.js';
import dbConnect from '../config/database.js';
import { successResponse, paginatedResponse, errorResponse } from '../utils/response.js';
import { validateRequiredFields } from '../middleware/validateRequest.js';

// POST /api/products → Crear producto
export async function createProduct(body) {
  await dbConnect();

  const { error } = validateRequiredFields(body, ['name', 'price', 'category']);
  if (error) return error;

  const product = await Product.create(body);
  return successResponse(null, product, 201);
}

// GET /api/products → Listar productos (con filtros y paginación)
export async function listProducts(query) {
  await dbConnect();

  const page     = parseInt(query.page) || 1;
  const limit    = parseInt(query.limit) || 20;
  const skip     = (page - 1) * limit;
  const filters  = {};

  if (query.category)  filters.category = query.category;
  if (query.minPrice)  filters.price = { ...filters.price, $gte: Number(query.minPrice) };
  if (query.maxPrice)  filters.price = { ...filters.price, $lte: Number(query.maxPrice) };
  if (query.featured) filters.isFeatured = true;
  if (query.search)    filters.$text = { $search: query.search };
  filters.isActive = true;

  const [products, total] = await Promise.all([
    Product.find(filters)
      .populate('category')
      .populate({ path: 'images', options: { sort: { order: 1 } } })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Product.countDocuments(filters),
  ]);

  return paginatedResponse(null, { data: products, total, page, limit });
}

// GET /api/products/:id → Obtener producto completo
export async function getProductById(id) {
  await dbConnect();

  const product = await Product.findById(id)
    .populate('category')
    .populate({ path: 'images', options: { sort: { order: 1 } } })
    .populate({ path: 'characteristics', options: { sort: { order: 1 } } });

  if (!product) return errorResponse('Producto no encontrado', 404);
  return successResponse(null, product);
}

// PUT /api/products/:id → Actualizar producto
export async function updateProduct(id, body) {
  await dbConnect();
  const product = await Product.findByIdAndUpdate(id, body, { new: true, runValidators: true });
  if (!product) return errorResponse('Producto no encontrado', 404);
  return successResponse(null, product);
}

// DELETE /api/products/:id → Eliminar producto
export async function deleteProduct(id) {
  await dbConnect();
  const product = await Product.findByIdAndDelete(id);
  if (!product) return errorResponse('Producto no encontrado', 404);

  // Limpiar imágenes y características asociadas
  await ProductImage.deleteMany({ product: id });
  await ProductCharacteristic.deleteMany({ product: id });

  return successResponse(null, { message: 'Producto eliminado' });
}

// POST /api/products/:id/images → Agregar imagen
export async function addProductImage(productId, fileBuffer, altText, contentType) {
  await dbConnect();

  const product = await Product.findById(productId);
  if (!product) return errorResponse('Producto no encontrado', 404);

  const storagePath = `products/${productId}/${Date.now()}.jpg`;
  const { url } = await uploadImage(fileBuffer, storagePath, contentType);

  // Si no hay imágenes, esta es la principal
  const existingImages = await ProductImage.countDocuments({ product: productId });

  const image = await ProductImage.create({
    product:   productId,
    url,
    storagePath,
    altText,
    isPrimary: existingImages === 0,
    order:     existingImages,
  });

  return successResponse(null, image, 201);
}

// DELETE /api/products/:id/images/:imageId → Eliminar imagen
export async function deleteProductImage(productId, imageId) {
  await dbConnect();

  const image = await ProductImage.findOne({ _id: imageId, product: productId });
  if (!image) return errorResponse('Imagen no encontrada', 404);

  await deleteImage(image.storagePath);
  await image.deleteOne();

  // Si era la principal, hacer otra imagen primary
  if (image.isPrimary) {
    const nextImage = await ProductImage.findOne({ product: productId }).sort({ order: 1 });
    if (nextImage) {
      nextImage.isPrimary = true;
      await nextImage.save();
    }
  }

  return successResponse(null, { message: 'Imagen eliminada' });
}

// POST /api/products/:id/characteristics → Agregar característica
export async function addProductCharacteristic(productId, body) {
  await dbConnect();

  const product = await Product.findById(productId);
  if (!product) return errorResponse('Producto no encontrado', 404);

  const { error } = validateRequiredFields(body, ['key', 'label', 'value', 'valueType']);
  if (error) return error;

  const characteristic = await ProductCharacteristic.create({ ...body, product: productId });
  return successResponse(null, characteristic, 201);
}

// DELETE /api/products/:id/characteristics/:charId → Eliminar característica
export async function deleteProductCharacteristic(productId, charId) {
  await dbConnect();

  const char = await ProductCharacteristic.findOne({ _id: charId, product: productId });
  if (!char) return errorResponse('Característica no encontrada', 404);

  await char.deleteOne();
  return successResponse(null, { message: 'Característica eliminada' });
}
PRODCTRL

cat > src/controllers/categoryController.js << 'CATCTRL'
import { Category, Product } from '../models/index.js';
import dbConnect from '../config/database.js';
import { successResponse, paginatedResponse, errorResponse } from '../utils/response.js';
import { validateRequiredFields } from '../middleware/validateRequest.js';

export async function createCategory(body) {
  await dbConnect();
  const { error } = validateRequiredFields(body, ['name']);
  if (error) return error;
  const category = await Category.create(body);
  return successResponse(null, category, 201);
}

export async function listCategories(query) {
  await dbConnect();
  const categories = await Category.find({ isActive: true })
    .populate('parent')
    .sort({ order: 1 });
  return successResponse(null, categories);
}

export async function getCategoryById(id) {
  await dbConnect();
  const category = await Category.findById(id).populate('parent').populate('children');
  if (!category) return errorResponse('Categoría no encontrada', 404);
  return successResponse(null, category);
}

export async function updateCategory(id, body) {
  await dbConnect();
  const category = await Category.findByIdAndUpdate(id, body, { new: true, runValidators: true });
  if (!category) return errorResponse('Categoría no encontrada', 404);
  return successResponse(null, category);
}

export async function deleteCategory(id) {
  await dbConnect();
  // No eliminar si tiene productos
  const productCount = await Product.countDocuments({ category: id });
  if (productCount > 0) {
    return errorResponse('No se puede eliminar una categoría con productos', 400);
  }
  const category = await Category.findByIdAndDelete(id);
  if (!category) return errorResponse('Categoría no encontrada', 404);
  return successResponse(null, { message: 'Categoría eliminada' });
}

export async function getProductsByCategory(categoryId) {
  await dbConnect();
  const products = await Product.find({ category: categoryId, isActive: true })
    .populate({ path: 'images', options: { sort: { order: 1 } } })
    .sort({ createdAt: -1 });
  return successResponse(null, products);
}
CATCTRL

cat > src/controllers/orderController.js << 'ORDERCTRL'
import { Order, OrderItem, DeliveryType, Address, User } from '../models/index.js';
import dbConnect from '../config/database.js';
import { successResponse, paginatedResponse, errorResponse } from '../utils/response.js';
import { validateRequiredFields } from '../middleware/validateRequest.js';

// POST /api/orders → Crear orden
export async function createOrder(body, userId) {
  await dbConnect();

  const { error } = validateRequiredFields(body, ['deliveryType', 'items']);
  if (error) return error;

  const user = await User.findById(userId);
  const deliveryType = await DeliveryType.findById(body.deliveryType);
  if (!deliveryType) return errorResponse('Tipo de entrega no encontrado', 404);

  // Si es DELIVERY, debe tener dirección de envío
  if (deliveryType.type === 'DELIVERY' && !body.shippingAddress) {
    return errorResponse('Se requiere dirección de envío para delivery', 400);
  }

  // Crear orden
  const order = await Order.create({
    user: userId,
    deliveryType: deliveryType._id,
    shippingAddress: body.shippingAddress || null,
    customerData: {
      firstName: user.firstName,
      lastName:  user.lastName,
      email:     user.email,
      phone:     user.phone,
      dni:       user.dni,
    },
    shippingCost: deliveryType.price,
    subtotal: 0,
    total: 0,
    customerNotes: body.customerNotes,
  });

  // Crear items con snapshots
  for (const item of body.items) {
    await OrderItem.createWithSnapshot({
      orderId:   order._id,
      productId: item.productId,
      quantity:  item.quantity,
    });
  }

  // Recalcular totales
  const items = await OrderItem.find({ order: order._id });
  order.items = items;
  order.calculateTotals();
  await order.save();

  return successResponse(null, order, 201);
}

// GET /api/orders → Listar órdenes
export async function listOrders(query, userId, userRole) {
  await dbConnect();

  const page  = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;
  const skip  = (page - 1) * limit;
  const filters = {};

  // Si no es admin, solo ver sus propias órdenes
  if (userRole !== 'ADMIN') filters.user = userId;
  if (query.status) filters.status = query.status;

  const [orders, total] = await Promise.all([
    Order.find(filters)
      .populate('user', 'firstName lastName email')
      .populate('deliveryType')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Order.countDocuments(filters),
  ]);

  return paginatedResponse(null, { data: orders, total, page, limit });
}

// GET /api/orders/:id → Obtener orden completa
export async function getOrderById(id) {
  await dbConnect();

  const order = await Order.findById(id)
    .populate('user', 'firstName lastName email')
    .populate('deliveryType')
    .populate('shippingAddress')
    .populate('items')
    .populate('payment')
    .populate('shipment');

  if (!order) return errorResponse('Orden no encontrada', 404);
  return successResponse(null, order);
}

// PUT /api/orders/:id → Actualizar estado de orden
export async function updateOrderStatus(id, body) {
  await dbConnect();

  const { error } = validateRequiredFields(body, ['status']);
  if (error) return error;

  const order = await Order.findById(id);
  if (!order) return errorResponse('Orden no encontrada', 404);

  await order.updateStatus(body.status, body.note || '');
  return successResponse(null, order);
}

// DELETE /api/orders/:id → Cancelar orden
export async function cancelOrder(id) {
  await dbConnect();

  const order = await Order.findById(id).populate('items');
  if (!order) return errorResponse('Orden no encontrada', 404);

  if (!order.canBeCancelled()) {
    return errorResponse('Esta orden ya no puede ser cancelada', 400);
  }

  // Restaurar stock de cada item
  for (const item of order.items) {
    await item.restoreStock();
  }

  await order.updateStatus('CANCELLED', 'Cancelada por el usuario');
  return successResponse(null, order);
}
ORDERCTRL

cat > src/controllers/paymentController.js << 'PAYMCTRL'
import { Payment, Order } from '../models/index.js';
import { createPreference, getPayment } from '../lib/mercadopago.js';
import dbConnect from '../config/database.js';
import { successResponse, errorResponse } from '../utils/response.js';

// POST /api/payments → Crear preferencia de pago
export async function createPayment(body) {
  await dbConnect();

  const order = await Order.findById(body.orderId);
  if (!order) return errorResponse('Orden no encontrada', 404);

  // Crear preferencia en MercadoPago
  const preference = await createPreference({
    items: [{
      title:      `Orden ${order.orderNumber}`,
      quantity:   1,
      unit_price: order.total,
      currency_id: 'ARS',
    }],
    back_urls: {
      success:  `${process.env.FRONTEND_URL}/checkout/success`,
      failure:  `${process.env.FRONTEND_URL}/checkout/failure`,
      pending:  `${process.env.FRONTEND_URL}/checkout/pending`,
    },
    auto_return:       'approved',
    external_reference: order._id.toString(),
    notification_url:  `${process.env.BACKEND_URL}/api/payments/webhook`,
  });

  // Guardar registro de pago
  const payment = await Payment.create({
    order:       order._id,
    mercadopago: {
      preferenceId:      preference.id,
      externalReference: order._id.toString(),
    },
    amount:          order.total,
    initPoint:       preference.init_point,
    sandboxInitPoint: preference.sandbox_init_point,
  });

  // Actualizar estado de orden
  await order.updateStatus('PAYMENT_PENDING', 'Redirigiendo a MercadoPago');

  return successResponse(null, {
    payment,
    initPoint: preference.init_point,
    sandboxInitPoint: preference.sandbox_init_point,
  }, 201);
}

// GET /api/payments/:id → Obtener estado del pago
export async function getPaymentById(id) {
  await dbConnect();
  const payment = await Payment.findById(id).populate('order');
  if (!payment) return errorResponse('Pago no encontrado', 404);
  return successResponse(null, payment);
}

// POST /api/payments/webhook → Procesar webhook de MercadoPago
export async function processWebhook(body) {
  await dbConnect();

  // Buscar pago por preferenceId
  const payment = await Payment.findOne({
    'mercadopago.preferenceId': body.data?.preference_id,
  });

  if (!payment) {
    // Intentar por paymentId (MercadoPago puede enviar payment.id en lugar)
    if (body.data?.id) {
      const paymentData = await getPayment(body.data.id);
      const payByRef = await Payment.findOne({
        'mercadopago.externalReference': paymentData?.external_reference,
      });
      if (payByRef) {
        await payByRef.updateFromPaymentData(paymentData);
        return successResponse(null, { message: 'Webhook procesado' });
      }
    }
    return errorResponse('Pago no encontrado', 404);
  }

  const shouldFetch = await payment.updateFromWebhook(body);
  await payment.save();

  if (shouldFetch && body.data?.id) {
    const paymentData = await getPayment(body.data.id);
    await payment.updateFromPaymentData(paymentData);
  }

  return successResponse(null, { message: 'Webhook procesado' });
}
PAYMCTRL

cat > src/controllers/shipmentController.js << 'SHIPCTRL'
import { Shipment, Order, Address, DeliveryType } from '../models/index.js';
import dbConnect from '../config/database.js';
import { successResponse, errorResponse } from '../utils/response.js';

// GET /api/shipments/:id → Obtener envío
export async function getShipmentById(id) {
  await dbConnect();

  const shipment = await Shipment.findById(id)
    .populate('order')
    .populate('shippingAddress');

  if (!shipment) return errorResponse('Envío no encontrado', 404);
  return successResponse(null, shipment);
}

// PUT /api/shipments/:id → Actualizar estado de envío
export async function updateShipmentStatus(id, body) {
  await dbConnect();

  const shipment = await Shipment.findById(id);
  if (!shipment) return errorResponse('Envío no encontrado', 404);

  await shipment.updateStatus(body.status, body.location, body.note);
  return successResponse(null, shipment);
}

// Crear envío desde orden (se llama internamente cuando se confirma pago + delivery)
export async function createShipmentFromOrder(orderId) {
  await dbConnect();

  const order = await Order.findById(orderId)
    .populate('shippingAddress')
    .populate('deliveryType');

  if (!order) return errorResponse('Orden no encontrada', 404);
  if (order.deliveryType.type !== 'DELIVERY') return null;

  const shipment = await Shipment.createFromOrder(order, order.shippingAddress, order.deliveryType);
  return shipment;
}
SHIPCTRL

# ─── RUTAS API (esqueletos con withErrorHandler) ────────────────

# Users
cat > src/app/api/users/route.js << 'USERSROUTE'
import dbConnect from '../../../config/database.js';
import { withErrorHandler } from '../../../middleware/errorHandler.js';
import { authenticate } from '../../../middleware/auth.js';
import { requireRole } from '../../../middleware/roleGuard.js';
import { createUser, listUsers } from '../../../controllers/userController.js';

// POST /api/users → Crear usuario
export const POST = withErrorHandler(async (request) => {
  const body = await request.json();
  return createUser(body);
});

// GET /api/users → Listar usuarios (solo admin)
export const GET = withErrorHandler(async (request) => {
  const { user, error } = await authenticate(request);
  if (error) return error;

  const { error: roleError } = requireRole(user, ['ADMIN']);
  if (roleError) return roleError;

  const query = Object.fromEntries(new URL(request.url).searchParams);
  return listUsers(query);
});
USERSROUTE

cat > "src/app/api/users/[id]/route.js" << 'USERIDROUTE'
import { withErrorHandler } from '../../../../middleware/errorHandler.js';
import { authenticate } from '../../../../middleware/auth.js';
import { getUserById, updateUser, deleteUser } from '../../../../controllers/userController.js';

// GET /api/users/:id
export const GET = withErrorHandler(async (request, { params }) => {
  const { error } = await authenticate(request);
  if (error) return error;
  return getUserById(id);
});

// PUT /api/users/:id
export const PUT = withErrorHandler(async (request, { params }) => {
  const { error } = await authenticate(request);
  if (error) return error;
  const body = await request.json();
  return updateUser(id, body);
});

// DELETE /api/users/:id
export const DELETE = withErrorHandler(async (request, { params }) => {
  const { user, error } = await authenticate(request);
  if (error) return error;
  const { error: roleError } = requireRole(user, ['ADMIN']);
  if (roleError) return roleError;
  return deleteUser(id);
});

import { requireRole } from '../../../../middleware/roleGuard.js';
USERIDROUTE

cat > "src/app/api/users/[id]/addresses/route.js" << 'USERADDRROUTE'
import { withErrorHandler } from '../../../../../middleware/errorHandler.js';
import { authenticate } from '../../../../../middleware/auth.js';
import { getAddressesByUser } from '../../../../../controllers/addressController.js';

// GET /api/users/:id/addresses
export const GET = withErrorHandler(async (request, { params }) => {
  const { error } = await authenticate(request);
  if (error) return error;
  return getAddressesByUser(id);
});
USERADDRROUTE

cat > "src/app/api/users/[id]/orders/route.js" << 'USERORDROUTE'
import { withErrorHandler } from '../../../../../middleware/errorHandler.js';
import { authenticate } from '../../../../../middleware/auth.js';
import { listOrders } from '../../../../../controllers/orderController.js';

// GET /api/users/:id/orders
export const GET = withErrorHandler(async (request, { params }) => {
  const { error } = await authenticate(request);
  if (error) return error;
  const query = Object.fromEntries(new URL(request.url).searchParams);
  return listOrders({ ...query, user: id }, id, 'USER');
});
USERORDROUTE

# Addresses
cat > src/app/api/addresses/route.js << 'ADDRSROUTE'
import { withErrorHandler } from '../../../middleware/errorHandler.js';
import { authenticate } from '../../../middleware/auth.js';
import { createAddress } from '../../../controllers/addressController.js';

// POST /api/addresses
export const POST = withErrorHandler(async (request) => {
  const { user, error } = await authenticate(request);
  if (error) return error;
  const body = await request.json();
  return createAddress(body, user._id);
});
ADDRSROUTE

cat > "src/app/api/addresses/[id]/route.js" << 'ATTRIDROUTE'
import { withErrorHandler } from '../../../../middleware/errorHandler.js';
import { authenticate } from '../../../../middleware/auth.js';
import { getAddressById, updateAddress, deleteAddress } from '../../../../controllers/addressController.js';

export const GET    = withErrorHandler(async (request, { params }) => {
  const { error } = await authenticate(request);
  if (error) return error;
  return getAddressById(id);
});

export const PUT    = withErrorHandler(async (request, { params }) => {
  const { error } = await authenticate(request);
  if (error) return error;
  const body = await request.json();
  return updateAddress(id, body);
});

export const DELETE = withErrorHandler(async (request, { params }) => {
  const { error } = await authenticate(request);
  if (error) return error;
  return deleteAddress(id);
});
ATTRIDROUTE

cat > "src/app/api/addresses/[id]/validate/route.js" << 'ADDRVALROUTE'
import { withErrorHandler } from '../../../../../middleware/errorHandler.js';
import { authenticate } from '../../../../../middleware/auth.js';
import { validateAddress } from '../../../../../controllers/addressController.js';

// POST /api/addresses/:id/validate
export const POST = withErrorHandler(async (request, { params }) => {
  const { error } = await authenticate(request);
  if (error) return error;
  return validateAddress(id);
});
ADDRVALROUTE

# Products
cat > src/app/api/products/route.js << 'PRODSROUTE'
import { withErrorHandler } from '../../../middleware/errorHandler.js';
import { authenticate } from '../../../middleware/auth.js';
import { requireRole } from '../../../middleware/roleGuard.js';
import { createProduct, listProducts } from '../../../controllers/productController.js';

export const GET = withErrorHandler(async (request) => {
  const query = Object.fromEntries(new URL(request.url).searchParams);
  return listProducts(query);
});

export const POST = withErrorHandler(async (request) => {
  const { user, error } = await authenticate(request);
  if (error) return error;
  const { error: roleError } = requireRole(user, ['ADMIN']);
  if (roleError) return roleError;
  const body = await request.json();
  return createProduct(body);
});
PRODSROUTE

cat > "src/app/api/products/[id]/route.js" << 'PRODIDROUTE'
import { withErrorHandler } from '../../../../middleware/errorHandler.js';
import { authenticate } from '../../../../middleware/auth.js';
import { requireRole } from '../../../../middleware/roleGuard.js';
import { getProductById, updateProduct, deleteProduct } from '../../../../controllers/productController.js';

export const GET    = withErrorHandler(async (request, { params }) => {
  return getProductById(id);
});

export const PUT    = withErrorHandler(async (request, { params }) => {
  const { user, error } = await authenticate(request);
  if (error) return error;
  const { error: roleError } = requireRole(user, ['ADMIN']);
  if (roleError) return roleError;
  const body = await request.json();
  return updateProduct(id, body);
});

export const DELETE = withErrorHandler(async (request, { params }) => {
  const { user, error } = await authenticate(request);
  if (error) return error;
  const { error: roleError } = requireRole(user, ['ADMIN']);
  if (roleError) return roleError;
  return deleteProduct(id);
});
PRODIDROUTE

cat > "src/app/api/products/[id]/images/route.js" << 'PRODIMGROUTE'
import { withErrorHandler } from '../../../../../middleware/errorHandler.js';
import { authenticate } from '../../../../../middleware/auth.js';
import { requireRole } from '../../../../../middleware/roleGuard.js';
import { addProductImage } from '../../../../../controllers/productController.js';

// POST /api/products/:id/images
export const POST = withErrorHandler(async (request, { params }) => {
  const { user, error } = await authenticate(request);
  if (error) return error;
  const { error: roleError } = requireRole(user, ['ADMIN']);
  if (roleError) return roleError;

  const formData = await request.formData();
  const file     = formData.get('image');
  const altText  = formData.get('altText') || '';

  if (!file) {
    return new Response(JSON.stringify({ success: false, error: { message: 'Se requiere imagen' } }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  return addProductImage(id, buffer, altText, file.type);
});
PRODIMGROUTE

cat > "src/app/api/products/[id]/images/[imageId]/route.js" << 'PRODIMGIDROUTE'
import { withErrorHandler } from '../../../../../../middleware/errorHandler.js';
import { authenticate } from '../../../../../../middleware/auth.js';
import { requireRole } from '../../../../../../middleware/roleGuard.js';
import { deleteProductImage } from '../../../../../../controllers/productController.js';

export const DELETE = withErrorHandler(async (request, { params }) => {
  const { user, error } = await authenticate(request);
  if (error) return error;
  const { error: roleError } = requireRole(user, ['ADMIN']);
  if (roleError) return roleError;
  return deleteProductImage(id, params.imageId);
});
PRODIMGIDROUTE

cat > "src/app/api/products/[id]/characteristics/route.js" << 'PRODCHARROUTE'
import { withErrorHandler } from '../../../../../middleware/errorHandler.js';
import { authenticate } from '../../../../../middleware/auth.js';
import { requireRole } from '../../../../../middleware/roleGuard.js';
import { addProductCharacteristic } from '../../../../../controllers/productController.js';

export const POST = withErrorHandler(async (request, { params }) => {
  const { user, error } = await authenticate(request);
  if (error) return error;
  const { error: roleError } = requireRole(user, ['ADMIN']);
  if (roleError) return roleError;
  const body = await request.json();
  return addProductCharacteristic(id, body);
});
PRODCHARROUTE

cat > "src/app/api/products/[id]/characteristics/[charId]/route.js" << 'PRODCHARIDROUTE'
import { withErrorHandler } from '../../../../../../middleware/errorHandler.js';
import { authenticate } from '../../../../../../middleware/auth.js';
import { requireRole } from '../../../../../../middleware/roleGuard.js';
import { deleteProductCharacteristic } from '../../../../../../controllers/productController.js';

export const DELETE = withErrorHandler(async (request, { params }) => {
  const { user, error } = await authenticate(request);
  if (error) return error;
  const { error: roleError } = requireRole(user, ['ADMIN']);
  if (roleError) return roleError;
  return deleteProductCharacteristic(id, params.charId);
});
PRODCHARIDROUTE

# Categories
cat > src/app/api/categories/route.js << 'CATSROUTE'
import { withErrorHandler } from '../../../middleware/errorHandler.js';
import { authenticate } from '../../../middleware/auth.js';
import { requireRole } from '../../../middleware/roleGuard.js';
import { createCategory, listCategories } from '../../../controllers/categoryController.js';

export const GET = withErrorHandler(async (request) => {
  const query = Object.fromEntries(new URL(request.url).searchParams);
  return listCategories(query);
});

export const POST = withErrorHandler(async (request) => {
  const { user, error } = await authenticate(request);
  if (error) return error;
  const { error: roleError } = requireRole(user, ['ADMIN']);
  if (roleError) return roleError;
  const body = await request.json();
  return createCategory(body);
});
CATSROUTE

cat > "src/app/api/categories/[id]/route.js" << 'CATIDROUTE'
import { withErrorHandler } from '../../../../middleware/errorHandler.js';
import { authenticate } from '../../../../middleware/auth.js';
import { requireRole } from '../../../../middleware/roleGuard.js';
import { getCategoryById, updateCategory, deleteCategory } from '../../../../controllers/categoryController.js';

export const GET = withErrorHandler(async (request, { params }) => {
  return getCategoryById(id);
});

export const PUT = withErrorHandler(async (request, { params }) => {
  const { user, error } = await authenticate(request);
  if (error) return error;
  const { error: roleError } = requireRole(user, ['ADMIN']);
  if (roleError) return roleError;
  const body = await request.json();
  return updateCategory(id, body);
});

export const DELETE = withErrorHandler(async (request, { params }) => {
  const { user, error } = await authenticate(request);
  if (error) return error;
  const { error: roleError } = requireRole(user, ['ADMIN']);
  if (roleError) return roleError;
  return deleteCategory(id);
});
CATIDROUTE

cat > "src/app/api/categories/[id]/products/route.js" << 'CATPRODSROUTE'
import { withErrorHandler } from '../../../../../middleware/errorHandler.js';
import { getProductsByCategory } from '../../../../../controllers/categoryController.js';

export const GET = withErrorHandler(async (request, { params }) => {
  return getProductsByCategory(id);
});
CATPRODSROUTE

# Orders
cat > src/app/api/orders/route.js << 'ORDERSROUTE'
import { withErrorHandler } from '../../../middleware/errorHandler.js';
import { authenticate } from '../../../middleware/auth.js';
import { createOrder, listOrders } from '../../../controllers/orderController.js';

export const POST = withErrorHandler(async (request) => {
  const { user, error } = await authenticate(request);
  if (error) return error;
  const body = await request.json();
  return createOrder(body, user._id);
});

export const GET = withErrorHandler(async (request) => {
  const { user, error } = await authenticate(request);
  if (error) return error;
  const query = Object.fromEntries(new URL(request.url).searchParams);
  return listOrders(query, user._id, user.role);
});
ORDERSROUTE

cat > "src/app/api/orders/[id]/route.js" << 'ORDERIDROUTE'
import { withErrorHandler } from '../../../../middleware/errorHandler.js';
import { authenticate } from '../../../../middleware/auth.js';
import { requireRole } from '../../../../middleware/roleGuard.js';
import { getOrderById, updateOrderStatus, cancelOrder } from '../../../../controllers/orderController.js';

export const GET = withErrorHandler(async (request, { params }) => {
  const { error } = await authenticate(request);
  if (error) return error;
  return getOrderById(id);
});

export const PUT = withErrorHandler(async (request, { params }) => {
  const { user, error } = await authenticate(request);
  if (error) return error;
  const { error: roleError } = requireRole(user, ['ADMIN']);
  if (roleError) return roleError;
  const body = await request.json();
  return updateOrderStatus(id, body);
});

export const DELETE = withErrorHandler(async (request, { params }) => {
  const { error } = await authenticate(request);
  if (error) return error;
  return cancelOrder(id);
});
ORDERIDROUTE

# Payments
cat > src/app/api/payments/route.js << 'PAYMENTSROUTE'
import { withErrorHandler } from '../../../middleware/errorHandler.js';
import { authenticate } from '../../../middleware/auth.js';
import { createPayment } from '../../../controllers/paymentController.js';

export const POST = withErrorHandler(async (request) => {
  const { error } = await authenticate(request);
  if (error) return error;
  const body = await request.json();
  return createPayment(body);
});
PAYMENTSROUTE

cat > "src/app/api/payments/[id]/route.js" << 'PAYMENTIDROUTE'
import { withErrorHandler } from '../../../../middleware/errorHandler.js';
import { authenticate } from '../../../../middleware/auth.js';
import { getPaymentById } from '../../../../controllers/paymentController.js';

export const GET = withErrorHandler(async (request, { params }) => {
  const { error } = await authenticate(request);
  if (error) return error;
  return getPaymentById(id);
});
PAYMENTIDROUTE

cat > src/app/api/payments/webhook/route.js << 'WEBHOOKROUTE'
import { withErrorHandler } from '../../../../middleware/errorHandler.js';
import { processWebhook } from '../../../../controllers/paymentController.js';

// POST /api/payments/webhook → MercadoPago IPN (no requiere auth)
export const POST = withErrorHandler(async (request) => {
  const body = await request.json();
  return processWebhook(body);
});
WEBHOOKROUTE

# Shipments
cat > "src/app/api/shipments/[id]/route.js" << 'SHIPMENTIDROUTE'
import { withErrorHandler } from '../../../../middleware/errorHandler.js';
import { authenticate } from '../../../../middleware/auth.js';
import { requireRole } from '../../../../middleware/roleGuard.js';
import { getShipmentById, updateShipmentStatus } from '../../../../controllers/shipmentController.js';

export const GET = withErrorHandler(async (request, { params }) => {
  const { error } = await authenticate(request);
  if (error) return error;
  return getShipmentById(id);
});

export const PUT = withErrorHandler(async (request, { params }) => {
  const { user, error } = await authenticate(request);
  if (error) return error;
  const { error: roleError } = requireRole(user, ['ADMIN']);
  if (roleError) return roleError;
  const body = await request.json();
  return updateShipmentStatus(id, body);
});
SHIPMENTIDROUTE

# ─── .env.example ─────────────────────────────────────────────
cat > .env.example << 'ENVEXAMPLE'
# ─── Database ─────────────────────────────
MONGODB_URI=mongodb://localhost:27017/ecommerce

# ─── MercadoPago ──────────────────────────
MERCADOPAGO_ACCESS_TOKEN=your_access_token
MERCADOPAGO_PUBLIC_KEY=your_public_key

# ─── Firebase ─────────────────────────────
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_bucket_name
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY=your_private_key

# ─── Google Maps ──────────────────────────
GOOGLE_MAPS_API_KEY=your_api_key

# ─── App URLs ─────────────────────────────
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3000/api

# ─── Auth ─────────────────────────────────
JWT_SECRET=your_jwt_secret_here
ENVEXAMPLE

# ─── RESUMEN FINAL ───────────────────────────────────────────
echo ""
echo "✅ ¡Estructura creada exitosamente!"
echo ""
echo "📂 Carpetas creadas:"
echo "   src/models/            → 11 modelos de Mongoose"
echo "   src/controllers/       → 7 controllers (uno por recurso)"
echo "   src/services/          → (preparado para lógica de negocio aislada)"
echo "   src/lib/               → Wrappers: MercadoPago, Firebase, Google Maps"
echo "   src/middleware/        → Auth, RoleGuard, ErrorHandler, Validations"
echo "   src/config/            → Conexión DB"
echo "   src/utils/             → Constants, Response helpers, Slugify"
echo "   src/app/api/           → Rutas RESTful (Next.js App Router)"
echo ""
echo "📄 Archivos clave:"
echo "   .env.example           → Variables de entorno necesarias"
echo "   src/models/index.js    → Export centralizado de modelos"
echo "   src/utils/constants.js → Enums de estados del sistema"
echo ""
echo "🔧 Próximos pasos:"
echo "   1. cp .env.example .env          → Copiar y completar variables"
echo "   2. npm install                   → Instalar dependencias"
echo "   3. npm install mongoose bcryptjs jsonwebtoken mercadopago firebase-admin"
echo "   4. Configurar Firebase y Google Maps en .env"
echo "   5. ¡Empezar a desarrollar! 🚀"