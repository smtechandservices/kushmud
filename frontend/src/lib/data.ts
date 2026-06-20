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

export interface Faq {
  q: string;
  a: string;
}

export interface Story {
  title: string;
  excerpt: string;
  date: string;
  author: string;
  img: string;
  tag: string;
}

export interface PackageFilters {
  types: string[];
  regions: { name: string; count: number }[];
  durations: string[];
  months: string[];
  sortOptions: { label: string; value: string }[];
}

export async function fetchPackages(): Promise<Package[]> {
  const res = await fetch('/data/packages.json');
  if (!res.ok) throw new Error('Failed to load packages');
  return res.json();
}

export async function fetchPackageById(id: string): Promise<Package> {
  const packages = await fetchPackages();
  const found = packages.find(p => p.id === id);
  if (!found) throw new Error(`Package not found: ${id}`);
  return found;
}

export async function fetchDestinations(): Promise<Destination[]> {
  const res = await fetch('/data/destinations.json');
  if (!res.ok) throw new Error('Failed to load destinations');
  return res.json();
}

export async function fetchOffers(): Promise<Offer[]> {
  const res = await fetch('/data/offers.json');
  if (!res.ok) throw new Error('Failed to load offers');
  return res.json();
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  const res = await fetch('/data/testimonials.json');
  if (!res.ok) throw new Error('Failed to load testimonials');
  return res.json();
}

export async function fetchItinerary(): Promise<ItineraryDay[]> {
  const res = await fetch('/data/itinerary-rajasthan.json');
  if (!res.ok) throw new Error('Failed to load itinerary');
  return res.json();
}

export async function fetchFaqs(): Promise<Faq[]> {
  const res = await fetch('/data/faqs.json');
  if (!res.ok) throw new Error('Failed to load faqs');
  return res.json();
}

export async function fetchStories(): Promise<Story[]> {
  const res = await fetch('/data/stories.json');
  if (!res.ok) throw new Error('Failed to load stories');
  return res.json();
}

export async function fetchPackageFilters(): Promise<PackageFilters> {
  const res = await fetch('/data/packages-filters.json');
  if (!res.ok) throw new Error('Failed to load filters');
  return res.json();
}
