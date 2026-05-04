import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createBooking } from '../redux/slices/bookingSlice';
import { roomService, paymentService } from '../services/Api';
import { format } from 'date-fns';
import {
  FiArrowLeft,
  FiCheckCircle,
  FiCreditCard,
  FiGlobe,
  FiLoader,
  FiShield,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const loadRazorpaySdk = () => new Promise((resolve, reject) => {
  if (window.Razorpay) {
    resolve(true);
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.async = true;
  script.onload = () => resolve(true);
  script.onerror = () => reject(new Error('Unable to load Razorpay checkout. Please check your connection.'));
  document.body.appendChild(script);
});

export default function BookingPage() {
  const { roomId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { loading, currentBooking } = useSelector((s) => s.bookings);

  const [room, setRoom] = useState(null);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [specialRequests, setSpecialRequests] = useState('');
  const [paying, setPaying] = useState(false);

  const { checkIn, checkOut, guests, nights, pricing } = state || {};

  useEffect(() => {
    if (!state) {
      navigate(`/rooms/${roomId}`);
      return;
    }

    roomService.getRoom(roomId).then((res) => setRoom(res.data.room));
  }, [roomId, state, navigate]);

  const handleCreateAndPay = async () => {
    try {
      const result = await dispatch(createBooking({
        roomId,
        checkIn,
        checkOut,
        guests,
        specialRequests,
      })).unwrap();

      const booking = result.booking;

      if (paymentMethod === 'razorpay') {
        await handleRazorpay(booking);
      } else {
        toast.error('Stripe checkout needs Payment Element setup. Please use Razorpay for now.');
      }
    } catch (err) {
      toast.error(err.message || 'Booking failed');
    }
  };

  const handleRazorpay = async (booking) => {
    setPaying(true);

    try {
      await loadRazorpaySdk();
      const orderRes = await paymentService.createRazorpayOrder({ bookingId: booking._id });
      const { orderId, amount, keyId } = orderRes.data;

      if (!keyId) {
        throw new Error('Razorpay key is missing. Add RAZORPAY_KEY_ID in backend .env.');
      }

      const rzp = new window.Razorpay({
        key: keyId,
        amount: Math.round(amount * 100),
        currency: 'INR',
        name: 'StayNest',
        description: `Booking: ${room?.name}`,
        order_id: orderId,
        prefill: { name: user?.name, email: user?.email },
        theme: { color: '#e05a27' },
        modal: {
          ondismiss: () => toast('Payment was cancelled. Your booking is still pending.'),
        },
        handler: async (response) => {
          try {
            await paymentService.verifyRazorpay({
              bookingId: booking._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            setStep(3);
          } catch {
            toast.error('Payment verification failed');
          }
        },
      });

      rzp.on('payment.failed', (response) => {
        toast.error(response.error?.description || 'Payment failed. Please try again.');
      });

      rzp.open();
    } catch (err) {
      toast.error(err.message || 'Unable to start payment checkout');
    } finally {
      setPaying(false);
    }
  };

  if (!room || !state) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const paymentOptions = [
    {
      id: 'razorpay',
      label: 'Razorpay',
      desc: 'UPI, cards, net banking, and wallets',
      icon: FiCreditCard,
      disabled: false,
    },
    {
      id: 'stripe',
      label: 'Stripe',
      desc: 'Coming soon: secure Payment Element checkout',
      icon: FiGlobe,
      disabled: false,
    },
  ];

  return (
    <div className="pt-16 min-h-screen bg-stone-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {step < 3 && (
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-stone-500 hover:text-primary-600 mb-6 text-sm"
          >
            <FiArrowLeft className="w-4 h-4" /> Back
          </button>
        )}

        <div className="flex items-center gap-2 sm:gap-4 mb-8">
          {['Review', 'Payment', 'Confirmed'].map((label, i) => (
            <React.Fragment key={label}>
              <div className="flex items-center gap-2 shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-primary-500 text-white' : 'bg-stone-200 text-stone-500'
                }`}>
                  {step > i + 1 ? <FiCheckCircle className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${step === i + 1 ? 'text-dark-800' : 'text-stone-400'}`}>
                  {label}
                </span>
              </div>
              {i < 2 && <div className={`flex-1 h-0.5 transition-all ${step > i + 1 ? 'bg-green-400' : 'bg-stone-200'}`} />}
            </React.Fragment>
          ))}
        </div>

        {step === 1 && (
          <div className="card p-4 sm:p-6">
            <h2 className="font-display text-2xl font-semibold mb-6">Review Your Booking</h2>

            <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-stone-50 rounded-xl">
              <img
                src={room.images?.[0]?.url}
                alt={room.name}
                className="w-full sm:w-24 h-40 sm:h-20 object-cover rounded-lg shrink-0"
              />
              <div>
                <h3 className="font-semibold text-dark-800">{room.name}</h3>
                <p className="text-stone-500 text-sm">{room.location.city}, {room.location.state}</p>
                <p className="text-primary-600 font-medium text-sm mt-1 capitalize">{room.roomType}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              {[
                { label: 'Check-in', val: format(new Date(checkIn), 'EEE, MMM d yyyy') },
                { label: 'Check-out', val: format(new Date(checkOut), 'EEE, MMM d yyyy') },
                { label: 'Duration', val: `${nights} night${nights > 1 ? 's' : ''}` },
                { label: 'Guests', val: `${guests?.adults} adult${guests?.adults > 1 ? 's' : ''}` },
              ].map(({ label, val }) => (
                <div key={label} className="bg-stone-50 rounded-xl p-3">
                  <p className="text-xs text-stone-500 uppercase tracking-wide mb-0.5">{label}</p>
                  <p className="font-medium text-dark-800 text-sm">{val}</p>
                </div>
              ))}
            </div>

            <div className="border border-stone-200 rounded-xl p-4 mb-5 space-y-2">
              <div className="flex justify-between gap-4 text-sm text-stone-600">
                <span>Rs. {room.pricePerNight?.toLocaleString('en-IN')} x {nights} nights</span>
                <span>Rs. {pricing?.subtotal?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between gap-4 text-sm text-stone-600">
                <span>GST (18%)</span>
                <span>Rs. {pricing?.taxes?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between gap-4 text-sm text-stone-600">
                <span>Service fee</span>
                <span>Rs. 500</span>
              </div>
              <div className="border-t border-stone-200 pt-2 flex justify-between gap-4 font-bold text-dark-800">
                <span>Total</span>
                <span className="text-primary-600 text-lg">Rs. {pricing?.total?.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Special Requests (optional)</label>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Late check-in, extra towels, floor preference..."
                rows={3}
                className="input resize-none"
              />
            </div>

            <button onClick={() => setStep(2)} className="btn-primary w-full text-base">
              Continue to Payment
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="card p-4 sm:p-6">
            <h2 className="font-display text-2xl font-semibold mb-6">Choose Payment Method</h2>

            <div className="space-y-3 mb-6">
              {paymentOptions.map((m) => (
                <label
                  key={m.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    m.disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                  } ${paymentMethod === m.id ? 'border-primary-500 bg-primary-50' : 'border-stone-200 hover:border-stone-300'}`}
                >
                  <input
                    type="radio"
                    value={m.id}
                    checked={paymentMethod === m.id}
                    disabled={m.disabled}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-primary-500"
                  />
                  <m.icon className="w-6 h-6 text-primary-500 shrink-0" />
                  <div>
                    <p className="font-medium text-dark-800">{m.label}</p>
                    <p className="text-xs text-stone-500">{m.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 mb-6 flex justify-between gap-4">
              <span className="font-medium text-dark-800">Amount to Pay</span>
              <span className="font-bold text-primary-600 text-lg">Rs. {pricing?.total?.toLocaleString('en-IN')}</span>
            </div>

            <button
              onClick={handleCreateAndPay}
              disabled={loading || paying}
              className="btn-primary w-full text-base flex items-center justify-center gap-2"
            >
              {(loading || paying)
                ? <><FiLoader className="w-4 h-4 animate-spin" /> Processing...</>
                : `Pay Rs. ${pricing?.total?.toLocaleString('en-IN')}`
              }
            </button>

            <p className="text-center text-xs text-stone-400 mt-3 flex items-center justify-center gap-1">
              <FiShield className="w-3.5 h-3.5" /> Payments are secured and encrypted
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="card p-6 sm:p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="font-display text-2xl font-bold text-dark-800 mb-2">Booking Confirmed!</h2>
            <p className="text-stone-500 mb-6">
              Your stay at <strong>{room.name}</strong> is confirmed. Check your email for the booking details.
            </p>
            {currentBooking && (
              <p className="text-sm text-stone-400 mb-8">
                Booking Reference: <strong className="text-primary-600">{currentBooking.bookingReference}</strong>
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => navigate('/bookings')} className="btn-primary">
                View My Bookings
              </button>
              <button onClick={() => navigate('/rooms')} className="btn-outline">
                Browse More Rooms
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
