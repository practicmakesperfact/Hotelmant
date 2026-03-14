import { useState, useEffect } from 'react';
import { mockBookings, mockRooms } from '../mock-data';
import type { Booking, BookingStatus } from '../types';

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Load from localStorage or initialize with mock data
    const stored = localStorage.getItem('hotel_bookings');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convert string dates back to Date objects
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
        console.error("Failed to parse bookings from localStorage", e);
        setBookings(mockBookings);
      }
    } else {
      setBookings(mockBookings);
      localStorage.setItem('hotel_bookings', JSON.stringify(mockBookings));
    }
    setIsInitialized(true);
  }, []);

  // Save to localeStorage whenever bookings change (but only after initialization)
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('hotel_bookings', JSON.stringify(bookings));
    }
  }, [bookings, isInitialized]);

  const addBooking = (newBooking: Booking) => {
    setBookings(prev => [newBooking, ...prev]);
  };

  const updateBookingStatus = (id: string, status: BookingStatus) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === id 
          ? { ...booking, status, updatedAt: new Date() } 
          : booking
      )
    );
  };

  const cancelBooking = (id: string) => {
    updateBookingStatus(id, 'cancelled');
  };
  
  const getCustomerBookings = (email: string) => {
    return bookings.filter(b => b.customerEmail.toLowerCase() === email.toLowerCase())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // newest first
  };

  return {
    bookings,
    isInitialized,
    addBooking,
    updateBookingStatus,
    cancelBooking,
    getCustomerBookings
  };
}
