import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre del producto es requerido'],
      trim: true,
      maxlength: [200, 'El nombre no puede exceder 200 caracteres']
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    description: {
      type: String,
      required: [true, 'La descripción es requerida'],
      trim: true,
      maxlength: [2000, 'La descripción no puede exceder 2000 caracteres']
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [300, 'La descripción corta no puede exceder 300 caracteres']
    },
    // Precios
    price: {
      type: Number,
      required: [true, 'El precio es requerido'],
      min: [0, 'El precio no puede ser negativo']
    },
    compareAtPrice: {
      // Precio tachado (para mostrar descuento)
      type: Number,
      min: [0, 'El precio de comparación no puede ser negativo'],
      default: null
    },
    cost: {
      // Costo del producto (para cálculos internos)
      type: Number,
      min: [0, 'El costo no puede ser negativo'],
      default: null
    },
    // Inventario
    stock: {
      type: Number,
      required: [true, 'El stock es requerido'],
      min: [0, 'El stock no puede ser negativo'],
      default: 0
    },
    sku: {
      // Stock Keeping Unit
      type: String,
      unique: true,
      trim: true,
      sparse: true, // Permite null/undefined sin conflictos de unique
      index: true
    },
    barcode: {
      type: String,
      trim: true,
      default: null
    },
    // Categorización
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'La categoría es requerida'],
      index: true
    },
    // Gestión de stock
    trackInventory: {
      type: Boolean,
      default: true
    },
    allowBackorder: {
      // Permitir compra sin stock
      type: Boolean,
      default: false
    },
    // Dimensiones y peso (para cálculo de envío)
    weight: {
      type: Number,
      min: [0, 'El peso no puede ser negativo'],
      default: null
    },
    dimensions: {
      length: {
        type: Number,
        min: [0, 'La longitud no puede ser negativa'],
        default: null
      },
      width: {
        type: Number,
        min: [0, 'El ancho no puede ser negativo'],
        default: null
      },
      height: {
        type: Number,
        min: [0, 'La altura no puede ser negativa'],
        default: null
      },
      unit: {
        type: String,
        enum: ['cm', 'm', 'mm'],
        default: 'cm'
      }
    },
    // Estado del producto
    isActive: {
      type: Boolean,
      default: true
    },
    isFeatured: {
      // Producto destacado
      type: Boolean,
      default: false
    },
    isNew: {
      type: Boolean,
      default: true
    },
    // SEO
    metaTitle: {
      type: String,
      trim: true,
      maxlength: [70, 'El meta título no puede exceder 70 caracteres']
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: [160, 'La meta descripción no puede exceder 160 caracteres']
    },
    // Tags para búsqueda
    tags: [{
      type: String,
      trim: true
    }],
    // Estadísticas
    viewsCount: {
      type: Number,
      default: 0
    },
    salesCount: {
      type: Number,
      default: 0
    },
    // Ratings y Reviews (calculado desde reviews)
    averageRating: {
      type: Number,
      default: 0,
      min: [0, 'El rating no puede ser negativo'],
      max: [5, 'El rating no puede ser mayor a 5']
    },
    reviewsCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Índices compuestos para optimizar búsquedas
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ salesCount: -1 });
productSchema.index({ averageRating: -1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' }); // Búsqueda full-text

// Virtual para imágenes del producto
productSchema.virtual('images', {
  ref: 'ProductImage',
  localField: '_id',
  foreignField: 'product'
});

// Virtual para características del producto
productSchema.virtual('characteristics', {
  ref: 'ProductCharacteristic',
  localField: '_id',
  foreignField: 'product'
});

// Virtual para calcular descuento porcentual
productSchema.virtual('discountPercentage').get(function () {
  if (!this.compareAtPrice || this.compareAtPrice <= this.price) {
    return 0;
  }
  return Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
});

// Virtual para verificar disponibilidad
productSchema.virtual('isAvailable').get(function () {
  if (!this.isActive) return false;
  if (!this.trackInventory) return true;
  if (this.stock > 0) return true;
  return this.allowBackorder;
});

// Middleware para generar slug antes de guardar
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    const baseSlug = this.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    this.slug = baseSlug;
  }
  next();
});

// Método para actualizar rating promedio
productSchema.methods.updateRating = async function (newRating, isNewReview = true) {
  if (isNewReview) {
    const totalRating = this.averageRating * this.reviewsCount + newRating;
    this.reviewsCount += 1;
    this.averageRating = totalRating / this.reviewsCount;
  }
  await this.save();
};

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
