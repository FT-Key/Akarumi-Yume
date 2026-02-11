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
});

export default mongoose.models.ProductImage || mongoose.model('ProductImage', productImageSchema);
