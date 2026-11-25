import React, { useState } from 'react';
import { ImagePlus, Link2, Trash2, UploadCloud } from 'lucide-react';
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE_BYTES, validateCarForm } from '../utils/validation';
import { useToast } from '../context/ToastContext';
import { FALLBACK_CAR_IMAGE } from '../utils/formatters';

const DEFAULT_VALUES = {
  brand: '',
  model: '',
  variant: '',
  year: new Date().getFullYear(),
  price: '',
  kilometers: '',
  fuelType: 'Petrol',
  transmission: 'Manual',
  bodyType: 'Hatchback',
  engineCapacity: '',
  ownership: 'First Owner',
  registrationNumber: '',
  registrationState: '',
  location: '',
  color: '',
  description: '',
  sellerPhone: '',
  images: []
};

export default function CarForm({ initialValues, onSubmit, submitLabel = 'Publish Listing', loading = false }) {
  const { showToast } = useToast();
  const [values, setValues] = useState({ ...DEFAULT_VALUES, ...initialValues });
  const [errors, setErrors] = useState({});
  const [imageUrlInput, setImageUrlInput] = useState('');

  const handleChange = (field, val) => {
    setValues((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validDataUrls = [];
    for (const file of files) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        showToast(`Unsupported format for ${file.name}. Use JPG, PNG, WEBP, or SVG.`, 'error');
        continue;
      }
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        showToast(`${file.name} exceeds 2 MB size limit.`, 'error');
        continue;
      }
      const dataUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
      validDataUrls.push(dataUrl);
    }

    if (validDataUrls.length > 0) {
      setValues((prev) => ({ ...prev, images: [...prev.images, ...validDataUrls].slice(0, 6) }));
      showToast(`Added ${validDataUrls.length} image(s).`, 'success');
    }
    e.target.value = '';
  };

  const handleAddImageUrl = () => {
    const trimmed = imageUrlInput.trim();
    if (!trimmed) return;
    setValues((prev) => ({ ...prev, images: [...prev.images, trimmed].slice(0, 6) }));
    setImageUrlInput('');
  };

  const handleRemoveImage = (index) => {
    setValues((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateCarForm(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showToast('Please fix the highlighted form errors.', 'error');
      return;
    }
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ padding: '28px' }} noValidate>
      <div className="grid-3" style={{ gap: '18px' }}>
        <div>
          <label className="filter-label" htmlFor="car-brand">Brand *</label>
          <input
            id="car-brand"
            type="text"
            className="form-control"
            placeholder="e.g., Hyundai"
            value={values.brand}
            onChange={(e) => handleChange('brand', e.target.value)}
          />
          {errors.brand && <p className="form-error">{errors.brand}</p>}
        </div>

        <div>
          <label className="filter-label" htmlFor="car-model">Model *</label>
          <input
            id="car-model"
            type="text"
            className="form-control"
            placeholder="e.g., Creta"
            value={values.model}
            onChange={(e) => handleChange('model', e.target.value)}
          />
          {errors.model && <p className="form-error">{errors.model}</p>}
        </div>

        <div>
          <label className="filter-label" htmlFor="car-variant">Variant</label>
          <input
            id="car-variant"
            type="text"
            className="form-control"
            placeholder="e.g., SX(O) 1.5 AT"
            value={values.variant}
            onChange={(e) => handleChange('variant', e.target.value)}
          />
        </div>

        <div>
          <label className="filter-label" htmlFor="car-year">Manufacturing Year *</label>
          <input
            id="car-year"
            type="number"
            className="form-control"
            min="1995"
            max={new Date().getFullYear() + 1}
            value={values.year}
            onChange={(e) => handleChange('year', e.target.value)}
          />
          {errors.year && <p className="form-error">{errors.year}</p>}
        </div>

        <div>
          <label className="filter-label" htmlFor="car-price">Selling Price (INR ₹) *</label>
          <input
            id="car-price"
            type="number"
            className="form-control"
            min="1"
            placeholder="e.g., 1250000"
            value={values.price}
            onChange={(e) => handleChange('price', e.target.value)}
          />
          {errors.price && <p className="form-error">{errors.price}</p>}
        </div>

        <div>
          <label className="filter-label" htmlFor="car-km">Kilometers Driven *</label>
          <input
            id="car-km"
            type="number"
            className="form-control"
            min="0"
            placeholder="e.g., 24500"
            value={values.kilometers}
            onChange={(e) => handleChange('kilometers', e.target.value)}
          />
          {errors.kilometers && <p className="form-error">{errors.kilometers}</p>}
        </div>

        <div>
          <label className="filter-label" htmlFor="car-fuel">Fuel Type *</label>
          <select
            id="car-fuel"
            className="form-control"
            value={values.fuelType}
            onChange={(e) => handleChange('fuelType', e.target.value)}
          >
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="CNG">CNG</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        <div>
          <label className="filter-label" htmlFor="car-transmission">Transmission *</label>
          <select
            id="car-transmission"
            className="form-control"
            value={values.transmission}
            onChange={(e) => handleChange('transmission', e.target.value)}
          >
            <option value="Manual">Manual</option>
            <option value="Automatic">Automatic</option>
          </select>
        </div>

        <div>
          <label className="filter-label" htmlFor="car-body">Body Type *</label>
          <select
            id="car-body"
            className="form-control"
            value={values.bodyType}
            onChange={(e) => handleChange('bodyType', e.target.value)}
          >
            <option value="Hatchback">Hatchback</option>
            <option value="Sedan">Sedan</option>
            <option value="Compact SUV">Compact SUV</option>
            <option value="SUV">SUV</option>
            <option value="MPV">MPV</option>
            <option value="Coupe">Coupe</option>
          </select>
        </div>

        <div>
          <label className="filter-label" htmlFor="car-engine">Engine Capacity *</label>
          <input
            id="car-engine"
            type="text"
            className="form-control"
            placeholder="e.g., 1497 cc"
            value={values.engineCapacity}
            onChange={(e) => handleChange('engineCapacity', e.target.value)}
          />
          {errors.engineCapacity && <p className="form-error">{errors.engineCapacity}</p>}
        </div>

        <div>
          <label className="filter-label" htmlFor="car-ownership">Ownership *</label>
          <select
            id="car-ownership"
            className="form-control"
            value={values.ownership}
            onChange={(e) => handleChange('ownership', e.target.value)}
          >
            <option value="First Owner">First Owner</option>
            <option value="Second Owner">Second Owner</option>
            <option value="Third Owner">Third Owner</option>
            <option value="Fourth+ Owner">Fourth+ Owner</option>
          </select>
        </div>

        <div>
          <label className="filter-label" htmlFor="car-reg">Registration Number (Optional)</label>
          <input
            id="car-reg"
            type="text"
            className="form-control"
            placeholder="e.g., MH-02-AB-1234"
            value={values.registrationNumber}
            onChange={(e) => handleChange('registrationNumber', e.target.value)}
          />
        </div>

        <div>
          <label className="filter-label" htmlFor="car-location">City / Location *</label>
          <input
            id="car-location"
            type="text"
            className="form-control"
            placeholder="e.g., Mumbai"
            value={values.location}
            onChange={(e) => handleChange('location', e.target.value)}
          />
          {errors.location && <p className="form-error">{errors.location}</p>}
        </div>

        <div>
          <label className="filter-label" htmlFor="car-color">Exterior Color</label>
          <input
            id="car-color"
            type="text"
            className="form-control"
            placeholder="e.g., Pearl White"
            value={values.color}
            onChange={(e) => handleChange('color', e.target.value)}
          />
        </div>

        <div>
          <label className="filter-label" htmlFor="car-phone">Seller Contact Number *</label>
          <input
            id="car-phone"
            type="tel"
            className="form-control"
            placeholder="e.g., +91 98201 55443"
            value={values.sellerPhone}
            onChange={(e) => handleChange('sellerPhone', e.target.value)}
          />
          {errors.sellerPhone && <p className="form-error">{errors.sellerPhone}</p>}
        </div>
      </div>

      <div style={{ marginTop: '18px' }}>
        <label className="filter-label" htmlFor="car-desc">Vehicle Description *</label>
        <textarea
          id="car-desc"
          rows={4}
          className="form-control"
          placeholder="Describe service history, tyres, insurance status, key features, and condition..."
          value={values.description}
          onChange={(e) => handleChange('description', e.target.value)}
        />
        {errors.description && <p className="form-error">{errors.description}</p>}
      </div>

      {/* Image Upload & URL Section */}
      <div style={{ marginTop: '22px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
        <label className="filter-label">Vehicle Photographs (Up to 6 images, max 2 MB each)</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginTop: '8px' }}>
          <label className="btn btn-outline" style={{ cursor: 'pointer' }}>
            <UploadCloud size={18} />
            <span>Upload Photos (JPG/PNG/WEBP)</span>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.svg"
              multiple
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </label>

          <div style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '240px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Or paste an image URL (e.g., /images/cars/creta-1.svg)"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
            />
            <button type="button" className="btn btn-secondary" onClick={handleAddImageUrl}>
              <Link2 size={16} />
              <span>Add</span>
            </button>
          </div>
        </div>

        {values.images.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px', marginTop: '16px' }}>
            {values.images.map((img, idx) => (
              <div
                key={`${img.slice(0, 24)}-${idx}`}
                style={{
                  position: 'relative',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                  aspectRatio: '16/10',
                  background: '#F1F5F9'
                }}
              >
                <img
                  src={img}
                  alt={`Preview ${idx + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_CAR_IMAGE;
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  aria-label="Remove image"
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    border: 'none',
                    background: 'rgba(220, 38, 38, 0.9)',
                    color: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              marginTop: '14px',
              padding: '20px',
              borderRadius: '10px',
              border: '1.5px dashed var(--border-strong)',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.88rem'
            }}
          >
            <ImagePlus size={20} />
            <span>No photos added yet. A clean fallback preview image will be used if submitted without photos.</span>
          </div>
        )}
      </div>

      <div style={{ marginTop: '26px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
        <button type="submit" className="btn btn-accent btn-lg" disabled={loading}>
          {loading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
