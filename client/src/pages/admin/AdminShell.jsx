import React from 'react';
import { Outlet } from 'react-router-dom';
import { CarFront, LayoutDashboard, MessageSquare, User, Users } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const ADMIN_NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'Manage Users', icon: Users },
  { to: '/admin/listings', label: 'All Listings', icon: CarFront },
  { to: '/admin/inquiries', label: 'All Inquiries', icon: MessageSquare },
  { to: '/admin/profile', label: 'My Profile', icon: User }
];

export default function AdminShell() {
  return (
    <DashboardLayout navItems={ADMIN_NAV}>
      <Outlet />
    </DashboardLayout>
  );
}
