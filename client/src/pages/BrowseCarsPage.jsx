import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CarFront, RotateCcw } from 'lucide-react';
import { useData } from '../context/DataContext';
import FilterSidebar from '../components/FilterSidebar';
import CarCard from '../components/CarCard';
import EmptyState from '../components/EmptyState';

const INITIAL_FILTERS = {
  search: '',
  brand: 'All',
  minPrice: '',
  maxPrice: '',
  minYear: '',
  fuelType: 'All',
  transmission: 'All',
  bodyType: 'All',
  location: 'All',
  sort: 'newest'
};

export default function BrowseCarsPage() {
  const { cars, carsLoading } = useData();
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState(() => ({
    ...INITIAL_FILTERS,
    search: searchParams.get('search') || '',
    brand: searchParams.get('brand') || 'All',
    bodyType: searchParams.get('bodyType') || 'All',
    fuelType: searchParams.get('fuelType') || 'All',
    location: searchParams.get('location') || 'All'
  }));

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      search: searchParams.get('search') ?? prev.search,
      brand: searchParams.get('brand') ?? prev.brand,
      bodyType: searchParams.get('bodyType') ?? prev.bodyType
    }));
  }, [searchParams]);

  const activeCars = useMemo(() => cars.filter((c) => c.status === 'active'), [cars]);

  const brands = useMemo(
    () => Array.from(new Set(activeCars.map((c) => c.brand))).sort(),
    [activeCars]
  );

  const locations = useMemo(
    () => Array.from(new Set(activeCars.map((c) => c.location))).sort(),
    [activeCars]
  );

  const filteredCars = useMemo(() => {
    let result = [...activeCars];

    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      result = result.filter(
        (c) =>
          c.brand.toLowerCase().includes(q) ||
          c.model.toLowerCase().includes(q) ||
          (c.variant && c.variant.toLowerCase().includes(q)) ||
          c.location.toLowerCase().includes(q) ||
          `${c.brand} ${c.model}`.toLowerCase().includes(q)
      );
    }
    if (filters.brand !== 'All') {
      result = result.filter((c) => c.brand.toLowerCase() === filters.brand.toLowerCase());
    }
    if (filters.fuelType !== 'All') {
      result = result.filter((c) => c.fuelType === filters.fuelType);
    }
    if (filters.transmission !== 'All') {
      result = result.filter((c) => c.transmission === filters.transmission);
    }
    if (filters.bodyType !== 'All') {
      result = result.filter((c) => c.bodyType === filters.bodyType);
    }
    if (filters.location !== 'All') {
      result = result.filter((c) => c.location === filters.location);
    }
    if (filters.minPrice !== '') {
      const minP = Number(filters.minPrice);
      if (Number.isFinite(minP)) result = result.filter((c) => c.price >= minP);
    }
    if (filters.maxPrice !== '') {
      const maxP = Number(filters.maxPrice);
      if (Number.isFinite(maxP)) result = result.filter((c) => c.price <= maxP);
    }
    if (filters.minYear !== '') {
      const minY = Number(filters.minYear);
      if (Number.isFinite(minY)) result = result.filter((c) => c.year >= minY);
    }

    if (filters.sort === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sort === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [activeCars, filters]);

  const handleReset = () => {
    setFilters(INITIAL_FILTERS);
    setSearchParams({});
  };

  return (
    <div className="section" style={{ paddingTop: '36px' }}>
      <div className="container">
        <div className="section-header" style={{ marginBottom: '24px' }}>
          <div>
            <div className="section-eyebrow">Verified Inventory</div>
            <h1 className="section-title">Browse Pre-Owned Cars</h1>
            <p className="section-desc">
              Showing <strong>{filteredCars.length}</strong> of {activeCars.length} active listings across India
            </p>
          </div>
        </div>

        <div className="browse-layout">
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            onReset={handleReset}
            brands={brands}
            locations={locations}
          />

          <div>
            {carsLoading ? (
              <div className="loader-center">
                <div className="spinner" />
                <span>Loading available cars...</span>
              </div>
            ) : filteredCars.length === 0 ? (
              <EmptyState
                icon={CarFront}
                title="No matching cars found"
                description="Try adjusting your budget range, brand, fuel type, or search keywords to see more vehicles."
                action={
                  <button type="button" className="btn btn-primary" onClick={handleReset}>
                    <RotateCcw size={16} />
                    <span>Reset All Filters</span>
                  </button>
                }
              />
            ) : (
              <div className="car-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                {filteredCars.map((car) => (
                  <CarCard key={car._id} car={car} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
