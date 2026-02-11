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
