import mongoose, { Schema } from 'mongoose';
import { PROVINCES } from '../utils/constants.js';

const addressSchema = new Schema(
  {
    user:             { type: Schema.Types.ObjectId, ref: 'User', required: true },
    alias:            { type: String, trim: true },                          // "Casa", "Oficina"
    street:           { type: String, required: true, trim: true },
    streetNumber:     { type: String, required: true, trim: true },
    floor:            { type: String, trim: true },
    apartment:        { type: String, trim: true },
    city:             { type: String, required: true, trim: true },
    province:         { type: String, required: true, enum: PROVINCES },
    postalCode:       { type: String, required: true, match: /^[A-Z]?\d{4}[A-Z]?$/ },
    country:          { type: String, default: 'Argentina' },
    reference:        { type: String, trim: true },                          // "Edificio blanco"
    coordinates:      { lat: Number, lng: Number },                          // De Google Maps
    formattedAddress: { type: String },                                      // Dirección formattada por Google
    googlePlaceId:    { type: String },                                      // Place ID de Google
    isDefault:        { type: Boolean, default: false },
    isValidated:      { type: Boolean, default: false },                     // Validada con Google Maps
  },
  { timestamps: true }
);

// Índices compuestos
addressSchema.index({ user: 1, isDefault: 1 });
addressSchema.index({ user: 1, createdAt: -1 });

// Solo una dirección default por usuario
addressSchema.pre('save', async function (next) {
  if (this.isDefault && this.isModified('isDefault')) {
    await mongoose.model('Address').updateMany(
      { user: this.user, _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
});

// Helper para generar query de Google Maps
addressSchema.methods.getGoogleMapsQuery = function () {
  const parts = [
    `${this.street} ${this.streetNumber}`,
    this.floor ? `Piso ${this.floor}` : null,
    this.apartment ? `Apto ${this.apartment}` : null,
    this.city,
    this.province,
    this.postalCode,
    this.country,
  ];
  return parts.filter(Boolean).join(', ');
};

export default mongoose.models.Address || mongoose.model('Address', addressSchema);
