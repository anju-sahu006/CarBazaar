import { localDemoService } from './localDemoService';

const API_BASE = '/api';

async function request(path, options = {}, fallbackFn) {
  const token = localStorage.getItem('carbazaar_token');
  const isDemoToken = token && token.startsWith('demo-token:');

  if (isDemoToken && fallbackFn) {
    return fallbackFn();
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers
    });

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      if (res.status >= 500 && fallbackFn) {
        return fallbackFn();
      }
      throw new Error('Unexpected server response.');
    }

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Request failed (${res.status})`);
    }
    return data;
  } catch (err) {
    const isNetworkError =
      err instanceof TypeError ||
      /failed to fetch|network|econnrefused|unexpected server/i.test(err.message);
    if (isNetworkError && fallbackFn) {
      return fallbackFn();
    }
    throw err;
  }
}

function buildQuery(params = {}) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '' && v !== 'All') {
      sp.set(k, String(v));
    }
  });
  const str = sp.toString();
  return str ? `?${str}` : '';
}

export const api = {
  // Auth
  login: (body) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(body) }, () =>
      localDemoService.login(body)
    ),
  register: (body) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(body) }, () =>
      localDemoService.register(body)
    ),
  getMe: () => request('/auth/me', {}, () => localDemoService.me()),
  updateProfile: (body) =>
    request('/auth/profile', { method: 'PUT', body: JSON.stringify(body) }, () =>
      localDemoService.updateProfile(body)
    ),

  // Cars
  listCars: (params = {}) =>
    request(`/cars${buildQuery(params)}`, {}, () => localDemoService.listCars(params)),
  getCar: (id) => request(`/cars/${id}`, {}, () => localDemoService.getCar(id)),
  getSellerCars: () =>
    request('/cars/seller/mine', {}, () => localDemoService.getSellerCars()),
  createCar: (body) =>
    request('/cars', { method: 'POST', body: JSON.stringify(body) }, () =>
      localDemoService.createCar(body)
    ),
  updateCar: (id, body) =>
    request(`/cars/${id}`, { method: 'PUT', body: JSON.stringify(body) }, () =>
      localDemoService.updateCar(id, body)
    ),
  markCarSold: (id, status = 'sold') =>
    request(`/cars/${id}/sold`, { method: 'PATCH', body: JSON.stringify({ status }) }, () =>
      localDemoService.markCarSold(id, status)
    ),
  deleteCar: (id) =>
    request(`/cars/${id}`, { method: 'DELETE' }, () => localDemoService.deleteCar(id)),

  // Wishlist
  getWishlist: () => request('/wishlist', {}, () => localDemoService.getWishlist()),
  addToWishlist: (carId) =>
    request(`/wishlist/${carId}`, { method: 'POST' }, () => localDemoService.addToWishlist(carId)),
  removeFromWishlist: (carId) =>
    request(`/wishlist/${carId}`, { method: 'DELETE' }, () =>
      localDemoService.removeFromWishlist(carId)
    ),

  // Inquiries
  createInquiry: (body) =>
    request('/inquiries', { method: 'POST', body: JSON.stringify(body) }, () =>
      localDemoService.createInquiry(body)
    ),
  getBuyerInquiries: () =>
    request('/inquiries/buyer', {}, () => localDemoService.getBuyerInquiries()),
  getSellerInquiries: () =>
    request('/inquiries/seller', {}, () => localDemoService.getSellerInquiries()),
  updateInquiryStatus: (id, status) =>
    request(`/inquiries/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }, () =>
      localDemoService.updateInquiryStatus(id, status)
    ),

  // Admin
  getAdminStats: () => request('/admin/stats', {}, () => localDemoService.getAdminStats()),
  getAdminUsers: () => request('/admin/users', {}, () => localDemoService.getAdminUsers()),
  toggleAdminUser: (id) =>
    request(`/admin/users/${id}/toggle`, { method: 'PATCH' }, () =>
      localDemoService.toggleUserActive(id)
    ),
  deleteAdminUser: (id) =>
    request(`/admin/users/${id}`, { method: 'DELETE' }, () =>
      localDemoService.deleteAdminUser(id)
    ),
  getAdminCars: () => request('/admin/cars', {}, () => localDemoService.getAdminCars()),
  getAdminInquiries: () =>
    request('/admin/inquiries', {}, () => localDemoService.getAdminInquiries())
};
