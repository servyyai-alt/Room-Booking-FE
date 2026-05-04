import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from '../redux/slices/authSlice';
import { authService } from '../services/Api';
import { FiUser, FiMail, FiPhone, FiLock, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((s) => s.auth);

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  const [passForm, setPassForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [passLoading, setPassLoading] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    dispatch(updateUserProfile(profileForm));
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setPassLoading(true);
    try {
      await authService.changePassword({
        currentPassword: passForm.currentPassword,
        newPassword: passForm.newPassword,
      });
      toast.success('Password changed successfully!');
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch {
      // Error handled by interceptor
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-stone-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="font-display text-3xl font-bold text-dark-800 mb-8">Profile Settings</h1>

        {/* Avatar */}
        <div className="card p-6 mb-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center text-white font-display text-2xl font-bold shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-dark-800">{user?.name}</p>
            <p className="text-stone-500 text-sm">{user?.email}</p>
            <span className={`badge mt-1 ${user?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'} capitalize`}>
              {user?.role}
            </span>
          </div>
        </div>

        {/* Profile Form */}
        <div className="card p-6 mb-6">
          <h2 className="font-semibold text-dark-800 text-lg mb-5 flex items-center gap-2">
            <FiUser className="w-4 h-4 text-primary-500" /> Personal Information
          </h2>
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Full Name</label>
              <input type="text" value={profileForm.name} required
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
                <input type="email" value={user?.email} disabled
                  className="input pl-10 bg-stone-50 text-stone-400 cursor-not-allowed" />
              </div>
              <p className="text-xs text-stone-400 mt-1">Email cannot be changed</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Phone</label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
                <input type="tel" value={profileForm.phone} placeholder="9876543210"
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="input pl-10" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              <FiSave className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Password Form */}
        <div className="card p-6">
          <h2 className="font-semibold text-dark-800 text-lg mb-5 flex items-center gap-2">
            <FiLock className="w-4 h-4 text-primary-500" /> Change Password
          </h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {[
              { key: 'currentPassword', label: 'Current Password' },
              { key: 'newPassword', label: 'New Password' },
              { key: 'confirmPassword', label: 'Confirm New Password' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">{label}</label>
                <input type="password" required minLength={6}
                  value={passForm[key]}
                  onChange={(e) => setPassForm({ ...passForm, [key]: e.target.value })}
                  className="input" />
              </div>
            ))}
            <button type="submit" disabled={passLoading} className="btn-outline flex items-center gap-2">
              <FiLock className="w-4 h-4" />
              {passLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
