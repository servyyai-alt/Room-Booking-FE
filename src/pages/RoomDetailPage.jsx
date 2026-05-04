import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRoom, clearCurrentRoom } from '../redux/slices/roomSlice';
import BookingForm from '../components/booking/BookingForm';
import { FiMapPin, FiStar, FiUsers, FiMaximize, FiArrowLeft } from 'react-icons/fi';

const amenityLabels = {
  wifi: '📶 Free WiFi', ac: '❄️ Air Conditioning', tv: '📺 Smart TV',
  parking: '🚗 Free Parking', pool: '🏊 Swimming Pool', gym: '💪 Gym',
  spa: '🧖 Spa', breakfast: '🍳 Breakfast Included', balcony: '🌿 Balcony',
  sea_view: '🌊 Sea View', mountain_view: '⛰️ Mountain View',
  pet_friendly: '🐾 Pet Friendly', kitchen: '🍽️ Kitchen', bar: '🍸 Bar',
  laundry: '👕 Laundry', restaurant: '🍴 Restaurant',
};

export default function RoomDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentRoom: room, loading } = useSelector((s) => s.rooms);
  const [activeImg, setActiveImg] = React.useState(0);

  useEffect(() => {
    dispatch(fetchRoom(id));
    return () => dispatch(clearCurrentRoom());
  }, [dispatch, id]);

  if (loading) return (
    <div className="pt-16 min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="skeleton h-10 w-48 rounded mb-6" />
        <div className="skeleton h-[400px] rounded-2xl mb-4" />
        <div className="grid grid-cols-3 gap-2 mb-8">
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />)}
        </div>
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-4">
            <div className="skeleton h-8 w-3/4 rounded" />
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-5/6 rounded" />
          </div>
          <div className="skeleton h-96 rounded-2xl" />
        </div>
      </div>
    </div>
  );

  if (!room) return (
    <div className="pt-16 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-dark-800 mb-2">Room not found</h2>
        <Link to="/rooms" className="btn-primary">Browse Rooms</Link>
      </div>
    </div>
  );

  const images = room.images?.length ? room.images : [{ url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800' }];

  return (
    <div className="pt-16 min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <Link to="/rooms" className="inline-flex items-center gap-2 text-stone-500 hover:text-primary-600 mb-5 text-sm transition-colors">
          <FiArrowLeft className="w-4 h-4" /> Back to Rooms
        </Link>

        {/* Image Gallery */}
        <div className="mb-6">
          <div className="rounded-2xl overflow-hidden aspect-video md:aspect-[21/9] mb-3">
            <img src={images[activeImg]?.url} alt={room.name}
              className="w-full h-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`shrink-0 rounded-xl overflow-hidden w-20 h-16 border-2 transition-all
                    ${i === activeImg ? 'border-primary-500' : 'border-transparent hover:border-stone-300'}`}>
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2">
            {/* Title Row */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="badge bg-primary-100 text-primary-700 capitalize">{room.roomType}</span>
                  {room.isFeatured && <span className="badge bg-amber-100 text-amber-700">Featured</span>}
                </div>
                <h1 className="font-display text-3xl font-bold text-dark-800">{room.name}</h1>
              </div>
              {room.ratings?.count > 0 && (
                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 shrink-0">
                  <FiStar className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-semibold text-dark-800">{room.ratings.average}</span>
                  <span className="text-stone-500 text-sm">({room.ratings.count} reviews)</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4 text-stone-600 text-sm mb-6">
              <span className="flex items-center gap-1.5">
                <FiMapPin className="w-4 h-4 text-primary-400" />
                {room.location.address}, {room.location.city}, {room.location.state}
              </span>
              <span className="flex items-center gap-1.5">
                <FiUsers className="w-4 h-4 text-primary-400" />
                Up to {room.capacity.adults} adults{room.capacity.children > 0 ? `, ${room.capacity.children} children` : ''}
              </span>
              {room.size && (
                <span className="flex items-center gap-1.5">
                  <FiMaximize className="w-4 h-4 text-primary-400" />
                  {room.size} sq ft
                </span>
              )}
            </div>

            {/* Description */}
            <div className="card p-6 mb-6">
              <h2 className="font-semibold text-dark-800 text-lg mb-3">About this room</h2>
              <p className="text-stone-600 leading-relaxed">{room.description}</p>
            </div>

            {/* Amenities */}
            <div className="card p-6 mb-6">
              <h2 className="font-semibold text-dark-800 text-lg mb-4">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {room.amenities?.map((a) => (
                  <div key={a} className="flex items-center gap-2 text-sm text-stone-700 bg-stone-50 rounded-lg px-3 py-2">
                    {amenityLabels[a] || a}
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            {room.reviews?.length > 0 && (
              <div className="card p-6">
                <h2 className="font-semibold text-dark-800 text-lg mb-4">
                  Guest Reviews ({room.reviews.length})
                </h2>
                <div className="space-y-4">
                  {room.reviews.map((review, i) => (
                    <div key={i} className="border-b border-stone-100 last:border-0 pb-4 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-bold">
                            {review.name?.charAt(0)}
                          </div>
                          <span className="font-medium text-dark-800 text-sm">{review.name}</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, s) => (
                            <FiStar key={s} className={`w-3.5 h-3.5 ${s < review.rating ? 'text-amber-400 fill-amber-400' : 'text-stone-200'}`} />
                          ))}
                        </div>
                      </div>
                      {review.comment && <p className="text-stone-600 text-sm">{review.comment}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking Sidebar */}
          <div>
            <BookingForm room={room} />
          </div>
        </div>
      </div>
    </div>
  );
}