'use client';

import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DESTINATIONS, DestinationItem } from '../../data/destinations';
import { SectionLabel } from '../ui/SectionLabel';
import { prefersReducedMotion } from '../../lib/utils';

gsap.registerPlugin(ScrollTrigger);

interface DestinationBoardProps {
  onSelectDestination?: (destinationName: string) => void;
}

/**
 * SECTION 5 — DESTINATION BOARD (simple photo cards)
 *
 * Plain white-mat photo cards: one photo, place name + region.
 * Clicking a card still pre-fills the travel enquiry with that destination.
 */
export const DestinationBoard: React.FC<DestinationBoardProps> = ({
  onSelectDestination,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const galleryRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const gallery = galleryRef.current;
    if (!section || !gallery) return;

    const reducedMotion = prefersReducedMotion();

    const ctx = gsap.context(() => {
      const cards = gallery.querySelectorAll<HTMLElement>('.dest-photo-card');

      if (reducedMotion) {
        // Leave the CSS tilt alone; only settle position.
        gsap.set(cards, { opacity: 1, y: 0 });
        return;
      }

      // Simple entrance: cards fade up once, no tilt or hanging motion.
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 92%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const handleCardClick = (dest: DestinationItem) => {
    if (onSelectDestination) {
      onSelectDestination(dest.name);
      return;
    }
    const enquiryEl = document.getElementById('enquiry');
    if (enquiryEl) {
      enquiryEl.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="destinations"
      className="relative py-14 sm:py-20 lg:py-24 bg-[#fcfcfc] border-b border-[#D9D1C3] overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <SectionLabel
          label="DESTINATION BOARD"
          meta="PLACES WE GO • YOUR OWN ROUTES"
        />

        {/* Editorial Header */}
        <div className="mt-8 lg:mt-12 flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-[#D9D1C3]">
          <div className="max-w-3xl">
            <span className="inline-block font-mono text-xs uppercase tracking-[0.2em] text-[#FD6703] mb-4">
              DEPARTURE INDEX
            </span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#231A10] leading-[1.06]">
              Where Will We{' '}
              <span className="font-editorial-serif italic font-normal text-[#FD6703]">
                Take You?
              </span>
            </h2>
          </div>

          <p className="text-base sm:text-lg text-[#6B6A63] max-w-md leading-relaxed">
            Tap a place to start your enquiry. We plan each route to suit your group.
          </p>
        </div>

        {/* Simple photo cards — white mat, one photo, a few plain words */}
        <div ref={galleryRef} className="relative mt-14 sm:mt-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DESTINATIONS.map((dest, idx) => (
              <button
                key={dest.id}
                type="button"
                className="dest-photo-card group relative block w-full text-left cursor-pointer bg-white p-3 pb-4 pt-6 rounded-lg border border-[#E3DED2] shadow-[0_1px_2px_rgba(30,25,15,0.08)] hover:shadow-[0_10px_24px_-12px_rgba(30,25,15,0.3)] hover:-translate-y-1 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FD6703]"
                style={{ rotate: `${idx % 2 === 0 ? -1.5 : 1.5}deg` }}
                onClick={() => handleCardClick(dest)}
                aria-label={`Plan route to ${dest.name} — ${dest.region}`}
              >
                {/* Punched tag hole at top center */}
                <span
                  className="pointer-events-none absolute top-2.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#fcfcfc] border border-[#D9D1C3] shadow-[inset_0_1px_2px_rgba(30,25,15,0.35)]"
                  aria-hidden="true"
                />
                <div className="overflow-hidden rounded-md bg-[#EDEAE3]">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    loading="lazy"
                    className="w-full aspect-[4/5] object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="pt-3 px-1">
                  <h3 className="font-display text-xl font-semibold text-[#20211F]">
                    {dest.name}
                  </h3>
                  <p className="mt-0.5 text-sm text-[#6B6A63]">{dest.region}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
