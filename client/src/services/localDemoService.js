import { DEMO_USERS, DEMO_CARS, DEMO_INQUIRIES, DEMO_WISHLISTS } from '../data/seedDemoData';

const STORAGE_KEY = 'carbazaar_demo_db_v1';

function loadDb() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  const initial = {
    users: structuredClone(DEMO_USERS),
    cars: structuredClone(DEMO_CARS),
    inquiries: structuredClone(DEMO_INQUIRIES),
    wishlists: structuredClone(DEMO_WISHLISTS)
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

function saveDb(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function getCurrentUser(db) {
  const token = localStorage.getItem('carbazaar_token');
  if (!token || !token.startsWith('demo-token:')) return null;
  const userId = token.replace('demo-token:', '');
  return db.users.find((u) => u._id === userId) || null;
}

function stripPassword(user) {
  if (!user) return null;
  const { password, ...safe } = user;
  return safe;
}

export const localDemoService = {
  async login({ email, password }) {
    const db = loadDb();
    const user = db.users.find((u) => u.email.toLowerCase() === String(email).toLowerCase().trim());
    if (!user || user.password !== password) {
      throw new Error('Invalid email or password.');
    }
    if (user.isActive === false) {
      throw new Error('This account has been deactivated.');
    }
    return {
      token: `demo-token:${user._id}`,
      user: stripPassword(user)
    };
  },

  async register({ name, email, password, role, phone, city }) {
    const db = loadDb();
    const exists = db.users.some((u) => u.email.toLowerCase() === String(email).toLowerCase().trim());
    if (exists) throw new Error('An account with this email already exists.');
    const newUser = {
      _id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: role === 'seller' ? 'seller' : 'buyer',
      phone: phone || '',
      city: city || '',
      isActive: true,
      createdAt: new Date().toISOString()
    };
    db.users.push(newUser);
    saveDb(db);
    return {
      token: `demo-token:${newUser._id}`,
      user: stripPassword(newUser)
    };
  },

  async me() {
    const db = loadDb();
    const user = getCurrentUser(db);
    if (!user) throw new Error('Session expired.');
    return { user: stripPassword(user) };
  },

  async updateProfile({ name, phone, city }) {
    const db = loadDb();
    const user = getCurrentUser(db);
    if (!user) throw new Error('Authentication required.');
    user.name = name.trim();
    user.phone = phone ?? user.phone;
    user.city = city ?? user.city;
    saveDb(db);
    return { user: stripPassword(user), message: 'Profile updated successfully.' };
  },

  async listCars(params = {}) {
    const db = loadDb();
    let cars = [...db.cars];
    if (!params.includeSold) {
      cars = cars.filter((c) => c.status === 'active');
    }
    if (params.featured) {
      cars = cars.filter((c) => Boolean(c.featured));
    }
    if (params.search && params.search.trim()) {
      const q = params.search.trim().toLowerCase();
      cars = cars.filter(
        (c) =>
          c.brand.toLowerCase().includes(q) ||
          c.model.toLowerCase().includes(q) ||
          (c.variant && c.variant.toLowerCase().includes(q)) ||
          c.location.toLowerCase().includes(q) ||
          `${c.brand} ${c.model}`.toLowerCase().includes(q)
      );
    }
    if (params.brand && params.brand !== 'All') {
      cars = cars.filter((c) => c.brand.toLowerCase() === params.brand.toLowerCase());
    }
    if (params.fuelType && params.fuelType !== 'All') {
      cars = cars.filter((c) => c.fuelType.toLowerCase() === params.fuelType.toLowerCase());
    }
    if (params.transmission && params.transmission !== 'All') {
      cars = cars.filter((c) => c.transmission.toLowerCase() === params.transmission.toLowerCase());
    }
    if (params.bodyType && params.bodyType !== 'All') {
      cars = cars.filter((c) => c.bodyType.toLowerCase() === params.bodyType.toLowerCase());
    }
    if (params.location && params.location !== 'All') {
      cars = cars.filter((c) => c.location.toLowerCase() === params.location.toLowerCase());
    }
    if (params.minPrice !== undefined && params.minPrice !== '') {
      cars = cars.filter((c) => c.price >= Number(params.minPrice));
    }
    if (params.maxPrice !== undefined && params.maxPrice !== '') {
      cars = cars.filter((c) => c.price <= Number(params.maxPrice));
    }
    if (params.minYear !== undefined && params.minYear !== '') {
      cars = cars.filter((c) => c.year >= Number(params.minYear));
    }
    if (params.maxYear !== undefined && params.maxYear !== '') {
      cars = cars.filter((c) => c.year <= Number(params.maxYear));
    }

    if (params.sort === 'price_asc') cars.sort((a, b) => a.price - b.price);
    else if (params.sort === 'price_desc') cars.sort((a, b) => b.price - a.price);
    else cars.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return { cars, total: cars.length };
  },

  async getCar(id) {
    const db = loadDb();
    const car = db.cars.find((c) => c._id === id);
    if (!car) throw new Error('Car listing not found.');
    car.views = (car.views || 0) + 1;
    saveDb(db);
    return { car };
  },

  async getSellerCars() {
    const db = loadDb();
    const user = getCurrentUser(db);
    if (!user) throw new Error('Authentication required.');
    return {
      cars: db.cars
        .filter((c) => c.sellerId === user._id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    };
  },

  async createCar(payload) {
    const db = loadDb();
    const user = getCurrentUser(db);
    if (!user) throw new Error('Authentication required.');
    const newCar = {
      _id: `car-${Date.now()}`,
      ...payload,
      year: Number(payload.year),
      price: Number(payload.price),
      kilometers: Number(payload.kilometers),
      images: payload.images?.length ? payload.images : ['/images/fallback-car.svg'],
      sellerId: user._id,
      sellerName: user.name,
      sellerEmail: user.email,
      status: 'active',
      views: 0,
      createdAt: new Date().toISOString()
    };
    db.cars.unshift(newCar);
    saveDb(db);
    return { car: newCar, message: 'Car listing published successfully.' };
  },

  async updateCar(id, payload) {
    const db = loadDb();
    const idx = db.cars.findIndex((c) => c._id === id);
    if (idx === -1) throw new Error('Listing not found.');
    db.cars[idx] = {
      ...db.cars[idx],
      ...payload,
      year: payload.year !== undefined ? Number(payload.year) : db.cars[idx].year,
      price: payload.price !== undefined ? Number(payload.price) : db.cars[idx].price,
      kilometers: payload.kilometers !== undefined ? Number(payload.kilometers) : db.cars[idx].kilometers
    };
    saveDb(db);
    return { car: db.cars[idx], message: 'Listing updated successfully.' };
  },

  async markCarSold(id, status = 'sold') {
    const db = loadDb();
    const car = db.cars.find((c) => c._id === id);
    if (!car) throw new Error('Listing not found.');
    car.status = status;
    saveDb(db);
    return { car, message: status === 'sold' ? 'Listing marked as Sold.' : 'Listing reactivated.' };
  },

  async deleteCar(id) {
    const db = loadDb();
    db.cars = db.cars.filter((c) => c._id !== id);
    db.wishlists = db.wishlists.filter((w) => w.carId !== id);
    saveDb(db);
    return { message: 'Listing deleted successfully.' };
  },

  async getWishlist() {
    const db = loadDb();
    const user = getCurrentUser(db);
    if (!user) return { carIds: [], cars: [] };
    const ids = db.wishlists.filter((w) => w.userId === user._id).map((w) => w.carId);
    const cars = ids.map((id) => db.cars.find((c) => c._id === id)).filter(Boolean);
    return { carIds: cars.map((c) => c._id), cars };
  },

  async addToWishlist(carId) {
    const db = loadDb();
    const user = getCurrentUser(db);
    if (!user) throw new Error('Please log in to save cars.');
    if (!db.wishlists.some((w) => w.userId === user._id && w.carId === carId)) {
      db.wishlists.push({ _id: `wish-${Date.now()}`, userId: user._id, carId });
      saveDb(db);
    }
    return this.getWishlist();
  },

  async removeFromWishlist(carId) {
    const db = loadDb();
    const user = getCurrentUser(db);
    if (!user) throw new Error('Authentication required.');
    db.wishlists = db.wishlists.filter((w) => !(w.userId === user._id && w.carId === carId));
    saveDb(db);
    return this.getWishlist();
  },

  async createInquiry(payload) {
    const db = loadDb();
    const user = getCurrentUser(db);
    const car = db.cars.find((c) => c._id === payload.carId);
    if (!car) throw new Error('Selected car not found.');
    const inquiry = {
      _id: `inq-${Date.now()}`,
      carId: car._id,
      carTitle: `${car.year} ${car.brand} ${car.model}${car.variant ? ` ${car.variant}` : ''}`,
      carPrice: car.price,
      carImage: car.images?.[0] || '/images/fallback-car.svg',
      buyerId: user?._id || '',
      buyerName: payload.buyerName,
      buyerEmail: payload.buyerEmail,
      buyerPhone: payload.buyerPhone,
      message: payload.message,
      sellerId: car.sellerId,
      sellerName: car.sellerName,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    db.inquiries.unshift(inquiry);
    saveDb(db);
    return { inquiry, message: 'Your inquiry has been sent to the seller!' };
  },

  async getBuyerInquiries() {
    const db = loadDb();
    const user = getCurrentUser(db);
    if (!user) return { inquiries: [] };
    return {
      inquiries: db.inquiries.filter(
        (i) => i.buyerId === user._id || i.buyerEmail.toLowerCase() === user.email.toLowerCase()
      )
    };
  },

  async getSellerInquiries() {
    const db = loadDb();
    const user = getCurrentUser(db);
    if (!user) return { inquiries: [] };
    return { inquiries: db.inquiries.filter((i) => i.sellerId === user._id) };
  },

  async updateInquiryStatus(id, status) {
    const db = loadDb();
    const inq = db.inquiries.find((i) => i._id === id);
    if (!inq) throw new Error('Inquiry not found.');
    inq.status = status;
    saveDb(db);
    return { inquiry: inq, message: `Inquiry marked as ${status}.` };
  },

  async getAdminStats() {
    const db = loadDb();
    return {
      stats: {
        totalUsers: db.users.length,
        totalSellers: db.users.filter((u) => u.role === 'seller').length,
        totalBuyers: db.users.filter((u) => u.role === 'buyer').length,
        totalListings: db.cars.length,
        activeListings: db.cars.filter((c) => c.status === 'active').length,
        soldListings: db.cars.filter((c) => c.status === 'sold').length,
        totalInquiries: db.inquiries.length
      }
    };
  },

  async getAdminUsers() {
    const db = loadDb();
    return { users: db.users.map(stripPassword) };
  },

  async toggleUserActive(id) {
    const db = loadDb();
    const u = db.users.find((item) => item._id === id);
    if (!u) throw new Error('User not found.');
    u.isActive = u.isActive === false;
    saveDb(db);
    return { user: stripPassword(u), message: `User ${u.isActive ? 'activated' : 'deactivated'}.` };
  },

  async deleteAdminUser(id) {
    const db = loadDb();
    db.users = db.users.filter((u) => u._id !== id);
    saveDb(db);
    return { message: 'User deleted successfully.' };
  },

  async getAdminCars() {
    const db = loadDb();
    return { cars: db.cars };
  },

  async getAdminInquiries() {
    const db = loadDb();
    return { inquiries: db.inquiries };
  }
};
