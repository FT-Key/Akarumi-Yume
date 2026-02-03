import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El usuario es requerido'],
      index: true
    },
    alias: {
      type: String,
      required: [true, 'El alias es requerido'],
      trim: true,
      maxlength: [50, 'El alias no puede exceder 50 caracteres'],
      // Ejemplo: "Casa", "Trabajo", "Casa de mamá"
    },
    // Información para Google Maps
    street: {
      type: String,
      required: [true, 'La calle es requerida'],
      trim: true
    },
    streetNumber: {
      type: String,
      required: [true, 'La altura es requerida'],
      trim: true
    },
    floor: {
      type: String,
      trim: true,
      default: null
    },
    apartment: {
      type: String,
      trim: true,
      default: null
    },
    // Localización administrativa
    city: {
      type: String,
      required: [true, 'La ciudad es requerida'],
      trim: true
    },
    province: {
      type: String,
      required: [true, 'La provincia es requerida'],
      trim: true,
      enum: [
        'Buenos Aires',
        'Catamarca',
        'Chaco',
        'Chubut',
        'Córdoba',
        'Corrientes',
        'Entre Ríos',
        'Formosa',
        'Jujuy',
        'La Pampa',
        'La Rioja',
        'Mendoza',
        'Misiones',
        'Neuquén',
        'Río Negro',
        'Salta',
        'San Juan',
        'San Luis',
        'Santa Cruz',
        'Santa Fe',
        'Santiago del Estero',
        'Tierra del Fuego',
        'Tucumán'
      ]
    },
    postalCode: {
      type: String,
      required: [true, 'El código postal es requerido'],
      trim: true,
      match: [/^[A-Z]?\d{4}[A-Z]{0,3}$/, 'Código postal inválido']
    },
    country: {
      type: String,
      default: 'Argentina',
      trim: true
    },
    // Referencias adicionales
    reference: {
      type: String,
      trim: true,
      maxlength: [200, 'La referencia no puede exceder 200 caracteres'],
      // Ejemplo: "Casa azul con portón blanco", "Al lado del supermercado"
    },
    // Coordenadas obtenidas de Google Maps API
    coordinates: {
      lat: {
        type: Number,
        default: null
      },
      lng: {
        type: Number,
        default: null
      }
    },
    // Dirección formateada por Google Maps
    formattedAddress: {
      type: String,
      trim: true
    },
    // Place ID de Google Maps (para mantener referencia)
    googlePlaceId: {
      type: String,
      trim: true
    },
    // Indicar si es dirección por defecto
    isDefault: {
      type: Boolean,
      default: false
    },
    // Validación de Google Maps
    isValidated: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Índices compuestos para optimizar búsquedas
addressSchema.index({ user: 1, isDefault: 1 });
addressSchema.index({ user: 1, createdAt: -1 });

// Virtual para dirección completa legible
addressSchema.virtual('fullAddress').get(function () {
  let address = `${this.street} ${this.streetNumber}`;
  
  if (this.floor || this.apartment) {
    address += `, ${this.floor ? `Piso ${this.floor}` : ''} ${
      this.apartment ? `Dpto ${this.apartment}` : ''
    }`.trim();
  }
  
  address += `, ${this.city}, ${this.province}, ${this.postalCode}, ${this.country}`;
  
  return address;
});

// Middleware: Solo puede haber una dirección por defecto por usuario
addressSchema.pre('save', async function (next) {
  if (this.isDefault) {
    // Remover default de otras direcciones del mismo usuario
    await mongoose.model('Address').updateMany(
      { user: this.user, _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
  next();
});

// Método para formatear dirección para Google Maps API
addressSchema.methods.getGoogleMapsQuery = function () {
  return `${this.street} ${this.streetNumber}, ${this.city}, ${this.province} ${this.postalCode}, ${this.country}`;
};

const Address = mongoose.models.Address || mongoose.model('Address', addressSchema);

export default Address;
