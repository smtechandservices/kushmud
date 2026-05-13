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
