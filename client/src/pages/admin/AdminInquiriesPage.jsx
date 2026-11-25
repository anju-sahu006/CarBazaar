import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, MessageSquare } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatDate, formatINR } from '../../utils/formatters';
import EmptyState from '../../components/EmptyState';

export default function AdminInquiriesPage() {
  const { showToast } = useToast();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getAdminInquiries()
      .then((res) => setInquiries(res.inquiries || []))
      .catch((err) => showToast(err.message || 'Failed to load inquiries', 'error'))
      .finally(() => setLoading(false));
  }, [showToast]);

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Platform Inquiries</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Monitor all buyer–seller inquiries across the marketplace
          </p>
        </div>
      </div>

      {loading ? (
        <div className="loader-center">
          <div className="spinner" />
          <span>Loading inquiries...</span>
        </div>
      ) : inquiries.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No inquiries recorded"
          description="Submitted buyer inquiries will appear here for administrative visibility."
        />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Buyer</th>
                <th>Seller</th>
                <th>Vehicle</th>
                <th>Message</th>
                <th>Date</th>
                <th>Status</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inq) => (
                <tr key={inq._id}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{inq.buyerName}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{inq.buyerEmail}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{inq.buyerPhone}</div>
                  </td>
                  <td>{inq.sellerName}</td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{inq.carTitle}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--primary)' }}>{formatINR(inq.carPrice)}</div>
                  </td>
                  <td style={{ maxWidth: '260px', fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                    {inq.message}
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>{formatDate(inq.createdAt)}</td>
                  <td>
                    <span
                      className={`badge ${
                        inq.status === 'Contacted'
                          ? 'badge-primary'
                          : inq.status === 'Closed'
                          ? 'badge-neutral'
                          : 'badge-warning'
                      }`}
                    >
                      {inq.status}
                    </span>
                  </td>
                  <td>
                    <Link to={`/cars/${inq.carId}`} className="btn btn-outline btn-sm">
                      <ExternalLink size={14} />
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
