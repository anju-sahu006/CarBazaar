export function validateEmail(email) {
  return /^\S+@\S+\.\S+$/.test(String(email || '').trim());
}

export function validatePhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 13;
}

export function validateCarForm(values) {
  const errors = {};
  const maxYear = new Date().getFullYear() + 1;

  if (!values.brand?.trim()) errors.brand = 'Brand is required.';
  if (!values.model?.trim()) errors.model = 'Model is required.';

  const year = Number(values.year);
  if (!Number.isFinite(year) || year < 1995 || year > maxYear) {
    errors.year = `Enter a valid year between 1995 and ${maxYear}.`;
  }

  const price = Number(values.price);
  if (!Number.isFinite(price) || price <= 0) {
    errors.price = 'Selling price must be greater than ₹ 0.';
  }

  const km = Number(values.kilometers);
  if (!Number.isFinite(km) || km < 0 || values.kilometers === '') {
    errors.kilometers = 'Kilometers driven cannot be negative.';
  }

  if (!values.fuelType) errors.fuelType = 'Fuel type is required.';
  if (!values.transmission) errors.transmission = 'Transmission is required.';
  if (!values.bodyType) errors.bodyType = 'Body type is required.';
  if (!values.engineCapacity?.trim()) errors.engineCapacity = 'Engine capacity is required.';
  if (!values.ownership) errors.ownership = 'Ownership is required.';
  if (!values.location?.trim()) errors.location = 'Location is required.';
  if (!values.description?.trim() || values.description.trim().length < 15) {
    errors.description = 'Please provide a description (at least 15 characters).';
  }
  if (!values.sellerPhone?.trim() || !validatePhone(values.sellerPhone)) {
    errors.sellerPhone = 'Please enter a valid 10-digit seller contact number.';
  }

  return errors;
}

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
export const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB per image
