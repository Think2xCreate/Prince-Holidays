import { LOCAL_IMAGES } from './business';

export interface HangingPhoto {
  id: string;
  image: string;
  /** Handwritten caption printed under the photo. */
  caption: string;
  /** Alt text for accessibility. */
  alt: string;
  /** Small card rotation in degrees (clockwise positive). */
  rotation: number;
  /** Extra vertical drop in px below the rope anchor. */
  slack: number;
  /** Entrance animation delay (s). */
  delay: number;
  /** Swing cycle duration (s). */
  swingDuration: number;
  /** Swing cycle delay (s). */
  swingDelay: number;
  /** object-position so each photo's subject stays in frame. */
  objectPosition: string;
  /** Index within GALLERY_PHOTOS for the lightbox. */
  lightboxIndex: number;
}

/**
 * The eight hanging Polaroid cards, in the exact order of the reference
 * design. Every image reuses a genuine Prince Holidays photo already in the
 * project (see LOCAL_IMAGES in business.ts).
 */
export const HANGING_PHOTOS: HangingPhoto[] = [
  {
    id: 'our-bus',
    image: LOCAL_IMAGES.galleryRealBusFront,
    caption: 'Our Bus',
    alt: 'Prince Holidays bus with Black & White branding, front view',
    rotation: -4,
    slack: 2,
    delay: 0,
    swingDuration: 6.4,
    swingDelay: 0,
    objectPosition: 'center 42%',
    lightboxIndex: 0,
  },
  {
    id: 'park-visits',
    image: LOCAL_IMAGES.galleryRealWonderlaGroup,
    caption: 'Park Visits',
    alt: 'Travel group at a theme park entrance',
    rotation: 2.2,
    slack: 0,
    delay: 0.08,
    swingDuration: 7.2,
    swingDelay: 0.6,
    objectPosition: 'center 55%',
    lightboxIndex: 1,
  },
  {
    id: 'night-travels',
    image: LOCAL_IMAGES.galleryRealBusBlueNeon,
    caption: 'Night Travels',
    alt: 'Bus decorated with blue lights at night',
    rotation: -2.5,
    slack: 4,
    delay: 0.16,
    swingDuration: 5.8,
    swingDelay: 1.2,
    objectPosition: 'center 60%',
    lightboxIndex: 2,
  },
  {
    id: 'our-fleet',
    image: LOCAL_IMAGES.galleryRealSafariJeeps,
    caption: 'Our Fleet',
    alt: 'Fleet of vehicles lined up for a trip',
    rotation: 0.6,
    slack: 0,
    delay: 0.24,
    swingDuration: 6.8,
    swingDelay: 0.3,
    objectPosition: 'center 72%',
    lightboxIndex: 3,
  },
  {
    id: 'travel-vibes',
    image: LOCAL_IMAGES.galleryRealBusRgbLights,
    caption: 'Travel Vibes',
    alt: 'Brightly illuminated travel bus at night',
    rotation: -2,
    slack: 3,
    delay: 0.32,
    swingDuration: 7.6,
    swingDelay: 0.9,
    objectPosition: 'center 62%',
    lightboxIndex: 4,
  },
  {
    id: 'travel-groups',
    image: LOCAL_IMAGES.galleryRealTeamBusHills,
    caption: 'Travel Groups',
    alt: 'Travel group outing with the bus in the hills',
    rotation: 1.8,
    slack: 0,
    delay: 0.4,
    swingDuration: 6.2,
    swingDelay: 0.4,
    objectPosition: 'center 42%',
    lightboxIndex: 5,
  },
  {
    id: 'night-view',
    image: LOCAL_IMAGES.galleryRealBusNight,
    caption: 'Night View',
    alt: 'Colorful lights of the bus at night',
    rotation: -1.6,
    slack: 5,
    delay: 0.48,
    swingDuration: 7,
    swingDelay: 1.5,
    objectPosition: 'center 55%',
    lightboxIndex: 6,
  },
  {
    id: 'good-times',
    image: LOCAL_IMAGES.galleryRealGroupPhoto,
    caption: 'Good Times',
    alt: 'Group photograph from a trip',
    rotation: 2.4,
    slack: 2,
    delay: 0.56,
    swingDuration: 5.6,
    swingDelay: 0.8,
    objectPosition: 'center 58%',
    lightboxIndex: 7,
  },
];
