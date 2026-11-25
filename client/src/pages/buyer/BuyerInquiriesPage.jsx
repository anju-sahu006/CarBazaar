import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ExternalLink } from 'lucide-react';
import { api } from '../../services/api';
import { FALLBACK_CAR_IMAGE, formatDate, formatINR } from '../../utils/formatters';
import EmptyState from '../../components/EmptyState';

function statusBadgeClass(status) {
  if (status === 'Contacted') return 'badge-primary';
  if (status === 'Closed') return 'badge-neutral';
  return 'badge-warning';
}

export default function BuyerInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getBuyerInquiries()
      .then((res) => setInquiries(res.inquiries || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>My Inquiries</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Track responses and status updates from sellers
          </p>
        </div>
      </div>

      {loading ? (
        <div className="loader-center">
          <div className="spinner" />
          <span>Loading your inquiries...</span>
        </div>
      ) : inquiries.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No inquiries submitted yet"
          description="Open any car listing and click Send Inquiry to message a seller directly."
          action={
            <Link to="/buyer/browse" className="btn btn-primary">
              Find a Car
            </Link>
          }
        />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Seller</th>
                <th>Your Message</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inq) => (
                <tr key={inq._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={inq.carImage || FALLBACK_CAR_IMAGE}
                        alt={inq.carTitle}
                        style={{ width: '64px', height: '42px', objectFit: 'cover', borderRadius: '6px' }}
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_CAR_IMAGE;
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 700 }}>{inq.carTitle}</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 600 }}>
                          {formatINR(inq.carPrice)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{inq.sellerName || 'Verified Seller'}</td>
                  <td style={{ maxWidth: '300px', color: 'var(--text-muted)', fontSize: '0.86rem' }}>
                    {inq.message}
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>{formatDate(inq.createdAt)}</td>
                  <td>
                    <span className={`badge ${statusBadgeClass(inq.status)}`}>{inq.status}</span>
                  </td>
                  <td>
                    <Link to={`/cars/${inq.carId}`} className="btn btn-outline btn-sm">
                      <ExternalLink size={14} />
                      <span>View Car</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
