import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { roomService } from '../../services/Api';
import { FiCalendar, FiUsers, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { format, differenceInCalendarDays, addDays } from 'date-fns';

const TAX_RATE = 0.18;
const SERVICE_FEE = 500;

export default function BookingForm({ room }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((s) => s.auth);

  const today = format(new Date(), 'yyyy-MM-dd');
  const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState({ adults: 1, children: 0 });
  const [availability, setAvailability] = useState(null);
  const [checking, setChecking] = useState(false);

  // Calculate pricing
  const nights = checkIn && checkOut
    ? differenceInCalendarDays(new Date(checkOut), new Date(checkIn))
    : 0;
  const subtotal = nights * (room?.pricePerNight || 0);
  const taxes = Math.round(subtotal * TAX_RATE);
  const total = subtotal + taxes + (nights > 0 ? SERVICE_FEE : 0);

  // Check availability when dates change
  useEffect(() => {
    if (!checkIn || !checkOut || nights <= 0) {
      setAvailability(null);
      return;
    }
    const timer = setTimeout(async () => {
      setChecking(true);
      try {
        const res = await roomService.checkAvailability(room._id, { checkIn, checkOut });
        setAvailability(res.data);
      } catch {
        setAvailability(null);
      } finally {
        setChecking(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [checkIn, checkOut, room._id, nights]);

  const handleBook = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/booking/${room._id}` } });
      return;
    }
    navigate(`/booking/${room._id}`, {
      state: { checkIn, checkOut, guests, nights, pricing: { subtotal, taxes, total } },
    });
  };

  return (
    <div className="card p-5 sticky top-24">
      {/* Price Header */}
      <div className="flex items-baseline gap-1 mb-5">
        <span className="font-display text-2xl font-bold text-primary-600">
          ₹{room.pricePerNight?.toLocaleString('en-IN')}
        </span>
        <span className="text-stone-500 text-sm">/night</span>
        {room.ratings?.count > 0 && (
          <span className="ml-auto text-sm text-stone-500">
            ⭐ {room.ratings.average} ({room.ratings.count} reviews)
          </span>
        )}
      </div>

      {/* Date Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs font-semibold text-stone-500 mb-1 uppercase tracking-wide">Check-in</label>
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
            <input
              type="date"
              value={checkIn}
              min={today}
              onChange={(e) => { setCheckIn(e.target.value); if (e.target.value >= checkOut) setCheckOut(''); }}
              className="input pl-9 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-stone-500 mb-1 uppercase tracking-wide">Check-out</label>
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
            <input
              type="date"
              value={checkOut}
              min={checkIn || tomorrow}
              onChange={(e) => setCheckOut(e.target.value)}
              className="input pl-9 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Guests */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-stone-500 mb-1 uppercase tracking-wide">Guests</label>
        <div className="relative">
          <FiUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
          <select
            value={guests.adults}
            onChange={(e) => setGuests({ ...guests, adults: Number(e.target.value) })}
            className="input pl-9 text-sm"
          >
            {[...Array(room.capacity?.adults || 2)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1} adult{i > 0 ? 's' : ''}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Availability Status */}
      {checking && <p className="text-sm text-stone-400 mb-3 animate-pulse">Checking availability...</p>}
      {!checking && availability && (
        <div className={`flex items-center gap-2 text-sm mb-4 p-2.5 rounded-lg
          ${availability.available ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {availability.available
            ? <FiCheckCircle className="w-4 h-4 shrink-0" />
            : <FiAlertCircle className="w-4 h-4 shrink-0" />}
          {availability.message}
        </div>
      )}

      {/* Pricing Breakdown */}
      {nights > 0 && (
        <div className="bg-stone-50 rounded-xl p-4 mb-4 space-y-2">
          <div className="flex justify-between text-sm text-stone-600">
            <span>₹{room.pricePerNight?.toLocaleString('en-IN')} × {nights} night{nights > 1 ? 's' : ''}</span>
            <span>₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-sm text-stone-600">
            <span>GST (18%)</span>
            <span>₹{taxes.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-sm text-stone-600">
            <span>Service fee</span>
            <span>₹{SERVICE_FEE.toLocaleString('en-IN')}</span>
          </div>
          <div className="border-t border-stone-200 pt-2 flex justify-between font-semibold text-dark-800">
            <span>Total</span>
            <span className="text-primary-600">₹{total.toLocaleString('en-IN')}</span>
          </div>
        </div>
      )}

      {/* CTA Button */}
      <button
        onClick={handleBook}
        disabled={!checkIn || !checkOut || nights <= 0 || (availability && !availability.available)}
        className="btn-primary w-full text-base"
      >
        {!isAuthenticated ? 'Sign In to Book' : nights > 0 ? `Book for ₹${total.toLocaleString('en-IN')}` : 'Select Dates'}
      </button>

      <p className="text-center text-xs text-stone-400 mt-3">
        Free cancellation if cancelled 48+ hours before check-in
      </p>
    </div>
  );
}
