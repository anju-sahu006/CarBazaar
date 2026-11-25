import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { api } from '../../services/api';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import CarForm from '../../components/CarForm';

export default function EditCarPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { refreshCars } = useData();
  const { showToast } = useToast();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .getCar(id)
      .then((res) => setCar(res.car))
      .catch((err) => {
        showToast(err.message || 'Listing not found', 'error');
        navigate('/seller/listings');
      })
      .finally(() => setLoading(false));
  }, [id, navigate, showToast]);

  const handleUpdate = async (values) => {
    setSaving(true);
    try {
      await api.updateCar(id, values);
      await refreshCars();
      showToast('Listing updated successfully!', 'success');
      navigate('/seller/listings');
    } catch (err) {
      showToast(err.message || 'Failed to update listing', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Edit Car Listing</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Update pricing, specifications, images, or contact information
          </p>
        </div>
        <button type="button" className="btn btn-outline btn-sm" onClick={() => navigate('/seller/listings')}>
          <ArrowLeft size={16} />
          <span>Back to My Listings</span>
        </button>
      </div>

      {loading ? (
        <div className="loader-center">
          <div className="spinner" />
          <span>Loading car details...</span>
        </div>
      ) : (
        car && (
          <CarForm
            initialValues={car}
            onSubmit={handleUpdate}
            submitLabel="Save Listing Changes"
            loading={saving}
          />
        )
      )}
    </div>
  );
}
