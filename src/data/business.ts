/** Image paths — all assets served from /public/images/ */
const heroCoachImg = '/images/prince_luxury_tourist_bus_1791964067427.jpg';
const altCoachImg = '/images/hero_luxury_tourist_coach_1791958694871.jpg';
const munnarImg = '/images/scenic_munnar_tea_hills_1791958694088.jpg';
const ootyImg = '/images/ooty_nilgiri_hills_1791958694025.jpg';
const keralaBackwatersImg = '/images/kerala_backwaters_1791958695061.jpg';
const kodaikanalImg = '/images/kodaikanal_hills.jpg';
const coorgImg = '/images/coorg_coffee_hills.jpg';
const mysuruImg = '/images/mysore_palace_heritage.jpg';
const chennaiImg = '/images/chennai_coastal_beach.jpg';
const customBespokeImg = '/images/custom_bespoke_travel.jpg';
const familyHolidayImg = '/images/family_holiday_tour.jpg';
const familyHolidayBeachImg = '/images/family_holiday_beach.jpg';
const corporateToursImg = '/images/corporate_tours.jpg';
const corporateToursSnowImg = '/images/corporate_tours_snow.jpg';
const schoolEducationalImg = '/images/school_educational.jpg';
const schoolEducationalParkImg = '/images/school_educational_park.jpg';
const collegeIndustrialImg = '/images/college_industrial.jpg';
const collegeIndustrialTripImg = '/images/college_industrial_trip.jpg';
const domesticHolidaysImg = '/images/domestic_holidays_coorg_group.png';
const featuredJourneyImg = '/images/featured_south_india.jpg';
const luxuryBusJourneyImg = '/images/luxury_bus_journey.jpg';
const groupTravelImg = '/images/group_tour_travelers_1791958704908.jpg';
const galleryCampfireImg = '/images/gallery_campfire.jpg';
const gallerySafariImg = '/images/gallery_safari.jpg';
const galleryBusInteriorImg = '/images/gallery_bus_interior.jpg';
const gallerySunriseImg = '/images/gallery_sunrise.jpg';
const journeyScenicRoadImg = '/images/journey_scenic_road.jpg';
const logoImg = '/images/prince-holidays-logo.png';
const galleryRealBusFrontImg = '/images/gallery_real_bus_front.jpg';
const galleryRealSafariJeepsImg = '/images/gallery_real_safari_jeeps.png';
const galleryRealBusNightImg = '/images/gallery_real_bus_night.png';
const galleryRealGroupPhotoImg = '/images/gallery_real_group_photo.png';
const galleryRealTeamBusHillsImg = '/images/gallery_real_team_bus_hills.jpg';
const galleryRealWonderlaGroupImg = '/images/gallery_real_wonderla_group.png';
const galleryRealBusBlueNeonImg = '/images/gallery_real_bus_blue_neon.png';
const galleryRealBusRgbLightsImg = '/images/gallery_real_bus_rgb_lights.png';
const domesticHolidaysCoorgGroupImg = '/images/domestic_holidays_coorg_group.png';

/**
 * Central Business Configuration for Prince Holidays
 */
export const BUSINESS_CONFIG = {
  name: 'Prince Holidays',
  wordmark: 'PRINCE HOLIDAYS',
  tagline: 'Your Journey, Our Responsibility.',
  phone: '9715057769',
  phoneFormatted: '+91 97150 57769',
  countryCode: '91',
  whatsappNumber: '919715057769',
  whatsappBaseUrl: 'https://wa.me/919715057769',
  instagramHandle: '@prince_holidays',
  instagramUrl: 'https://instagram.com/prince_holidays',
  youtubeUrl: 'https://youtube.com/@princetravelhub?si=o1tp_fVTRSx2Qwoe',
  logo: logoImg,
  services: [
    'Family holidays',
    'Office team outings',
    'School trips',
    'College industrial visits',
    'India tour packages',
    'Tourist bus',
    'Hotel stay and food',
    'Sightseeing and entry tickets',
    'Tour guides and wildlife safari',
    'Campfire where possible',
    'Full trip plan for groups',
  ],
} as const;

export const VIDEO_ASSETS = {
  hero: {
    id: 'hero-bus-video',
    videoSrc: '/videos/prince-holidays-hero.mp4',
    posterSrc: '/images/prince-holidays-hero-poster.webp',
    fallbackImg: heroCoachImg,
    alt: 'Premium tourist bus travelling along a scenic mountain road with misty green hills and morning sunlight',
  },
  scenicJourney: {
    id: 'scenic-journey-video',
    videoSrc: '/videos/scenic-bus-journey.mp4',
    posterSrc: '/images/scenic-bus-journey-poster.webp',
    fallbackImg: munnarImg,
    alt: 'Tourist bus moving through a lush scenic mountain landscape',
  },
  closing: {
    id: 'closing-bus-video',
    videoSrc: '/videos/prince-holidays-closing.mp4',
    posterSrc: '/images/cta_mountain_road.jpg',
    fallbackImg: altCoachImg,
    alt: 'Aerial view of a winding mountain road cutting through misty green hills at dawn',
  },
} as const;

export const LOCAL_IMAGES = {
  heroCoach: heroCoachImg,
  altCoach: altCoachImg,
  munnar: munnarImg,
  ooty: ootyImg,
  keralaBackwaters: keralaBackwatersImg,
  kodaikanal: kodaikanalImg,
  coorg: coorgImg,
  mysuru: mysuruImg,
  chennai: chennaiImg,
  customBespoke: customBespokeImg,
  familyHoliday: familyHolidayImg,
  familyHolidayBeach: familyHolidayBeachImg,
  corporateTours: corporateToursImg,
  corporateToursSnow: corporateToursSnowImg,
  schoolEducational: schoolEducationalImg,
  schoolEducationalPark: schoolEducationalParkImg,
  collegeIndustrial: collegeIndustrialImg,
  collegeIndustrialTrip: collegeIndustrialTripImg,
  domesticHolidays: domesticHolidaysImg,
  domesticHolidaysCoorgGroup: domesticHolidaysCoorgGroupImg,
  featuredJourney: featuredJourneyImg,
  luxuryBusJourney: luxuryBusJourneyImg,
  groupTravel: groupTravelImg,
  galleryCampfire: galleryCampfireImg,
  gallerySafari: gallerySafariImg,
  galleryBusInterior: galleryBusInteriorImg,
  gallerySunrise: gallerySunriseImg,
  journeyScenicRoad: journeyScenicRoadImg,
  galleryRealBusFront: galleryRealBusFrontImg,
  galleryRealSafariJeeps: galleryRealSafariJeepsImg,
  galleryRealBusNight: galleryRealBusNightImg,
  galleryRealGroupPhoto: galleryRealGroupPhotoImg,
  galleryRealTeamBusHills: galleryRealTeamBusHillsImg,
  galleryRealWonderlaGroup: galleryRealWonderlaGroupImg,
  galleryRealBusBlueNeon: galleryRealBusBlueNeonImg,
  galleryRealBusRgbLights: galleryRealBusRgbLightsImg,
  logo: logoImg,
} as const;

export function buildWhatsAppUrl(message: string): string {
  return `${BUSINESS_CONFIG.whatsappBaseUrl}?text=${encodeURIComponent(message)}`;
}
