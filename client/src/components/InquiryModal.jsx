import React, { useEffect, useState } from 'react';
import { Send, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { formatINR } from '../utils/formatters';
import { validateEmail, validatePhone } from '../utils/validation';

export default function InquiryModal({ open, car, onClose, onSuccess }) {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setBuyerName(user?.name || '');
      setBuyerEmail(user?.email || '');
      setBuyerPhone(user?.phone || '');
      setMessage(
        car
          ? `Hi, I am interested in your ${car.year} ${car.brand} ${car.model}. Is it still available for inspection and test drive?`
          : ''
      );
      setErrors({});
    }
  }, [open, user, car]);

  if (!open || !car) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!buyerName.trim()) nextErrors.buyerName = 'Your name is required.';
    if (!validateEmail(buyerEmail)) nextErrors.buyerEmail = 'Enter a valid email address.';
    if (!validatePhone(buyerPhone)) nextErrors.buyerPhone = 'Enter a valid 10-digit phone number.';
    if (!message.trim() || message.trim().length < 10) {
      nextErrors.message = 'Please enter a short message (min 10 characters).';
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    try {
      await api.createInquiry({
        carId: car._id,
        buyerName: buyerName.trim(),
        buyerEmail: buyerEmail.trim(),
        buyerPhone: buyerPhone.trim(),
        message: message.trim()
      });
      showToast('Inquiry submitted! The seller will contact you shortly.', 'success');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      showToast(err.message || 'Failed to submit inquiry.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Send Inquiry to Seller</h3>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div
          style={{
            background: '#F8FAFC',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '12px',
            marginBottom: '18px'
          }}
        >
          <div style={{ fontWeight: 700, color: 'var(--primary)' }}>
            {car.year} {car.brand} {car.model} {car.variant}
          </div>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Asking Price: <strong>{formatINR(car.price)}</strong> • Seller: {car.sellerName}
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="filter-group">
            <label className="filter-label" htmlFor="inq-name">Your Name</label>
            <input
              id="inq-name"
              type="text"
              className="form-control"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
            />
            {errors.buyerName && <p className="form-error">{errors.buyerName}</p>}
          </div>

          <div className="filter-group">
            <label className="filter-label" htmlFor="inq-email">Email Address</label>
            <input
              id="inq-email"
              type="email"
              className="form-control"
              value={buyerEmail}
              onChange={(e) => setBuyerEmail(e.target.value)}
            />
            {errors.buyerEmail && <p className="form-error">{errors.buyerEmail}</p>}
          </div>

          <div className="filter-group">
            <label className="filter-label" htmlFor="inq-phone">Phone Number</label>
            <input
              id="inq-phone"
              type="tel"
              className="form-control"
              placeholder="+91 98765 43210"
              value={buyerPhone}
              onChange={(e) => setBuyerPhone(e.target.value)}
            />
            {errors.buyerPhone && <p className="form-error">{errors.buyerPhone}</p>}
          </div>

          <div className="filter-group">
            <label className="filter-label" htmlFor="inq-msg">Message</label>
            <textarea
              id="inq-msg"
              rows={3}
              className="form-control"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            {errors.message && <p className="form-error">{errors.message}</p>}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '18px' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-accent" disabled={submitting}>
              <Send size={16} />
              <span>{submitting ? 'Sending...' : 'Submit Inquiry'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
