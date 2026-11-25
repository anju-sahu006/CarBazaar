const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    brand: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    variant: { type: String, default: '' },
    year: { type: Number, required: true },
    price: { type: Number, required: true },
    kilometers: { type: Number, required: true },
    fuelType: { type: String, enum: ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'], required: true },
    transmission: { type: String, enum: ['Manual', 'Automatic'], required: true },
    bodyType: { type: String, enum: ['Hatchback', 'Sedan', 'SUV', 'Compact SUV', 'MPV', 'Coupe'], required: true },
    engineCapacity: { type: String, required: true },
    ownership: { type: String, enum: ['First Owner', 'Second Owner', 'Third Owner', 'Fourth+ Owner'], required: true },
    registrationNumber: { type: String, default: '' },
    registrationState: { type: String, default: '' },
    location: { type: String, required: true },
    color: { type: String, default: 'Metallic Silver' },
    description: { type: String, required: true },
    images: { type: [String], default: [] },
    sellerId: { type: String, required: true },
    sellerName: { type: String, required: true },
    sellerPhone: { type: String, required: true },
    sellerEmail: { type: String, default: '' },
    status: { type: String, enum: ['active', 'sold'], default: 'active' },
    featured: { type: Boolean, default: false },
    views: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Car', carSchema);
