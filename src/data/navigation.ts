export interface NavItem {
  label: string;
  href: string;
  sectionId: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'About', href: '#about', sectionId: 'about' },
  { label: 'Experiences', href: '#experiences', sectionId: 'experiences' },
  { label: 'Destinations', href: '#destinations', sectionId: 'destinations' },
  { label: 'Gallery', href: '#gallery', sectionId: 'gallery' },
  { label: 'Contact', href: '#enquiry', sectionId: 'enquiry' },
];
