import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiStar, FiUsers, FiWifi } from 'react-icons/fi';

const amenityIcons = {
  wifi: '📶', ac: '❄️', tv: '📺', parking: '🚗', pool: '🏊',
  gym: '💪', spa: '🧖', breakfast: '🍳', balcony: '🌿', sea_view: '🌊',
  mountain_view: '⛰️', pet_friendly: '🐾', kitchen: '🍽️', bar: '🍸',
};

const roomTypeBadgeColor = {
  single: 'bg-blue-100 text-blue-700',
  double: 'bg-green-100 text-green-700',
  suite: 'bg-purple-100 text-purple-700',
  deluxe: 'bg-amber-100 text-amber-700',
  penthouse: 'bg-rose-100 text-rose-700',
  studio: 'bg-cyan-100 text-cyan-700',
};

export default function RoomCard({ room, featured = false }) {
  const img = room.images?.[0]?.url || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600';

  return (
    <Link to={`/rooms/${room._id}`}
      className={`card group block overflow-hidden ${featured ? 'hover:-translate-y-1' : ''} transition-all duration-300`}>
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={img}
          alt={room.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Badge overlay */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`badge ${roomTypeBadgeColor[room.roomType] || 'bg-stone-100 text-stone-700'} capitalize`}>
            {room.roomType}
          </span>
          {room.isFeatured && (
            <span className="badge bg-gold-400 text-white">Featured</span>
          )}
        </div>
        {/* Rating overlay */}
        {room.ratings?.count > 0 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1">
            <FiStar className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-xs font-semibold text-dark-800">{room.ratings.average}</span>
            <span className="text-xs text-stone-500">({room.ratings.count})</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display font-semibold text-dark-800 text-lg leading-tight mb-1 group-hover:text-primary-600 transition-colors line-clamp-1">
          {room.name}
        </h3>

        <div className="flex items-center gap-1.5 text-stone-500 text-sm mb-3">
          <FiMapPin className="w-3.5 h-3.5 text-primary-400 shrink-0" />
          <span className="truncate">{room.location.city}, {room.location.state}</span>
        </div>

        {/* Amenities */}
        <div className="flex gap-1 mb-4 flex-wrap">
          {room.amenities?.slice(0, 5).map((a) => (
            <span key={a} title={a} className="text-base" role="img" aria-label={a}>
              {amenityIcons[a] || '•'}
            </span>
          ))}
          {room.amenities?.length > 5 && (
            <span className="text-xs text-stone-400 self-center">+{room.amenities.length - 5}</span>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-stone-100">
          <div className="flex items-center gap-1.5 text-stone-500 text-sm">
            <FiUsers className="w-3.5 h-3.5" />
            <span>Up to {room.capacity.adults} guests</span>
          </div>
          <div className="text-right">
            <span className="font-display text-xl font-semibold text-primary-600">
              ₹{room.pricePerNight?.toLocaleString('en-IN')}
            </span>
            <span className="text-stone-400 text-xs">/night</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Skeleton loading card
export function RoomCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton aspect-[4/3]" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-5 w-3/4 rounded" />
        <div className="skeleton h-4 w-1/2 rounded" />
        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-6 w-6 rounded" />)}
        </div>
        <div className="flex justify-between pt-2 border-t border-stone-100">
          <div className="skeleton h-4 w-24 rounded" />
          <div className="skeleton h-6 w-20 rounded" />
        </div>
      </div>
    </div>
  );
}