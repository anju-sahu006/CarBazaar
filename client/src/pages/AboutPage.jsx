import React from 'react';
import { Link } from 'react-router-dom';
import { BadgeCheck, CarFront, ShieldCheck, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="section">
      <div className="container">
        <div style={{ maxWidth: '800px', margin: '0 auto 48px', textAlign: 'center' }}>
          <div className="section-eyebrow">About CarBazaar</div>
          <h1 className="section-title" style={{ fontSize: '2.4rem', marginBottom: '14px' }}>
            Reimagining Pre-Owned Car Buying &amp; Selling in India
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
            CarBazaar – Find Your Next Ride is an exclusive second-hand automotive marketplace designed to bring transparency, structured comparisons, and effortless buyer–seller communication into one modern portal.
          </p>
        </div>

        <div className="grid-3" style={{ marginBottom: '48px' }}>
          <div className="feature-card">
            <div className="feature-icon"><CarFront size={24} /></div>
            <h3 style={{ marginBottom: '8px' }}>100% Pre-Owned Focus</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Every filter, specification card, and price indicator is tailored specifically for evaluating used cars across Indian cities.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><BadgeCheck size={24} /></div>
            <h3 style={{ marginBottom: '8px' }}>Smart Fair Price Benchmarks</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Buyers immediately see estimated price comparisons against similar models so they can negotiate confidently.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Users size={24} /></div>
            <h3 style={{ marginBottom: '8px' }}>Dedicated Portals</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Buyers track wishlists and inquiries, Sellers manage listings and leads, and Admins oversee marketplace integrity.
            </p>
          </div>
        </div>

        <div
          className="card"
          style={{
            padding: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="feature-icon" style={{ marginBottom: 0 }}>
              <ShieldCheck size={26} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem' }}>Ready to explore our inventory?</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                Browse 20+ pre-loaded vehicles or sign in with one of our role-based demo accounts.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/browse" className="btn btn-primary">Browse Cars</Link>
            <Link to="/contact" className="btn btn-outline">Contact Team</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
