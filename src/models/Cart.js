import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  // Snapshot del producto para mantener info si el producto cambia
  productSnapshot: {
    name: String,
    slug: String,
    price: Number,
    primaryImage: String
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'La cantidad debe ser al menos 1'],
    default: 1
  },
  // Características seleccionadas (ej: talla, color)
  selectedCharacteristics: [{
    key: String,
    label: String,
    value: mongoose.Schema.Types.Mixed
  }],
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    items: [cartItemSchema],
    // Total calculado
    subtotal: {
      type: Number,
      default: 0
    },
    // Fecha de última modificación
    lastModified: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual para cantidad total de items
cartSchema.virtual('totalItems').get(function () {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

// Middleware para actualizar subtotal y lastModified
cartSchema.pre('save', function (next) {
  this.subtotal = this.items.reduce((sum, item) => {
    return sum + (item.productSnapshot.price * item.quantity);
  }, 0);
  this.lastModified = new Date();
});

// Método para agregar item
cartSchema.methods.addItem = async function (productData, quantity = 1, characteristics = []) {
  // Buscar si el producto ya existe con las mismas características
  const existingItemIndex = this.items.findIndex(item => {
    const sameProduct = item.product.toString() === productData._id.toString();
    const sameCharacteristics = JSON.stringify(item.selectedCharacteristics) === JSON.stringify(characteristics);
    return sameProduct && sameCharacteristics;
  });

  if (existingItemIndex > -1) {
    // Incrementar cantidad
    this.items[existingItemIndex].quantity += quantity;
  } else {
    // Agregar nuevo item
    this.items.push({
      product: productData._id,
      productSnapshot: {
        name: productData.name,
        slug: productData.slug,
        price: productData.price,
        primaryImage: productData.primaryImage || null
      },
      quantity,
      selectedCharacteristics: characteristics
    });
  }

  return this.save();
};

// Método para actualizar cantidad
cartSchema.methods.updateQuantity = async function (itemId, quantity) {
  const item = this.items.id(itemId);
  if (!item) throw new Error('Item no encontrado en el carrito');
  
  if (quantity <= 0) {
    this.items.pull(itemId);
  } else {
    item.quantity = quantity;
  }
  
  return this.save();
};

// Método para remover item
cartSchema.methods.removeItem = async function (itemId) {
  this.items.pull(itemId);
  return this.save();
};

// Método para vaciar carrito
cartSchema.methods.clear = async function () {
  this.items = [];
  return this.save();
};

const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

export default Cart;
