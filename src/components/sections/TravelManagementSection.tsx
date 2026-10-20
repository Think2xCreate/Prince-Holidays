'use client';

import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TRAVEL_MANAGEMENT_STEPS } from '../../data/travelCategories';
import { SectionLabel } from '../ui/SectionLabel';
import { prefersReducedMotion } from '../../lib/utils';

gsap.registerPlugin(ScrollTrigger);

/**
 * SECTION 7 — COMPLETE TRAVEL MANAGEMENT
 *
 * Headline: "From Planning to the Last Mile."
 * Communicates that Prince Holidays can coordinate:
 * 01. Transportation
 * 02. Accommodation
 * 03. Meals
 * 04. Sightseeing
 * 05. Entry tickets
 * 06. Guides
 * 07. Wildlife safaris
 * 08. Campfire arrangements where available
 * 09. Itineraries and group coordination
 *
 * Presented as a visually engaging sequence of numbered editorial rows with a scroll-animated timeline spine.
 * Does not make unsupported guarantees about availability at every destination.
 */
export const TravelManagementSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const progressLineRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const progressLine = progressLineRef.current;
    if (!section || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      if (progressLine) {
        gsap.fromTo(
          progressLine,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top 60%',
              end: 'bottom 70%',
              scrub: 0.5,
            },
          }
        );
      }

      const rows = section.querySelectorAll('.management-step-row');
      rows.forEach((row) => {
        const rule = row.querySelector('.management-rule');
        gsap.fromTo(
          row,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: row,
              start: 'top 86%',
              toggleActions: 'play none none none',
            },
          }
        );

        if (rule) {
          gsap.fromTo(
            rule,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 0.9,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: row,
                start: 'top 86%',
                toggleActions: 'play none none none',
              },
            }
          );
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-14 sm:py-20 lg:py-24 bg-[#fcfcfc] border-b border-[#D9D1C3] overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <SectionLabel
          label="COMPLETE TRAVEL MANAGEMENT"
          meta="BUS • STAY • FOOD • ALL IN ONE PLACE"
        />

        {/* Editorial Heading */}
        <div className="mt-8 lg:mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end pb-8 border-b border-[#D9D1C3]">
          <div className="lg:col-span-7">
            <span className="inline-block font-mono text-xs uppercase tracking-[0.2em] text-[#FD6703] mb-4">
              WE TAKE FULL CARE
            </span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#231A10] leading-[1.06]">
              From Planning to{' '}
              <span className="font-editorial-serif italic font-normal text-[#FD6703]">
                Safe Return.
              </span>
            </h2>
          </div>

          <div className="lg:col-span-5">
            <p className="text-base sm:text-lg text-[#6B6A63] leading-relaxed">
              Good group trips need good planning. We arrange each part of your trip, so your family, students or office team enjoy from start to end.
            </p>
          </div>
        </div>

        {/* Editorial Timeline Rows */}
        <div className="relative mt-6">
          {/* Vertical Animated Wine Spine on Desktop */}
          <div
            className="hidden lg:block absolute left-[16.666%] top-0 bottom-0 w-[1px] bg-[#D9D1C3]"
            aria-hidden="true"
          >
            <div
              ref={progressLineRef}
              className="w-full h-full bg-[#FD6703] origin-top scale-y-0"
            />
          </div>

          <div>
            {TRAVEL_MANAGEMENT_STEPS.map((step) => (
              <div
                key={step.title}
                className="management-step-row relative py-8 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-baseline group"
              >
                {/* Animated Bottom Divider Rule */}
                <div
                  className="management-rule absolute bottom-0 left-0 right-0 h-[1px] bg-[#D9D1C3] origin-left"
                  aria-hidden="true"
                />

                {/* Category Pillar */}
                <div className="lg:col-span-2 flex items-center justify-between lg:justify-start gap-3">
                  <span className="text-xs uppercase tracking-wider text-[#FD6703] font-medium">
                    {step.category}
                  </span>
                </div>

                {/* Title */}
                <div className="lg:col-span-4 lg:pl-8">
                  <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#231A10] group-hover:text-[#FD6703] transition-colors">
                    {step.title}
                  </h3>
                </div>

                {/* Description */}
                <div className="lg:col-span-6">
                  <p className="text-sm sm:text-base text-[#231A10]/80 leading-relaxed max-w-2xl">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Honest Availability Note */}
        <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.16em] text-[#6B6A63]">
        </p>
      </div>
    </section>
  );
};
