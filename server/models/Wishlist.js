const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    userId: { type: String, required: true },
    carId: { type: String, required: true }
  },
  { timestamps: true }
);

wishlistSchema.index({ userId: 1, carId: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);
