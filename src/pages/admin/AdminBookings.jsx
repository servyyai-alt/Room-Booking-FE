import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/Api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'];
const statusColors = {
  confirmed: 'bg-green-100 text-green-700', pending: 'bg-amber-100 text-amber-700',
  cancelled: 'bg-red-100 text-red-600', checked_in: 'bg-blue-100 text-blue-700',
  checked_out: 'bg-stone-100 text-stone-600', refunded: 'bg-purple-100 text-purple-600',
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const load = () => {
    setLoading(true);
    const params = { page, limit: 10 };
    if (filter) params.status = filter;
    adminService.getAllBookings(params)
      .then((res) => { setBookings(res.data.bookings); setPagination(res.data.pagination); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter, page]);

  const handleStatusChange = async (id, status) => {
    try {
      await adminService.updateBookingStatus(id, { status });
      toast.success('Booking status updated');
      load();
    } catch { /* handled */ }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-dark-800">Bookings</h1>
          <p className="text-stone-500 text-sm">{pagination?.total || 0} total bookings</p>
        </div>
        <select value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }} className="input w-full sm:w-auto text-sm">
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s} className="capitalize">{s.replace('_', ' ')}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[840px] text-sm">
            <thead>
              <tr className="text-left text-xs text-stone-500 uppercase tracking-wider bg-stone-50">
                {['Reference', 'Guest', 'Room', 'Dates', 'Amount', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded" /></td>
                    ))}
                  </tr>
                ))
              ) : bookings.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-stone-400">No bookings found</td></tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-stone-600">{b.bookingReference}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-dark-800">{b.user?.name}</p>
                      <p className="text-xs text-stone-400">{b.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 max-w-[140px]">
                      <p className="truncate text-stone-700">{b.room?.name}</p>
                      <p className="text-xs text-stone-400">{b.room?.location?.city}</p>
                    </td>
                    <td className="px-4 py-3 text-stone-600 text-xs">
                      <p>{b.checkIn ? format(new Date(b.checkIn), 'MMM d') : '—'}</p>
                      <p>→ {b.checkOut ? format(new Date(b.checkOut), 'MMM d, yy') : '—'}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-dark-800">
                      ₹{b.pricing?.total?.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge capitalize ${statusColors[b.status] || 'bg-stone-100 text-stone-600'}`}>
                        {b.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={b.status}
                        onChange={(e) => handleStatusChange(b._id, e.target.value)}
                        className="text-xs border border-stone-200 rounded-lg px-2 py-1 text-stone-600 focus:outline-none focus:ring-1 focus:ring-primary-400"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s} className="capitalize">{s.replace('_', ' ')}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination && pagination.pages > 1 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-t border-stone-100">
            <p className="text-sm text-stone-500">
              Showing {(page - 1) * 10 + 1}–{Math.min(page * 10, pagination.total)} of {pagination.total}
            </p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => p - 1)} disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-40 hover:border-primary-400 transition-all">Prev</button>
              <button onClick={() => setPage(p => p + 1)} disabled={page === pagination.pages}
                className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-40 hover:border-primary-400 transition-all">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
