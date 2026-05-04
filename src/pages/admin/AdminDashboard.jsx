import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/Api';
import { FiUsers, FiCalendar, FiTrendingUp, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { format } from 'date-fns';
import { FaBed } from 'react-icons/fa';

const statusColors = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  cancelled: 'bg-red-100 text-red-600',
  checked_in: 'bg-blue-100 text-blue-700',
  checked_out: 'bg-stone-100 text-stone-600',
};

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboard()
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="skeleton h-64 rounded-2xl lg:col-span-2" />
        <div className="skeleton h-64 rounded-2xl" />
      </div>
    </div>
  );

  const { stats, bookingsByStatus, recentBookings, revenueChart } = data || {};

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers, icon: FiUsers, color: 'bg-blue-500', change: '+12%' },
    { label: 'Total Rooms', value: stats?.totalRooms, icon: FaBed, color: 'bg-green-500', change: null },
    { label: 'Active Bookings', value: stats?.activeBookings, icon: FiCalendar, color: 'bg-amber-500', change: null },
    {
      label: 'Revenue (This Month)',
      value: `₹${(stats?.thisMonthRevenue || 0).toLocaleString('en-IN')}`,
      icon: FiTrendingUp,
      color: 'bg-primary-500',
      change: stats?.revenueGrowth,
      isRevenue: true,
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-dark-800">Dashboard</h1>
        <p className="text-stone-500 text-sm mt-1">Overview of your property management system</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          const growth = Number(card.change);
          return (
            <div key={card.label} className="bg-white rounded-2xl p-5 shadow-card">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                {card.change !== null && !card.isRevenue && (
                  <span className="text-xs text-green-600 font-medium">{card.change}</span>
                )}
                {card.isRevenue && stats?.revenueGrowth !== undefined && (
                  <span className={`text-xs font-medium flex items-center gap-0.5 ${growth >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {growth >= 0 ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />}
                    {Math.abs(growth)}%
                  </span>
                )}
              </div>
              <p className="font-display text-2xl font-bold text-dark-800">{card.value}</p>
              <p className="text-stone-500 text-xs mt-0.5">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart (simple bar) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-card">
          <h2 className="font-semibold text-dark-800 mb-5">Monthly Revenue</h2>
          {revenueChart?.length > 0 ? (
            <div className="flex items-end gap-3 h-40">
              {revenueChart.map((item) => {
                const max = Math.max(...revenueChart.map((r) => r.revenue));
                const pct = max > 0 ? (item.revenue / max) * 100 : 0;
                return (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-1 group">
                    <div className="relative w-full">
                      <div
                        className="bg-primary-500 rounded-t-lg transition-all duration-500 group-hover:bg-primary-400 w-full"
                        style={{ height: `${Math.max(pct, 4)}%`, minHeight: '4px', maxHeight: '140px' }}
                        title={`₹${item.revenue.toLocaleString('en-IN')}`}
                      />
                    </div>
                    <span className="text-xs text-stone-400">{item.month}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-stone-400 text-sm">No revenue data</div>
          )}
        </div>

        {/* Booking Status Breakdown */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h2 className="font-semibold text-dark-800 mb-5">Bookings by Status</h2>
          <div className="space-y-3">
            {Object.entries(bookingsByStatus || {}).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className={`badge capitalize ${statusColors[status] || 'bg-stone-100 text-stone-600'}`}>
                  {status.replace('_', ' ')}
                </span>
                <span className="font-semibold text-dark-800">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl p-6 shadow-card mt-6">
        <h2 className="font-semibold text-dark-800 mb-4">Recent Bookings</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="text-left text-xs text-stone-500 uppercase tracking-wider border-b border-stone-100">
                <th className="pb-3 pr-4">Guest</th>
                <th className="pb-3 pr-4">Room</th>
                <th className="pb-3 pr-4">Check-in</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {recentBookings?.map((b) => (
                <tr key={b._id} className="hover:bg-stone-50 transition-colors">
                  <td className="py-3 pr-4">
                    <div>
                      <p className="font-medium text-dark-800">{b.user?.name}</p>
                      <p className="text-stone-400 text-xs">{b.user?.email}</p>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-stone-700 max-w-[140px] truncate">{b.room?.name}</td>
                  <td className="py-3 pr-4 text-stone-600">
                    {b.checkIn ? format(new Date(b.checkIn), 'MMM d, yyyy') : '—'}
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`badge capitalize ${statusColors[b.status] || 'bg-stone-100 text-stone-600'}`}>
                      {b.status?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 font-medium text-dark-800">
                    ₹{b.pricing?.total?.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
