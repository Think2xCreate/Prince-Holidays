'use client';

import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { TRAVEL_CATEGORIES } from '../../data/travelCategories';
import { SectionLabel } from '../ui/SectionLabel';
import { ImageReveal } from '../ui/ImageReveal';
import { prefersReducedMotion } from '../../lib/utils';

gsap.registerPlugin(ScrollTrigger);

interface TravelCategoriesProps {
  onSelectCategory?: (categoryTitle: string) => void;
}

/**
 * SECTION 6 — OUR TRAVEL EXPERIENCES
 *
 * Shows the five types of travel Prince Holidays organizes:
 * 1. Family Holidays
 * 2. Corporate Tours
 * 3. School Educational Trips
 * 4. College Industrial Visits
 * 5. Domestic Holidays
 *
 * Uses a clean alternating editorial layout (not a generic grid of identical cards)
 * with one strong photograph, clear title, short description, and simple action link per category.
 */
export const TravelCategories: React.FC<TravelCategoriesProps> = ({
  onSelectCategory,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const rows = section.querySelectorAll('.category-editorial-row');
      rows.forEach((row) => {
        const textItems = row.querySelectorAll('.category-text-reveal');
        if (!textItems.length) return;

        gsap.fromTo(
          textItems,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: row,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const handleCategoryAction = (title: string) => {
    if (onSelectCategory) {
      onSelectCategory(title);
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
      id="experiences"
      className="relative py-14 sm:py-20 lg:py-24 bg-[#FBF8F1] border-b border-[#D9D1C3] overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">            <SectionLabel
          label="OUR TRAVEL SERVICES"
          meta="FOR FAMILIES • COLLEGES • SCHOOLS • COMPANIES"
        />

        {/* Section Header */}
        <div className="mt-8 lg:mt-12 max-w-3xl">
          <span className="inline-block font-mono text-xs uppercase tracking-[0.2em] text-[#FD6703] mb-4">
            PICK YOUR TRIP TYPE
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#231A10] leading-[1.06]">            Trips Planned For{' '}
              <span className="font-editorial-serif italic font-normal text-[#FD6703]">
                Your Group.
              </span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-[#6B6A63] leading-relaxed">
            Every group is different. Families, students and office teams all travel with a different plan. We arrange the bus, hotels, food and sightseeing to match your group.
          </p>
        </div>

        {/* Alternating Editorial Compositions */}
        <div className="mt-16 sm:mt-24">
          {TRAVEL_CATEGORIES.map((category, idx) => {
            const isEven = idx % 2 === 0;
            const useArch = idx === 1 || idx === 4;

            return (
              <article
                key={category.id}
                className="category-editorial-row py-14 sm:py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center"
              >
                {/* Photograph Column */}
                <div
                  className={`lg:col-span-6 ${
                    isEven ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <ImageReveal
                    src={category.image}
                    alt={category.title}
                    shape={useArch ? 'arch' : 'rounded'}
                    aspectClassName="aspect-[16/11]"
                    caption={category.imageCaption}
                  />
                </div>

                {/* Editorial Text Column */}
                <div
                  className={`lg:col-span-6 ${
                    isEven ? 'lg:order-2 lg:pl-6' : 'lg:order-1 lg:pr-6'
                  }`}
                >
                  <div className="category-text-reveal flex items-center gap-3 text-xs uppercase tracking-wider text-[#FD6703] font-medium">
                    <span>{category.subtitle}</span>
                  </div>

                  <h3 className="category-text-reveal mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#231A10] leading-[1.1]">
                    {category.title}
                  </h3>

                  <p className="category-text-reveal mt-5 text-base sm:text-lg text-[#231A10]/85 leading-relaxed">
                    {category.description}
                  </p>

                  {/* Key Coordinated Highlights */}
                  <ul className="category-text-reveal mt-6 flex flex-wrap gap-2">
                    {category.inclusions.map((inc) => (
                      <li
                        key={inc}
                        className="px-3.5 py-1.5 rounded-full bg-[#fcfcfc] border border-[#D9D1C3] font-mono text-[11px] uppercase tracking-[0.14em] text-[#231A10]"
                      >
                        {inc}
                      </li>
                    ))}
                  </ul>

                  {/* Simple Editorial Action Link */}
                  <div className="category-text-reveal mt-8">
                    <button
                      type="button"
                      onClick={() => handleCategoryAction(category.title)}
                      className="group inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-[#231A10] hover:text-[#FD6703] transition-colors cursor-pointer"
                    >
                      <span className="border-b border-[#231A10] group-hover:border-[#FD6703] pb-1 transition-colors">
                        {category.actionLabel}
                      </span>
                      <span className="w-8 h-8 rounded-full border border-[#D9D1C3] group-hover:border-[#FD6703] group-hover:bg-[#FD6703] group-hover:text-[#FBF8F1] flex items-center justify-center transition-all duration-300">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
