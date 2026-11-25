import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  CarFront,
  Fuel,
  Gauge,
  Heart,
  Mail,
  MapPin,
  Phone,
  Send,
  Settings2,
  Share2,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { api } from '../services/api';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import {
  FALLBACK_CAR_IMAGE,
  computeFairPriceEstimate,
  formatINR,
  formatKm
} from '../utils/formatters';
import FairPriceBadge from '../components/FairPriceBadge';
import InquiryModal from '../components/InquiryModal';

export default function CarDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cars, wishlistIds, toggleWishlist, trackRecentlyViewed } = useData();
  const { showToast } = useToast();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showSellerContact, setShowSellerContact] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setActiveImageIndex(0);
    setShowSellerContact(false);

    api
      .getCar(id)
      .then((res) => {
        if (mounted && res.car) {
          setCar(res.car);
          trackRecentlyViewed(res.car._id);
        }
      })
      .catch(() => {
        const localCar = cars.find((c) => c._id === id);
        if (mounted && localCar) {
          setCar(localCar);
          trackRecentlyViewed(localCar._id);
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id, trackRecentlyViewed, cars]);

  if (loading) {
    return (
      <div className="loader-center">
        <div className="spinner" />
        <span>Loading car details...</span>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>Car Listing Not Found</h2>
          <p style={{ color: 'var(--text-muted)', margin: '10px 0 20px' }}>
            This listing may have been removed or is no longer available.
          </p>
          <Link to="/browse" className="btn btn-primary">
            Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  const images = car.images && car.images.length > 0 ? car.images : [FALLBACK_CAR_IMAGE];
  const isSaved = wishlistIds.includes(car._id);
  const fairEstimate = computeFairPriceEstimate(car, cars);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Listing link copied to clipboard!', 'success');
    } catch {
      showToast('Share URL ready in your browser address bar.', 'info');
    }
  };

  return (
    <div className="section" style={{ paddingTop: '28px' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <button type="button" className="btn btn-outline btn-sm" onClick={() => navigate('/browse')}>
            <ArrowLeft size={16} />
            <span>Back to Browse</span>
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className={`btn btn-sm ${isSaved ? 'btn-danger' : 'btn-outline'}`}
              onClick={() => toggleWishlist(car._id)}
            >
              <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} />
              <span>{isSaved ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
            </button>
            <button type="button" className="btn btn-outline btn-sm" onClick={handleShare}>
              <Share2 size={16} />
              <span>Share Listing</span>
            </button>
          </div>
        </div>

        <div className="details-grid">
          {/* Left Column: Gallery + Specs + Description */}
          <div>
            <div className="gallery-main">
              <img
                src={images[activeImageIndex] || FALLBACK_CAR_IMAGE}
                alt={`${car.year} ${car.brand} ${car.model}`}
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_CAR_IMAGE;
                }}
              />
            </div>

            {images.length > 1 && (
              <div className="gallery-thumbs">
                {images.map((img, idx) => (
                  <button
                    key={`${img.slice(0, 20)}-${idx}`}
                    type="button"
                    className={`gallery-thumb ${activeImageIndex === idx ? 'active' : ''}`}
                    onClick={() => setActiveImageIndex(idx)}
                  >
                    <img
                      src={img}
                      alt={`View ${idx + 1}`}
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_CAR_IMAGE;
                      }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Key Specifications */}
            <div className="card" style={{ padding: '24px', marginTop: '24px' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Vehicle Specifications</h2>
              <div className="specs-table-grid">
                <div className="spec-box">
                  <div className="spec-box-label">Manufacturing Year</div>
                  <div className="spec-box-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={15} color="var(--secondary)" /> {car.year}
                  </div>
                </div>
                <div className="spec-box">
                  <div className="spec-box-label">Kilometers Driven</div>
                  <div className="spec-box-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Gauge size={15} color="var(--secondary)" /> {formatKm(car.kilometers)}
                  </div>
                </div>
                <div className="spec-box">
                  <div className="spec-box-label">Fuel Type</div>
                  <div className="spec-box-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Fuel size={15} color="var(--secondary)" /> {car.fuelType}
                  </div>
                </div>
                <div className="spec-box">
                  <div className="spec-box-label">Transmission</div>
                  <div className="spec-box-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Settings2 size={15} color="var(--secondary)" /> {car.transmission}
                  </div>
                </div>
                <div className="spec-box">
                  <div className="spec-box-label">Engine Capacity</div>
                  <div className="spec-box-value">{car.engineCapacity}</div>
                </div>
                <div className="spec-box">
                  <div className="spec-box-label">Ownership</div>
                  <div className="spec-box-value">{car.ownership}</div>
                </div>
                <div className="spec-box">
                  <div className="spec-box-label">Body Type</div>
                  <div className="spec-box-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CarFront size={15} color="var(--secondary)" /> {car.bodyType}
                  </div>
                </div>
                <div className="spec-box">
                  <div className="spec-box-label">Registration</div>
                  <div className="spec-box-value">
                    {car.registrationNumber || 'Available on Request'}
                    {car.registrationState ? ` (${car.registrationState})` : ''}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card" style={{ padding: '24px', marginTop: '20px' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Seller Description</h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>{car.description}</p>
            </div>
          </div>

          {/* Right Column: Pricing, Fair Price Analysis, Actions & Seller Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '90px' }}>
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="badge badge-primary">{car.bodyType}</span>
                {car.status === 'sold' ? (
                  <span className="badge badge-danger">SOLD</span>
                ) : (
                  <span className="badge badge-success">Available</span>
                )}
              </div>

              <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>
                {car.year} {car.brand} {car.model}
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '16px' }}>
                {car.variant} • {car.color || 'Showroom Finish'}
              </p>

              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '12px' }}>
                {formatINR(car.price)}
              </div>

              {/* Fair Price Indicator Box */}
              <div
                style={{
                  background: '#F8FAFC',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '14px',
                  marginBottom: '20px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>Fair Price Indicator</span>
                  <FairPriceBadge car={car} allCars={cars} />
                </div>
                {fairEstimate && fairEstimate.peerCount > 0 && (
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Peer benchmark across {fairEstimate.peerCount} similar listing(s):{' '}
                    <strong>{formatINR(fairEstimate.avgPrice)}</strong>
                  </p>
                )}
                <p style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                  * Estimated comparison based on available CarBazaar listings, not an official valuation.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
                <MapPin size={16} color="var(--secondary)" />
                <span>Located in <strong>{car.location}</strong></span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  type="button"
                  className="btn btn-accent btn-lg"
                  onClick={() => setInquiryOpen(true)}
                  disabled={car.status === 'sold'}
                >
                  <Send size={18} />
                  <span>{car.status === 'sold' ? 'Vehicle Already Sold' : 'Send Inquiry'}</span>
                </button>

                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={() => setShowSellerContact((prev) => !prev)}
                >
                  <Phone size={18} />
                  <span>{showSellerContact ? 'Hide Seller Contact' : 'Contact Seller'}</span>
                </button>
              </div>

              {showSellerContact && (
                <div
                  style={{
                    marginTop: '16px',
                    padding: '14px',
                    borderRadius: '10px',
                    background: 'var(--secondary-light)',
                    border: '1px solid #BFDBFE'
                  }}
                >
                  <div style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '6px' }}>
                    Direct Seller Contact Details
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.92rem', marginBottom: '4px' }}>
                    <Phone size={15} color="var(--secondary)" />
                    <a href={`tel:${car.sellerPhone}`} style={{ fontWeight: 700, color: 'var(--primary)' }}>
                      {car.sellerPhone}
                    </a>
                  </div>
                  {car.sellerEmail && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem' }}>
                      <Mail size={15} color="var(--secondary)" />
                      <span>{car.sellerEmail}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Seller Information Card */}
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: 'var(--secondary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <UserCheck size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>{car.sellerName}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={14} color="var(--success)" /> Verified CarBazaar Seller
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <InquiryModal
        open={inquiryOpen}
        car={car}
        onClose={() => setInquiryOpen(false)}
      />
    </div>
  );
}
