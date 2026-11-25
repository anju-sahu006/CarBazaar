import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Search, Trash2 } from 'lucide-react';
import { api } from '../../services/api';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { FALLBACK_CAR_IMAGE, formatINR } from '../../utils/formatters';
import ConfirmModal from '../../components/ConfirmModal';

export default function AdminListingsPage() {
  const { refreshCars } = useData();
  const { showToast } = useToast();

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [brandFilter, setBrandFilter] = useState('All');
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    api
      .getAdminCars()
      .then((res) => setCars(res.cars || []))
      .catch((err) => showToast(err.message || 'Failed to load listings', 'error'))
      .finally(() => setLoading(false));
  }, [showToast]);

  const brands = useMemo(() => Array.from(new Set(cars.map((c) => c.brand))).sort(), [cars]);

  const filteredCars = useMemo(() => {
    return cars.filter((c) => {
      if (statusFilter !== 'All' && c.status !== statusFilter) return false;
      if (brandFilter !== 'All' && c.brand !== brandFilter) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        return (
          c.brand.toLowerCase().includes(q) ||
          c.model.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          c.sellerName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [cars, search, statusFilter, brandFilter]);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteCar(deleteTarget._id);
      setCars((prev) => prev.filter((c) => c._id !== deleteTarget._id));
      await refreshCars();
      showToast('Inappropriate listing removed successfully.', 'info');
      setDeleteTarget(null);
    } catch (err) {
      showToast(err.message || 'Failed to remove listing', 'error');
    }
  };

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>All Car Listings</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Search, inspect, and moderate all active and sold vehicles across CarBazaar
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="card" style={{ padding: '16px', marginBottom: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }}
          />
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '34px' }}
            placeholder="Search by brand, model, city, or seller..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="form-control"
          style={{ width: '170px' }}
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
        >
          <option value="All">All Brands</option>
          {brands.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        <select
          className="form-control"
          style={{ width: '150px' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="active">Active</option>
          <option value="sold">Sold</option>
        </select>
      </div>

      {loading ? (
        <div className="loader-center">
          <div className="spinner" />
          <span>Loading listings...</span>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Seller</th>
                <th>Price</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCars.map((car) => (
                <tr key={car._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={car.images?.[0] || FALLBACK_CAR_IMAGE}
                        alt={car.model}
                        style={{ width: '70px', height: '46px', objectFit: 'cover', borderRadius: '6px' }}
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_CAR_IMAGE;
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 700 }}>
                          {car.year} {car.brand} {car.model}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {car.fuelType} • {car.transmission} • {car.bodyType}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{car.sellerName}</td>
                  <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{formatINR(car.price)}</td>
                  <td>{car.location}</td>
                  <td>
                    <span className={`badge ${car.status === 'sold' ? 'badge-danger' : 'badge-success'}`}>
                      {car.status === 'sold' ? 'Sold' : 'Active'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link to={`/cars/${car._id}`} className="btn btn-outline btn-sm">
                        <ExternalLink size={14} />
                        <span>Inspect</span>
                      </Link>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => setDeleteTarget(car)}
                      >
                        <Trash2 size={14} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Remove Car Listing"
        message={`Are you sure you want to remove "${deleteTarget?.year} ${deleteTarget?.brand} ${deleteTarget?.model}" by ${deleteTarget?.sellerName}?`}
        confirmLabel="Remove Listing"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
