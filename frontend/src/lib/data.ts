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

export async function fetchPackages(): Promise<Package[]> {
  try {
    const res = await fetch(getApiUrl('/api/packages/'));
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch (e) {
    console.warn('Fallback to local packages data', e);
    return PACKAGES;
  }
}

export async function fetchPackageById(id: string): Promise<Package> {
  try {
    const res = await fetch(getApiUrl(`/api/packages/${id}/`));
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch (e) {
    console.warn(`Fallback to local package data for ID: ${id}`, e);
    const found = PACKAGES.find(p => p.id === id);
    if (!found) throw new Error(`Package not found: ${id}`);
    return found;
  }
}

export async function fetchDestinations(): Promise<Destination[]> {
  try {
    const res = await fetch(getApiUrl('/api/destinations/'));
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch (e) {
    console.warn('Fallback to local destinations data', e);
    return DESTINATIONS;
  }
}

export async function fetchOffers(): Promise<Offer[]> {
  try {
    const res = await fetch(getApiUrl('/api/offers/'));
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch (e) {
    console.warn('Fallback to local offers data', e);
    return OFFERS;
  }
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  try {
    const res = await fetch(getApiUrl('/api/testimonials/'));
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch (e) {
    console.warn('Fallback to local testimonials data', e);
    return TESTIMONIALS;
  }
}

export async function createBooking(bookingData: any): Promise<any> {
  const res = await fetch(getApiUrl('/api/bookings/'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData),
  });
  if (!res.ok) throw new Error('Failed to submit booking');
  return await res.json();
}

export async function createContactInquiry(inquiryData: any): Promise<any> {
  const res = await fetch(getApiUrl('/api/inquiries/'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inquiryData),
  });
  if (!res.ok) throw new Error('Failed to submit inquiry');
  return await res.json();
}

