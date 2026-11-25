import React from 'react';
import { Outlet } from 'react-router-dom';
import { CarFront, LayoutDashboard, MessageSquare, PlusCircle, User } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const SELLER_NAV = [
  { to: '/seller', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/seller/listings', label: 'My Listings', icon: CarFront },
  { to: '/seller/add', label: 'Add New Car', icon: PlusCircle },
  { to: '/seller/inquiries', label: 'Buyer Inquiries', icon: MessageSquare },
  { to: '/seller/profile', label: 'My Profile', icon: User }
];

export default function SellerShell() {
  return (
    <DashboardLayout navItems={SELLER_NAV}>
      <Outlet />
    </DashboardLayout>
  );
}
