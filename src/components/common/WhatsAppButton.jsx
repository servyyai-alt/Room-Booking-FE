import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const DEFAULT_NUMBER = '919876543210';

export default function WhatsAppButton() {
  const number = import.meta.env.VITE_ADMIN_WHATSAPP_NUMBER || DEFAULT_NUMBER;
  const text = encodeURIComponent('Hi StayNest admin, I need help with a room booking.');
  const href = `https://wa.me/${number}?text=${text}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message StayNest admin on WhatsApp"
      title="Message admin on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-card transition-all hover:bg-green-600 hover:shadow-card-hover focus:outline-none focus:ring-4 focus:ring-green-200"
    >
      <FaWhatsapp className="h-7 w-7" />
    </a>
  );
}
