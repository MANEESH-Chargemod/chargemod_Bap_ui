import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true
  },
  transactionId: String,
  stationId: {
    type: String,
    required: true
  },
  userId: String,
  userDetails: {
    name: String,
    email: String,
    phone: String,
    vehicleType: String
  },
  chargingParameters: {
    energyAmount: Number,
    connectorType: String,
    maxPower: Number,
    estimatedDuration: Number
  },
  quote: {
    price: {
      value: Number,
      currency: String
    },
    breakup: [{
      title: String,
      price: {
        value: Number,
        currency: String
      }
    }]
  },
  status: {
    type: String,
    enum: ['DRAFT', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'PAYMENT_PENDING'],
    default: 'DRAFT'
  },
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED'],
    default: 'PENDING'
  },
  paymentDetails: {
    paymentId: String,
    paymentMethod: String,
    amount: Number,
    currency: String,
    paymentDate: Date
  },
  sessionStart: Date,
  sessionEnd: Date,
  totalEnergy: Number,
  finalCost: Number
}, {
  timestamps: true
});

export default mongoose.model('Booking', bookingSchema);