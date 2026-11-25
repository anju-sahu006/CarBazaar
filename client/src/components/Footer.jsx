import React from 'react';
import { Link } from 'react-router-dom';
import { CarFront, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link to="/" className="brand-logo" style={{ color: '#FFFFFF', marginBottom: '14px' }}>
              <span className="brand-logo-icon">
                <CarFront size={22} />
              </span>
              <span>
                CarBazaar<span className="accent-dot">.</span>
              </span>
            </Link>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.72)', maxWidth: '300px' }}>
              CarBazaar – Find Your Next Ride. India&apos;s transparent marketplace exclusively dedicated to verified pre-owned cars.
            </p>
          </div>

          <div>
            <h4>Marketplace</h4>
            <ul className="footer-links">
              <li><Link to="/browse">Browse All Cars</Link></li>
              <li><Link to="/browse?bodyType=SUV">Used SUVs</Link></li>
              <li><Link to="/browse?bodyType=Sedan">Pre-Owned Sedans</Link></li>
              <li><Link to="/browse?bodyType=Hatchback">City Hatchbacks</Link></li>
            </ul>
          </div>

          <div>
            <h4>Company &amp; Portals</h4>
            <ul className="footer-links">
              <li><Link to="/about">About CarBazaar</Link></li>
              <li><Link to="/contact">Contact Support</Link></li>
              <li><Link to="/login">Buyer &amp; Seller Login</Link></li>
              <li><Link to="/register">Sell Your Car</Link></li>
            </ul>
          </div>

          <div>
            <h4>Contact Info</h4>
            <ul className="footer-links">
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={15} /> +91 1800-202-4545
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={15} /> support@carbazaar.com
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={15} /> Cyber Hub, Gurugram, India
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} CarBazaar Auto Marketplace. All rights reserved.</span>
          <span>Academic SDLC Prototype • Transparent Pre-Owned Car Portal</span>
        </div>
      </div>
    </footer>
  );
}
