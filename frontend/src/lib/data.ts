// data.ts — Wayfare package data and shared assets

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

export const PACKAGES: Package[] = [
  {
    id: 'rajasthan-royal',
    title: 'A Slow Pass Through Rajasthan',
    destination: 'Jaipur → Jodhpur → Udaipur',
    region: 'India',
    type: 'Cultural',
    duration: 9,
    nights: 8,
    rating: 4.9,
    reviews: 312,
    price: 2980,
    priceWas: 3480,
    featured: true,
    badge: 'Editor’s pick',
    blurb: 'Three palace cities, painted havelis and quiet desert mornings — a heritage route walked at a thoughtful pace.',
    img: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1400&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1477586957327-847a0f3f4f0d?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=900&auto=format&fit=crop',
    ],
    highlights: ['Heritage haveli stays', 'Private Amber Fort visit', 'Lake Pichola at sunset', 'Old-city food walk'],
  },
  {
    id: 'dubai-desert',
    title: 'Dubai, From Sand to Skyline',
    destination: 'Dubai, UAE',
    region: 'UAE',
    type: 'Luxury',
    duration: 6,
    nights: 5,
    rating: 4.8,
    reviews: 248,
    price: 3290,
    badge: 'Trending',
    blurb: 'A city of contrasts — Bedouin desert camps, gold-souk mornings and a corner table at the world’s tallest tower.',
    img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1400&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1546412414-e1885259563a?w=900&auto=format&fit=crop',
    ],
    highlights: ['Burj Khalifa private floor', 'Desert dune dinner', 'Old Dubai abra crossing'],
  },
  {
    id: 'kerala-backwaters',
    title: 'The Kerala Backwaters, On Water',
    destination: 'Alleppey & Kochi',
    region: 'India',
    type: 'Wellness',
    duration: 7,
    nights: 6,
    rating: 4.9,
    reviews: 187,
    price: 2140,
    blurb: 'Houseboat days through coconut canals, two ayurveda mornings and a Fort Kochi finish — soft, slow, southern.',
    img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1400&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1400&auto=format&fit=crop',
    ],
    highlights: ['Two-night houseboat', 'Ayurvedic retreat', 'Spice plantation walk'],
  },
  {
    id: 'abu-dhabi-quiet',
    title: 'Abu Dhabi — Mosque & Mangrove',
    destination: 'Abu Dhabi, UAE',
    region: 'UAE',
    type: 'Cultural',
    duration: 5,
    nights: 4,
    rating: 4.7,
    reviews: 142,
    price: 2680,
    badge: 'New',
    blurb: 'Sheikh Zayed at first light, Louvre Abu Dhabi after lunch, kayak the mangroves at dusk.',
    img: 'https://images.unsplash.com/photo-1583395145039-1c50b89def85?w=1400&auto=format&fit=crop',
    highlights: ['Sheikh Zayed dawn visit', 'Louvre Abu Dhabi private tour', 'Mangrove kayak'],
  },
  {
    id: 'himalaya-ladakh',
    title: 'High Roads of Ladakh',
    destination: 'Leh & the Nubra Valley',
    region: 'India',
    type: 'Adventure',
    duration: 10,
    nights: 9,
    rating: 4.8,
    reviews: 96,
    price: 3640,
    blurb: 'Monasteries above the cloud line, a night under stars at Pangong, and a slow descent through Nubra apricot orchards.',
    img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1400&auto=format&fit=crop',
    highlights: ['Hemis monastery', 'Pangong Lake camp', 'Nubra valley ride'],
  },
  {
    id: 'goa-coastal',
    title: 'Goa, North to South',
    destination: 'Assagao → Palolem',
    region: 'India',
    type: 'Culinary',
    duration: 6,
    nights: 5,
    rating: 4.7,
    reviews: 221,
    price: 1840,
    blurb: 'Portuguese-era villas, fish-curry lunches and quiet southern beaches — the Goa beyond the postcard.',
    img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1400&auto=format&fit=crop',
    highlights: ['Heritage villa stay', 'Fish market & cookery class', 'South-coast quiet beaches'],
  },
];

