import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  BadgeCheck,
  CarFront,
  CheckCircle2,
  IndianRupee,
  MessageSquare,
  Search,
  ShieldCheck,
  Sparkles,
  Star
} from 'lucide-react';
import { useData } from '../context/DataContext';
import CarCard from '../components/CarCard';
import { formatINR } from '../utils/formatters';

const POPULAR_BRANDS = [
  { name: 'Maruti Suzuki', code: 'MS' },
  { name: 'Hyundai', code: 'HY' },
  { name: 'Tata', code: 'TT' },
  { name: 'Mahindra', code: 'MH' },
  { name: 'Kia', code: 'KA' },
  { name: 'Honda', code: 'HD' },
  { name: 'Toyota', code: 'TY' },
  { name: 'Volkswagen', code: 'VW' },
  { name: 'Skoda', code: 'SK' },
  { name: 'MG', code: 'MG' },
  { name: 'Renault', code: 'RN' },
  { name: 'Nissan', code: 'NS' }
];

const TESTIMONIALS = [
  {
    name: 'Siddharth Kulkarni',
    city: 'Pune',
    car: '2023 Tata Nexon XZ+ Lux',
    quote:
      'The Fair Price Indicator helped me compare similar Nexon listings instantly. I contacted the seller directly and closed the deal in 3 days.'
  },
  {
    name: 'Meera Krishnan',
    city: 'Bengaluru',
    car: '2022 Hyundai Creta SX(O)',
    quote:
      'Unlike cluttered classifieds, CarBazaar focuses purely on pre-owned cars with clean specs, wishlist tracking, and real inquiry updates.'
  },
  {
    name: 'Arjun Malhotra',
    city: 'Delhi NCR',
    car: 'Sold 2021 Honda City ZX',
    quote:
      'Listing my sedan took under five minutes. Buyer inquiries arrived straight in my Seller Dashboard and I could mark it sold with one click.'
  }
];

