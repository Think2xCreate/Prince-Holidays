'use client';

import React, { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { HeroSection } from '../components/sections/HeroSection';
import { JourneySection } from '../components/sections/JourneySection';
import { CinematicVideoSection } from '../components/sections/CinematicVideoSection';
import { DestinationBoard } from '../components/sections/DestinationBoard';
import { TravelCategories } from '../components/sections/TravelCategories';
import { TravelManagementSection } from '../components/sections/TravelManagementSection';
import { FeaturedJourney } from '../components/sections/FeaturedJourney';
import { GallerySection } from '../components/sections/GallerySection';
import { EnquirySection } from '../components/sections/EnquirySection';
import { ClosingSection } from '../components/sections/ClosingSection';
import { FirstVisitQuickContact } from '../components/ui/FirstVisitQuickContact';
import { prefersReducedMotion } from '../lib/utils';

export default function HomePage() {
  const [selectedDestination, setSelectedDestination] = useState<string | undefined>(
    undefined
  );
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    }
  };

  const handleSelectDestination = (destName: string) => {
    setSelectedDestination(destName);
    scrollToId('enquiry');
  };

  const handleSelectCategory = (categoryTitle: string) => {
    setSelectedCategory(categoryTitle);
    scrollToId('enquiry');
  };

  return (
    <>
      {/* Fixed Minimal Navigation */}
      <Navbar onPlanTrip={() => scrollToId('enquiry')} />

      <main className="flex-1">
        {/* SECTION 1 — CINEMATIC HERO */}
        <HeroSection
          onExploreJourneys={() => scrollToId('about')}
          onPlanTrip={() => scrollToId('enquiry')}
        />

        {/* SECTION 2 — THE JOURNEY BEGINS */}
        <JourneySection />

        {/* SECTION 4 — THE CINEMATIC JOURNEY */}
        <CinematicVideoSection />

        {/* SECTION 5 — DESTINATION BOARD */}
        <DestinationBoard onSelectDestination={handleSelectDestination} />

        {/* SECTION 6 — OUR TRAVEL EXPERIENCES */}
        <TravelCategories onSelectCategory={handleSelectCategory} />

        {/* SECTION 7 — COMPLETE TRAVEL MANAGEMENT */}
        <TravelManagementSection />

        {/* SECTION 9 — TRAVEL GALLERY */}
        <GallerySection />

        {/* FEATURED JOURNEY — sticky photo moment, just before enquiry */}
        <FeaturedJourney />

        {/* SECTION 11 — TRAVEL ENQUIRY */}
        <EnquirySection
          preselectedDestination={selectedDestination}
          preselectedCategory={selectedCategory}
        />

        {/* SECTION 12 — FINAL CINEMATIC CTA */}
        <ClosingSection onPlanTrip={() => scrollToId('enquiry')} />
      </main>

      {/* SECTION 13 — FOOTER */}
      <Footer />

      {/* FIRST-VISIT QUICK CONTACT (Name / Phone / Message → WhatsApp) */}
      <FirstVisitQuickContact />
    </>
  );
}
