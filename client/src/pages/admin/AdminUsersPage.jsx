import React, { useEffect, useMemo, useState } from 'react';
import { Search, ShieldOff, ShieldCheck, Trash2 } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/formatters';
import ConfirmModal from '../../components/ConfirmModal';

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    api
      .getAdminUsers()
      .then((res) => setUsers(res.users || []))
      .catch((err) => showToast(err.message || 'Failed to load users', 'error'))
      .finally(() => setLoading(false));
  }, [showToast]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (roleFilter !== 'All' && u.role !== roleFilter) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        return (
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.city && u.city.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [users, search, roleFilter]);

  const handleToggleActive = async (targetUser) => {
    try {
      const res = await api.toggleAdminUser(targetUser._id);
      setUsers((prev) => prev.map((u) => (u._id === targetUser._id ? res.user : u)));
      showToast(res.message || 'User updated.', 'success');
    } catch (err) {
      showToast(err.message || 'Action failed', 'error');
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteAdminUser(deleteTarget._id);
      setUsers((prev) => prev.filter((u) => u._id !== deleteTarget._id));
      showToast('User removed from platform.', 'info');
      setDeleteTarget(null);
    } catch (err) {
      showToast(err.message || 'Failed to delete user', 'error');
    }
  };

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Registered Users</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            View buyers, sellers, and administrators across CarBazaar
          </p>
        </div>
      </div>

      {/* Filters */}
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
            placeholder="Search by name, email, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="form-control"
          style={{ width: '180px' }}
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="All">All Roles</option>
          <option value="buyer">Buyers</option>
          <option value="seller">Sellers</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {loading ? (
        <div className="loader-center">
          <div className="spinner" />
          <span>Loading registered users...</span>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Phone &amp; City</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => {
                const isSelf = u._id === currentUser?._id;
                return (
                  <tr key={u._id}>
                    <td style={{ fontWeight: 700 }}>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span
                        className={`badge ${
                          u.role === 'admin'
                            ? 'badge-accent'
                            : u.role === 'seller'
                            ? 'badge-primary'
                            : 'badge-neutral'
                        }`}
                        style={{ textTransform: 'uppercase' }}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                      <div>{u.phone || '—'}</div>
                      <div>{u.city || '—'}</div>
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>{formatDate(u.createdAt)}</td>
                    <td>
                      <span className={`badge ${u.isActive === false ? 'badge-danger' : 'badge-success'}`}>
                        {u.isActive === false ? 'Inactive' : 'Active'}
                      </span>
                    </td>
                    <td>
                      {isSelf ? (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Current Admin</span>
                      ) : (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() => handleToggleActive(u)}
                          >
                            {u.isActive === false ? (
                              <>
                                <ShieldCheck size={14} />
                                <span>Activate</span>
                              </>
                            ) : (
                              <>
                                <ShieldOff size={14} />
                                <span>Deactivate</span>
                              </>
                            )}
                          </button>
                          {u.role !== 'admin' && (
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => setDeleteTarget(u)}
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Remove User Account"
        message={`Are you sure you want to delete user "${deleteTarget?.name}" (${deleteTarget?.email})?`}
        confirmLabel="Yes, Delete User"
        onConfirm={handleDeleteUser}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
