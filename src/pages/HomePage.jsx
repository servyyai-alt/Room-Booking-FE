import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeaturedRooms } from '../redux/slices/roomSlice';
import RoomCard, { RoomCardSkeleton } from '../components/rooms/RoomCard';
import { FiSearch, FiShield, FiStar, FiMapPin, FiArrowRight } from 'react-icons/fi';

const DESTINATIONS = [
  { city: 'Mumbai', img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400', rooms: 42 },
  { city: 'Jaipur', img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400', rooms: 28 },
  { city: 'Goa', img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400', rooms: 35 },
  { city: 'Shimla', img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400', rooms: 19 },
];

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { featuredRooms, loading } = useSelector((s) => s.rooms);
  const [searchCity, setSearchCity] = React.useState('');

  useEffect(() => {
    dispatch(fetchFeaturedRooms());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/rooms${searchCity ? `?city=${searchCity}` : ''}`);
  };

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900/70 via-dark-900/50 to-dark-900/80" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <span className="inline-block text-primary-300 text-sm font-medium tracking-widest uppercase mb-4">
            India's Finest Stays
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Find Your<br />
            <span className="text-primary-400 italic">Perfect Room</span>
          </h1>
          <p className="text-stone-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            From heritage havelis to ocean-facing suites — discover handpicked stays across India, curated for every occasion.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20">
            <div className="relative flex-1">
              <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300 w-4 h-4" />
              <input
                type="text"
                placeholder="Where do you want to stay?"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-9 pr-3 py-3 text-white placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
            <button type="submit" className="btn-primary flex items-center gap-2 justify-center whitespace-nowrap">
              <FiSearch className="w-4 h-4" /> Search Rooms
            </button>
          </form>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 text-stone-300 text-sm">
            {['500+ Rooms', '50+ Cities', '24/7 Support'].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-primary-400 rounded-full" />
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-stone-400 text-xs animate-bounce">
          <span>Scroll</span>
          <div className="w-0.5 h-8 bg-stone-500 rounded" />
        </div>
      </section>

      {/* ── Popular Destinations ── */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-primary-500 text-sm font-medium uppercase tracking-wider">Explore</span>
              <h2 className="section-title mt-1">Popular Destinations</h2>
            </div>
            <Link to="/rooms" className="hidden sm:flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium text-sm">
              View all <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {DESTINATIONS.map((d) => (
              <Link
                key={d.city}
                to={`/rooms?city=${d.city}`}
                className="group relative rounded-2xl overflow-hidden aspect-[3/4] cursor-pointer"
              >
                <img src={d.img} alt={d.city} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-display font-semibold text-lg">{d.city}</h3>
                  <p className="text-stone-300 text-sm">{d.rooms} rooms</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Rooms ── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-primary-500 text-sm font-medium uppercase tracking-wider">Handpicked</span>
              <h2 className="section-title mt-1">Featured Rooms</h2>
            </div>
            <Link to="/rooms" className="hidden sm:flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium text-sm">
              See all <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? [...Array(6)].map((_, i) => <RoomCardSkeleton key={i} />)
              : featuredRooms.map((room) => <RoomCard key={room._id} room={room} featured />)
            }
          </div>

          <div className="text-center mt-10">
            <Link to="/rooms" className="btn-outline inline-flex items-center gap-2">
              Browse All Rooms <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why StayNest ── */}
      <section className="py-16 bg-dark-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-3">Why Choose StayNest?</h2>
            <p className="text-stone-400 max-w-xl mx-auto">We make booking the perfect stay effortless, transparent, and delightful.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: FiSearch, title: 'Easy Discovery', desc: 'Powerful filters help you find exactly what you need — by city, type, price, or amenities.' },
              { icon: FiShield, title: 'Secure Bookings', desc: 'JWT-protected accounts, encrypted payments via Stripe/Razorpay. Your data is safe.' },
              { icon: FiStar, title: 'Verified Reviews', desc: 'Only guests who actually stayed can leave reviews, so you always get honest feedback.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center p-6 rounded-2xl bg-dark-800 border border-dark-700">
                <div className="w-12 h-12 bg-primary-500/20 rounded-2xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-stone-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
