import React, { useEffect, useState } from 'react';
import { adminService, roomService } from '../../services/Api';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';

const EMPTY_ROOM = {
  name: '', description: '', pricePerNight: '', roomType: 'double',
  'location.address': '', 'location.city': '', 'location.state': '', 'location.country': 'India',
  'capacity.adults': 2, 'capacity.children': 0,
  amenities: [], isAvailable: true, isFeatured: false,
  images: [{ url: '', caption: '' }],
};

const ROOM_TYPES = ['single', 'double', 'suite', 'deluxe', 'penthouse', 'studio'];
const ALL_AMENITIES = ['wifi', 'ac', 'tv', 'parking', 'pool', 'gym', 'spa', 'breakfast', 'balcony', 'sea_view', 'mountain_view', 'pet_friendly', 'kitchen', 'bar', 'laundry', 'restaurant'];

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_ROOM);
  const [saving, setSaving] = useState(false);

  const loadRooms = () => {
    setLoading(true);
    adminService.getAllRooms()
      .then((res) => setRooms(res.data.rooms))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadRooms(); }, []);

  useEffect(() => {
    if (!showModal) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setShowModal(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [showModal]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_ROOM);
    setShowModal(true);
  };

  const openEdit = (room) => {
    setEditing(room._id);
    setForm({
      name: room.name, description: room.description, pricePerNight: room.pricePerNight,
      roomType: room.roomType, isAvailable: room.isAvailable, isFeatured: room.isFeatured,
      'location.address': room.location.address, 'location.city': room.location.city,
      'location.state': room.location.state, 'location.country': room.location.country,
      'capacity.adults': room.capacity.adults, 'capacity.children': room.capacity.children,
      amenities: room.amenities || [],
      images: room.images?.length ? room.images : [{ url: '', caption: '' }],
    });
    setShowModal(true);
  };

  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const toggleAmenity = (a) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(a)
        ? prev.amenities.filter((x) => x !== a)
        : [...prev.amenities, a],
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name, description: form.description,
      pricePerNight: Number(form.pricePerNight), roomType: form.roomType,
      isAvailable: form.isAvailable, isFeatured: form.isFeatured,
      location: {
        address: form['location.address'], city: form['location.city'],
        state: form['location.state'], country: form['location.country'],
      },
      capacity: { adults: Number(form['capacity.adults']), children: Number(form['capacity.children']) },
      amenities: form.amenities,
      images: form.images.filter((img) => img.url),
    };

    try {
      if (editing) {
        await roomService.updateRoom(editing, payload);
        toast.success('Room updated!');
      } else {
        await roomService.createRoom(payload);
        toast.success('Room created!');
      }
      setShowModal(false);
      loadRooms();
    } catch {
      // handled by interceptor
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this room?')) return;
    try {
      await roomService.deleteRoom(id);
      toast.success('Room deleted');
      loadRooms();
    } catch {
      // handled
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-dark-800">Rooms</h1>
          <p className="text-stone-500 text-sm">{rooms.length} rooms total</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center justify-center gap-2">
          <FiPlus className="w-4 h-4" /> Add Room
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-48 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <div key={room._id} className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="relative aspect-video">
                <img src={room.images?.[0]?.url || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400'}
                  alt={room.name} className="w-full h-full object-cover" />
                <div className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full border-2 border-white
                  ${room.isAvailable ? 'bg-green-400' : 'bg-red-400'}`} title={room.isAvailable ? 'Available' : 'Unavailable'} />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-dark-800 truncate">{room.name}</h3>
                <p className="text-stone-500 text-sm">{room.location.city} · <span className="capitalize">{room.roomType}</span></p>
                <p className="text-primary-600 font-semibold mt-1">₹{room.pricePerNight?.toLocaleString('en-IN')}/night</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => openEdit(room)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-stone-200 text-sm text-stone-600 hover:border-primary-400 hover:text-primary-600 transition-all">
                    <FiEdit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button onClick={() => handleDelete(room._id)}
                    className="flex items-center justify-center p-2 rounded-lg border border-stone-200 text-stone-400 hover:border-red-300 hover:text-red-500 transition-all">
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-3 sm:p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowModal(false);
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-2 sm:my-4 max-h-[calc(100vh-1rem)] flex flex-col">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-stone-100 shrink-0">
              <h2 className="font-display text-xl font-semibold">{editing ? 'Edit Room' : 'Add New Room'}</h2>
              <button type="button" onClick={() => setShowModal(false)} className="text-stone-400 hover:text-stone-600">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-4 sm:p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-stone-700 mb-1">Room Name *</label>
                  <input required value={form.name} onChange={(e) => handleChange('name', e.target.value)} className="input" placeholder="Oceanview Deluxe Suite" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Room Type *</label>
                  <select value={form.roomType} onChange={(e) => handleChange('roomType', e.target.value)} className="input capitalize">
                    {ROOM_TYPES.map((t) => <option key={t} value={t} className="capitalize">{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Price / Night (₹) *</label>
                  <input required type="number" min="0" value={form.pricePerNight}
                    onChange={(e) => handleChange('pricePerNight', e.target.value)} className="input" placeholder="5000" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Max Adults *</label>
                  <input required type="number" min="1" max="10" value={form['capacity.adults']}
                    onChange={(e) => handleChange('capacity.adults', e.target.value)} className="input" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Max Children</label>
                  <input type="number" min="0" value={form['capacity.children']}
                    onChange={(e) => handleChange('capacity.children', e.target.value)} className="input" />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-stone-700 mb-1">Description *</label>
                  <textarea required rows={3} value={form.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="input resize-none" placeholder="Describe the room..." />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Address *</label>
                  <input required value={form['location.address']} onChange={(e) => handleChange('location.address', e.target.value)} className="input" placeholder="12 Marine Drive" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">City *</label>
                  <input required value={form['location.city']} onChange={(e) => handleChange('location.city', e.target.value)} className="input" placeholder="Mumbai" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">State *</label>
                  <input required value={form['location.state']} onChange={(e) => handleChange('location.state', e.target.value)} className="input" placeholder="Maharashtra" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Country</label>
                  <input value={form['location.country']} onChange={(e) => handleChange('location.country', e.target.value)} className="input" />
                </div>

                {/* Image URL */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-stone-700 mb-1">Image URL</label>
                  <input value={form.images[0]?.url}
                    onChange={(e) => setForm((p) => ({ ...p, images: [{ url: e.target.value }] }))}
                    className="input" placeholder="https://images.unsplash.com/..." />
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_AMENITIES.map((a) => (
                    <button key={a} type="button" onClick={() => toggleAmenity(a)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border capitalize transition-all
                        ${form.amenities.includes(a)
                          ? 'bg-primary-500 text-white border-primary-500'
                          : 'bg-white text-stone-600 border-stone-200 hover:border-primary-300'}`}>
                      {a.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
                {[
                  { key: 'isAvailable', label: 'Available' },
                  { key: 'isFeatured', label: 'Featured' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <div
                      onClick={() => handleChange(key, !form[key])}
                      className={`w-10 h-6 rounded-full transition-colors relative ${form[key] ? 'bg-primary-500' : 'bg-stone-300'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${form[key] ? 'left-5' : 'left-1'}`} />
                    </div>
                    <span className="text-sm text-stone-700">{label}</span>
                  </label>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2 sticky bottom-0 bg-white pb-1">
                <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 flex-1">
                  <FiSave className="w-4 h-4" />
                  {saving ? 'Saving...' : editing ? 'Update Room' : 'Create Room'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-ghost">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