export default function HomePage() {
  const { cars, carsLoading } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const featuredCars = cars.filter((c) => c.featured && c.status === 'active').slice(0, 6);
  const heroHighlight = featuredCars[0] || cars[0];

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const q = searchTerm.trim();
    navigate(q ? `/browse?search=${encodeURIComponent(q)}` : '/browse');
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-art" />
        <div className="container hero-grid">
          <div>
            <div className="hero-pill">
              <Sparkles size={15} />
              <span>India&apos;s Dedicated Pre-Owned Car Marketplace</span>
            </div>
            <h1 className="hero-title">Find Your Perfect Pre-Owned Car</h1>
            <p className="hero-subtitle">
              Discover inspected second-hand hatchbacks, sedans, and SUVs across India with transparent INR pricing, Fair Price estimates, and direct seller inquiries.
            </p>

            <form className="hero-search-box" onSubmit={handleHeroSearch}>
              <div className="hero-search-input-wrap">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Search by brand or model (e.g., Creta, Swift, XUV700)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search cars by brand or model"
                />
              </div>
              <button type="submit" className="btn btn-accent btn-lg">
                Search Cars
              </button>
            </form>

            <div className="hero-cta-row">
              <Link to="/browse" className="btn btn-secondary btn-lg">
                <span>Browse Cars</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/register" className="btn btn-outline-white btn-lg">
                Sell Your Car
              </Link>
            </div>

            <div className="hero-stats-strip">
              <div className="hero-stat">
                <strong>{cars.length}+</strong>
                <span>Active Verified Cars</span>
              </div>
              <div className="hero-stat">
                <strong>12+</strong>
                <span>Leading Auto Brands</span>
              </div>
              <div className="hero-stat">
                <strong>100%</strong>
                <span>Direct Buyer–Seller Connect</span>
              </div>
            </div>
          </div>

          {heroHighlight && (
            <div className="hero-showcase-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="badge badge-accent">Spotlight Ride</span>
                <span style={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.8)' }}>
                  {heroHighlight.location}
                </span>
              </div>
              <img
                src={heroHighlight.images?.[0] || '/images/fallback-car.svg'}
                alt={`${heroHighlight.brand} ${heroHighlight.model}`}
              />
              <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                <div>
                  <h3 style={{ color: '#FFFFFF', fontSize: '1.12rem' }}>
                    {heroHighlight.year} {heroHighlight.brand} {heroHighlight.model}
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.84rem' }}>
                    {heroHighlight.fuelType} • {heroHighlight.transmission} • {heroHighlight.ownership}
                  </p>
                </div>
                <Link to={`/cars/${heroHighlight._id}`} className="btn btn-accent btn-sm">
                  {formatINR(heroHighlight.price)}
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Featured Cars */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">Handpicked Inventory</div>
              <h2 className="section-title">Featured Pre-Owned Cars</h2>
              <p className="section-desc">
                Popular, low-mileage vehicles with verified specs and transparent market pricing.
              </p>
            </div>
            <Link to="/browse" className="btn btn-outline">
              <span>View All Cars</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {carsLoading ? (
            <div className="loader-center">
              <div className="spinner" />
              <span>Loading featured vehicles...</span>
            </div>
          ) : (
            <div className="car-grid">
              {featuredCars.map((car) => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular Brands */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">Browse by Make</div>
              <h2 className="section-title">Popular Car Brands</h2>
              <p className="section-desc">
                Explore trusted hatchbacks, sedans, and SUVs from India&apos;s top manufacturers.
              </p>
            </div>
          </div>

          <div className="brands-grid">
            {POPULAR_BRANDS.map((brand) => {
              const count = cars.filter((c) => c.brand.toLowerCase() === brand.name.toLowerCase()).length;
              return (
                <Link
                  key={brand.name}
                  to={`/browse?brand=${encodeURIComponent(brand.name)}`}
                  className="brand-tile"
                >
                  <div className="brand-monogram">{brand.code}</div>
                  <h4>{brand.name}</h4>
                  <span>{count} {count === 1 ? 'Car' : 'Cars'}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose CarBazaar */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">The CarBazaar Advantage</div>
              <h2 className="section-title">Why Choose CarBazaar?</h2>
            </div>
          </div>

          <div className="grid-4">
            <div className="feature-card">
              <div className="feature-icon"><BadgeCheck size={24} /></div>
              <h3 style={{ fontSize: '1.08rem', marginBottom: '8px' }}>Exclusively Used Cars</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Built specifically for pre-owned automobiles with detailed ownership, engine, and registration specs.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><IndianRupee size={24} /></div>
              <h3 style={{ fontSize: '1.08rem', marginBottom: '8px' }}>Fair Price Indicator</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Instantly see whether an asking price is Below Market, Fair Price, or Above Market compared to peers.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><MessageSquare size={24} /></div>
              <h3 style={{ fontSize: '1.08rem', marginBottom: '8px' }}>Live Inquiry Tracking</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Message sellers directly and track inquiry status from Pending to Contacted or Closed in real time.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><ShieldCheck size={24} /></div>
              <h3 style={{ fontSize: '1.08rem', marginBottom: '8px' }}>Role-Based Portals</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Dedicated dashboards for Buyers, Sellers, and Admins ensure smooth management and moderation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">Simple 4-Step Process</div>
              <h2 className="section-title">How CarBazaar Works</h2>
            </div>
          </div>

          <div className="grid-4">
            <div className="feature-card">
              <div className="step-number">1</div>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>Search &amp; Filter</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Combine brand, budget, fuel type, transmission, body type, and city filters to narrow down rides.
              </p>
            </div>
            <div className="feature-card">
              <div className="step-number">2</div>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>Inspect Details</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Review multi-angle galleries, ownership history, Fair Price benchmark, and save favorites to your wishlist.
              </p>
            </div>
            <div className="feature-card">
              <div className="step-number">3</div>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>Connect &amp; Inquire</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                View seller contact info or submit an inquiry directly to schedule a test drive and inspection.
              </p>
            </div>
            <div className="feature-card">
              <div className="step-number">4</div>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>Drive Home Happy</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Complete paperwork directly with the seller while sellers mark completed deals as Sold cleanly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">Customer Stories</div>
              <h2 className="section-title">Trusted by Buyers &amp; Sellers</h2>
            </div>
          </div>

          <div className="grid-3">
            {TESTIMONIALS.map((item) => (
              <div key={item.name} className="feature-card">
                <div style={{ display: 'flex', gap: '4px', color: 'var(--accent)', marginBottom: '12px' }}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} size={16} fill="currentColor" />
                  ))}
                </div>
                <p style={{ fontSize: '0.94rem', color: 'var(--text)', marginBottom: '16px' }}>
                  &ldquo;{item.quote}&rdquo;
                </p>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {item.city} • {item.car}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Banner */}
          <div
            style={{
              marginTop: '52px',
              background: 'linear-gradient(120deg, var(--primary) 0%, var(--secondary) 100%)',
              borderRadius: 'var(--radius-lg)',
              padding: '36px 32px',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '20px'
            }}
          >
            <div>
              <h3 style={{ color: '#FFFFFF', fontSize: '1.5rem', marginBottom: '6px' }}>
                Ready to Buy or Sell Your Next Ride?
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.84)', fontSize: '0.96rem' }}>
                Join CarBazaar today or test the platform instantly with our Buyer, Seller, and Admin demo accounts.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link to="/browse" className="btn btn-accent btn-lg">
                <CarFront size={18} />
                <span>Explore Cars</span>
              </Link>
              <Link to="/login" className="btn btn-outline-white btn-lg">
                <Award size={18} />
                <span>Try Demo Accounts</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
