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
