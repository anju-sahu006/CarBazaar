import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import CarForm from '../../components/CarForm';

export default function AddCarPage() {
  const { user } = useAuth();
  const { refreshCars } = useData();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (values) => {
    setSubmitting(true);
    try {
      await api.createCar(values);
      await refreshCars();
      showToast('Car listing published! Buyers can now see your vehicle.', 'success');
      navigate('/seller/listings');
    } catch (err) {
      showToast(err.message || 'Failed to publish car listing', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Add New Car Listing</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Enter complete vehicle specifications and photos to attract serious buyers
          </p>
        </div>
        <button type="button" className="btn btn-outline btn-sm" onClick={() => navigate('/seller/listings')}>
          <ArrowLeft size={16} />
          <span>Back to My Listings</span>
        </button>
      </div>

      <CarForm
        initialValues={{
          location: user?.city || '',
          sellerPhone: user?.phone || ''
        }}
        onSubmit={handleCreate}
        submitLabel="Publish Car Listing"
        loading={submitting}
      />
    </div>
  );
}
