import React from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { useData } from '../../context/DataContext';
import CarCard from '../../components/CarCard';
import EmptyState from '../../components/EmptyState';

export default function RecentlyViewedPage() {
  const { recentlyViewedCars } = useData();

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Recently Viewed Cars</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Quickly revisit vehicles you inspected recently
          </p>
        </div>
      </div>

      {recentlyViewedCars.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No recently viewed cars yet"
          description="Cars you open from Browse Cars or the homepage will appear here automatically."
          action={
            <Link to="/buyer/browse" className="btn btn-primary">
              Browse Cars
            </Link>
          }
        />
      ) : (
        <div className="car-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(275px, 1fr))' }}>
          {recentlyViewedCars.map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
}
