import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const DataContext = createContext(null);

function getRecentKey(userId) {
  return `carbazaar_recent_${userId || 'guest'}`;
}

export function DataProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [cars, setCars] = useState([]);
  const [carsLoading, setCarsLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [wishlistCars, setWishlistCars] = useState([]);
  const [recentlyViewedIds, setRecentlyViewedIds] = useState([]);

  const refreshCars = useCallback(async () => {
    setCarsLoading(true);
    try {
      const res = await api.listCars({ includeSold: false });
      setCars(res.cars || []);
    } catch (err) {
      showToast(err.message || 'Could not load car listings', 'error');
    } finally {
      setCarsLoading(false);
    }
  }, [showToast]);

  const refreshWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlistIds([]);
      setWishlistCars([]);
      return;
    }
    try {
      const res = await api.getWishlist();
      setWishlistIds(res.carIds || []);
      setWishlistCars(res.cars || []);
    } catch {
      setWishlistIds([]);
      setWishlistCars([]);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCars();
  }, [refreshCars]);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist, user?._id]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(getRecentKey(user?._id));
      setRecentlyViewedIds(raw ? JSON.parse(raw) : []);
    } catch {
      setRecentlyViewedIds([]);
    }
  }, [user?._id]);

  const toggleWishlist = async (carId) => {
    if (!isAuthenticated) {
      showToast('Please log in as a buyer to save cars to your wishlist.', 'info');
      return false;
    }
    const isSaved = wishlistIds.includes(carId);
    try {
      if (isSaved) {
        const res = await api.removeFromWishlist(carId);
        setWishlistIds(res.carIds || []);
        setWishlistCars((prev) => prev.filter((c) => c._id !== carId));
        showToast('Removed from your saved cars.', 'info');
      } else {
        const res = await api.addToWishlist(carId);
        setWishlistIds(res.carIds || []);
        await refreshWishlist();
        showToast('Car saved to your wishlist!', 'success');
      }
      return true;
    } catch (err) {
      showToast(err.message || 'Failed to update wishlist', 'error');
      return false;
    }
  };

  const trackRecentlyViewed = useCallback(
    (carId) => {
      if (!carId) return;
      setRecentlyViewedIds((prev) => {
        const next = [carId, ...prev.filter((id) => id !== carId)].slice(0, 8);
        localStorage.setItem(getRecentKey(user?._id), JSON.stringify(next));
        return next;
      });
    },
    [user?._id]
  );

  const recentlyViewedCars = recentlyViewedIds
    .map((id) => cars.find((c) => c._id === id))
    .filter(Boolean);

  return (
    <DataContext.Provider
      value={{
        cars,
        carsLoading,
        refreshCars,
        wishlistIds,
        wishlistCars,
        refreshWishlist,
        toggleWishlist,
        recentlyViewedIds,
        recentlyViewedCars,
        trackRecentlyViewed
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
