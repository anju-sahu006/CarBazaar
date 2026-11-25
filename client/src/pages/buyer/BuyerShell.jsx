import React from 'react';
import { Outlet } from 'react-router-dom';
import { Clock, Heart, LayoutDashboard, MessageSquare, Search, User } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const BUYER_NAV = [
  { to: '/buyer', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/buyer/browse', label: 'Browse Cars', icon: Search },
  { to: '/buyer/saved', label: 'Saved Cars', icon: Heart },
  { to: '/buyer/inquiries', label: 'My Inquiries', icon: MessageSquare },
  { to: '/buyer/recent', label: 'Recently Viewed', icon: Clock },
  { to: '/buyer/profile', label: 'My Profile', icon: User }
];

export default function BuyerShell() {
  return (
    <DashboardLayout navItems={BUYER_NAV}>
      <Outlet />
    </DashboardLayout>
  );
}
