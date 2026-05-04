import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE = {
  name: 'StayNest',
  url: 'https://staynest.in',
  description:
    'Book verified rooms, suites, villas, and city stays across India with secure checkout and 24/7 guest support.',
};

const ROUTES = {
  '/': {
    title: 'StayNest | Premium Room Booking Across India',
    description:
      'Discover handpicked rooms across India, from ocean-view suites and heritage stays to city studios and beach villas.',
  },
  '/rooms': {
    title: 'Browse Rooms | StayNest',
    description:
      'Search and filter available rooms by city, room type, price, guests, and amenities on StayNest.',
  },
  '/login': {
    title: 'Sign In | StayNest',
    description: 'Sign in to manage bookings, update your profile, and continue your StayNest reservation.',
  },
  '/register': {
    title: 'Create Account | StayNest',
    description: 'Create a StayNest account to book rooms faster and manage every reservation in one place.',
  },
  '/dashboard': {
    title: 'My Dashboard | StayNest',
    description: 'View your StayNest booking summary, upcoming stays, and quick booking actions.',
  },
  '/bookings': {
    title: 'My Bookings | StayNest',
    description: 'Review, track, and manage your StayNest room bookings.',
  },
  '/profile': {
    title: 'Profile Settings | StayNest',
    description: 'Update your StayNest profile and account password.',
  },
  '/admin': {
    title: 'Admin Dashboard | StayNest',
    description: 'Manage StayNest rooms, bookings, users, and revenue from the admin dashboard.',
  },
};

const dynamicMeta = (pathname) => {
  if (pathname.startsWith('/rooms/')) {
    return {
      title: 'Room Details | StayNest',
      description: 'View room photos, amenities, pricing, availability, reviews, and secure booking options.',
    };
  }

  if (pathname.startsWith('/booking/')) {
    return {
      title: 'Secure Checkout | StayNest',
      description: 'Review your stay details and complete your StayNest room booking with secure payment.',
    };
  }

  if (pathname.startsWith('/admin/rooms')) return { ...ROUTES['/admin'], title: 'Manage Rooms | StayNest Admin' };
  if (pathname.startsWith('/admin/bookings')) return { ...ROUTES['/admin'], title: 'Manage Bookings | StayNest Admin' };
  if (pathname.startsWith('/admin/users')) return { ...ROUTES['/admin'], title: 'Manage Users | StayNest Admin' };

  return ROUTES[pathname] || {
    title: 'StayNest | Room Booking',
    description: SITE.description,
  };
};

const upsertMeta = (name, content, attr = 'name') => {
  let tag = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
};

export default function Seo() {
  const location = useLocation();

  useEffect(() => {
    const meta = dynamicMeta(location.pathname);
    const canonical = `${SITE.url}${location.pathname}`;

    document.title = meta.title;
    upsertMeta('description', meta.description);
    upsertMeta('robots', location.pathname.startsWith('/admin') ? 'noindex,nofollow' : 'index,follow');
    upsertMeta('og:site_name', SITE.name, 'property');
    upsertMeta('og:title', meta.title, 'property');
    upsertMeta('og:description', meta.description, 'property');
    upsertMeta('og:type', 'website', 'property');
    upsertMeta('og:url', canonical, 'property');
    upsertMeta('twitter:card', 'summary_large_image');
    upsertMeta('twitter:title', meta.title);
    upsertMeta('twitter:description', meta.description);

    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonical);
  }, [location.pathname]);

  return null;
}
