import mongoose from 'mongoose';

const stationSchema = new mongoose.Schema({
  stationId: {
    type: String,
    required: true,
    unique: true
  },
  provider: {
    id: String,
    name: String,
    description: String,
    contact: {
      phone: String,
      email: String
    }
  },
  location: {
    gps: String,
    lat: Number,
    lng: Number,
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      pinCode: String
    }
  },
  chargerDetails: {
    connectorType: {
      type: String,
      enum: ['TYPE2', 'CCS2', 'CHAdeMO', 'GB/T', 'TESLA']
    },
    chargingSpeed: {
      type: String,
      enum: ['SLOW', 'MEDIUM', 'FAST', 'ULTRA_FAST']
    },
    powerOutput: Number,
    availability: Boolean,
    supportedVehicles: [String]
  },
  pricing: {
    pricePerKwh: Number,
    currency: String,
    minBookingAmount: Number,
    dynamicPricing: Boolean
  },
  operatingHours: {
    open24x7: Boolean,
    openingTime: String,
    closingTime: String,
    timezone: String
  },
  amenities: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Station', stationSchema);