import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageSquare, Phone } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatDate, formatINR } from '../../utils/formatters';
import EmptyState from '../../components/EmptyState';

export default function SellerInquiriesPage() {
  const { showToast } = useToast();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getSellerInquiries()
      .then((res) => setInquiries(res.inquiries || []))
      .catch((err) => showToast(err.message || 'Failed to load inquiries', 'error'))
      .finally(() => setLoading(false));
  }, [showToast]);

  const handleStatusChange = async (id, status) => {
    try {
      await api.updateInquiryStatus(id, status);
      setInquiries((prev) => prev.map((inq) => (inq._id === id ? { ...inq, status } : inq)));
      showToast(`Inquiry marked as ${status}.`, 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Buyer Inquiries</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Review buyer messages and update inquiry status as you follow up
          </p>
        </div>
      </div>

      {loading ? (
        <div className="loader-center">
          <div className="spinner" />
          <span>Loading buyer inquiries...</span>
        </div>
      ) : inquiries.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No buyer inquiries yet"
          description="When buyers submit inquiries on your car listings, they will appear here with contact details."
        />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Buyer Details</th>
                <th>Vehicle</th>
                <th>Message</th>
                <th>Received</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inq) => (
                <tr key={inq._id}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{inq.buyerName}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Phone size={12} /> {inq.buyerPhone}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Mail size={12} /> {inq.buyerEmail}
                    </div>
                  </td>
                  <td>
                    <Link to={`/cars/${inq.carId}`} style={{ fontWeight: 700, color: 'var(--primary)' }}>
                      {inq.carTitle}
                    </Link>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {formatINR(inq.carPrice)}
                    </div>
                  </td>
                  <td style={{ maxWidth: '300px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    {inq.message}
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>{formatDate(inq.createdAt)}</td>
                  <td>
                    <select
                      className="form-control"
                      style={{ minWidth: '130px', padding: '7px 10px', fontWeight: 600 }}
                      value={inq.status}
                      onChange={(e) => handleStatusChange(inq._id, e.target.value)}
                      aria-label={`Update status for ${inq.buyerName}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Closed">Closed</option>
                    </select>
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
