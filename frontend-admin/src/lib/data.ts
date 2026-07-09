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

export interface Region {
  name: string;
}

export interface Destination {
  name: string;
  region: string;
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
  created_at?: string;
  destination?: string | null;
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
  status: 'pending' | 'approved' | 'rejected';
  submitted_by?: string | null;
}

export interface JobOpening {
  id: number;
  title: string;
  location: string;
  type: string;
  order: number;
}

export interface NewsletterSubscriber {
  id: number;
  email: string;
  subscribed_at: string;
}

export interface Flyer {
  id: number;
  img: string;
  is_visible: boolean;
  created_at: string;
}

export type SiteEffect = 'none' | 'snow' | 'rain' | 'autumn' | 'independence_day';

export interface SiteEffectSetting {
  active_effect: SiteEffect;
  updated_at: string;
}

export interface AdminUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  is_superuser?: boolean;
  is_active?: boolean;
}

export interface B2BInquiry {
  id: number;
  organization: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  inquiry_type: string;
  group_size?: string | null;
  requested_margin_percent?: string | null;
  message: string;
  status: 'new' | 'contacted' | 'closed';
  created_at: string;
}

export interface RegisteredCustomer {
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

export async function fetchAnalytics(): Promise<any> {
  const res = await authFetch(getApiUrl('/api/analytics/'));
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return await res.json();
}

export async function fetchMe(): Promise<AdminUser> {
  const res = await authFetch(getApiUrl('/api/me/'));
  if (!res.ok) throw new Error('Failed to fetch current user');
  return await res.json();
}

export async function updateMe(data: Partial<Pick<AdminUser, 'first_name' | 'last_name' | 'email'>>): Promise<AdminUser> {
  const res = await authFetch(getApiUrl('/api/me/'), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return await res.json();
}

export async function changePassword(oldPassword: string, newPassword: string): Promise<void> {
  const res = await authFetch(getApiUrl('/api/me/password/'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || 'Failed to change password');
  }
}

export async function fetchPackages(): Promise<Package[]> {
  const res = await authFetch(getApiUrl('/api/packages/'));
  if (!res.ok) throw new Error('Failed to fetch packages');
  return await res.json();
}

export async function fetchBookings(): Promise<Booking[]> {
  const res = await authFetch(getApiUrl('/api/bookings/'));
  if (!res.ok) throw new Error('Failed to fetch bookings');
  return await res.json();
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

export async function updatePackage(id: string, packageData: Partial<Package>): Promise<Package> {
  const res = await authFetch(getApiUrl(`/api/packages/${id}/`), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(packageData),
  });
  if (!res.ok) throw new Error('Failed to update package');
  return await res.json();
}

export async function deletePackage(id: string): Promise<void> {
  const res = await authFetch(getApiUrl(`/api/packages/${id}/`), {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete package');
}

// ── Package Reviews ──
export async function fetchPackageReviews(packageId: string): Promise<PackageReview[]> {
  const res = await authFetch(getApiUrl(`/api/package-reviews/?package=${encodeURIComponent(packageId)}`));
  if (!res.ok) throw new Error('Failed to fetch reviews');
  return await res.json();
}

export async function createPackageReview(data: { package: string; name: string; quote: string; rating: number }): Promise<PackageReview> {
  const res = await authFetch(getApiUrl('/api/package-reviews/'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create review');
  return await res.json();
}

export async function deletePackageReview(id: number): Promise<void> {
  const res = await authFetch(getApiUrl(`/api/package-reviews/${id}/`), {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete review');
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
  const res = await authFetch(getApiUrl('/api/offers/'));
  if (!res.ok) throw new Error('Failed to fetch offers');
  return await res.json();
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

export async function updateOffer(id: string, offerData: Partial<Offer>): Promise<Offer> {
  const res = await authFetch(getApiUrl(`/api/offers/${id}/`), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(offerData),
  });
  if (!res.ok) throw new Error('Failed to update offer');
  return await res.json();
}

export async function deleteOffer(id: string): Promise<void> {
  const res = await authFetch(getApiUrl(`/api/offers/${id}/`), {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete offer');
}

// ── Flyers ──
export async function fetchFlyers(): Promise<Flyer[]> {
  const res = await authFetch(getApiUrl('/api/flyers/'));
  if (!res.ok) throw new Error('Failed to fetch flyers');
  return await res.json();
}

export async function createFlyer(data: { img: string }): Promise<Flyer> {
  const res = await authFetch(getApiUrl('/api/flyers/'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create flyer');
  return await res.json();
}

export async function updateFlyer(id: number, data: Partial<Pick<Flyer, 'img' | 'is_visible'>>): Promise<Flyer> {
  const res = await authFetch(getApiUrl(`/api/flyers/${id}/`), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update flyer');
  return await res.json();
}

export async function deleteFlyer(id: number): Promise<void> {
  const res = await authFetch(getApiUrl(`/api/flyers/${id}/`), {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete flyer');
}

export async function fetchSiteEffect(): Promise<SiteEffectSetting> {
  const res = await authFetch(getApiUrl('/api/site-effect/'));
  if (!res.ok) throw new Error('Failed to fetch site effect');
  return await res.json();
}

export async function updateSiteEffect(effect: SiteEffect): Promise<SiteEffectSetting> {
  const res = await authFetch(getApiUrl('/api/site-effect/'), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ active_effect: effect }),
  });
  if (!res.ok) throw new Error('Failed to update site effect');
  return await res.json();
}

// ── Regions ──
export async function fetchRegions(): Promise<Region[]> {
  const res = await authFetch(getApiUrl('/api/regions/'));
  if (!res.ok) throw new Error('Failed to fetch regions');
  return await res.json();
}

export async function createRegion(data: { name: string }): Promise<Region> {
  const res = await authFetch(getApiUrl('/api/regions/'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create region');
  return await res.json();
}

export async function deleteRegion(name: string): Promise<void> {
  const res = await authFetch(getApiUrl(`/api/regions/${encodeURIComponent(name)}/`), {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete region');
}

// ── Destinations ──
export async function fetchDestinations(): Promise<Destination[]> {
  const res = await authFetch(getApiUrl('/api/destinations/'));
  if (!res.ok) throw new Error('Failed to fetch destinations');
  return await res.json();
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

export async function updateDestination(name: string, data: any): Promise<Destination> {
  const res = await authFetch(getApiUrl(`/api/destinations/${encodeURIComponent(name)}/`), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update destination');
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

// ── B2B Inquiries ──
export async function fetchB2BInquiries(): Promise<B2BInquiry[]> {
  const res = await authFetch(getApiUrl('/api/b2b-inquiries/'));
  if (!res.ok) throw new Error('Failed to fetch B2B inquiries');
  return await res.json();
}

export async function updateB2BInquiryStatus(id: number, status: string): Promise<B2BInquiry> {
  const res = await authFetch(getApiUrl(`/api/b2b-inquiries/${id}/`), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update inquiry status');
  return await res.json();
}

// ── Testimonials ──
export async function fetchTestimonials(): Promise<Testimonial[]> {
  const res = await authFetch(getApiUrl('/api/testimonials/'));
  if (!res.ok) throw new Error('Failed to fetch testimonials');
  return await res.json();
}

export async function createTestimonial(data: any): Promise<Testimonial> {
  const res = await authFetch(getApiUrl('/api/testimonials/'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create testimonial');
  return await res.json();
}

export async function deleteTestimonial(id: number): Promise<void> {
  const res = await authFetch(getApiUrl(`/api/testimonials/${id}/`), {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete testimonial');
}

// ── FAQs ──
export async function fetchFaqs(): Promise<FAQ[]> {
  const res = await authFetch(getApiUrl('/api/faqs/'));
  if (!res.ok) throw new Error('Failed to fetch FAQs');
  return await res.json();
}

export async function createFaq(data: any): Promise<FAQ> {
  const res = await authFetch(getApiUrl('/api/faqs/'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create FAQ');
  return await res.json();
}

export async function updateFaq(id: number, data: Partial<FAQ>): Promise<FAQ> {
  const res = await authFetch(getApiUrl(`/api/faqs/${id}/`), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update FAQ');
  return await res.json();
}

export async function deleteFaq(id: number): Promise<void> {
  const res = await authFetch(getApiUrl(`/api/faqs/${id}/`), {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete FAQ');
}

// ── Job Openings ──
export async function fetchJobOpenings(): Promise<JobOpening[]> {
  const res = await authFetch(getApiUrl('/api/job-openings/'));
  if (!res.ok) throw new Error('Failed to fetch job openings');
  return await res.json();
}

export async function createJobOpening(data: any): Promise<JobOpening> {
  const res = await authFetch(getApiUrl('/api/job-openings/'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create job opening');
  return await res.json();
}

export async function updateJobOpening(id: number, data: Partial<JobOpening>): Promise<JobOpening> {
  const res = await authFetch(getApiUrl(`/api/job-openings/${id}/`), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update job opening');
  return await res.json();
}

export async function deleteJobOpening(id: number): Promise<void> {
  const res = await authFetch(getApiUrl(`/api/job-openings/${id}/`), {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete job opening');
}

// ── Stories ──
export async function fetchStories(): Promise<Story[]> {
  const res = await authFetch(getApiUrl('/api/stories/'));
  if (!res.ok) throw new Error('Failed to fetch stories');
  return await res.json();
}

export async function createStory(data: any): Promise<Story> {
  const res = await authFetch(getApiUrl('/api/stories/'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create story');
  return await res.json();
}

export async function updateStory(id: number, data: Partial<Story>): Promise<Story> {
  const res = await authFetch(getApiUrl(`/api/stories/${id}/`), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update story');
  return await res.json();
}

export async function deleteStory(id: number): Promise<void> {
  const res = await authFetch(getApiUrl(`/api/stories/${id}/`), {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete story');
}

// ── Newsletter Subscribers ──
export async function fetchNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
  const res = await authFetch(getApiUrl('/api/newsletter-subscribers/'));
  if (!res.ok) throw new Error('Failed to fetch newsletter subscribers');
  return await res.json();
}

export async function deleteNewsletterSubscriber(id: number): Promise<void> {
  const res = await authFetch(getApiUrl(`/api/newsletter-subscribers/${id}/`), {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete subscriber');
}

// ── Registered Customer Accounts ──
export async function fetchRegisteredCustomers(): Promise<RegisteredCustomer[]> {
  const res = await authFetch(getApiUrl('/api/customers/'));
  if (!res.ok) throw new Error('Failed to fetch customers');
  return await res.json();
}

export async function updateRegisteredCustomer(id: number, data: Partial<Pick<RegisteredCustomer, 'name' | 'email' | 'phone' | 'is_active'>>): Promise<RegisteredCustomer> {
  const res = await authFetch(getApiUrl(`/api/customers/${id}/`), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update customer');
  return await res.json();
}

export async function deleteRegisteredCustomer(id: number): Promise<void> {
  const res = await authFetch(getApiUrl(`/api/customers/${id}/`), {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete customer');
}

// ── Admin Accounts (superuser-only) ──
async function throwApiError(res: Response, fallback: string): Promise<never> {
  const data = await res.json().catch(() => ({} as Record<string, unknown>));
  const detail = typeof data.detail === 'string'
    ? data.detail
    : Object.values(data).flat().filter(v => typeof v === 'string').join(' ');
  throw new Error(detail || fallback);
}

export async function fetchAdmins(): Promise<AdminUser[]> {
  const res = await authFetch(getApiUrl('/api/admins/'));
  if (!res.ok) await throwApiError(res, 'Failed to fetch admins');
  return await res.json();
}

export async function createAdmin(data: {
  username: string;
  password: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  is_superuser?: boolean;
}): Promise<AdminUser> {
  const res = await authFetch(getApiUrl('/api/admins/'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) await throwApiError(res, 'Failed to create admin');
  return await res.json();
}

export async function updateAdmin(
  id: number,
  data: Partial<Pick<AdminUser, 'first_name' | 'last_name' | 'email' | 'is_superuser' | 'is_active'>> & { password?: string }
): Promise<AdminUser> {
  const res = await authFetch(getApiUrl(`/api/admins/${id}/`), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) await throwApiError(res, 'Failed to update admin');
  return await res.json();
}

export async function deleteAdmin(id: number): Promise<void> {
  const res = await authFetch(getApiUrl(`/api/admins/${id}/`), {
    method: 'DELETE',
  });
  if (!res.ok) await throwApiError(res, 'Failed to delete admin');
}
