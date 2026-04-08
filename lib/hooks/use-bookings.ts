import { useState, useEffect, useCallback, useRef } from 'react';
import { mockBookings } from '../mock-data';
import type { Booking, BookingStatus } from '../types';

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  // Track whether we should persist — only persist after user-initiated changes
  const shouldPersistRef = useRef(false);

  useEffect(() => {
    // Load from localStorage or initialize with mock data (runs once on mount)
    const stored = localStorage.getItem('hotel_bookings');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const withDates = parsed.map((b: any) => ({
          ...b,
          checkInDate: new Date(b.checkInDate),
          checkOutDate: new Date(b.checkOutDate),
          createdAt: new Date(b.createdAt),
          updatedAt: new Date(b.updatedAt),
          actualCheckIn: b.actualCheckIn ? new Date(b.actualCheckIn) : undefined,
          actualCheckOut: b.actualCheckOut ? new Date(b.actualCheckOut) : undefined,
        }));
        setBookings(withDates);
      } catch (e) {
        console.error('Failed to parse bookings from localStorage', e);
        setBookings(mockBookings);
      }
    } else {
      setBookings(mockBookings);
      localStorage.setItem('hotel_bookings', JSON.stringify(mockBookings));
    }
    setIsInitialized(true);
  }, []);

  // Only persist when a mutation has been explicitly made (not on the initial load)
  useEffect(() => {
    if (isInitialized && shouldPersistRef.current) {
      localStorage.setItem('hotel_bookings', JSON.stringify(bookings));
      shouldPersistRef.current = false;
    }
  }, [bookings, isInitialized]);

  const addBooking = useCallback((newBooking: Booking) => {
    shouldPersistRef.current = true;
    setBookings(prev => [newBooking, ...prev]);
  }, []);

  const updateBookingStatus = useCallback((id: string, status: BookingStatus) => {
    shouldPersistRef.current = true;
    setBookings(prev =>
      prev.map(booking =>
        booking.id === id
          ? { ...booking, status, updatedAt: new Date() }
          : booking
      )
    );
  }, []);

  const cancelBooking = useCallback((id: string) => {
    updateBookingStatus(id, 'cancelled');
  }, [updateBookingStatus]);

  const getCustomerBookings = useCallback((email: string) => {
    return bookings
      .filter(b => b.customerEmail.toLowerCase() === email.toLowerCase())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [bookings]);

  return {
    bookings,
    isInitialized,
    addBooking,
    updateBookingStatus,
    cancelBooking,
    getCustomerBookings,
  };
}

