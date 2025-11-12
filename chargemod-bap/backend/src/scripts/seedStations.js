import mongoose from 'mongoose';
import Station from '../models/Station.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleStations = [
  {
    stationId: 'station_1',
    provider: {
      name: 'EV Charging Hub - Koramangala',
      description: '24/7 Fast Charging Station',
      contact: {
        phone: '+91-9876543210',
        email: 'koramangala@evhub.com'
      }
    },
    location: {
      gps: '12.9352,77.6245',
      lat: 12.9352,
      lng: 77.6245,
      address: {
        street: '80 Feet Road, Koramangala',
        city: 'Bangalore',
        state: 'Karnataka',
        country: 'India',
        pinCode: '560034'
      }
    },
    chargerDetails: {
      connectorType: 'CCS2',
      chargingSpeed: 'FAST',
      powerOutput: 50,
      availability: true,
      supportedVehicles: ['Tata Nexon EV', 'MG ZS EV', 'Hyundai Kona']
    },
    pricing: {
      pricePerKwh: 12.5,
      currency: 'INR',
      minBookingAmount: 50
    },
    operatingHours: {
      open24x7: true
    },
    amenities: ['Cafe', 'Restrooms', 'WiFi'],
    isActive: true
  },
  {
    stationId: 'station_2',
    provider: {
      name: 'Power EV Center - HSR Layout',
      description: 'Ultra Fast Charging Station',
      contact: {
        phone: '+91-9876543211',
        email: 'hsr@powerev.com'
      }
    },
    location: {
      gps: '12.9110,77.6386',
      lat: 12.9110,
      lng: 77.6386,
      address: {
        street: '27th Main, HSR Layout',
        city: 'Bangalore',
        state: 'Karnataka',
        country: 'India',
        pinCode: '560102'
      }
    },
    chargerDetails: {
      connectorType: 'TYPE2',
      chargingSpeed: 'ULTRA_FAST',
      powerOutput: 120,
      availability: true
    },
    pricing: {
      pricePerKwh: 15.0,
      currency: 'INR',
      minBookingAmount: 100
    },
    operatingHours: {
      open24x7: true
    },
    amenities: ['Restrooms', 'Convenience Store'],
    isActive: true
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chargemod');
    console.log('✅ Connected to MongoDB');

    await Station.deleteMany({});
    console.log('🧹 Cleared existing stations');

    await Station.insertMany(sampleStations);
    console.log(`✅ Seeded ${sampleStations.length} stations`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();