import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchRooms, setFilters } from '../redux/slices/roomSlice';
import RoomCard, { RoomCardSkeleton } from '../components/rooms/RoomCard';
import RoomFilters from '../components/rooms/RoomFilters';
import { FiChevronLeft, FiChevronRight, FiInbox } from 'react-icons/fi';

export default function RoomsPage() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { rooms, loading, pagination, filters } = useSelector((s) => s.rooms);
  const [page, setPage] = useState(1);

  // Apply URL params (e.g., ?city=Mumbai from homepage)
  useEffect(() => {
    const city = searchParams.get('city');
    if (city) dispatch(setFilters({ city }));
  }, [searchParams, dispatch]);

  // Fetch when filters or page changes
  useEffect(() => {
    const params = { page, limit: 9 };
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
    dispatch(fetchRooms(params));
  }, [dispatch, filters, page]);

  const handleFilterApply = () => setPage(1);

  return (
    <div className="pt-16 min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="section-title">Browse Rooms</h1>
          {pagination && (
            <p className="text-stone-500 mt-1">
              {pagination.total} room{pagination.total !== 1 ? 's' : ''} found
            </p>
          )}
        </div>

        <div className="lg:hidden mb-4">
          <RoomFilters onApply={handleFilterApply} />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <aside className="hidden lg:block w-72 shrink-0">
            <RoomFilters onApply={handleFilterApply} />
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(9)].map((_, i) => <RoomCardSkeleton key={i} />)}
              </div>
            ) : rooms.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mb-4">
                  <FiInbox className="w-8 h-8 text-stone-400" />
                </div>
                <h3 className="font-semibold text-dark-800 text-lg mb-2">No rooms found</h3>
                <p className="text-stone-500 text-sm max-w-xs">
                  Try adjusting your filters or search in a different city.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {rooms.map((room) => <RoomCard key={room._id} room={room} />)}
                </div>

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="w-9 h-9 rounded-lg border border-stone-200 flex items-center justify-center
                                 text-stone-600 hover:border-primary-400 hover:text-primary-600
                                 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <FiChevronLeft className="w-4 h-4" />
                    </button>

                    {[...Array(pagination.pages)].map((_, i) => {
                      const p = i + 1;
                      if (p === 1 || p === pagination.pages || Math.abs(p - page) <= 1) {
                        return (
                          <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`w-9 h-9 rounded-lg text-sm font-medium transition-all
                              ${p === page
                                ? 'bg-primary-500 text-white shadow-warm'
                                : 'border border-stone-200 text-stone-600 hover:border-primary-400 hover:text-primary-600'
                              }`}
                          >
                            {p}
                          </button>
                        );
                      }
                      if (Math.abs(p - page) === 2) return <span key={p} className="text-stone-400">…</span>;
                      return null;
                    })}

                    <button
                      onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                      disabled={page === pagination.pages}
                      className="w-9 h-9 rounded-lg border border-stone-200 flex items-center justify-center
                                 text-stone-600 hover:border-primary-400 hover:text-primary-600
                                 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <FiChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