export const DESTINATIONS: Destination[] = [
  { name: 'Rajasthan',   count: 14, img: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&auto=format&fit=crop', tag: 'Cultural · India', size: 'lg' },
  { name: 'Dubai',       count: 11, img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&auto=format&fit=crop', tag: 'Luxury · UAE' },
  { name: 'Kerala',      count: 9,  img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=900&auto=format&fit=crop', tag: 'Wellness · India' },
  { name: 'Abu Dhabi',   count: 6,  img: 'https://images.unsplash.com/photo-1583395145039-1c50b89def85?w=900&auto=format&fit=crop', tag: 'Cultural · UAE' },
  { name: 'Ladakh',      count: 5,  img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=900&auto=format&fit=crop', tag: 'Adventure · India' },
];

export const OFFERS: Offer[] = [
  { id: 'monsoon', tag: 'Monsoon Sale', title: 'Up to 25% off Kerala & Goa', sub: 'Book by May 31 · Travel through Aug', code: 'MONSOON25', img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&auto=format&fit=crop', accent: '#1f3b30' },
  { id: 'gulf',    tag: 'Gulf Pairing', title: 'India + UAE — second city free', sub: 'Pair any India trip with 2 nights in Dubai or Abu Dhabi', code: 'GULFPAIR', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&auto=format&fit=crop', accent: '#c79a4a' },
  { id: 'family',  tag: 'Families', title: 'Kids stay & fly free', sub: 'On every Rajasthan & Dubai trip · Two children under 12', code: 'FAMILYWF', img: 'https://images.unsplash.com/photo-1583395145039-1c50b89def85?w=1200&auto=format&fit=crop', accent: '#1f3b30' },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: 'Wayfare took the guesswork out without taking the discovery out. Every handoff felt curated, and every quiet moment felt earned.',
    name: 'Mira Halvorsen',
    place: 'Booked: Rajasthan, Spring 2025',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop',
  },
  {
    quote: 'I’ve booked through five different agencies. None of them remembered I prefer trains over planes. Wayfare did, on the second trip.',
    name: 'Daniel Okafor',
    place: 'Booked: Dubai + Abu Dhabi',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop',
  },
  {
    quote: 'The itinerary read like an essay. The trip felt like one too.',
    name: 'Anya Reyes',
    place: 'Booked: Kerala, monsoon week',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop',
  },
];

export const ITINERARY_RAJASTHAN: ItineraryDay[] = [
  { title: 'Arrival in the Pink City', body: 'Greeted at Jaipur Airport, transferred to a heritage haveli in the old quarter. A welcome dinner of laal maas and a quiet courtyard evening.', activities: ['Private transfer', 'Heritage dinner'] },
  { title: 'Amber Fort, Privately', body: 'A sunrise approach to Amber before the crowds. Mid-morning at Anokhi block-print workshop. Afternoon free; optional walking tour of the Pink City bazaars.', activities: ['Fort visit', 'Block print'] },
  { title: 'On to Jodhpur', body: 'A scenic drive west. Check in to a riverside haveli below Mehrangarh. Sunset on the fort ramparts with a private guide and the city turning blue beneath you.', activities: ['Mehrangarh', 'Blue city walk'] },
  { title: 'Bishnoi Villages', body: 'A slow morning out into the desert — Bishnoi craft villages, a thali lunch with a local family, and a return through the Thar at golden hour.', activities: ['Village visit', 'Desert drive'] },
  { title: 'To the Lake, Udaipur', body: 'Onward to Udaipur. Lake Pichola at sunset by private boat, dinner over the water at a courtyard restaurant kept by friends.', activities: ['Boat ride', 'Lake dinner'] },
  { title: 'Markets & Miniature', body: 'A long morning in the old city — silver bazaar, a private session with a miniature painter, and a final walk through the City Palace courtyards.', activities: ['Market', 'Painter studio'] },
  { title: 'Departure', body: 'Late checkout, transfers arranged, and a parting box of mithai for the road.', activities: ['Departure assist'] },
];

export const BOOKINGS: Booking[] = [
  { id: 'WF-2841', name: 'Hannah Visser',    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop', pkg: 'A Slow Pass Through Rajasthan', dates: 'Apr 14 — Apr 22', total: 5960, status: 'confirmed' },
  { id: 'WF-2840', name: 'Marcus Lindqvist', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop', pkg: 'Dubai, From Sand to Skyline',    dates: 'Mar 02 — Mar 07', total: 6580, status: 'pending' },
  { id: 'WF-2839', name: 'Priya Raman',      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop', pkg: 'The Kerala Backwaters, On Water', dates: 'May 11 — May 17', total: 4280, status: 'confirmed' },
  { id: 'WF-2838', name: 'Theo Bergmann',    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=120&auto=format&fit=crop', pkg: 'High Roads of Ladakh',           dates: 'Jun 18 — Jun 27', total: 7280, status: 'confirmed' },
  { id: 'WF-2837', name: 'Lina Park',        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop', pkg: 'Abu Dhabi — Mosque & Mangrove',  dates: 'Mar 22 — Mar 26', total: 5360, status: 'cancelled' },
  { id: 'WF-2836', name: 'Owen Brookes',     avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&auto=format&fit=crop', pkg: 'Goa, North to South',            dates: 'Nov 04 — Nov 09', total: 3680, status: 'pending' },
];
