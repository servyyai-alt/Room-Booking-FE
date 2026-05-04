import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyBookings } from '../redux/slices/bookingSlice';
import { FiCalendar, FiClock, FiCheckCircle, FiXCircle, FiArrowRight } from 'react-icons/fi';
import { format } from 'date-fns';

const statusConfig = {
  pending: { color: 'bg-amber-100 text-amber-700', icon: FiClock, label: 'Pending' },
  confirmed: { color: 'bg-green-100 text-green-700', icon: FiCheckCircle, label: 'Confirmed' },
  checked_in: { color: 'bg-blue-100 text-blue-700', icon: FiCheckCircle, label: 'Checked In' },
  checked_out: { color: 'bg-stone-100 text-stone-600', icon: FiCheckCircle, label: 'Completed' },
  cancelled: { color: 'bg-red-100 text-red-600', icon: FiXCircle, label: 'Cancelled' },
  refunded: { color: 'bg-purple-100 text-purple-600', icon: FiCheckCircle, label: 'Refunded' },
};

export default function UserDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { bookings, loading } = useSelector((s) => s.bookings);

  useEffect(() => {
    dispatch(fetchMyBookings({ limit: 5 }));
  }, [dispatch]);

  const stats = {
    total: bookings.length,
    upcoming: bookings.filter(b => ['confirmed', 'pending'].includes(b.status)).length,
    completed: bookings.filter(b => b.status === 'checked_out').length,
  };

  return (
    <div className="pt-16 min-h-screen bg-stone-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-dark-800">
            Hello, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-stone-500 mt-1">Here's an overview of your bookings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Bookings', value: stats.total, color: 'text-primary-600' },
            { label: 'Upcoming', value: stats.upcoming, color: 'text-green-600' },
            { label: 'Completed', value: stats.completed, color: 'text-stone-600' },
          ].map((s) => (
            <div key={s.label} className="card p-5 text-center">
              <p className={`font-display text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-stone-500 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Bookings */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-dark-800 text-lg">Recent Bookings</h2>
            <Link to="/bookings" className="flex items-center gap-1 text-primary-600 text-sm font-medium hover:text-primary-700">
              View all <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4 p-4 bg-stone-50 rounded-xl">
                  <div className="skeleton w-20 h-16 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-4 w-3/4 rounded" />
                    <div className="skeleton h-3 w-1/2 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12">
              <FiCalendar className="w-10 h-10 text-stone-300 mx-auto mb-3" />
              <p className="text-stone-500 mb-4">No bookings yet</p>
              <Link to="/rooms" className="btn-primary">Browse Rooms</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => {
                const cfg = statusConfig[booking.status] || statusConfig.pending;
                const StatusIcon = cfg.icon;
                return (
                  <div key={booking._id} className="flex flex-col sm:flex-row gap-4 p-4 bg-stone-50 rounded-xl hover:bg-stone-100 transition-colors">
                    <img
                      src={booking.room?.images?.[0]?.url || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=200'}
                      alt={booking.room?.name}
                      className="w-full sm:w-20 h-32 sm:h-16 object-cover rounded-lg shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <h3 className="font-medium text-dark-800 truncate">{booking.room?.name}</h3>
                          <p className="text-stone-500 text-sm">
                            {booking.room?.location?.city} · {booking.nights} night{booking.nights > 1 ? 's' : ''}
                          </p>
                        </div>
                        <span className={`badge ${cfg.color} flex items-center gap-1 shrink-0`}>
                          <StatusIcon className="w-3 h-3" /> {cfg.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-stone-500">
                        <span>{format(new Date(booking.checkIn), 'MMM d')} → {format(new Date(booking.checkOut), 'MMM d, yyyy')}</span>
                        <span className="font-medium text-primary-600">₹{booking.pricing?.total?.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <Link to="/rooms" className="card p-5 flex items-center gap-4 hover:shadow-card-hover transition-all group">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-500 transition-colors">
              <FiCalendar className="w-5 h-5 text-primary-600 group-hover:text-white transition-colors" />
            </div>
            <div>
              <p className="font-medium text-dark-800">Book a Room</p>
              <p className="text-stone-500 text-sm">Browse available rooms</p>
            </div>
            <FiArrowRight className="ml-auto text-stone-400 group-hover:text-primary-600 transition-colors" />
          </Link>
          <Link to="/profile" className="card p-5 flex items-center gap-4 hover:shadow-card-hover transition-all group">
            <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center group-hover:bg-stone-800 transition-colors">
              <span className="text-lg">👤</span>
            </div>
            <div>
              <p className="font-medium text-dark-800">Edit Profile</p>
              <p className="text-stone-500 text-sm">Update your details</p>
            </div>
            <FiArrowRight className="ml-auto text-stone-400 group-hover:text-stone-700 transition-colors" />
          </Link>
        </div>
      </div>
    </div>
  );
}
