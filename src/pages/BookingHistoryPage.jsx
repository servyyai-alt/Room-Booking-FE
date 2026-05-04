import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyBookings, cancelBooking } from '../redux/slices/bookingSlice';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FiCalendar, FiClock, FiCheckCircle, FiXCircle, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const STATUS_FILTERS = ['all', 'pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'];

const statusConfig = {
  pending:    { color: 'bg-amber-100 text-amber-700',   label: 'Pending' },
  confirmed:  { color: 'bg-green-100 text-green-700',   label: 'Confirmed' },
  checked_in: { color: 'bg-blue-100 text-blue-700',     label: 'Checked In' },
  checked_out:{ color: 'bg-stone-100 text-stone-600',   label: 'Completed' },
  cancelled:  { color: 'bg-red-100 text-red-600',       label: 'Cancelled' },
  refunded:   { color: 'bg-purple-100 text-purple-600', label: 'Refunded' },
};

export default function BookingHistoryPage() {
  const dispatch = useDispatch();
  const { bookings, loading, pagination } = useSelector((s) => s.bookings);
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    const params = { page, limit: 8 };
    if (statusFilter !== 'all') params.status = statusFilter;
    dispatch(fetchMyBookings(params));
  }, [dispatch, statusFilter, page]);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    setCancellingId(id);
    await dispatch(cancelBooking({ id, reason: 'Cancelled by user' }));
    setCancellingId(null);
  };

  return (
    <div className="pt-16 min-h-screen bg-stone-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-display text-3xl font-bold text-dark-800 mb-6">My Bookings</h1>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {STATUS_FILTERS.map((s) => (
            <button key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium capitalize transition-all
                ${statusFilter === s
                  ? 'bg-primary-500 text-white shadow-warm'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-primary-300'}`}>
              {s === 'all' ? 'All Bookings' : s.replace('_', ' ')}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card p-5 flex gap-4">
                <div className="skeleton w-28 h-24 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-5 w-2/3 rounded" />
                  <div className="skeleton h-4 w-1/2 rounded" />
                  <div className="skeleton h-4 w-1/3 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="card p-12 text-center">
            <FiCalendar className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="font-semibold text-dark-800 mb-2">No bookings found</h3>
            <p className="text-stone-500 text-sm mb-5">
              {statusFilter !== 'all' ? 'No bookings with this status.' : 'You haven\'t made any bookings yet.'}
            </p>
            <Link to="/rooms" className="btn-primary">Browse Rooms</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const cfg = statusConfig[booking.status] || statusConfig.pending;
              const canCancel = ['pending', 'confirmed'].includes(booking.status);

              return (
                <div key={booking._id} className="card p-5">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <img
                      src={booking.room?.images?.[0]?.url || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300'}
                      alt={booking.room?.name}
                      className="w-full sm:w-28 h-40 sm:h-24 object-cover rounded-xl shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap mb-2">
                        <div>
                          <h3 className="font-semibold text-dark-800">{booking.room?.name}</h3>
                          <p className="text-stone-500 text-sm capitalize">{booking.room?.roomType} · {booking.room?.location?.city}</p>
                        </div>
                        <span className={`badge ${cfg.color} shrink-0`}>{cfg.label}</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                        {[
                          { label: 'Check-in', val: format(new Date(booking.checkIn), 'MMM d, yyyy') },
                          { label: 'Check-out', val: format(new Date(booking.checkOut), 'MMM d, yyyy') },
                          { label: 'Nights', val: `${booking.nights} night${booking.nights > 1 ? 's' : ''}` },
                          { label: 'Total', val: `₹${booking.pricing?.total?.toLocaleString('en-IN')}` },
                        ].map(({ label, val }) => (
                          <div key={label}>
                            <p className="text-xs text-stone-400 uppercase tracking-wide">{label}</p>
                            <p className="text-sm font-medium text-dark-800">{val}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-xs text-stone-400">
                          Ref: <span className="font-mono text-stone-600">{booking.bookingReference}</span>
                        </span>
                        {canCancel && (
                          <button
                            onClick={() => handleCancel(booking._id)}
                            disabled={cancellingId === booking._id}
                            className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors disabled:opacity-50"
                          >
                            {cancellingId === booking._id ? 'Cancelling...' : 'Cancel Booking'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button onClick={() => setPage(p => p - 1)} disabled={page === 1}
                  className="w-9 h-9 rounded-lg border border-stone-200 flex items-center justify-center disabled:opacity-40 hover:border-primary-400 transition-all">
                  <FiChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-stone-600">Page {page} of {pagination.pages}</span>
                <button onClick={() => setPage(p => p + 1)} disabled={page === pagination.pages}
                  className="w-9 h-9 rounded-lg border border-stone-200 flex items-center justify-center disabled:opacity-40 hover:border-primary-400 transition-all">
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}