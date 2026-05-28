// data.ts — Wayfare package data and shared assets

import packagesData from '@/assets/packages.json';
import destinationsData from '@/assets/destinations.json';
import offersData from '@/assets/offers.json';
import testimonialsData from '@/assets/testimonials.json';
import itineraryData from '@/assets/itinerary-rajasthan.json';
import bookingsData from '@/assets/bookings.json';

export interface Package {
  id: string;
  title: string;
  destination: string;
  region: string;
  type: string;
  duration: number;
  nights: number;
  rating: number;
  reviews: number;
  price: number;
  priceWas?: number;
  featured?: boolean;
  badge?: string;
  blurb: string;
  img: string;
  gallery?: string[];
  highlights: string[];
}

export interface Destination {
  name: string;
  count: number;
  img: string;
  tag: string;
  size?: 'lg';
}

export interface Offer {
  id: string;
  tag: string;
  title: string;
  sub: string;
  code: string;
  img: string;
  accent: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  place: string;
  avatar: string;
}

export interface Booking {
  id: string;
  name: string;
  avatar: string;
  pkg: string;
  dates: string;
  total: number;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export interface ItineraryDay {
  title: string;
  body: string;
  activities: string[];
}

export const PACKAGES: Package[] = packagesData as Package[];
export const DESTINATIONS: Destination[] = destinationsData as Destination[];
export const OFFERS: Offer[] = offersData as Offer[];
export const TESTIMONIALS: Testimonial[] = testimonialsData as Testimonial[];
export const ITINERARY_RAJASTHAN: ItineraryDay[] = itineraryData as ItineraryDay[];
export const BOOKINGS: Booking[] = bookingsData as Booking[];

export const getApiUrl = (path: string) => {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  return `${base}${path}`;
};

export const getAuthHeaders = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function login(username: string, password: string) {
  const res = await fetch(getApiUrl('/api/token/'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) throw new Error('Invalid credentials');
  const data = await res.json();
  localStorage.setItem('access_token', data.access);
  if (data.refresh) {
    localStorage.setItem('refresh_token', data.refresh);
  }
  return data;
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
  }
}

async function authFetch(url: string, options: RequestInit = {}) {
  const customHeaders: Record<string, string> = { ...getAuthHeaders() };
  if (options.headers) {
    Object.assign(customHeaders, options.headers);
  }
  const res = await fetch(url, { ...options, headers: customHeaders });
  
  if (res.status === 401) {
    logout();
    throw new Error('Unauthorized');
  }
  return res;
}

export async function fetchStats(): Promise<any> {
  const res = await authFetch(getApiUrl('/api/stats/'));
  if (!res.ok) throw new Error('Failed to fetch stats');
  return await res.json();
}

export async function fetchPackages(): Promise<Package[]> {
  try {
    const res = await authFetch(getApiUrl('/api/packages/'));
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch (e) {
    console.warn('Fallback to local packages data', e);
    return PACKAGES;
  }
}

export async function fetchBookings(): Promise<Booking[]> {
  try {
    const res = await authFetch(getApiUrl('/api/bookings/'));
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch (e) {
    console.warn('Fallback to local bookings data', e);
    return BOOKINGS;
  }
}

export async function createPackage(packageData: any): Promise<Package> {
  const res = await authFetch(getApiUrl('/api/packages/'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(packageData),
  });
  if (!res.ok) throw new Error('Failed to create package');
  return await res.json();
}

export async function deletePackage(id: string): Promise<void> {
  const res = await authFetch(getApiUrl(`/api/packages/${id}/`), {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete package');
}

export async function updateBookingStatus(id: string, status: string): Promise<Booking> {
  const res = await authFetch(getApiUrl(`/api/bookings/${id}/`), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update booking status');
  return await res.json();
}

// ── Offers ──
export async function fetchOffers(): Promise<Offer[]> {
  try {
    const res = await authFetch(getApiUrl('/api/offers/'));
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch (e) {
    console.warn('Fallback to local offers data', e);
    return OFFERS;
  }
}

export async function createOffer(offerData: any): Promise<Offer> {
  const res = await authFetch(getApiUrl('/api/offers/'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(offerData),
  });
  if (!res.ok) throw new Error('Failed to create offer');
  return await res.json();
}

export async function deleteOffer(id: string): Promise<void> {
  const res = await authFetch(getApiUrl(`/api/offers/${id}/`), {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete offer');
}

// ── Destinations ──
export async function fetchDestinations(): Promise<Destination[]> {
  try {
    const res = await authFetch(getApiUrl('/api/destinations/'));
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch (e) {
    console.warn('Fallback to local destinations data', e);
    return DESTINATIONS;
  }
}

export async function createDestination(data: any): Promise<Destination> {
  const res = await authFetch(getApiUrl('/api/destinations/'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create destination');
  return await res.json();
}

export async function deleteDestination(name: string): Promise<void> {
  const res = await authFetch(getApiUrl(`/api/destinations/${encodeURIComponent(name)}/`), {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete destination');
}

// ── Contact Inquiries ──
export async function fetchInquiries(): Promise<any[]> {
  const res = await authFetch(getApiUrl('/api/inquiries/'));
  if (!res.ok) throw new Error('Failed to fetch inquiries');
  return await res.json();
}
