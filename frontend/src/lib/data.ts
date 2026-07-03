// data.ts — Wayfare API client and shared types

export interface ItineraryDay {
  title: string;
  body: string;
  activities: string[];
}

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
  itinerary?: ItineraryDay[];
  group_size?: string | null;
  best_months?: string | null;
}

export interface PackageReview {
  id: number;
  package: string;
  name: string;
  quote: string;
  rating: number;
  created_at: string;
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
  email?: string | null;
  phone?: string | null;
  pax?: number;
  remarks?: string | null;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category?: string | null;
  order: number;
}

export interface Story {
  id: number;
  title: string;
  excerpt: string;
  body?: string | null;
  img: string;
  author?: string | null;
  tag?: string | null;
  published_at: string;
}

export interface JobOpening {
  id: number;
  title: string;
  location: string;
  type: string;
  order: number;
}

export interface TrendingPackage {
  id: string;
  title: string;
  img: string;
  price: number;
  region: string;
  type: string;
  duration: number;
}

export interface SiteStats {
  active_trips: number;
  cities_covered: number;
  avg_rating: number;
  trending: TrendingPackage[];
  trending_basis: 'inquiries' | 'rating';
}

export interface Customer {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
}

export const getApiUrl = (path: string) => {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  return `${base}${path}`;
};

const CUSTOMER_TOKEN_KEY = 'customer_access_token';
const CUSTOMER_REFRESH_KEY = 'customer_refresh_token';

function storeCustomerTokens(data: { access: string; refresh?: string }) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CUSTOMER_TOKEN_KEY, data.access);
  if (data.refresh) localStorage.setItem(CUSTOMER_REFRESH_KEY, data.refresh);
}

export function getCustomerAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem(CUSTOMER_TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function isCustomerLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem(CUSTOMER_TOKEN_KEY);
}

export function customerLogout() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CUSTOMER_TOKEN_KEY);
  localStorage.removeItem(CUSTOMER_REFRESH_KEY);
}

export async function customerSignup(data: { name: string; email?: string; phone?: string; password: string }): Promise<Customer> {
  const res = await fetch(getApiUrl('/api/customers/signup/'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const body = await res.json();
  if (!res.ok) {
    const message = Object.values(body).flat().join(' ') || 'Failed to sign up.';
    throw new Error(message);
  }
  storeCustomerTokens(body);
  return body.customer;
}

export async function customerLogin(identifier: string, password: string): Promise<Customer> {
  const res = await fetch(getApiUrl('/api/customers/login/'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.detail || 'Invalid credentials.');
  storeCustomerTokens(body);
  return body.customer;
}

export async function fetchCustomerMe(): Promise<Customer> {
  const res = await fetch(getApiUrl('/api/customers/me/'), {
    headers: getCustomerAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch profile');
  return await res.json();
}

export async function fetchPackages(): Promise<Package[]> {
  const res = await fetch(getApiUrl('/api/packages/'));
  if (!res.ok) throw new Error('Failed to fetch packages');
  return await res.json();
}

export async function fetchPackageById(id: string): Promise<Package> {
  const res = await fetch(getApiUrl(`/api/packages/${id}/`));
  if (!res.ok) throw new Error(`Failed to fetch package: ${id}`);
  return await res.json();
}

export async function fetchPackageReviews(packageId: string): Promise<PackageReview[]> {
  const res = await fetch(getApiUrl(`/api/package-reviews/?package=${encodeURIComponent(packageId)}`));
  if (!res.ok) throw new Error('Failed to fetch reviews');
  return await res.json();
}

export async function fetchDestinations(): Promise<Destination[]> {
  const res = await fetch(getApiUrl('/api/destinations/'));
  if (!res.ok) throw new Error('Failed to fetch destinations');
  return await res.json();
}

export async function fetchOffers(): Promise<Offer[]> {
  const res = await fetch(getApiUrl('/api/offers/'));
  if (!res.ok) throw new Error('Failed to fetch offers');
  return await res.json();
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  const res = await fetch(getApiUrl('/api/testimonials/'));
  if (!res.ok) throw new Error('Failed to fetch testimonials');
  return await res.json();
}

export async function fetchFaqs(): Promise<FAQ[]> {
  const res = await fetch(getApiUrl('/api/faqs/'));
  if (!res.ok) throw new Error('Failed to fetch FAQs');
  return await res.json();
}

export async function fetchStories(): Promise<Story[]> {
  const res = await fetch(getApiUrl('/api/stories/'));
  if (!res.ok) throw new Error('Failed to fetch stories');
  return await res.json();
}

export async function fetchStoryById(id: number): Promise<Story> {
  const res = await fetch(getApiUrl(`/api/stories/${id}/`));
  if (!res.ok) throw new Error(`Failed to fetch story: ${id}`);
  return await res.json();
}

export async function fetchJobOpenings(): Promise<JobOpening[]> {
  const res = await fetch(getApiUrl('/api/job-openings/'));
  if (!res.ok) throw new Error('Failed to fetch job openings');
  return await res.json();
}

export async function fetchSiteStats(): Promise<SiteStats> {
  const res = await fetch(getApiUrl('/api/site-stats/'));
  if (!res.ok) throw new Error('Failed to fetch site stats');
  return await res.json();
}

export async function subscribeToNewsletter(email: string): Promise<void> {
  const res = await fetch(getApiUrl('/api/newsletter-subscribers/'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error('Failed to subscribe');
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

