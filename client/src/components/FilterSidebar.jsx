import React from 'react';
import { RotateCcw, Search, SlidersHorizontal } from 'lucide-react';

export default function FilterSidebar({
  filters,
  onChange,
  onReset,
  brands = [],
  locations = []
}) {
  const handleField = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <aside className="filter-panel" aria-label="Car Filters">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '18px',
          paddingBottom: '12px',
          borderBottom: '1px solid var(--border)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: 'var(--primary)' }}>
          <SlidersHorizontal size={18} />
          <span>Filter &amp; Sort</span>
        </div>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={onReset}
          style={{ padding: '4px 10px', fontSize: '0.8rem' }}
        >
          <RotateCcw size={14} />
          <span>Reset</span>
        </button>
      </div>

      <div className="filter-group">
        <label className="filter-label" htmlFor="filter-search">Search Brand or Model</label>
        <div style={{ position: 'relative' }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }}
          />
          <input
            id="filter-search"
            type="text"
            className="form-control"
            style={{ paddingLeft: '34px' }}
            placeholder="e.g., Hyundai, Creta, Swift"
            value={filters.search}
            onChange={(e) => handleField('search', e.target.value)}
          />
        </div>
      </div>

      <div className="filter-group">
        <label className="filter-label" htmlFor="filter-sort">Sort By</label>
        <select
          id="filter-sort"
          className="form-control"
          value={filters.sort}
          onChange={(e) => handleField('sort', e.target.value)}
        >
          <option value="newest">Newest Listings</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label" htmlFor="filter-brand">Brand</label>
        <select
          id="filter-brand"
          className="form-control"
          value={filters.brand}
          onChange={(e) => handleField('brand', e.target.value)}
        >
          <option value="All">All Brands</option>
          {brands.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">Price Range (INR)</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <input
            type="number"
            className="form-control"
            placeholder="Min ₹"
            min="0"
            value={filters.minPrice}
            onChange={(e) => handleField('minPrice', e.target.value)}
            aria-label="Minimum Price"
          />
          <input
            type="number"
            className="form-control"
            placeholder="Max ₹"
            min="0"
            value={filters.maxPrice}
            onChange={(e) => handleField('maxPrice', e.target.value)}
            aria-label="Maximum Price"
          />
        </div>
      </div>

      <div className="filter-group">
        <label className="filter-label" htmlFor="filter-year">Manufacturing Year (From)</label>
        <select
          id="filter-year"
          className="form-control"
          value={filters.minYear}
          onChange={(e) => handleField('minYear', e.target.value)}
        >
          <option value="">Any Year</option>
          <option value="2023">2023 &amp; Newer</option>
          <option value="2022">2022 &amp; Newer</option>
          <option value="2021">2021 &amp; Newer</option>
          <option value="2020">2020 &amp; Newer</option>
          <option value="2018">2018 &amp; Newer</option>
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label" htmlFor="filter-fuel">Fuel Type</label>
        <select
          id="filter-fuel"
          className="form-control"
          value={filters.fuelType}
          onChange={(e) => handleField('fuelType', e.target.value)}
        >
          <option value="All">All Fuel Types</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="CNG">CNG</option>
          <option value="Electric">Electric</option>
          <option value="Hybrid">Hybrid</option>
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label" htmlFor="filter-transmission">Transmission</label>
        <select
          id="filter-transmission"
          className="form-control"
          value={filters.transmission}
          onChange={(e) => handleField('transmission', e.target.value)}
        >
          <option value="All">All Transmissions</option>
          <option value="Manual">Manual</option>
          <option value="Automatic">Automatic</option>
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label" htmlFor="filter-body">Body Type</label>
        <select
          id="filter-body"
          className="form-control"
          value={filters.bodyType}
          onChange={(e) => handleField('bodyType', e.target.value)}
        >
          <option value="All">All Body Types</option>
          <option value="Hatchback">Hatchback</option>
          <option value="Sedan">Sedan</option>
          <option value="Compact SUV">Compact SUV</option>
          <option value="SUV">SUV</option>
          <option value="MPV">MPV</option>
        </select>
      </div>

      <div className="filter-group" style={{ marginBottom: 0 }}>
        <label className="filter-label" htmlFor="filter-location">Location</label>
        <select
          id="filter-location"
          className="form-control"
          value={filters.location}
          onChange={(e) => handleField('location', e.target.value)}
        >
          <option value="All">All Cities</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>
    </aside>
  );
}
