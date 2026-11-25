import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search } from 'lucide-react';
import { useData } from '../../context/DataContext';
import CarCard from '../../components/CarCard';
import EmptyState from '../../components/EmptyState';

export default function SavedCarsPage() {
  const { wishlistCars } = useData();

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Saved Cars (Wishlist)</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            {wishlistCars.length} {wishlistCars.length === 1 ? 'vehicle' : 'vehicles'} saved for comparison
          </p>
        </div>
        <Link to="/buyer/browse" className="btn btn-primary btn-sm">
          <Search size={16} />
          <span>Explore More Cars</span>
        </Link>
      </div>

      {wishlistCars.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Tap the heart icon on any car listing to save it here and track prices easily."
          action={
            <Link to="/buyer/browse" className="btn btn-accent">
              Browse Cars
            </Link>
          }
        />
      ) : (
        <div className="car-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(275px, 1fr))' }}>
          {wishlistCars.map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
}
