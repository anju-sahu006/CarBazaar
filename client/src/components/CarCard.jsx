import React from 'react';
import { Link } from 'react-router-dom';
import { Fuel, Gauge, Heart, MapPin, Settings2, ArrowRight, Sparkles } from 'lucide-react';
import { FALLBACK_CAR_IMAGE, formatINR, formatKm } from '../utils/formatters';
import { useData } from '../context/DataContext';
import FairPriceBadge from './FairPriceBadge';

export default function CarCard({ car }) {
  const { wishlistIds, toggleWishlist, cars } = useData();
  const isSaved = wishlistIds.includes(car._id);
  const coverImage = (car.images && car.images[0]) || FALLBACK_CAR_IMAGE;

  return (
    <article className="car-card">
      <div className="car-card-media">
        <Link to={`/cars/${car._id}`}>
          <img
            src={coverImage}
            alt={`${car.year} ${car.brand} ${car.model}`}
            onError={(e) => {
              e.currentTarget.src = FALLBACK_CAR_IMAGE;
            }}
          />
        </Link>

        <div className="car-card-top-badges">
          {car.status === 'sold' ? (
            <span className="badge badge-danger">SOLD</span>
          ) : car.featured ? (
            <span className="badge badge-accent">
              <Sparkles size={12} /> Featured
            </span>
          ) : null}
          <span className="badge badge-neutral">{car.year}</span>
        </div>

        <button
          type="button"
          className={`wishlist-btn ${isSaved ? 'saved' : ''}`}
          onClick={() => toggleWishlist(car._id)}
          aria-label={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
          title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="car-card-body">
        <Link to={`/cars/${car._id}`}>
          <h3 className="car-card-title">
            {car.brand} {car.model}
          </h3>
        </Link>
        <p className="car-card-variant">
          {car.variant || car.bodyType} • {car.ownership}
        </p>

        <div className="car-card-price-row">
          <span className="car-price">{formatINR(car.price)}</span>
          <FairPriceBadge car={car} allCars={cars} />
        </div>

        <div className="car-specs-grid">
          <div className="car-spec-item">
            <Gauge size={15} />
            <span>{formatKm(car.kilometers)}</span>
          </div>
          <div className="car-spec-item">
            <Fuel size={15} />
            <span>{car.fuelType}</span>
          </div>
          <div className="car-spec-item">
            <Settings2 size={15} />
            <span>{car.transmission}</span>
          </div>
          <div className="car-spec-item">
            <MapPin size={15} />
            <span>{car.location}</span>
          </div>
        </div>

        <div className="car-card-footer">
          <Link to={`/cars/${car._id}`} className="btn btn-primary btn-sm" style={{ width: '100%' }}>
            <span>View Details</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}
