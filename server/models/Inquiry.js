const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    carId: { type: String, required: true },
    carTitle: { type: String, required: true },
    carPrice: { type: Number, required: true },
    carImage: { type: String, default: '' },
    buyerId: { type: String, default: '' },
    buyerName: { type: String, required: true },
    buyerEmail: { type: String, required: true },
    buyerPhone: { type: String, required: true },
    message: { type: String, required: true },
    sellerId: { type: String, required: true },
    sellerName: { type: String, default: '' },
    status: { type: String, enum: ['Pending', 'Contacted', 'Closed'], default: 'Pending' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inquiry', inquirySchema);
