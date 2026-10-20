'use client';

import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LOCAL_IMAGES } from '../../data/business';
import { SectionLabel } from '../ui/SectionLabel';
import { prefersReducedMotion } from '../../lib/utils';

gsap.registerPlugin(ScrollTrigger);

/**
 * SECTION 2 — THE JOURNEY BEGINS
 *
 * Editorial section on warm ivory (#fcfcfc) with:
 * - Headline: "Every Journey Has a Story."
 * - Supporting copy: "From peaceful family escapes to ambitious corporate outings, we bring every detail together so you can enjoy the journey."
 * - Inline cropped photographs (mountain destination, family vacation, premium tourist bus, scenic road)
 * - Line-by-line text reveals, image mask expansion, subtle multi-speed parallax, and small destination labels.
 */
export const JourneySection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const lines = section.querySelectorAll('.journey-line');
      const inlineMasks = section.querySelectorAll('.journey-inline-mask');

      if (lines.length) {
        gsap.fromTo(
          lines,
          { y: 36, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 76%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      if (inlineMasks.length) {
        gsap.fromTo(
          inlineMasks,
          { clipPath: 'inset(0% 45% 0% 45% round 999px)', scale: 0.9 },
          {
            clipPath: 'inset(0% 0% 0% 0% round 999px)',
            scale: 1,
            duration: 1.1,
            stagger: 0.14,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 72%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // No scrub drift on the hanging cards: they sit on pegs, so the
      // frames stay pinned to their strings.
    }, section);

    return () => ctx.revert();
  }, []);

  const vignettes = [
    {
      label: 'HILL STATIONS',
      place: 'Munnar & Ooty Hills',
      image: LOCAL_IMAGES.kodaikanal,
      alt: 'Misty mountain tea hills at dawn',
    },
    {
      label: 'FAMILY TRIPS',
      place: 'Backwaters & Hills',
      image: LOCAL_IMAGES.familyHoliday,
      alt: 'Family travelers enjoying vacation together',
    },
    {
      label: 'TOURIST BUS',
      place: 'Group Bus Travel',
      image: LOCAL_IMAGES.heroCoach,
      alt: 'Premium tourist bus travelling along a mountain road',
    },
    {
      label: 'BEAUTIFUL ROADS',
      place: 'Hill & Sea Roads',
      image: LOCAL_IMAGES.journeyScenicRoad,
      alt: 'Scenic highway through mountain landscapes',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-14 sm:py-20 lg:py-24 bg-[#fcfcfc] border-b border-[#D9D1C3] overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <SectionLabel
          label="THE JOURNEY BEGINS"
          meta="PRINCE HOLIDAYS • HOW WE PLAN YOUR TRIP"
        />

        {/* Main Editorial Headline & Supporting Copy */}
        <div className="mt-8 lg:mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-5">
            <span className="journey-line inline-block font-mono text-xs uppercase tracking-[0.2em] text-[#FD6703] mb-4">
              OUR PROMISE
            </span>
            <h2 className="journey-line font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#231A10] leading-[1.06]">
              Every Journey{' '}
              <span className="font-editorial-serif italic font-normal text-[#FD6703]">
                Has a Story.
              </span>
            </h2>
          </div>

          <div className="lg:col-span-7 lg:pt-4">
            <p className="journey-line font-display text-xl sm:text-2xl lg:text-[1.75rem] text-[#231A10] leading-[1.45] tracking-tight">
              Family trips, college tours or office outings — we plan every small detail, so you just enjoy the trip.
            </p>
            <p className="journey-line mt-5 text-base sm:text-lg text-[#6B6A63] max-w-2xl leading-relaxed">
              A good trip is more than just reaching a place. It is about laughing with your family in the bus, hot food on time, and a safe room waiting for you. We take care of all this from start to end, so you can enjoy every moment.
            </p>
          </div>
        </div>

        {/* Editorial Statement */}
         <div className="mt-16 sm:mt-24 pt-12">
          <div className="font-display text-2xl sm:text-4xl lg:text-[3rem] font-medium text-[#231A10] leading-[1.35] tracking-tight max-w-5xl">
            <span className="journey-line inline">
              Hills, beaches, temples or cities — family trips, college tours, school outings or office team trips —{' '}
              <span className="font-editorial-serif italic text-[#FD6703]">
                we plan the full trip for you.
              </span>
            </span>
          </div>
        </div>

        {/* Four frames hanging from a rope line, pegged like laundry — tilts kept */}
        <div className="relative mt-12 sm:mt-14 sm:pt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Rope — spans the row on sm+; each frame hangs from it by a string */}
          <div
            className="hidden sm:block absolute top-0 left-2 right-2 h-[3px] rounded-full bg-[#8A6B4A] shadow-[0_1px_1px_rgba(30,25,15,0.35)]"
            aria-hidden="true"
          />
          {vignettes.map((item, idx) => (
            <div
              key={item.label}
              className={`flex flex-col ${
                idx % 2 === 1 ? 'lg:mt-10' : ''
              }`}
            >
              {/* String + wooden peg (odd frames hang lower to meet the staggered row) */}
              <div
                className={`hidden sm:block w-[2px] mx-auto bg-[#8A6B4A]/80 ${
                  idx % 2 === 1 ? 'h-8 lg:h-[72px]' : 'h-8'
                }`}
                aria-hidden="true"
              />
              <div
                className="hidden sm:block w-3.5 h-7 mx-auto -mb-2.5 rounded-[3px] bg-[#B08954] ring-1 ring-[#7c6238] shadow-[0_2px_3px_rgba(30,25,15,0.4)] z-10"
                aria-hidden="true"
              />
               <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#231A10] group"
                    style={{ transform: `rotate(${idx % 2 === 0 ? -5 : 5}deg)`, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', margin: '0 -10px' }}>
                <img
                  src={item.image}
                  alt={item.alt}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#231A10]/45 via-transparent to-transparent pointer-events-none"
                  aria-hidden="true"
                />
              </div>
              <div className="mt-6 flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.16em] text-[#FD6703]">
                <span>{item.label}</span>
              </div>
              <p className="mt-3 font-display text-base font-medium text-[#231A10]">
                {item.place}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
