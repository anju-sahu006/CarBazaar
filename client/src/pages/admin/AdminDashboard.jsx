import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BadgeCheck,
  CarFront,
  CheckCircle2,
  MessageSquare,
  ShieldCheck,
  Store,
  UserCheck,
  Users
} from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function AdminDashboard() {
  const { showToast } = useToast();
  const [stats, setStats] = useState(null);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getAdminStats(), api.getAdminCars()])
      .then(([statsRes, carsRes]) => {
        setStats(statsRes.stats);
        setCars(carsRes.cars || []);
      })
      .catch((err) => showToast(err.message || 'Failed to load admin statistics', 'error'))
      .finally(() => setLoading(false));
  }, [showToast]);

  const fuelBreakdown = cars.reduce((acc, car) => {
    acc[car.fuelType] = (acc[car.fuelType] || 0) + 1;
    return acc;
  }, {});

  const bodyBreakdown = cars.reduce((acc, car) => {
    acc[car.bodyType] = (acc[car.bodyType] || 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="loader-center">
        <div className="spinner" />
        <span>Loading platform analytics...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 style={{ fontSize: '1.7rem', fontWeight: 800 }}>Admin Control Center</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Real-time platform statistics, user governance, and listing moderation
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/admin/users" className="btn btn-outline btn-sm">Manage Users</Link>
          <Link to="/admin/listings" className="btn btn-primary btn-sm">Moderate Listings</Link>
        </div>
      </div>

      {/* 7 Required Platform Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--secondary-light)', color: 'var(--primary)' }}>
            <Users size={22} />
          </div>
          <div>
            <div className="stat-value">{stats?.totalUsers ?? 0}</div>
            <div className="stat-label">Total Registered Users</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#E0E7FF', color: '#3730A3' }}>
            <Store size={22} />
          </div>
          <div>
            <div className="stat-value">{stats?.totalSellers ?? 0}</div>
            <div className="stat-label">Total Sellers</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#DCFCE7', color: '#15803D' }}>
            <UserCheck size={22} />
          </div>
          <div>
            <div className="stat-value">{stats?.totalBuyers ?? 0}</div>
            <div className="stat-label">Total Buyers</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--secondary-light)', color: 'var(--secondary)' }}>
            <CarFront size={22} />
          </div>
          <div>
            <div className="stat-value">{stats?.totalListings ?? 0}</div>
            <div className="stat-label">Total Car Listings</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--success-bg)', color: '#15803D' }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div className="stat-value">{stats?.activeListings ?? 0}</div>
            <div className="stat-label">Active Listings</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#F1F5F9', color: '#334155' }}>
            <BadgeCheck size={22} />
          </div>
          <div>
            <div className="stat-value">{stats?.soldListings ?? 0}</div>
            <div className="stat-label">Sold Listings</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--accent-light)', color: 'var(--accent-hover)' }}>
            <MessageSquare size={22} />
          </div>
          <div>
            <div className="stat-value">{stats?.totalInquiries ?? 0}</div>
            <div className="stat-label">Total Inquiries</div>
          </div>
        </div>
      </div>

      {/* Platform Breakdown Charts */}
      <div className="grid-2">
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.15rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} color="var(--secondary)" /> Inventory by Body Type
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(bodyBreakdown).map(([type, count]) => {
              const pct = cars.length ? Math.round((count / cars.length) * 100) : 0;
              return (
                <div key={type}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '4px' }}>
                    <strong>{type}</strong>
                    <span style={{ color: 'var(--text-muted)' }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ height: '9px', background: '#EDF2F7', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'var(--secondary)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.15rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CarFront size={18} color="var(--accent)" /> Inventory by Fuel Type
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(fuelBreakdown).map(([fuel, count]) => {
              const pct = cars.length ? Math.round((count / cars.length) * 100) : 0;
              return (
                <div key={fuel}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '4px' }}>
                    <strong>{fuel}</strong>
                    <span style={{ color: 'var(--text-muted)' }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ height: '9px', background: '#EDF2F7', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'var(--accent)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
