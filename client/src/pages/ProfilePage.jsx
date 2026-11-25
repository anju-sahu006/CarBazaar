import React, { useState } from 'react';
import { Save, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/formatters';

export default function ProfilePage() {
  const { user, updateUserProfile } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState(user?.city || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Name cannot be empty.', 'error');
      return;
    }
    setSaving(true);
    try {
      await updateUserProfile({ name, phone, city });
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>My Profile</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Manage your personal contact information and account preferences
          </p>
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <form onSubmit={handleSubmit} className="card" style={{ padding: '26px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Account Details</h3>
          <div className="filter-group">
            <label className="filter-label" htmlFor="prof-name">Full Name</label>
            <input
              id="prof-name"
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label className="filter-label" htmlFor="prof-email">Email Address</label>
            <input
              id="prof-email"
              type="email"
              className="form-control"
              value={user?.email || ''}
              disabled
              style={{ background: '#F8FAFC', color: 'var(--text-muted)' }}
            />
          </div>
          <div className="filter-group">
            <label className="filter-label" htmlFor="prof-phone">Phone Number</label>
            <input
              id="prof-phone"
              type="tel"
              className="form-control"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
            />
          </div>
          <div className="filter-group">
            <label className="filter-label" htmlFor="prof-city">City</label>
            <input
              id="prof-city"
              type="text"
              className="form-control"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Your city"
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            <Save size={16} />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </form>

        <div className="card" style={{ padding: '26px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div className="feature-icon" style={{ marginBottom: 0 }}>
              <UserCheck size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem' }}>{user?.name}</h3>
              <span className="badge badge-accent" style={{ textTransform: 'uppercase', marginTop: '4px' }}>
                {user?.role} Account
              </span>
            </div>
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div><strong>Account Status:</strong> Active</div>
            <div><strong>Member Since:</strong> {formatDate(user?.createdAt)}</div>
            <div><strong>Registered Email:</strong> {user?.email}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
