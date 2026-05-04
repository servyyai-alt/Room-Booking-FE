import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiMail, FiPhone, FiMapPin, FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-dark-900 text-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <FiHome className="text-white w-4 h-4" />
              </div>
              <span className="font-display text-xl font-semibold text-white">StayNest</span>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed max-w-sm">
              Discover handpicked rooms and hotels across India. From heritage havelis to modern city stays — find your perfect home away from home.
            </p>
            <div className="flex gap-3 mt-5">
              {[FiInstagram, FiTwitter, FiFacebook].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-dark-700 flex items-center justify-center text-stone-400 hover:text-white hover:bg-primary-500 transition-all duration-200">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/rooms', label: 'Browse Rooms' },
                { to: '/login', label: 'Sign In' },
                { to: '/register', label: 'Create Account' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-stone-400 hover:text-primary-400 text-sm transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-medium mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-stone-400 text-sm">
                <FiMapPin className="w-4 h-4 text-primary-400 shrink-0" />
                Mumbai, India
              </li>
              <li className="flex items-center gap-2 text-stone-400 text-sm">
                <FiMail className="w-4 h-4 text-primary-400 shrink-0" />
                hello@staynest.in
              </li>
              <li className="flex items-center gap-2 text-stone-400 text-sm">
                <FiPhone className="w-4 h-4 text-primary-400 shrink-0" />
                +91 98765 43210
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-700 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-stone-500 text-xs">© {new Date().getFullYear()} StayNest. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-stone-500">
            <a href="#" className="hover:text-stone-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-stone-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}