const express = require('express');
const { store } = require('../utils/store');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

function validateCarPayload(body, isEdit = false) {
  const errors = [];
  const currentYear = new Date().getFullYear() + 1;

  if (!isEdit || body.brand !== undefined) {
    if (!body.brand || !String(body.brand).trim()) errors.push('Brand is required.');
  }
  if (!isEdit || body.model !== undefined) {
    if (!body.model || !String(body.model).trim()) errors.push('Model is required.');
  }
  if (!isEdit || body.year !== undefined) {
    const yr = Number(body.year);
    if (!Number.isFinite(yr) || yr < 1995 || yr > currentYear) {
      errors.push(`Manufacturing year must be between 1995 and ${currentYear}.`);
    }
  }
  if (!isEdit || body.price !== undefined) {
    const pr = Number(body.price);
    if (!Number.isFinite(pr) || pr <= 0) {
      errors.push('Selling price must be greater than zero.');
    }
  }
  if (!isEdit || body.kilometers !== undefined) {
    const km = Number(body.kilometers);
    if (!Number.isFinite(km) || km < 0) {
      errors.push('Kilometers driven cannot be negative.');
    }
  }
  if (!isEdit || body.fuelType !== undefined) {
    if (!body.fuelType) errors.push('Fuel type is required.');
  }
  if (!isEdit || body.transmission !== undefined) {
    if (!body.transmission) errors.push('Transmission is required.');
  }
  if (!isEdit || body.bodyType !== undefined) {
    if (!body.bodyType) errors.push('Body type is required.');
  }
  if (!isEdit || body.engineCapacity !== undefined) {
    if (!body.engineCapacity || !String(body.engineCapacity).trim()) {
      errors.push('Engine capacity is required.');
    }
  }
  if (!isEdit || body.ownership !== undefined) {
    if (!body.ownership) errors.push('Ownership is required.');
  }
  if (!isEdit || body.location !== undefined) {
    if (!body.location || !String(body.location).trim()) errors.push('Location is required.');
  }
  if (!isEdit || body.description !== undefined) {
    if (!body.description || !String(body.description).trim()) errors.push('Description is required.');
  }
  if (!isEdit || body.sellerPhone !== undefined) {
    if (!body.sellerPhone || !String(body.sellerPhone).trim()) {
      errors.push('Seller contact number is required.');
    }
  }

  return errors;
}

// GET /api/cars - Public browse with combined search, filters, and sorting
router.get('/', async (req, res) => {
  try {
    const {
      search,
      brand,
      fuelType,
      transmission,
      bodyType,
      location,
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      sort,
      featured,
      includeSold
    } = req.query;

    let cars = await store.listCars();

    // Remove sold listings from normal buyer search results unless explicitly requested
    if (includeSold !== 'true') {
      cars = cars.filter((c) => c.status === 'active');
    }

    if (featured === 'true') {
      cars = cars.filter((c) => Boolean(c.featured));
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      cars = cars.filter(
        (c) =>
          c.brand.toLowerCase().includes(q) ||
          c.model.toLowerCase().includes(q) ||
          (c.variant && c.variant.toLowerCase().includes(q)) ||
          c.location.toLowerCase().includes(q) ||
          `${c.brand} ${c.model}`.toLowerCase().includes(q)
      );
    }

    if (brand && brand !== 'All') {
      cars = cars.filter((c) => c.brand.toLowerCase() === brand.toLowerCase());
    }
    if (fuelType && fuelType !== 'All') {
      cars = cars.filter((c) => c.fuelType.toLowerCase() === fuelType.toLowerCase());
    }
    if (transmission && transmission !== 'All') {
      cars = cars.filter((c) => c.transmission.toLowerCase() === transmission.toLowerCase());
    }
    if (bodyType && bodyType !== 'All') {
      cars = cars.filter((c) => c.bodyType.toLowerCase() === bodyType.toLowerCase());
    }
    if (location && location !== 'All') {
      cars = cars.filter((c) => c.location.toLowerCase() === location.toLowerCase());
    }
    if (minPrice !== undefined && minPrice !== '') {
      const minP = Number(minPrice);
      if (Number.isFinite(minP)) cars = cars.filter((c) => c.price >= minP);
    }
    if (maxPrice !== undefined && maxPrice !== '') {
      const maxP = Number(maxPrice);
      if (Number.isFinite(maxP)) cars = cars.filter((c) => c.price <= maxP);
    }
    if (minYear !== undefined && minYear !== '') {
      const minY = Number(minYear);
      if (Number.isFinite(minY)) cars = cars.filter((c) => c.year >= minY);
    }
    if (maxYear !== undefined && maxYear !== '') {
      const maxY = Number(maxYear);
      if (Number.isFinite(maxY)) cars = cars.filter((c) => c.year <= maxY);
    }

    if (sort === 'price_asc') {
      cars.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      cars.sort((a, b) => b.price - a.price);
    } else {
      cars.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return res.json({ cars, total: cars.length });
  } catch (err) {
    console.error('List cars error:', err);
    return res.status(500).json({ message: 'Failed to load car listings.' });
  }
});

// GET /api/cars/seller/mine - Seller's own listings (active + sold)
router.get('/seller/mine', authenticate, authorize('seller', 'admin'), async (req, res) => {
  try {
    const cars = await store.listCars({ sellerId: req.user._id });
    return res.json({ cars });
  } catch (err) {
    console.error('Seller cars error:', err);
    return res.status(500).json({ message: 'Failed to fetch your listings.' });
  }
});

// GET /api/cars/:id - Single car details
router.get('/:id', async (req, res) => {
  try {
    const car = await store.findCarById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car listing not found.' });
    }
    const updated = await store.updateCar(car._id, { views: (car.views || 0) + 1 });
    return res.json({ car: updated || car });
  } catch (err) {
    console.error('Get car error:', err);
    return res.status(500).json({ message: 'Failed to fetch car details.' });
  }
});

