import mongoose, { Schema } from 'mongoose';

const DAY_HOURS = {
  open: { type: String },
  close: { type: String },
  isOpen: { type: Boolean, default: true },
};

const deliveryTypeSchema = new Schema(
  {
    type:           { type: String, enum: ['PICKUP', 'DELIVERY'], required: true },
    name:           { type: String, required: true, trim: true },
    description:    { type: String, trim: true },
    price:          { type: Number, required: true, min: 0 },
    estimatedDays:  { min: { type: Number, min: 0 }, max: { type: Number, min: 0 } },
    pickupAddress:  {                                                        // Solo si es PICKUP
      street: String, streetNumber: String, city: String,
      province: String, postalCode: String,
      reference: String,
      coordinates: { lat: Number, lng: Number },
    },
    businessHours:  {                                                        // Horarios (solo PICKUP)
      monday: DAY_HOURS, tuesday: DAY_HOURS, wednesday: DAY_HOURS,
      thursday: DAY_HOURS, friday: DAY_HOURS, saturday: DAY_HOURS, sunday: DAY_HOURS,
    },
    isActive:       { type: Boolean, default: true },
    order:          { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.DeliveryType || mongoose.model('DeliveryType', deliveryTypeSchema);
