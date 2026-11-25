const express = require('express');
const { store } = require('../utils/store');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate, authorize('admin'));

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const [users, cars, inquiries] = await Promise.all([
      store.listUsers(),
      store.listCars(),
      store.listInquiries()
    ]);

    const totalUsers = users.length;
    const totalSellers = users.filter((u) => u.role === 'seller').length;
    const totalBuyers = users.filter((u) => u.role === 'buyer').length;
    const totalListings = cars.length;
    const activeListings = cars.filter((c) => c.status === 'active').length;
    const soldListings = cars.filter((c) => c.status === 'sold').length;
    const totalInquiries = inquiries.length;

    return res.json({
      stats: {
        totalUsers,
        totalSellers,
        totalBuyers,
        totalListings,
        activeListings,
        soldListings,
        totalInquiries
      }
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    return res.status(500).json({ message: 'Failed to load platform statistics.' });
  }
});

// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const users = await store.listUsers();
    return res.json({ users });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to load users.' });
  }
});

// PATCH /api/admin/users/:id/toggle
router.patch('/users/:id/toggle', async (req, res) => {
  try {
    if (req.params.id === req.user._id) {
      return res.status(400).json({ message: 'You cannot deactivate your own admin account.' });
    }
    const target = await store.findUserById(req.params.id);
    if (!target) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const updated = await store.updateUser(target._id, { isActive: target.isActive === false });
    return res.json({
      message: `User ${updated.isActive ? 'activated' : 'deactivated'} successfully.`,
      user: updated
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update user status.' });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', async (req, res) => {
  try {
    if (req.params.id === req.user._id) {
      return res.status(400).json({ message: 'You cannot delete your own account.' });
    }
    const target = await store.findUserById(req.params.id);
    if (!target) {
      return res.status(404).json({ message: 'User not found.' });
    }
    if (target.role === 'admin') {
      return res.status(400).json({ message: 'Admin accounts cannot be deleted.' });
    }
    await store.deleteUser(target._id);
    return res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete user.' });
  }
});

// GET /api/admin/cars
router.get('/cars', async (req, res) => {
  try {
    const cars = await store.listCars();
    return res.json({ cars });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to load all listings.' });
  }
});

// GET /api/admin/inquiries
router.get('/inquiries', async (req, res) => {
  try {
    const inquiries = await store.listInquiries();
    return res.json({ inquiries });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to load inquiries.' });
  }
});

module.exports = router;
