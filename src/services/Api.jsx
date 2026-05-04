import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    if (error.response?.status !== 401) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;

// ─── Auth Services ─────────────────────────────────────────────────────────────
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  changePassword: (data) => api.put('/auth/change-password', data),
  logout: () => api.post('/auth/logout'),
};

// ─── Room Services ─────────────────────────────────────────────────────────────
export const roomService = {
  getRooms: (params) => api.get('/rooms', { params }),
  getRoom: (id) => api.get(`/rooms/${id}`),
  getFeatured: () => api.get('/rooms/featured'),
  getCities: () => api.get('/rooms/cities'),
  checkAvailability: (id, params) => api.get(`/rooms/${id}/availability`, { params }),
  addReview: (id, data) => api.post(`/rooms/${id}/reviews`, data),
  // Admin
  createRoom: (data) => api.post('/rooms', data),
  updateRoom: (id, data) => api.put(`/rooms/${id}`, data),
  deleteRoom: (id) => api.delete(`/rooms/${id}`),
};

// ─── Booking Services ──────────────────────────────────────────────────────────
export const bookingService = {
  createBooking: (data) => api.post('/bookings', data),
  getMyBookings: (params) => api.get('/bookings/my-bookings', { params }),
  getBooking: (id) => api.get(`/bookings/${id}`),
  cancelBooking: (id, data) => api.put(`/bookings/${id}/cancel`, data),
};

// ─── User Services ─────────────────────────────────────────────────────────────
export const userService = {
  updateProfile: (data) => api.put('/users/profile', data),
};

// ─── Admin Services ────────────────────────────────────────────────────────────
export const adminService = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  toggleUser: (id) => api.put(`/admin/users/${id}/toggle`),
  getAllRooms: () => api.get('/admin/rooms'),
  getAllBookings: (params) => api.get('/admin/bookings', { params }),
  updateBookingStatus: (id, data) => api.put(`/admin/bookings/${id}/status`, data),
};

// ─── Payment Services ──────────────────────────────────────────────────────────
export const paymentService = {
  createStripeIntent: (data) => api.post('/payments/stripe/create-intent', data),
  confirmStripe: (data) => api.post('/payments/stripe/confirm', data),
  createRazorpayOrder: (data) => api.post('/payments/razorpay/create-order', data),
  verifyRazorpay: (data) => api.post('/payments/razorpay/verify', data),
};
