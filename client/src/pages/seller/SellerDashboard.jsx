import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BadgeCheck, CarFront, CheckCircle2, MessageSquare, PlusCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { FALLBACK_CAR_IMAGE, formatDate, formatINR } from '../../utils/formatters';

export default function SellerDashboard() {
  const { user } = useAuth();
  const [cars, setCars] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getSellerCars(), api.getSellerInquiries()])
      .then(([carsRes, inqRes]) => {
        setCars(carsRes.cars || []);
        setInquiries(inqRes.inquiries || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalListings = cars.length;
  const activeListings = cars.filter((c) => c.status === 'active').length;
  const soldCars = cars.filter((c) => c.status === 'sold').length;
  const totalInquiries = inquiries.length;

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 style={{ fontSize: '1.7rem', fontWeight: 800 }}>Seller Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Welcome back, <strong>{user?.name}</strong>. Manage your car inventory and buyer leads.
          </p>
        </div>
        <Link to="/seller/add" className="btn btn-accent">
          <PlusCircle size={18} />
          <span>Add New Car</span>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--secondary-light)', color: 'var(--primary)' }}>
            <CarFront size={24} />
          </div>
          <div>
            <div className="stat-value">{totalListings}</div>
            <div className="stat-label">Total Listings</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--success-bg)', color: '#15803D' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="stat-value">{activeListings}</div>
            <div className="stat-label">Active Listings</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#E2E8F0', color: '#334155' }}>
            <BadgeCheck size={24} />
          </div>
          <div>
            <div className="stat-value">{soldCars}</div>
            <div className="stat-label">Sold Cars</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--accent-light)', color: 'var(--accent-hover)' }}>
            <MessageSquare size={24} />
          </div>
          <div>
            <div className="stat-value">{totalInquiries}</div>
            <div className="stat-label">Buyer Inquiries</div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loader-center">
          <div className="spinner" />
          <span>Loading seller overview...</span>
        </div>
      ) : (
        <div className="grid-2">
          {/* Recent Listings */}
          <div className="card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.15rem' }}>Recent Listings</h2>
              <Link to="/seller/listings" className="btn btn-outline btn-sm">Manage All</Link>
            </div>
            {cars.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No listings added yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {cars.slice(0, 5).map((car) => (
                  <div
                    key={car._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      paddingBottom: '12px',
                      borderBottom: '1px solid var(--border)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={car.images?.[0] || FALLBACK_CAR_IMAGE}
                        alt={car.model}
                        style={{ width: '58px', height: '40px', objectFit: 'cover', borderRadius: '6px' }}
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_CAR_IMAGE;
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.94rem' }}>
                          {car.year} {car.brand} {car.model}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          {formatINR(car.price)} • {car.location}
                        </div>
                      </div>
                    </div>
                    <span className={`badge ${car.status === 'sold' ? 'badge-danger' : 'badge-success'}`}>
                      {car.status === 'sold' ? 'Sold' : 'Active'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Buyer Inquiries */}
          <div className="card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.15rem' }}>Latest Buyer Inquiries</h2>
              <Link to="/seller/inquiries" className="btn btn-outline btn-sm">View All</Link>
            </div>
            {inquiries.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No buyer inquiries received yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {inquiries.slice(0, 5).map((inq) => (
                  <div
                    key={inq._id}
                    style={{
                      paddingBottom: '12px',
                      borderBottom: '1px solid var(--border)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ fontSize: '0.94rem' }}>{inq.buyerName}</strong>
                      <span
                        className={`badge ${
                          inq.status === 'Contacted'
                            ? 'badge-primary'
                            : inq.status === 'Closed'
                            ? 'badge-neutral'
                            : 'badge-warning'
                        }`}
                      >
                        {inq.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--secondary)', fontWeight: 600 }}>
                      {inq.carTitle}
                    </div>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {inq.message.slice(0, 95)}
                      {inq.message.length > 95 ? '...' : ''}
                    </p>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '4px' }}>
                      {formatDate(inq.createdAt)} • {inq.buyerPhone}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
