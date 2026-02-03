import mongoose from 'mongoose';

const productCharacteristicSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'El producto es requerido'],
      index: true
    },
    // Clave de la característica (ej: "color", "talla", "material", "capacidad")
    key: {
      type: String,
      required: [true, 'La clave es requerida'],
      trim: true,
      lowercase: true,
      maxlength: [50, 'La clave no puede exceder 50 caracteres']
    },
    // Nombre visible de la característica
    label: {
      type: String,
      required: [true, 'El label es requerido'],
      trim: true,
      maxlength: [100, 'El label no puede exceder 100 caracteres']
    },
    // Valor de la característica (puede ser string, array, número, etc.)
    // Se guarda como Mixed para máxima flexibilidad
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'El valor es requerido']
    },
    // Tipo de valor para facilitar el renderizado en frontend
    valueType: {
      type: String,
      enum: ['text', 'number', 'boolean', 'array', 'color', 'size', 'date'],
      default: 'text'
    },
    // Unidad de medida si aplica (ej: "cm", "kg", "GB", "ml")
    unit: {
      type: String,
      trim: true,
      default: null
    },
    // Orden de visualización
    order: {
      type: Number,
      default: 0
    },
    // Determina si es una característica destacada
    isFeatured: {
      type: Boolean,
      default: false
    },
    // Para características que pueden usarse como filtros
    isFilterable: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Índices compuestos para optimizar búsquedas
productCharacteristicSchema.index({ product: 1, key: 1 });
productCharacteristicSchema.index({ product: 1, order: 1 });
productCharacteristicSchema.index({ key: 1, isFilterable: 1 });

// Validación: no duplicar keys en el mismo producto
productCharacteristicSchema.index(
  { product: 1, key: 1 }, 
  { unique: true }
);

// Virtual para formatear el valor con unidad
productCharacteristicSchema.virtual('formattedValue').get(function () {
  if (this.valueType === 'array' && Array.isArray(this.value)) {
    return this.value.join(', ');
  }
  
  if (this.valueType === 'boolean') {
    return this.value ? 'Sí' : 'No';
  }
  
  let formatted = String(this.value);
  
  if (this.unit) {
    formatted += ` ${this.unit}`;
  }
  
  return formatted;
});

// Método estático para obtener todas las características únicas (para filtros)
productCharacteristicSchema.statics.getUniqueKeys = async function (categoryId = null) {
  const match = categoryId 
    ? { 'product.category': new mongoose.Types.ObjectId(categoryId), isFilterable: true }
    : { isFilterable: true };
  
  const characteristics = await this.aggregate([
    {
      $lookup: {
        from: 'products',
        localField: 'product',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' },
    { $match: match },
    {
      $group: {
        _id: '$key',
        label: { $first: '$label' },
        valueType: { $first: '$valueType' },
        values: { $addToSet: '$value' }
      }
    },
    { $sort: { _id: 1 } }
  ]);
  
  return characteristics;
};

/**
 * Ejemplos de uso:
 * 
 * 1. Color simple:
 * { key: 'color', label: 'Color', value: 'Rojo', valueType: 'color' }
 * 
 * 2. Tallas múltiples:
 * { key: 'size', label: 'Tallas disponibles', value: ['XS', 'S', 'M', 'L', 'XL'], valueType: 'array' }
 * 
 * 3. Capacidad con unidad:
 * { key: 'capacity', label: 'Capacidad', value: 256, valueType: 'number', unit: 'GB' }
 * 
 * 4. Material:
 * { key: 'material', label: 'Material', value: '100% Algodón', valueType: 'text' }
 * 
 * 5. Característica booleana:
 * { key: 'waterproof', label: 'Resistente al agua', value: true, valueType: 'boolean' }
 * 
 * 6. Dimensiones:
 * { key: 'dimensions', label: 'Dimensiones', value: '50x30x20', valueType: 'text', unit: 'cm' }
 */

const ProductCharacteristic = mongoose.models.ProductCharacteristic || 
  mongoose.model('ProductCharacteristic', productCharacteristicSchema);

export default ProductCharacteristic;
