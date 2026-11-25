import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout({ navItems, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar" aria-label="Dashboard Sidebar">
        <div className="sidebar-user-box">
          <div className="sidebar-user-name">{user?.name}</div>
          <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.68)', wordBreak: 'break-all' }}>
            {user?.email}
          </div>
          <span className="sidebar-user-role">{user?.role}</span>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        <button type="button" onClick={handleLogout} className="sidebar-link sidebar-logout">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </aside>

      <main className="dashboard-main">{children}</main>
    </div>
  );
}
