import { LOCAL_IMAGES } from './business';

export interface DestinationItem {
  id: string;
  code: string;
  name: string;
  region: string;
  landscapeLabel: string;
  description: string;
  highlights: string[];
  image: string;
  coordinatesLabel: string;
}

/**
 * Initial destinations as specified in Section 5 — Destination Board.
 * Note: Contains no invented travel schedules, departure dates, or package prices.
 */
export const DESTINATIONS: DestinationItem[] = [
  {
    id: 'ooty',
    code: 'OTY',
    name: 'Ooty',
    region: 'Nilgiri Hills',
    landscapeLabel: 'Cool Hills & Tea Gardens',
    description:
      'Mountain roads, tea gardens, lake views and cool weather. A favourite trip for families and college groups from Tamil Nadu.',
    highlights: ['Mountain Views', 'Botanical Garden', 'Boat Lake', 'Tea Estate Walk'],
    image: LOCAL_IMAGES.ooty,
    coordinatesLabel: 'HIGHLAND CORRIDOR',
  },
  {
    id: 'kodaikanal',
    code: 'KDK',
    name: 'Kodaikanal',
    region: 'Palani Hills',
    landscapeLabel: 'Lake, Valleys & Pine Trees',
    description:
      'Calm lake walks, cliff views and pine forests. A slow and easy trip.',
    highlights: ['Valley Views', 'Pine Forest', 'Lake Walks', 'Misty Roads'],
    image: LOCAL_IMAGES.kodaikanal,
    coordinatesLabel: 'VALLEY RIDGE',
  },
  {
    id: 'munnar',
    code: 'MNR',
    name: 'Munnar',
    region: 'Western Ghats',
    landscapeLabel: 'Green Tea Hills',
    description:
      'Endless tea gardens, waterfalls and morning mist. Very green and peaceful.',
    highlights: ['Tea Gardens', 'Waterfalls', 'View Points', 'Nature Walks'],
    image: LOCAL_IMAGES.munnar,
    coordinatesLabel: 'TEA HIGHLANDS',
  },
  {
    id: 'kerala',
    code: 'KRL',
    name: 'Kerala',
    region: 'Backwaters & Coast',
    landscapeLabel: 'Backwaters & Beaches',
    description:
      'Calm backwaters, sea breeze and green hills. Bus and stay arranged together.',
    highlights: ['Backwater Boating', 'Beaches', 'Spice Gardens', 'Temple Visits'],
    image: LOCAL_IMAGES.keralaBackwaters,
    coordinatesLabel: 'BACKWATER CIRCUIT',
  },
  {
    id: 'coorg',
    code: 'CRG',
    name: 'Coorg',
    region: 'Kodagu Highlands',
    landscapeLabel: 'Coffee Gardens & Waterfalls',
    description:
      'Coffee estates, waterfalls and sunset views. Good for families and office teams.',
    highlights: ['Coffee Estate Walks', 'Waterfalls', 'Sunset Views', 'Forest Stay'],
    image: LOCAL_IMAGES.coorg,
    coordinatesLabel: 'COFFEE PLATEAU',
  },
  {
    id: 'mysuru',
    code: 'MYS',
    name: 'Mysuru',
    region: 'Heritage & Royal Circuit',
    landscapeLabel: 'Palaces & Gardens',
    description:
      'Famous palaces, gardens and viewpoints. Good for schools and families.',
    highlights: ['Mysore Palace', 'Brindavan Gardens', 'Museums', 'Chamundi Hills'],
    image: LOCAL_IMAGES.mysuru,
    coordinatesLabel: 'HERITAGE ROUTE',
  },
  {
    id: 'chennai',
    code: 'MAA',
    name: 'Chennai',
    region: 'Coromandel Coast',
    landscapeLabel: 'Beaches & City Places',
    description:
      'Sea-side roads, museums and factory visit places for colleges and groups.',
    highlights: ['Marina Beach', 'Factory Visits', 'Museums', 'East Coast Road Drive'],
    image: LOCAL_IMAGES.chennai,
    coordinatesLabel: 'COASTAL CORRIDOR',
  },
  {
    id: 'wayanad',
    code: 'WYD',
    name: 'Wayanad, Kerala',
    region: 'Western Ghats',
    landscapeLabel: 'Misty Hills & Spice Trails',
    description:
      'Lush green hills, spice plantations and waterfalls. A peaceful escape in North Kerala.',
    highlights: ['Edakkal Caves', 'Soochipara Falls', 'Spice Plantations', 'Banasura Sagar Dam'],
    image: LOCAL_IMAGES.wayanad,
    coordinatesLabel: 'HILLAND RETREAT',
  },
  {
    id: 'alleppey',
    code: 'ALL',
    name: 'Alleppey Backwaters',
    region: 'Kerala Coast',
    landscapeLabel: 'Backwaters & Houseboats',
    description:
      'Serene backwater cruises, houseboat stays and village life. The Venice of the East.',
    highlights: ['Houseboat Cruise', 'Backwater Village', 'Snake Boat Race', 'Beach'],
    image: LOCAL_IMAGES.alleppey,
    coordinatesLabel: 'BACKWATER VENICE',
  },
  {
    id: 'all-south-india',
    code: 'ASI',
    name: 'All South India',
    region: 'South India',
    landscapeLabel: 'Multi-State Circuit',
    description:
      'A grand tour covering hill stations, backwaters, temples and beaches across South India.',
    highlights: ['Hill Stations', 'Backwaters', 'Temples', 'Beaches'],
    image: LOCAL_IMAGES.allSouthIndia,
    coordinatesLabel: 'SOUTH INDIA CIRCUIT',
  },
  {
    id: 'custom-destinations',
    code: 'CST',
    name: 'Other Customized Destinations',
    region: 'Your Own Route',
    landscapeLabel: 'Your Own Trip Plan',
    description:
      'Tell us where you want to go. We plan the route, bus, stay and sightseeing for you.',
    highlights: ['Plan Your Own Route', 'Multi-City Trips', 'Travel at Your Own Pace', 'We Handle Everything'],
    image: LOCAL_IMAGES.customBespoke,
    coordinatesLabel: 'YOUR OWN TRIP',
  },
];
