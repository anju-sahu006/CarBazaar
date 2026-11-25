import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { CarFront, LayoutDashboard, LogOut, Menu, X, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { wishlistIds } = useData();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const dashboardPath =
    user?.role === 'admin'
      ? '/admin'
      : user?.role === 'seller'
      ? '/seller'
      : '/buyer';

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand-logo" onClick={() => setMobileOpen(false)}>
          <span className="brand-logo-icon">
            <CarFront size={22} />
          </span>
          <span>
            CarBazaar<span className="accent-dot">.</span>
          </span>
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Home
          </NavLink>
          <NavLink to="/browse" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Browse Cars
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            About Us
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Contact
          </NavLink>
        </nav>

        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              {user.role === 'buyer' && (
                <Link
                  to="/buyer/saved"
                  className="btn btn-ghost btn-sm"
                  title="Saved Cars"
                >
                  <Heart size={16} />
                  <span>Saved ({wishlistIds.length})</span>
                </Link>
              )}
              <Link to={dashboardPath} className="btn btn-primary btn-sm">
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </Link>
              <button type="button" onClick={handleLogout} className="btn btn-outline btn-sm">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-accent btn-sm">
                Register
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div
          style={{
            background: '#FFFFFF',
            borderTop: '1px solid var(--border)',
            padding: '16px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <NavLink to="/" end className="nav-link" onClick={() => setMobileOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/browse" className="nav-link" onClick={() => setMobileOpen(false)}>
            Browse Cars
          </NavLink>
          <NavLink to="/about" className="nav-link" onClick={() => setMobileOpen(false)}>
            About Us
          </NavLink>
          <NavLink to="/contact" className="nav-link" onClick={() => setMobileOpen(false)}>
            Contact
          </NavLink>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {isAuthenticated ? (
              <>
                <Link
                  to={dashboardPath}
                  className="btn btn-primary btn-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard ({user.role})
                </Link>
                <button type="button" onClick={handleLogout} className="btn btn-outline btn-sm">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline btn-sm" onClick={() => setMobileOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-accent btn-sm" onClick={() => setMobileOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
