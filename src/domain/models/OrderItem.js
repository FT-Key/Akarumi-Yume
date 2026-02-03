import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: [true, 'La orden es requerida'],
      index: true
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'El producto es requerido'],
      index: true
    },
    // Snapshot del producto al momento de la compra
    // Esto previene problemas si el producto cambia o se elimina
    productSnapshot: {
      name: {
        type: String,
        required: true
      },
      slug: String,
      sku: String,
      description: String,
      // Imagen principal al momento de la compra
      primaryImage: String,
      // Características al momento de la compra
      characteristics: [{
        key: String,
        label: String,
        value: mongoose.Schema.Types.Mixed
      }]
    },
    // Cantidad
    quantity: {
      type: Number,
      required: [true, 'La cantidad es requerida'],
      min: [1, 'La cantidad debe ser al menos 1']
    },
    // Precio unitario al momento de la compra
    price: {
      type: Number,
      required: [true, 'El precio es requerido'],
      min: [0, 'El precio no puede ser negativo']
    },
    // Precio de comparación (si había descuento)
    compareAtPrice: {
      type: Number,
      min: [0, 'El precio de comparación no puede ser negativo'],
      default: null
    },
    // Subtotal de este item
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'El subtotal no puede ser negativo']
    },
    // Descuento aplicado a este item específico
    discount: {
      type: Number,
      default: 0,
      min: [0, 'El descuento no puede ser negativo']
    },
    // Impuesto aplicado a este item
    tax: {
      type: Number,
      default: 0,
      min: [0, 'El impuesto no puede ser negativo']
    },
    // Total de este item (subtotal - discount + tax)
    total: {
      type: Number,
      required: true,
      min: [0, 'El total no puede ser negativo']
    }
  },
  {
    timestamps: true
  }
);

// Índices compuestos
orderItemSchema.index({ order: 1 });
orderItemSchema.index({ product: 1 });

// Middleware para calcular subtotal y total antes de guardar
orderItemSchema.pre('save', function (next) {
  this.subtotal = this.price * this.quantity;
  this.total = this.subtotal - this.discount + this.tax;
  next();
});

// Método estático para crear item con snapshot del producto
orderItemSchema.statics.createWithSnapshot = async function (orderData) {
  const Product = mongoose.model('Product');
  const ProductImage = mongoose.model('ProductImage');
  const ProductCharacteristic = mongoose.model('ProductCharacteristic');
  
  const product = await Product.findById(orderData.productId)
    .populate('category');
  
  if (!product) {
    throw new Error('Producto no encontrado');
  }
  
  // Verificar stock si se trackea inventario
  if (product.trackInventory && !product.allowBackorder) {
    if (product.stock < orderData.quantity) {
      throw new Error(`Stock insuficiente. Solo hay ${product.stock} unidades disponibles`);
    }
  }
  
  // Obtener imagen principal
  const primaryImage = await ProductImage.findOne({
    product: product._id,
    isPrimary: true
  });
  
  // Obtener características
  const characteristics = await ProductCharacteristic.find({
    product: product._id
  }).sort({ order: 1 });
  
  // Crear snapshot
  const productSnapshot = {
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    description: product.description,
    primaryImage: primaryImage?.url || null,
    characteristics: characteristics.map(char => ({
      key: char.key,
      label: char.label,
      value: char.value
    }))
  };
  
  // Crear item
  const orderItem = new this({
    order: orderData.orderId,
    product: product._id,
    productSnapshot,
    quantity: orderData.quantity,
    price: product.price,
    compareAtPrice: product.compareAtPrice
  });
  
  await orderItem.save();
  
  // Actualizar stock si se trackea
  if (product.trackInventory) {
    product.stock -= orderData.quantity;
    product.salesCount += orderData.quantity;
    await product.save();
  }
  
  return orderItem;
};

// Método para restaurar stock cuando se cancela una orden
orderItemSchema.methods.restoreStock = async function () {
  const Product = mongoose.model('Product');
  const product = await Product.findById(this.product);
  
  if (product && product.trackInventory) {
    product.stock += this.quantity;
    product.salesCount = Math.max(0, product.salesCount - this.quantity);
    await product.save();
  }
};

const OrderItem = mongoose.models.OrderItem || 
  mongoose.model('OrderItem', orderItemSchema);

export default OrderItem;
