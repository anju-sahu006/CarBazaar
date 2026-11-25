import React, { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { DataProvider } from './context/DataContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import BrowseCarsPage from './pages/BrowseCarsPage';
import CarDetailsPage from './pages/CarDetailsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';

import BuyerShell from './pages/buyer/BuyerShell';
import BuyerDashboard from './pages/buyer/BuyerDashboard';
import SavedCarsPage from './pages/buyer/SavedCarsPage';
import BuyerInquiriesPage from './pages/buyer/BuyerInquiriesPage';
import RecentlyViewedPage from './pages/buyer/RecentlyViewedPage';

import SellerShell from './pages/seller/SellerShell';
import SellerDashboard from './pages/seller/SellerDashboard';
import MyListingsPage from './pages/seller/MyListingsPage';
import AddCarPage from './pages/seller/AddCarPage';
import EditCarPage from './pages/seller/EditCarPage';
import SellerInquiriesPage from './pages/seller/SellerInquiriesPage';

import AdminShell from './pages/admin/AdminShell';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminListingsPage from './pages/admin/AdminListingsPage';
import AdminInquiriesPage from './pages/admin/AdminInquiriesPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

function PublicLayout({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  );
}

function DashboardFrame({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <DataProvider>
            <ScrollToTop />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
              <Route path="/browse" element={<PublicLayout><BrowseCarsPage /></PublicLayout>} />
              <Route path="/cars/:id" element={<PublicLayout><CarDetailsPage /></PublicLayout>} />
              <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
              <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
              <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
              <Route path="/register" element={<PublicLayout><RegisterPage /></PublicLayout>} />

              {/* Buyer Dashboard Routes */}
              <Route
                path="/buyer"
                element={
                  <ProtectedRoute allowedRoles={['buyer']}>
                    <DashboardFrame>
                      <BuyerShell />
                    </DashboardFrame>
                  </ProtectedRoute>
                }
              >
                <Route index element={<BuyerDashboard />} />
                <Route path="browse" element={<BrowseCarsPage />} />
                <Route path="saved" element={<SavedCarsPage />} />
                <Route path="inquiries" element={<BuyerInquiriesPage />} />
                <Route path="recent" element={<RecentlyViewedPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>

              {/* Seller Dashboard Routes */}
              <Route
                path="/seller"
                element={
                  <ProtectedRoute allowedRoles={['seller']}>
                    <DashboardFrame>
                      <SellerShell />
                    </DashboardFrame>
                  </ProtectedRoute>
                }
              >
                <Route index element={<SellerDashboard />} />
                <Route path="listings" element={<MyListingsPage />} />
                <Route path="add" element={<AddCarPage />} />
                <Route path="edit/:id" element={<EditCarPage />} />
                <Route path="inquiries" element={<SellerInquiriesPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>

              {/* Admin Dashboard Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <DashboardFrame>
                      <AdminShell />
                    </DashboardFrame>
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="listings" element={<AdminListingsPage />} />
                <Route path="inquiries" element={<AdminInquiriesPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </DataProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
