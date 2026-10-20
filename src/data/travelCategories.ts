import { LOCAL_IMAGES } from './business';

export interface TravelCategoryItem {
  id: string;
  index?: string;
  title: string;
  subtitle: string;
  description: string;
  inclusions: string[];
  actionLabel: string;
  image: string;
  imageCaption: string;
}

/**
 * Travel experience categories as specified in Section 6 — Our Travel Experiences.
 */
export const TRAVEL_CATEGORIES: TravelCategoryItem[] = [
  {
    id: 'family-holidays',
    title: 'Family Holidays',
    subtitle: 'Happy Trips for All Ages',
    description:
      'Family trips for parents, kids and elders together. We plan the bus, hotel, food and sightseeing. You just enjoy.',
    inclusions: ['Bus for the group', 'Hotel & food', 'Sightseeing tickets'],
    actionLabel: 'Plan a Family Holiday',
    image: LOCAL_IMAGES.familyHolidayBeach,
    imageCaption: 'Family fun by the sea',
  },
  {
    id: 'corporate-tours',
    title: 'Corporate Tours',
    subtitle: 'Fun Outings for Your Team',
    description:
      'Team trips without any stress. We plan the bus, stay, food and games. You enjoy with your team.',
    inclusions: ['Bus for the team', 'Stay & food', 'Full trip plan'],
    actionLabel: 'Plan a Corporate Outing',
    image: LOCAL_IMAGES.corporateToursSnow,
    imageCaption: 'Easy team outings',
  },
  {
    id: 'school-educational-trips',
    title: 'School Educational Trips',
    subtitle: 'Learning Outside the Classroom',
    description:
      'Safe school trips to museums, science centres, parks and historic places. Food, tickets and guides included.',
    inclusions: ['Safe buses', 'Tickets & guides', 'Food on time'],
    actionLabel: 'Arrange a School Tour',
    image: LOCAL_IMAGES.schoolEducationalPark,
    imageCaption: 'School trips full of learning',
  },
  {
    id: 'college-industrial-visits',
    title: 'College Industrial Visits',
    subtitle: 'College Trips & Factory Visits',
    description:
      'College industrial visits of 2–3 days. We plan the bus, stay, food, sightseeing and campfire where possible.',
    inclusions: ['Tourist bus', 'Stay & food', 'Campfire if possible'],
    actionLabel: 'Plan an Industrial Visit',
    image: LOCAL_IMAGES.collegeIndustrialTrip,
    imageCaption: 'College trips with friends',
  },
  {
    id: 'domestic-holidays',
    title: 'Domestic Holidays',
    subtitle: 'Hills, Backwaters & Old Cities',
    description:
      'See the best of India — hill stations, backwaters, beaches and wildlife parks. We plan everything from start to end.',
    inclusions: ['Your own route plan', 'Sightseeing & safari', 'Stay & travel'],
    actionLabel: 'Explore Domestic Packages',
    image: LOCAL_IMAGES.domesticHolidays,
    imageCaption: 'Group photo at Coorg',
  },
];

export interface ManagementStepItem {
  number?: string;
  title: string;
  category: string;
  description: string;
}

/**
 * Complete Travel Management items as specified in Section 7.
 */
export const TRAVEL_MANAGEMENT_STEPS: ManagementStepItem[] = [
  {
    title: 'Transportation',
    category: 'BUS',
    description:
      'Tourist bus to suit your group size. Everyone travels together, in comfort.',
  },
  {
    title: 'Accommodation',
    category: 'STAY',
    description:
      'Good hotels booked in advance. Clean, safe and near your sightseeing spots.',
  },
  {
    title: 'Meals',
    category: 'FOOD',
    description:
      'Veg and non-veg food on time, on the road and at your stay. Tell us what you eat.',
  },
  {
    title: 'Sightseeing',
    category: 'SIGHTSEEING',
    description:
      'See all main places without rushing. Enough time at each spot for photos and rest.',
  },
  {
    title: 'Entry Tickets',
    category: 'TICKETS',
    description:
      'Entry tickets booked before you go. Less waiting in queues for your group.',
  },
  {
    title: 'Guides',
    category: 'GUIDES',
    description:
      'Local guides who explain each place in simple words. Good for students too.',
  },
  {
    title: 'Wildlife Safaris',
    category: 'SAFARI',
    description:
      'Wildlife safari trips in forest areas on your route, where safaris run.',
  },
  {
    title: 'Campfire Arrangements',
    category: 'CAMPFIRE',
    description:
      'Evening campfire with songs and fun, where the stay allows it.',
  },
  {
    title: 'Full Trip Plan',
    category: 'START TO END',
    description:
      'Day-by-day plan for your full trip. We stay with you from start to safe return.',
  },
];

export interface GalleryPhotoItem {
  id: string;
  code: string;
  title: string;
  category: string;
  aspect: 'wide' | 'tall' | 'square';
  image: string;
  isSampleAsset: boolean;
}

export const GALLERY_PHOTOS: GalleryPhotoItem[] = [
  {
    id: 'gallery-real-bus-front',
    code: 'TOURIST BUS',
    title: 'Prince Holidays Bus',
    category: 'Tour Buses',
    aspect: 'tall',
    image: LOCAL_IMAGES.galleryRealBusFront,
    isSampleAsset: false,
  },
  {
    id: 'gallery-real-wonderla-group',
    code: 'COLLEGE & SCHOOL TRIP',
    title: 'Fun Park Group Trip',
    category: 'School & Team Trips',
    aspect: 'wide',
    image: LOCAL_IMAGES.galleryRealWonderlaGroup,
    isSampleAsset: false,
  },
  {
    id: 'gallery-real-bus-blue-neon',
    code: 'NIGHT FLEET',
    title: 'Blue Light Bus at Night',
    category: 'Tour Buses',
    aspect: 'tall',
    image: LOCAL_IMAGES.galleryRealBusBlueNeon,
    isSampleAsset: false,
  },
  {
    id: 'gallery-real-safari-jeeps',
    code: 'WILDLIFE SAFARI',
    title: 'Jeeps for Wildlife Ride',
    category: 'Nature & Parks',
    aspect: 'tall',
    image: LOCAL_IMAGES.galleryRealSafariJeeps,
    isSampleAsset: false,
  },
  {
    id: 'gallery-real-bus-rgb-lights',
    code: 'DJ & PARTY COACH',
    title: 'Color Light Bus at Night',
    category: 'Tour Buses',
    aspect: 'wide',
    image: LOCAL_IMAGES.galleryRealBusRgbLights,
    isSampleAsset: false,
  },
  {
    id: 'gallery-real-team-bus-hills',
    code: 'GROUP TOUR',
    title: 'Group Trip in Tea Hills',
    category: 'Group & Family Trips',
    aspect: 'tall',
    image: LOCAL_IMAGES.galleryRealTeamBusHills,
    isSampleAsset: false,
  },
  {
    id: 'gallery-real-bus-night',
    code: 'NIGHT DEPARTURE',
    title: 'Bus Ready for Night Trip',
    category: 'Group Travel',
    aspect: 'tall',
    image: LOCAL_IMAGES.galleryRealBusNight,
    isSampleAsset: false,
  },
  {
    id: 'gallery-real-group-photo',
    code: 'SHARED MOMENTS',
    title: 'School Group at Forest',
    category: 'School & College Trips',
    aspect: 'wide',
    image: LOCAL_IMAGES.galleryRealGroupPhoto,
    isSampleAsset: false,
  },
];

