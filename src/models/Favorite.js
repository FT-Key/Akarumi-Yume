import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    products: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }],
    lastModified: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Índice único compuesto: un usuario solo puede tener una lista de favoritos
favoriteSchema.index({ user: 1 }, { unique: true });

// Middleware para actualizar lastModified
favoriteSchema.pre('save', function (next) {
  this.lastModified = new Date();
});

// Método para agregar producto a favoritos
favoriteSchema.methods.addProduct = async function (productId) {
  if (!this.products.includes(productId)) {
    this.products.push(productId);
    await this.save();
  }
  return this;
};

// Método para remover producto de favoritos
favoriteSchema.methods.removeProduct = async function (productId) {
  this.products = this.products.filter(id => id.toString() !== productId.toString());
  await this.save();
  return this;
};

// Método para verificar si un producto está en favoritos
favoriteSchema.methods.hasProduct = function (productId) {
  return this.products.some(id => id.toString() === productId.toString());
};

// Método para limpiar favoritos
favoriteSchema.methods.clear = async function () {
  this.products = [];
  await this.save();
  return this;
};

const Favorite = mongoose.models.Favorite || mongoose.model('Favorite', favoriteSchema);

export default Favorite;
