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
