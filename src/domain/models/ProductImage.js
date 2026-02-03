import mongoose from 'mongoose';

const productImageSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'El producto es requerido'],
      index: true
    },
    // URL de Firebase Storage
    url: {
      type: String,
      required: [true, 'La URL de la imagen es requerida'],
      trim: true
    },
    // Path en Firebase Storage (para poder eliminar)
    storagePath: {
      type: String,
      required: [true, 'El path de storage es requerido'],
      trim: true
    },
    // Texto alternativo para SEO y accesibilidad
    altText: {
      type: String,
      trim: true,
      default: null
    },
    // Indica si es la imagen principal
    isPrimary: {
      type: Boolean,
      default: false
    },
    // Orden de visualización
    order: {
      type: Number,
      default: 0
    },
    // Dimensiones de la imagen
    width: {
      type: Number,
      default: null
    },
    height: {
      type: Number,
      default: null
    },
    // Tamaño del archivo en bytes
    fileSize: {
      type: Number,
      default: null
    },
    // Tipo MIME
    mimeType: {
      type: String,
      default: 'image/jpeg'
    }
  },
  {
    timestamps: true
  }
);

// Índices compuestos
productImageSchema.index({ product: 1, isPrimary: 1 });
productImageSchema.index({ product: 1, order: 1 });

// Middleware: Solo puede haber una imagen principal por producto
productImageSchema.pre('save', async function (next) {
  if (this.isNew && this.isPrimary) {
    // Remover isPrimary de otras imágenes del mismo producto
    await mongoose.model('ProductImage').updateMany(
      { product: this.product, _id: { $ne: this._id } },
      { isPrimary: false }
    );
  }
  next();
});

// Si se elimina una imagen primary, establecer otra como primary
productImageSchema.post('findOneAndDelete', async function (doc) {
  if (doc && doc.isPrimary) {
    const nextImage = await mongoose.model('ProductImage')
      .findOne({ product: doc.product })
      .sort({ order: 1 });
    
    if (nextImage) {
      nextImage.isPrimary = true;
      await nextImage.save();
    }
  }
});

const ProductImage = mongoose.models.ProductImage || 
  mongoose.model('ProductImage', productImageSchema);

export default ProductImage;
