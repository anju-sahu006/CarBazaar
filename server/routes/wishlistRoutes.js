const express = require('express');
const { store } = require('../utils/store');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// GET /api/wishlist - Get current user's saved car IDs and cars
router.get('/', authenticate, async (req, res) => {
  try {
    const carIds = await store.getWishlistByUser(req.user._id);
    const allCars = await store.listCars();
    const cars = carIds
      .map((id) => allCars.find((c) => c._id === id))
      .filter(Boolean);
    return res.json({ carIds: cars.map((c) => c._id), cars });
  } catch (err) {
    console.error('Get wishlist error:', err);
    return res.status(500).json({ message: 'Failed to load saved cars.' });
  }
});

// POST /api/wishlist/:carId - Add car to wishlist
router.post('/:carId', authenticate, async (req, res) => {
  try {
    const car = await store.findCarById(req.params.carId);
    if (!car) {
      return res.status(404).json({ message: 'Car listing not found.' });
    }
    const carIds = await store.addToWishlist(req.user._id, car._id);
    return res.json({ message: 'Added to wishlist.', carIds });
  } catch (err) {
    console.error('Add wishlist error:', err);
    return res.status(500).json({ message: 'Failed to save car to wishlist.' });
  }
});

// DELETE /api/wishlist/:carId - Remove car from wishlist
router.delete('/:carId', authenticate, async (req, res) => {
  try {
    const carIds = await store.removeFromWishlist(req.user._id, req.params.carId);
    return res.json({ message: 'Removed from wishlist.', carIds });
  } catch (err) {
    console.error('Remove wishlist error:', err);
    return res.status(500).json({ message: 'Failed to remove car from wishlist.' });
  }
});

module.exports = router;
