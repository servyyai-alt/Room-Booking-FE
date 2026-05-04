import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="text-center">
        <p className="font-display text-9xl font-bold text-primary-200">404</p>
        <h1 className="font-display text-3xl font-bold text-dark-800 mt-2 mb-3">Page not found</h1>
        <p className="text-stone-500 mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/" className="btn-primary">Go Home</Link>
          <Link to="/rooms" className="btn-outline">Browse Rooms</Link>
        </div>
      </div>
    </div>
  );
}