import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validateEmail } from '../utils/validation';

const DEMO_ACCOUNTS = [
  { role: 'Buyer', email: 'buyer@carbazaar.com', pass: 'Buyer123' },
  { role: 'Seller', email: 'seller@carbazaar.com', pass: 'Seller123' },
  { role: 'Admin', email: 'admin@carbazaar.com', pass: 'Admin123' }
];

export default function LoginPage() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const redirectByRole = (role) => {
    const from = location.state?.from;
    if (from && !from.startsWith('/login') && !from.startsWith('/register')) {
      return from;
    }
    if (role === 'admin') return '/admin';
    if (role === 'seller') return '/seller';
    return '/buyer';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    setSubmitting(true);
    try {
      const user = await login({ email, password });
      showToast(`Welcome back, ${user.name}!`, 'success');
      navigate(redirectByRole(user.role), { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemo = (acc) => {
    setEmail(acc.email);
    setPassword(acc.pass);
    setError('');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>
            Welcome Back
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '4px' }}>
            Sign in to access your CarBazaar dashboard
          </p>
        </div>

        {error && (
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
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="filter-group">
            <label className="filter-label" htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              className="form-control"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label" htmlFor="login-password">Password</label>
            <div className="password-field-wrap">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                style={{ paddingRight: '40px' }}
                placeholder="Enter your password"
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
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '6px' }}
            disabled={submitting}
          >
            <LogIn size={18} />
            <span>{submitting ? 'Signing In...' : 'Login'}</span>
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don&apos;t have an account?{' '}
          <Link to="/register" style={{ color: 'var(--secondary)', fontWeight: 700 }}>
            Register Now
          </Link>
        </div>

        {/* Demo Credentials Helper */}
        <div
          style={{
            marginTop: '24px',
            paddingTop: '18px',
            borderTop: '1px solid var(--border)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '10px' }}>
            <Shield size={14} />
            <span>Quick-Fill Demonstration Accounts (Demo Only)</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.role}
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => fillDemo(acc)}
                style={{ fontSize: '0.8rem', padding: '7px 8px' }}
              >
                {acc.role}
              </button>
            ))}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '8px', textAlign: 'center' }}>
            Click a role above to autofill its demo credentials, then press Login.
          </p>
        </div>
      </div>
    </div>
  );
}
