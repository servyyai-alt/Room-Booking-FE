import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import {
  FiMenu, FiX, FiUser, FiLogOut, FiCalendar,
  FiSettings, FiGrid, FiHome, FiSearch
} from 'react-icons/fi';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    navigate('/');
  };

  const navClass = isHome && !scrolled
    ? 'bg-transparent'
    : 'bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-100';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <FiHome className="text-white w-4 h-4" />
            </div>
            <span className={`font-display text-xl font-semibold ${isHome && !scrolled ? 'text-white' : 'text-dark-800'}`}>
              StayNest
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/rooms"
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors duration-200
                ${isHome && !scrolled ? 'text-white/90 hover:text-white' : 'text-stone-600 hover:text-primary-600'}`}
            >
              <FiSearch className="w-4 h-4" />
              Browse Rooms
            </Link>

            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-200
                    ${isHome && !scrolled
                      ? 'border-white/30 text-white hover:bg-white/10'
                      : 'border-stone-200 text-stone-700 hover:border-primary-300 hover:text-primary-600'
                    }`}
                >
                  <div className="w-7 h-7 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium max-w-[100px] truncate">{user?.name}</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-stone-100 overflow-hidden py-1 z-50">
                    <div className="px-4 py-3 border-b border-stone-100">
                      <p className="text-sm font-medium text-dark-800">{user?.name}</p>
                      <p className="text-xs text-stone-500">{user?.email}</p>
                    </div>
                    {user?.role === 'admin' && (
                      <Link to="/admin" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-primary-50 hover:text-primary-700 transition-colors">
                        <FiGrid className="w-4 h-4" /> Admin Panel
                      </Link>
                    )}
                    <Link to="/dashboard" onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-primary-50 hover:text-primary-700 transition-colors">
                      <FiUser className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link to="/bookings" onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-primary-50 hover:text-primary-700 transition-colors">
                      <FiCalendar className="w-4 h-4" /> My Bookings
                    </Link>
                    <Link to="/profile" onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-primary-50 hover:text-primary-700 transition-colors">
                      <FiSettings className="w-4 h-4" /> Profile
                    </Link>
                    <div className="border-t border-stone-100 mt-1 pt-1">
                      <button onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        <FiLogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login"
                  className={`text-sm font-medium transition-colors duration-200
                    ${isHome && !scrolled ? 'text-white/90 hover:text-white' : 'text-stone-600 hover:text-primary-600'}`}>
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary py-2 px-5 text-sm">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button className={`md:hidden p-2 rounded-lg transition-colors
            ${isHome && !scrolled ? 'text-white hover:bg-white/10' : 'text-stone-700 hover:bg-stone-100'}`}
            onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-stone-100 pb-4 space-y-1 shadow-lg">
            <Link to="/rooms" className="flex items-center gap-2 px-4 py-3 text-stone-700 hover:bg-stone-50"
              onClick={() => setMenuOpen(false)}>
              <FiSearch className="w-4 h-4" /> Browse Rooms
            </Link>
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="flex items-center gap-2 px-4 py-3 text-stone-700 hover:bg-stone-50"
                    onClick={() => setMenuOpen(false)}>
                    <FiGrid className="w-4 h-4" /> Admin Panel
                  </Link>
                )}
                <Link to="/dashboard" className="flex items-center gap-2 px-4 py-3 text-stone-700 hover:bg-stone-50"
                  onClick={() => setMenuOpen(false)}>
                  <FiUser className="w-4 h-4" /> Dashboard
                </Link>
                <Link to="/bookings" className="flex items-center gap-2 px-4 py-3 text-stone-700 hover:bg-stone-50"
                  onClick={() => setMenuOpen(false)}>
                  <FiCalendar className="w-4 h-4" /> My Bookings
                </Link>
                <button onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="flex items-center gap-2 w-full px-4 py-3 text-red-600 hover:bg-red-50">
                  <FiLogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <div className="px-4 pt-2 flex flex-col gap-2">
                <Link to="/login" className="btn-outline text-center" onClick={() => setMenuOpen(false)}>Sign In</Link>
                <Link to="/register" className="btn-primary text-center" onClick={() => setMenuOpen(false)}>Get Started</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
