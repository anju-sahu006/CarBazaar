import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Heart, MessageSquare, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { api } from '../../services/api';
import CarCard from '../../components/CarCard';

export default function BuyerDashboard() {
  const { user } = useAuth();
  const { cars, wishlistIds, recentlyViewedCars } = useData();
  const [inquiriesCount, setInquiriesCount] = useState(0);

  useEffect(() => {
    api
      .getBuyerInquiries()
      .then((res) => {
        const list = res.inquiries || [];
        setInquiriesCount(list.filter((i) => i.status !== 'Closed').length);
      })
      .catch(() => setInquiriesCount(0));
  }, []);

  const recommendedCars = cars.filter((c) => c.status === 'active').slice(0, 6);

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 style={{ fontSize: '1.7rem', fontWeight: 800 }}>
            Welcome, {user?.name}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.93rem' }}>
            Track your saved rides, active seller inquiries, and personalized recommendations
          </p>
        </div>
        <Link to="/buyer/browse" className="btn btn-accent">
          <Search size={17} />
          <span>Browse All Cars</span>
        </Link>
      </div>

      {/* Overview Cards */}
      <div className="stats-grid">
        <Link to="/buyer/saved" className="stat-card">
          <div className="stat-icon" style={{ background: '#FFE4E6', color: '#E11D48' }}>
            <Heart size={24} />
          </div>
          <div>
            <div className="stat-value">{wishlistIds.length}</div>
            <div className="stat-label">Saved Cars</div>
          </div>
        </Link>

        <Link to="/buyer/inquiries" className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--secondary-light)', color: 'var(--secondary)' }}>
            <MessageSquare size={24} />
          </div>
          <div>
            <div className="stat-value">{inquiriesCount}</div>
            <div className="stat-label">Active Inquiries</div>
          </div>
        </Link>

        <Link to="/buyer/recent" className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--accent-light)', color: 'var(--accent-hover)' }}>
            <Clock size={24} />
          </div>
          <div>
            <div className="stat-value">{recentlyViewedCars.length}</div>
            <div className="stat-label">Recently Viewed Cars</div>
          </div>
        </Link>
      </div>

      {/* Featured & Recommended */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Featured &amp; Recommended Cars</h2>
        <Link to="/buyer/browse" className="btn btn-outline btn-sm">
          <span>See All</span>
          <ArrowRight size={15} />
        </Link>
      </div>

      <div className="car-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(275px, 1fr))' }}>
        {recommendedCars.map((car) => (
          <CarCard key={car._id} car={car} />
        ))}
      </div>
    </div>
  );
}
