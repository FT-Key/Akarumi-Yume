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
