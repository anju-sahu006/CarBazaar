import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CarFront, CheckCircle2, Edit3, PlusCircle, RotateCcw, Trash2 } from 'lucide-react';
import { api } from '../../services/api';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { FALLBACK_CAR_IMAGE, formatINR } from '../../utils/formatters';
import ConfirmModal from '../../components/ConfirmModal';
import EmptyState from '../../components/EmptyState';

export default function MyListingsPage() {
  const { refreshCars } = useData();
  const { showToast } = useToast();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadListings = useCallback(() => {
    setLoading(true);
    api
      .getSellerCars()
      .then((res) => setListings(res.cars || []))
      .catch((err) => showToast(err.message || 'Failed to load listings', 'error'))
      .finally(() => setLoading(false));
  }, [showToast]);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  const handleToggleSold = async (car) => {
    const nextStatus = car.status === 'sold' ? 'active' : 'sold';
    try {
      await api.markCarSold(car._id, nextStatus);
      setListings((prev) =>
        prev.map((c) => (c._id === car._id ? { ...c, status: nextStatus } : c))
      );
      await refreshCars();
      showToast(
        nextStatus === 'sold' ? 'Listing marked as Sold.' : 'Listing reactivated and visible to buyers.',
        'success'
      );
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.deleteCar(deleteTarget._id);
      setListings((prev) => prev.filter((c) => c._id !== deleteTarget._id));
      await refreshCars();
      showToast('Listing deleted successfully.', 'info');
      setDeleteTarget(null);
    } catch (err) {
      showToast(err.message || 'Failed to delete listing', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>My Car Listings</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Edit pricing, update specifications, mark cars as sold, or remove listings
          </p>
        </div>
        <Link to="/seller/add" className="btn btn-accent">
          <PlusCircle size={18} />
          <span>Add New Car</span>
        </Link>
      </div>

      {loading ? (
        <div className="loader-center">
          <div className="spinner" />
          <span>Loading your listings...</span>
        </div>
      ) : listings.length === 0 ? (
        <EmptyState
          icon={CarFront}
          title="You have not posted any cars yet"
          description="Create your first used car listing to start receiving inquiries from buyers."
          action={
            <Link to="/seller/add" className="btn btn-accent">
              Add New Car
            </Link>
          }
        />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Car</th>
                <th>Year</th>
                <th>Price</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((car) => (
                <tr key={car._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={car.images?.[0] || FALLBACK_CAR_IMAGE}
                        alt={`${car.brand} ${car.model}`}
                        style={{ width: '74px', height: '48px', objectFit: 'cover', borderRadius: '8px' }}
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_CAR_IMAGE;
                        }}
                      />
                      <div>
                        <Link to={`/cars/${car._id}`} style={{ fontWeight: 700, color: 'var(--primary)' }}>
                          {car.brand} {car.model}
                        </Link>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {car.variant || car.bodyType} • {car.fuelType}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{car.year}</td>
                  <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{formatINR(car.price)}</td>
                  <td>{car.location}</td>
                  <td>
                    <span className={`badge ${car.status === 'sold' ? 'badge-danger' : 'badge-success'}`}>
                      {car.status === 'sold' ? 'SOLD' : 'Active'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <Link to={`/seller/edit/${car._id}`} className="btn btn-outline btn-sm">
                        <Edit3 size={14} />
                        <span>Edit</span>
                      </Link>
                      <button
                        type="button"
                        className={`btn btn-sm ${car.status === 'sold' ? 'btn-secondary' : 'btn-primary'}`}
                        onClick={() => handleToggleSold(car)}
                      >
                        {car.status === 'sold' ? (
                          <>
                            <RotateCcw size={14} />
                            <span>Mark Active</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={14} />
                            <span>Mark as Sold</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => setDeleteTarget(car)}
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
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
        title="Delete Car Listing"
        message={`Are you sure you want to permanently delete "${deleteTarget?.year} ${deleteTarget?.brand} ${deleteTarget?.model}"? This action cannot be undone.`}
        confirmLabel="Yes, Delete Listing"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
