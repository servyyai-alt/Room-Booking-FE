import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import {
  FiHome, FiGrid, FiCalendar, FiUsers,
  FiLogOut, FiMenu, FiX, FiExternalLink
} from 'react-icons/fi';
import { FaBed } from 'react-icons/fa';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: FiGrid, end: true },
  { to: '/admin/rooms', label: 'Rooms', icon: FaBed },
  { to: '/admin/bookings', label: 'Bookings', icon: FiCalendar },
  { to: '/admin/users', label: 'Users', icon: FiUsers },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1024);
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  useEffect(() => {
    const handleResize = () => setSidebarOpen(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-stone-100 flex">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close admin menu"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'translate-x-0 lg:w-60' : '-translate-x-full lg:translate-x-0 lg:w-16'} w-72 bg-dark-900 transition-all duration-300 flex flex-col shrink-0 fixed inset-y-0 left-0 z-40 lg:relative`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-dark-700">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center shrink-0">
            <FiHome className="text-white w-4 h-4" />
          </div>
          {sidebarOpen && <span className="font-display text-white font-semibold text-lg">Admin</span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end}
              onClick={() => {
                if (window.innerWidth < 1024) setSidebarOpen(false);
              }}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium
                ${isActive ? 'bg-primary-500 text-white' : 'text-stone-400 hover:bg-dark-700 hover:text-white'}`
              }>
              <Icon className="w-5 h-5 shrink-0" />
              {sidebarOpen && label}
            </NavLink>
          ))}
        </nav>

        {/* User + logout */}
        <div className="px-3 py-4 border-t border-dark-700 space-y-2">
          <a href="/" target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-stone-400 hover:bg-dark-700 hover:text-white transition-all text-sm">
            <FiExternalLink className="w-5 h-5 shrink-0" />
            {sidebarOpen && 'View Site'}
          </a>
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-stone-400 hover:bg-red-900/50 hover:text-red-400 transition-all w-full text-sm">
            <FiLogOut className="w-5 h-5 shrink-0" />
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-white border-b border-stone-200 px-4 sm:px-6 py-4 flex items-center gap-4 sticky top-0 z-30">
          <button
            type="button"
            aria-label={sidebarOpen ? 'Collapse admin menu' : 'Open admin menu'}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-stone-600 hover:text-stone-900"
          >
            {sidebarOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.charAt(0)}
            </div>
            <span className="text-sm font-medium text-dark-800 hidden sm:block">{user?.name}</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