// POST /api/cars - Create new car listing
router.post('/', authenticate, authorize('seller', 'admin'), async (req, res) => {
  try {
    const errors = validateCarPayload(req.body, false);
    if (errors.length > 0) {
      return res.status(400).json({ message: errors[0], errors });
    }

    const images = Array.isArray(req.body.images) && req.body.images.length > 0
      ? req.body.images
      : ['/images/fallback-car.svg'];

    const newCar = await store.createCar({
      brand: req.body.brand.trim(),
      model: req.body.model.trim(),
      variant: req.body.variant ? req.body.variant.trim() : '',
      year: Number(req.body.year),
      price: Number(req.body.price),
      kilometers: Number(req.body.kilometers),
      fuelType: req.body.fuelType,
      transmission: req.body.transmission,
      bodyType: req.body.bodyType,
      engineCapacity: req.body.engineCapacity.trim(),
      ownership: req.body.ownership,
      registrationNumber: req.body.registrationNumber ? req.body.registrationNumber.trim().toUpperCase() : '',
      registrationState: req.body.registrationState ? req.body.registrationState.trim() : '',
      location: req.body.location.trim(),
      color: req.body.color ? req.body.color.trim() : 'Metallic Silver',
      description: req.body.description.trim(),
      images,
      sellerId: req.user._id,
      sellerName: req.user.name,
      sellerPhone: req.body.sellerPhone.trim(),
      sellerEmail: req.user.email,
      status: 'active',
      featured: Boolean(req.body.featured)
    });

    return res.status(201).json({ message: 'Car listing published successfully.', car: newCar });
  } catch (err) {
    console.error('Create car error:', err);
    return res.status(500).json({ message: 'Failed to create listing.' });
  }
});

// PUT /api/cars/:id - Update car listing
router.put('/:id', authenticate, authorize('seller', 'admin'), async (req, res) => {
  try {
    const existing = await store.findCarById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Car listing not found.' });
    }
    if (req.user.role !== 'admin' && existing.sellerId !== req.user._id) {
      return res.status(403).json({ message: 'You can only edit your own listings.' });
    }

    const errors = validateCarPayload(req.body, true);
    if (errors.length > 0) {
      return res.status(400).json({ message: errors[0], errors });
    }

    const updates = {};
    const fields = [
      'brand', 'model', 'variant', 'fuelType', 'transmission', 'bodyType',
      'engineCapacity', 'ownership', 'registrationNumber', 'registrationState',
      'location', 'color', 'description', 'sellerPhone', 'status'
    ];
    for (const f of fields) {
      if (req.body[f] !== undefined) {
        updates[f] = typeof req.body[f] === 'string' ? req.body[f].trim() : req.body[f];
      }
    }
    if (req.body.year !== undefined) updates.year = Number(req.body.year);
    if (req.body.price !== undefined) updates.price = Number(req.body.price);
    if (req.body.kilometers !== undefined) updates.kilometers = Number(req.body.kilometers);
    if (req.body.featured !== undefined) updates.featured = Boolean(req.body.featured);
    if (Array.isArray(req.body.images)) {
      updates.images = req.body.images.length > 0 ? req.body.images : ['/images/fallback-car.svg'];
    }

    const updated = await store.updateCar(existing._id, updates);
    return res.json({ message: 'Listing updated successfully.', car: updated });
  } catch (err) {
    console.error('Update car error:', err);
    return res.status(500).json({ message: 'Failed to update listing.' });
  }
});

// PATCH /api/cars/:id/sold - Mark listing as sold (or active)
router.patch('/:id/sold', authenticate, authorize('seller', 'admin'), async (req, res) => {
  try {
    const existing = await store.findCarById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Car listing not found.' });
    }
    if (req.user.role !== 'admin' && existing.sellerId !== req.user._id) {
      return res.status(403).json({ message: 'You can only update your own listings.' });
    }

    const nextStatus = req.body.status === 'active' ? 'active' : 'sold';
    const updated = await store.updateCar(existing._id, { status: nextStatus });
    return res.json({
      message: nextStatus === 'sold' ? 'Listing marked as Sold.' : 'Listing reactivated.',
      car: updated
    });
  } catch (err) {
    console.error('Mark sold error:', err);
    return res.status(500).json({ message: 'Failed to update listing status.' });
  }
});

// DELETE /api/cars/:id - Delete car listing
router.delete('/:id', authenticate, authorize('seller', 'admin'), async (req, res) => {
  try {
    const existing = await store.findCarById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Car listing not found.' });
    }
    if (req.user.role !== 'admin' && existing.sellerId !== req.user._id) {
      return res.status(403).json({ message: 'You can only delete your own listings.' });
    }

    await store.deleteCar(existing._id);
    return res.json({ message: 'Listing deleted successfully.' });
  } catch (err) {
    console.error('Delete car error:', err);
    return res.status(500).json({ message: 'Failed to delete listing.' });
  }
});

module.exports = router;
