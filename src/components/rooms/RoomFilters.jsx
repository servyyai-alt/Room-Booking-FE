import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters, clearFilters } from '../../redux/slices/roomSlice';
import { roomService } from '../../services/Api';
import { FiSearch, FiSliders, FiX } from 'react-icons/fi';

const ROOM_TYPES = ['single', 'double', 'suite', 'deluxe', 'penthouse', 'studio'];

export default function RoomFilters({ onApply }) {
  const dispatch = useDispatch();
  const { filters } = useSelector((s) => s.rooms);
  const [cities, setCities] = useState([]);
  const [local, setLocal] = useState(filters);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    roomService.getCities().then((res) => setCities(res.data.cities || []));
  }, []);

  useEffect(() => { setLocal(filters); }, [filters]);

  useEffect(() => {
    if (!showMobileFilters) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setShowMobileFilters(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [showMobileFilters]);

  const handleChange = (key, value) => setLocal((prev) => ({ ...prev, [key]: value }));

  const handleApply = () => {
    dispatch(setFilters(local));
    onApply && onApply(local);
    setShowMobileFilters(false);
  };

  const handleClear = () => {
    dispatch(clearFilters());
    setLocal({ city: '', minPrice: '', maxPrice: '', roomType: '', capacity: '', search: '' });
    onApply && onApply({});
  };

  const hasFilters = Object.values(local).some(Boolean);

  const FilterContent = () => (
    <div className="space-y-5">
      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1.5">Search</label>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Room name, city..."
            value={local.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* City */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1.5">City</label>
        <select value={local.city} onChange={(e) => handleChange('city', e.target.value)} className="input">
          <option value="">All Cities</option>
          {cities.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Room Type */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1.5">Room Type</label>
        <div className="grid grid-cols-3 gap-2">
          {ROOM_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => handleChange('roomType', local.roomType === type ? '' : type)}
              className={`py-1.5 px-2 rounded-lg text-xs font-medium border capitalize transition-all duration-200
                ${local.roomType === type
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-primary-300'}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1.5">Price per night (₹)</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={local.minPrice}
            onChange={(e) => handleChange('minPrice', e.target.value)}
            className="input"
          />
          <input
            type="number"
            placeholder="Max"
            value={local.maxPrice}
            onChange={(e) => handleChange('maxPrice', e.target.value)}
            className="input"
          />
        </div>
      </div>

      {/* Guests */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1.5">Min. Guests</label>
        <select value={local.capacity} onChange={(e) => handleChange('capacity', e.target.value)} className="input">
          <option value="">Any</option>
          {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}+ guests</option>)}
        </select>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button onClick={handleApply} className="btn-primary flex-1">Apply Filters</button>
        {hasFilters && (
          <button onClick={handleClear} className="btn-ghost flex items-center gap-1">
            <FiX className="w-4 h-4" /> Clear
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <div className="card p-5 sticky top-24">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-dark-800 flex items-center gap-2">
              <FiSliders className="w-4 h-4 text-primary-500" /> Filters
            </h3>
            {hasFilters && (
              <button onClick={handleClear} className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                Clear all
              </button>
            )}
          </div>
          <FilterContent />
        </div>
      </div>

      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all
            ${hasFilters ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-stone-700 border-stone-200'}`}
        >
          <FiSliders className="w-4 h-4" />
          Filters {hasFilters && '•'}
        </button>
      </div>

      {/* Mobile Filter Panel */}
      {showMobileFilters && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/40 flex items-end"
          role="dialog"
          aria-modal="true"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowMobileFilters(false);
          }}
        >
          <div className="bg-white rounded-t-2xl shadow-2xl w-full max-h-[85vh] overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-dark-800 flex items-center gap-2">
                <FiSliders className="w-4 h-4 text-primary-500" /> Filters
              </h3>
              <button
                type="button"
                onClick={() => setShowMobileFilters(false)}
                className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-500"
                aria-label="Close filters"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
            <FilterContent />
          </div>
        </div>
      )}
    </>
  );
}
