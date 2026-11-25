import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validateEmail, validatePhone } from '../utils/validation';

export default function RegisterPage() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [role, setRole] = useState('buyer');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!name.trim()) nextErrors.name = 'Full name is required.';
    if (!validateEmail(email)) nextErrors.email = 'Please enter a valid email address.';
    if (phone.trim() && !validatePhone(phone)) nextErrors.phone = 'Enter a valid 10-digit phone number.';
    if (!password || password.length < 6) nextErrors.password = 'Password must be at least 6 characters.';
    if (password !== confirmPassword) nextErrors.confirmPassword = 'Passwords do not match.';

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    try {
      const user = await register({ name, email, password, role, phone, city });
      showToast('Account created successfully!', 'success');
      navigate(user.role === 'seller' ? '/seller' : '/buyer', { replace: true });
    } catch (err) {
      setErrors({ general: err.message || 'Registration failed.' });
      showToast(err.message || 'Registration failed.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: '520px' }}>
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>
            Create CarBazaar Account
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '4px' }}>
            Register as a Buyer or Seller to get started
          </p>
        </div>

        {errors.general && (
          <div
            role="alert"
            style={{
              background: 'var(--danger-bg)',
              color: '#B91C1C',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: 600,
              marginBottom: '16px'
            }}
          >
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="filter-group">
            <label className="filter-label">Select Account Role *</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                className={`btn ${role === 'buyer' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setRole('buyer')}
              >
                I want to Buy Cars
              </button>
              <button
                type="button"
                className={`btn ${role === 'seller' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setRole('seller')}
              >
                I want to Sell Cars
              </button>
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label" htmlFor="reg-name">Full Name *</label>
            <input
              id="reg-name"
              type="text"
              className="form-control"
              placeholder="e.g., Priya Nair"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>

          <div className="filter-group">
            <label className="filter-label" htmlFor="reg-email">Email Address *</label>
            <input
              id="reg-email"
              type="email"
              className="form-control"
              placeholder="priya@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          <div className="grid-2" style={{ gap: '12px' }}>
            <div className="filter-group">
              <label className="filter-label" htmlFor="reg-phone">Phone Number</label>
              <input
                id="reg-phone"
                type="tel"
                className="form-control"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {errors.phone && <p className="form-error">{errors.phone}</p>}
            </div>

            <div className="filter-group">
              <label className="filter-label" htmlFor="reg-city">City</label>
              <input
                id="reg-city"
                type="text"
                className="form-control"
                placeholder="e.g., Bengaluru"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label" htmlFor="reg-password">Password *</label>
            <div className="password-field-wrap">
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                style={{ paddingRight: '40px' }}
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <div className="filter-group">
            <label className="filter-label" htmlFor="reg-confirm">Confirm Password *</label>
            <input
              id="reg-confirm"
              type={showPassword ? 'text' : 'password'}
              className="form-control"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            className="btn btn-accent btn-lg"
            style={{ width: '100%', marginTop: '6px' }}
            disabled={submitting}
          >
            <UserPlus size={18} />
            <span>{submitting ? 'Creating Account...' : 'Create Account'}</span>
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--secondary)', fontWeight: 700 }}>
            Login Here
          </Link>
        </div>
      </div>
    </div>
  );
}
