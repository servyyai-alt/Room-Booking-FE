import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/Api';
import { format } from 'date-fns';
import { FiSearch, FiUserCheck, FiUserX } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const load = () => {
    setLoading(true);
    adminService.getUsers({ page, limit: 10, search, role: 'user' })
      .then((res) => { setUsers(res.data.users); setPagination(res.data.pagination); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    load();
  };

  const handleToggle = async (id) => {
    setTogglingId(id);
    try {
      const res = await adminService.toggleUser(id);
      toast.success(res.data.message);
      load();
    } catch { /* handled */ } finally {
      setTogglingId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-dark-800">Users</h1>
          <p className="text-stone-500 text-sm">{pagination?.total || 0} registered users</p>
        </div>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <div className="relative flex-1 lg:flex-none">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
            <input type="text" placeholder="Search name or email..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="input pl-9 text-sm w-full lg:w-64" />
          </div>
          <button type="submit" className="btn-primary py-2 px-4 text-sm">Search</button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="text-left text-xs text-stone-500 uppercase tracking-wider bg-stone-50">
              {['User', 'Phone', 'Joined', 'Status', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  {[...Array(5)].map((_, j) => <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded" /></td>)}
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-stone-400">No users found</td></tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-dark-800">{user.name}</p>
                        <p className="text-xs text-stone-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-stone-600">{user.phone || '—'}</td>
                  <td className="px-4 py-3 text-stone-500 text-xs">
                    {format(new Date(user.createdAt), 'MMM d, yyyy')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggle(user._id)}
                      disabled={togglingId === user._id}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all
                        ${user.isActive
                          ? 'border-red-200 text-red-500 hover:bg-red-50'
                          : 'border-green-200 text-green-600 hover:bg-green-50'
                        } disabled:opacity-50`}
                    >
                      {user.isActive ? <FiUserX className="w-3.5 h-3.5" /> : <FiUserCheck className="w-3.5 h-3.5" />}
                      {togglingId === user._id ? '...' : user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>

        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-stone-100">
            <p className="text-sm text-stone-500">Page {page} of {pagination.pages}</p>
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
