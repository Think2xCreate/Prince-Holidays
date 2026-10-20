'use client';

import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { LOCAL_IMAGES } from '../../data/business';
import { prefersReducedMotion } from '../../lib/utils';

gsap.registerPlugin(ScrollTrigger);

interface FeaturedJourneyProps {
  onPlanJourney?: () => void;
}

/**
 * SECTION 8 — FEATURED JOURNEY
 *
 * Cinematic featured destination section:
 * - Full-viewport scenic photograph, pinned (sticky) while the page scrolls past it
 * - Content travels over the held photo in three beats:
 *     1. Label + headline
 *     2. Three "what the journey looks like" notes on glass panels
 *     3. Closing line + "Plan your journey" CTA
 * - Strictly avoids fake prices, discounts, or package availability.
 */
const JOURNEY_NOTES = [
  {
    title: 'Cool mornings',
    body: 'Tea gardens and hill views, enjoyed before the crowds arrive.',
  },
  {
    title: 'Relaxed travel',
    body: 'Hill roads and coastal drives, taken slowly and safely.',
  },
  {
    title: 'Tasty food',
    body: 'Fresh South Indian meals — veg and non-veg — arranged at every stop.',
  },
];

export const FeaturedJourney: React.FC<FeaturedJourneyProps> = ({
  onPlanJourney,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const headlineRef = useRef<HTMLDivElement | null>(null);
  const notesRef = useRef<HTMLDivElement | null>(null);
  const closingRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const img = imgRef.current;
    const headline = headlineRef.current;
    const notes = notesRef.current;
    const closing = closingRef.current;
    if (!section || !img || !headline || !notes || !closing) return;

    if (prefersReducedMotion()) {
      gsap.set([headline, notes, closing], { autoAlpha: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(headline, { autoAlpha: 1, y: 0 });
      gsap.set(notes, { autoAlpha: 0, y: 90 });
      gsap.set(closing, { autoAlpha: 0, y: 90 });
      gsap.set(img, { scale: 1.14, yPercent: -4 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
        },
      });

      // The pinned photograph breathes slowly the whole way through
      tl.to(img, { scale: 1.02, yPercent: 4, ease: 'none', duration: 1 }, 0);

      // Beat 1 — headline drifts up and dissolves
      tl.to(
        headline,
        { autoAlpha: 0, y: -70, duration: 0.22, ease: 'power2.in' },
        0.16
      );

      // Beat 2 — journey notes rise over the photo
      tl.to(
        notes,
        { autoAlpha: 1, y: 0, duration: 0.24, ease: 'power2.out' },
        0.3
      );

      // Beat 2 leaves, Beat 3 — closing line + CTA arrive
      tl.to(notes, { autoAlpha: 0, y: -70, duration: 0.18, ease: 'power2.in' }, 0.66);

      tl.to(
        closing,
        { autoAlpha: 1, y: 0, duration: 0.24, ease: 'power2.out' },
        0.74
      );

      // Gentle upward drift as the next section takes over
      tl.to(closing, { y: -40, duration: 0.14, ease: 'none' }, 0.92);
    }, section);

    return () => ctx.revert();
  }, []);

  const handleCtaClick = () => {
    if (onPlanJourney) {
      onPlanJourney();
      return;
    }
    const enquiryEl = document.getElementById('enquiry');
    if (enquiryEl) {
      enquiryEl.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[300vh] bg-[#20211F]"
      aria-label="South India by Road"
    >
      {/* Sticky Full-Viewport Stage — the photo never moves */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        {/* Full-bleed scenic photo with dark readability overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            ref={imgRef}
            src={LOCAL_IMAGES.featuredJourney}
            alt="Scenic South India road journey"
            loading="lazy"
            className="w-full h-full object-cover object-center will-change-transform"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#20211F]/75 via-[#20211F]/45 to-[#20211F]/85 pointer-events-none"
            aria-hidden="true"
          />
        </div>

        {/* Beat 1 — label + headline over the open photo */}
        <div
          ref={headlineRef}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-5 sm:px-8 pointer-events-none"
        >
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-white/80">
            South India by bus
          </p>
          <h2 className="mt-4 font-display text-4xl sm:text-6xl lg:text-7xl font-medium text-white leading-[1.08] max-w-4xl text-balance">
            Green hills,{' '}
            <span className="font-editorial-serif italic text-[#FD6703]">slow miles,</span>
            <br />
            good company.
          </h2>
        </div>

        {/* Beat 2 — journey notes rising over the held photo */}
        <div
          ref={notesRef}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center px-5 sm:px-8 py-16 pointer-events-none"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/75">
            What your trip looks like
          </p>
          <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 w-full max-w-4xl">
            {JOURNEY_NOTES.map((note) => (
              <div
                key={note.title}
                className="rounded-2xl border border-white/20 bg-[#20211F]/55 backdrop-blur-md px-5 sm:px-6 py-6 text-left shadow-[0_20px_50px_-25px_rgba(0,0,0,0.8)]"
              >
                <h3 className="font-display text-lg sm:text-xl text-white">
                  {note.title}
                </h3>
                <p className="mt-2 text-sm text-white/75 leading-relaxed">
                  {note.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Beat 3 — closing line + CTA */}
        <div
          ref={closingRef}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-5 sm:px-8 pointer-events-none"
        >
          <h3 className="font-display text-3xl sm:text-5xl font-medium text-white leading-[1.12] max-w-3xl text-balance">
            One bus.{' '}
            <span className="font-editorial-serif italic text-[#FD6703]">One plan.</span>{' '}
            Everyone together.
          </h3>
          <p className="mt-5 max-w-xl text-base sm:text-lg text-white/80 leading-relaxed">
            Tell us where your group wants to go, and we will shape the route, the
            stay and the sightseeing around it.
          </p>
          <div className="mt-8 pointer-events-auto">
            <button
              type="button"
              onClick={handleCtaClick}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#FD6703] text-[#231A10] hover:bg-[#FBF8F1] text-xs uppercase tracking-[0.16em] font-semibold transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Plan your journey</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
