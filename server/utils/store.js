const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { getMongoStatus } = require('../config/db');
const { getSeedData } = require('../data/seedData');
const User = require('../models/User');
const Car = require('../models/Car');
const Inquiry = require('../models/Inquiry');
const Wishlist = require('../models/Wishlist');

const DB_FILE = path.join(__dirname, '..', 'data', 'db.json');

function genId(prefix) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

function readJsonDb() {
  if (!fs.existsSync(DB_FILE)) {
    const seed = getSeedData();
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), 'utf8');
    return seed;
  }
  const raw = fs.readFileSync(DB_FILE, 'utf8');
  return JSON.parse(raw);
}

function writeJsonDb(data) {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

async function ensureSeeded() {
  if (getMongoStatus()) {
    const userCount = await User.countDocuments();
    const carCount = await Car.countDocuments();
    if (userCount === 0 && carCount === 0) {
      const seed = getSeedData();
      await User.insertMany(seed.users);
      await Car.insertMany(seed.cars);
      await Inquiry.insertMany(seed.inquiries);
      await Wishlist.insertMany(seed.wishlists);
      console.log('Seeded MongoDB with initial demo users, 22 cars, inquiries, and wishlists.');
    }
  } else {
    readJsonDb();
    console.log('Local JSON store initialized at server/data/db.json.');
  }
}

const store = {
  // --- Users ---
  async findUserByEmail(email) {
    const normalized = String(email).toLowerCase().trim();
    if (getMongoStatus()) {
      return User.findOne({ email: normalized }).lean();
    }
    const db = readJsonDb();
    return db.users.find((u) => u.email.toLowerCase() === normalized) || null;
  },

  async findUserById(id) {
    if (getMongoStatus()) {
      return User.findById(id).lean();
    }
    const db = readJsonDb();
    return db.users.find((u) => u._id === id) || null;
  },

  async listUsers() {
    if (getMongoStatus()) {
      return User.find().select('-password').sort({ createdAt: -1 }).lean();
    }
    const db = readJsonDb();
    return [...db.users]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(({ password, ...safe }) => safe);
  },

  async createUser(userData) {
    if (getMongoStatus()) {
      const created = await User.create(userData);
      return created.toObject();
    }
    const db = readJsonDb();
    const newUser = {
      _id: genId('user'),
      ...userData,
      isActive: userData.isActive !== undefined ? userData.isActive : true,
      createdAt: new Date().toISOString()
    };
    db.users.push(newUser);
    writeJsonDb(db);
    return newUser;
  },

  async updateUser(id, updates) {
    if (getMongoStatus()) {
      return User.findByIdAndUpdate(id, updates, { new: true }).select('-password').lean();
    }
    const db = readJsonDb();
    const idx = db.users.findIndex((u) => u._id === id);
    if (idx === -1) return null;
    db.users[idx] = { ...db.users[idx], ...updates, updatedAt: new Date().toISOString() };
    writeJsonDb(db);
    const { password, ...safe } = db.users[idx];
    return safe;
  },

  async deleteUser(id) {
    if (getMongoStatus()) {
      const deleted = await User.findByIdAndDelete(id).lean();
      if (deleted) {
        await Wishlist.deleteMany({ userId: id });
      }
      return deleted;
    }
    const db = readJsonDb();
    const idx = db.users.findIndex((u) => u._id === id);
    if (idx === -1) return null;
    const [removed] = db.users.splice(idx, 1);
    db.wishlists = db.wishlists.filter((w) => w.userId !== id);
    writeJsonDb(db);
    return removed;
  },

  // --- Cars ---
  async listCars(filter = {}) {
    if (getMongoStatus()) {
      const query = {};
      if (filter.status) query.status = filter.status;
      if (filter.sellerId) query.sellerId = filter.sellerId;
      if (filter.featured !== undefined) query.featured = filter.featured;
      return Car.find(query).sort({ createdAt: -1 }).lean();
    }
    const db = readJsonDb();
    return db.cars
      .filter((c) => {
        if (filter.status && c.status !== filter.status) return false;
        if (filter.sellerId && c.sellerId !== filter.sellerId) return false;
        if (filter.featured !== undefined && Boolean(c.featured) !== Boolean(filter.featured)) return false;
        return true;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async findCarById(id) {
    if (getMongoStatus()) {
      return Car.findById(id).lean();
    }
    const db = readJsonDb();
    return db.cars.find((c) => c._id === id) || null;
  },

  async createCar(carData) {
    if (getMongoStatus()) {
      const created = await Car.create(carData);
      return created.toObject();
    }
    const db = readJsonDb();
    const newCar = {
      _id: genId('car'),
      ...carData,
      status: carData.status || 'active',
      featured: Boolean(carData.featured),
      views: 0,
      createdAt: new Date().toISOString()
    };
    db.cars.unshift(newCar);
    writeJsonDb(db);
    return newCar;
  },

  async updateCar(id, updates) {
    if (getMongoStatus()) {
      return Car.findByIdAndUpdate(id, updates, { new: true }).lean();
    }
    const db = readJsonDb();
    const idx = db.cars.findIndex((c) => c._id === id);
    if (idx === -1) return null;
    db.cars[idx] = { ...db.cars[idx], ...updates, updatedAt: new Date().toISOString() };
    writeJsonDb(db);
    return db.cars[idx];
  },

  async deleteCar(id) {
    if (getMongoStatus()) {
      const deleted = await Car.findByIdAndDelete(id).lean();
      if (deleted) {
        await Wishlist.deleteMany({ carId: id });
      }
      return deleted;
    }
    const db = readJsonDb();
    const idx = db.cars.findIndex((c) => c._id === id);
    if (idx === -1) return null;
    const [removed] = db.cars.splice(idx, 1);
    db.wishlists = db.wishlists.filter((w) => w.carId !== id);
    writeJsonDb(db);
    return removed;
  },

  // --- Wishlist ---
  async getWishlistByUser(userId) {
    if (getMongoStatus()) {
      const entries = await Wishlist.find({ userId }).sort({ createdAt: -1 }).lean();
      return entries.map((e) => e.carId);
    }
    const db = readJsonDb();
    return db.wishlists
      .filter((w) => w.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((w) => w.carId);
  },

  async addToWishlist(userId, carId) {
    if (getMongoStatus()) {
      const exists = await Wishlist.findOne({ userId, carId });
      if (!exists) {
        await Wishlist.create({ userId, carId });
      }
      return this.getWishlistByUser(userId);
    }
    const db = readJsonDb();
    const exists = db.wishlists.some((w) => w.userId === userId && w.carId === carId);
    if (!exists) {
      db.wishlists.push({
        _id: genId('wish'),
        userId,
        carId,
        createdAt: new Date().toISOString()
      });
      writeJsonDb(db);
    }
    return this.getWishlistByUser(userId);
  },

  async removeFromWishlist(userId, carId) {
    if (getMongoStatus()) {
      await Wishlist.deleteOne({ userId, carId });
      return this.getWishlistByUser(userId);
    }
    const db = readJsonDb();
    db.wishlists = db.wishlists.filter((w) => !(w.userId === userId && w.carId === carId));
    writeJsonDb(db);
    return this.getWishlistByUser(userId);
  },

  // --- Inquiries ---
  async listInquiries(filter = {}) {
    if (getMongoStatus()) {
      const query = {};
      if (filter.buyerId) query.buyerId = filter.buyerId;
      if (filter.sellerId) query.sellerId = filter.sellerId;
      if (filter.carId) query.carId = filter.carId;
      return Inquiry.find(query).sort({ createdAt: -1 }).lean();
    }
    const db = readJsonDb();
    return db.inquiries
      .filter((inq) => {
        if (filter.buyerId && inq.buyerId !== filter.buyerId) return false;
        if (filter.sellerId && inq.sellerId !== filter.sellerId) return false;
        if (filter.carId && inq.carId !== filter.carId) return false;
        return true;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async findInquiryById(id) {
    if (getMongoStatus()) {
      return Inquiry.findById(id).lean();
    }
    const db = readJsonDb();
    return db.inquiries.find((i) => i._id === id) || null;
  },

  async createInquiry(data) {
    if (getMongoStatus()) {
      const created = await Inquiry.create(data);
      return created.toObject();
    }
    const db = readJsonDb();
    const newInq = {
      _id: genId('inq'),
      ...data,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    db.inquiries.unshift(newInq);
    writeJsonDb(db);
    return newInq;
  },

  async updateInquiry(id, updates) {
    if (getMongoStatus()) {
      return Inquiry.findByIdAndUpdate(id, updates, { new: true }).lean();
    }
    const db = readJsonDb();
    const idx = db.inquiries.findIndex((i) => i._id === id);
    if (idx === -1) return null;
    db.inquiries[idx] = { ...db.inquiries[idx], ...updates, updatedAt: new Date().toISOString() };
    writeJsonDb(db);
    return db.inquiries[idx];
  }
};

module.exports = { store, ensureSeeded };
