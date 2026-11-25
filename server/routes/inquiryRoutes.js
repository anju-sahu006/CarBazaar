const express = require('express');
const { store } = require('../utils/store');
const { authenticate, optionalAuth, authorize } = require('../middleware/auth');

const router = express.Router();

// POST /api/inquiries - Submit a buyer inquiry
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { carId, buyerName, buyerEmail, buyerPhone, message } = req.body;

    if (!carId) return res.status(400).json({ message: 'Selected car is required.' });
    if (!buyerName || !buyerName.trim()) return res.status(400).json({ message: 'Buyer name is required.' });
    if (!buyerEmail || !/^\S+@\S+\.\S+$/.test(buyerEmail)) {
      return res.status(400).json({ message: 'Valid email address is required.' });
    }
    if (!buyerPhone || !buyerPhone.trim()) return res.status(400).json({ message: 'Phone number is required.' });
    if (!message || !message.trim()) return res.status(400).json({ message: 'Inquiry message is required.' });

    const car = await store.findCarById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Selected car listing not found.' });
    }

    const inquiry = await store.createInquiry({
      carId: car._id,
      carTitle: `${car.year} ${car.brand} ${car.model}${car.variant ? ` ${car.variant}` : ''}`,
      carPrice: car.price,
      carImage: (car.images && car.images[0]) || '/images/fallback-car.svg',
      buyerId: req.user ? req.user._id : '',
      buyerName: buyerName.trim(),
      buyerEmail: buyerEmail.trim().toLowerCase(),
      buyerPhone: buyerPhone.trim(),
      message: message.trim(),
      sellerId: car.sellerId,
      sellerName: car.sellerName
    });

    return res.status(201).json({
      message: 'Your inquiry has been sent to the seller!',
      inquiry
    });
  } catch (err) {
    console.error('Create inquiry error:', err);
    return res.status(500).json({ message: 'Failed to submit inquiry.' });
  }
});

// GET /api/inquiries/buyer - Buyer's own inquiries
router.get('/buyer', authenticate, async (req, res) => {
  try {
    const all = await store.listInquiries();
    const mine = all.filter(
      (i) => i.buyerId === req.user._id || i.buyerEmail.toLowerCase() === req.user.email.toLowerCase()
    );
    return res.json({ inquiries: mine });
  } catch (err) {
    console.error('Buyer inquiries error:', err);
    return res.status(500).json({ message: 'Failed to load your inquiries.' });
  }
});

// GET /api/inquiries/seller - Inquiries directed to the logged-in seller
router.get('/seller', authenticate, authorize('seller', 'admin'), async (req, res) => {
  try {
    const inquiries = await store.listInquiries({ sellerId: req.user._id });
    return res.json({ inquiries });
  } catch (err) {
    console.error('Seller inquiries error:', err);
    return res.status(500).json({ message: 'Failed to load buyer inquiries.' });
  }
});

// PATCH /api/inquiries/:id/status - Update inquiry status (Pending / Contacted / Closed)
router.patch('/:id/status', authenticate, authorize('seller', 'admin'), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Contacted', 'Closed'].includes(status)) {
      return res.status(400).json({ message: 'Status must be Pending, Contacted, or Closed.' });
    }

    const inquiry = await store.findInquiryById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found.' });
    }

    if (req.user.role !== 'admin' && inquiry.sellerId !== req.user._id) {
      return res.status(403).json({ message: 'You can only update inquiries for your own listings.' });
    }

    const updated = await store.updateInquiry(inquiry._id, { status });
    return res.json({ message: `Inquiry marked as ${status}.`, inquiry: updated });
  } catch (err) {
    console.error('Update inquiry status error:', err);
    return res.status(500).json({ message: 'Failed to update inquiry status.' });
  }
});

module.exports = router;
