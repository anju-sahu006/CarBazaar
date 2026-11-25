export const FALLBACK_CAR_IMAGE = '/images/fallback-car.svg';

/**
 * Format number as Indian Rupees (e.g., ₹ 14,50,000)
 */
export function formatINR(amount) {
  const num = Number(amount);
  if (!Number.isFinite(num)) return '₹ 0';
  return '₹ ' + num.toLocaleString('en-IN');
}

/**
 * Format kilometers (e.g., 28,400 km)
 */
export function formatKm(km) {
  const num = Number(km);
  if (!Number.isFinite(num)) return '0 km';
  return `${num.toLocaleString('en-IN')} km`;
}

/**
 * Format date nicely
 */
export function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Fair Price Indicator:
 * Compares a car's asking price against similar active listings in the dataset
 * (matching same bodyType or same brand/model, adjusted lightly for year).
 * Clearly marked as an estimated comparison, not an official valuation.
 */
export function computeFairPriceEstimate(car, allCars = []) {
  if (!car) return null;

  const peers = allCars.filter(
    (other) =>
      other._id !== car._id &&
      (other.model.toLowerCase() === car.model.toLowerCase() ||
        other.bodyType === car.bodyType)
  );

  if (peers.length === 0) {
    return {
      label: 'Fair Price',
      tone: 'primary',
      diffPercent: 0,
      avgPrice: car.price,
      peerCount: 0,
      note: 'Estimated comparison based on available listings, not an official valuation.'
    };
  }

  // Year-adjusted peer benchmark (~6% per year difference relative to target car)
  const adjustedPrices = peers.map((p) => {
    const yearDiff = car.year - p.year;
    return p.price * Math.pow(1.06, yearDiff);
  });

  const avgPrice = Math.round(
    adjustedPrices.reduce((sum, val) => sum + val, 0) / adjustedPrices.length
  );

  const diffPercent = Math.round(((car.price - avgPrice) / avgPrice) * 100);

  let label = 'Fair Price';
  let tone = 'primary';

  if (diffPercent <= -7) {
    label = 'Below Market Price';
    tone = 'success';
  } else if (diffPercent >= 8) {
    label = 'Above Market Price';
    tone = 'warning';
  }

  return {
    label,
    tone,
    diffPercent,
    avgPrice,
    peerCount: peers.length,
    note: 'Estimated comparison based on similar CarBazaar listings, not an official valuation.'
  };
}
