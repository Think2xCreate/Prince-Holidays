'use client';

import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GALLERY_PHOTOS } from '../../data/travelCategories';
import { HANGING_PHOTOS } from '../../data/galleryHanging';
import { SectionLabel } from '../ui/SectionLabel';
import { PhotoCard } from '../gallery/PhotoCard';
import { FlexibleRope } from '../gallery/FlexibleRope';
import { RopeDecoration } from '../gallery/GalleryDoodles';

/**
 * SECTION 9 — TRAVEL GALLERY
 *
 * Hanging polaroid banner: one continuous curved jute rope, eight genuine
 * Prince Holidays photographs, each in its own white polaroid frame clipped
 * to the rope with a wooden clothespin. Cards hang at slightly different
 * heights and rotations, exactly like the reference design.
 */

// --- Rope curve math (mirrors the path drawn in FlexibleRope) -------------

type Pt = { x: number; y: number };

const P0: Pt = { x: 8, y: 34 };
const C1: Pt = { x: 340, y: 88 };
const C2: Pt = { x: 1260, y: 78 };
const P1: Pt = { x: 1592, y: 26 };

/** Evaluate the rope's cubic bezier at parameter t (0..1). */
function ropePoint(t: number, sag = 1): Pt {
  const mt = 1 - t;
  const x =
    mt * mt * mt * P0.x + 3 * mt * mt * t * C1.x + 3 * mt * t * t * C2.x + t * t * t * P1.x;
  const y =
    mt * mt * mt * P0.y +
    3 * mt * mt * t * (P0.y + (C1.y - P0.y) * sag) +
    3 * mt * t * t * (P0.y + (C2.y - P0.y) * sag) +
    t * t * t * P1.y;
  return { x, y };
}

/**
 * Rope Y (in the 90px-tall rope coordinate space) at a horizontal fraction
 * of the row width. The bezier's X is nearly linear, so a small bisection
 * is plenty accurate for positioning the clothespins on the curve.
 */
function ropeYAt(xf: number, sag = 1): number {
  const targetX = xf * 1600;
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (ropePoint(mid, sag).x < targetX) lo = mid;
    else hi = mid;
  }
  return ropePoint((lo + hi) / 2, sag).y;
}

// --- One rope row ----------------------------------------------------------

interface RopeRowProps {
  photos: typeof HANGING_PHOTOS;
  /** Sag multiplier — full garland on desktop, gentler on smaller rows. */
  sag?: number;
  className?: string;
  /** Base entrance delay offset for later rope rows. */
  delayOffset?: number;
}

const openLightboxRef: { current: (index: number) => void } = { current: () => {} };

const RopeRow: React.FC<RopeRowProps> = ({ photos, sag = 1, className, delayOffset = 0 }) => {
  const count = photos.length;
  const gapXf = 0.075; // fraction of width kept clear at each edge

  return (
    <div className={`relative ${className ?? ''}`}>
      {/* The rope — drawn first, so every card + clothespin sits in front */}
      <FlexibleRope className="absolute inset-x-0 top-0 z-0 h-[90px] w-full" />

      <div
        className="relative z-10 flex items-start justify-between"
        style={{ paddingInline: `${gapXf * 100}%`, paddingTop: '2px' }}
      >
        {photos.map((photo, i) => {
          const centerFrac = gapXf + ((i + 0.5) / count) * (1 - gapXf * 2);
          const dropPx = ropeYAt(centerFrac, sag);
          return (
            <div
              key={photo.id}
              className="photo-card-slot"                style={{
                  width: `calc((100% - ${(count - 1) * 2}rem) / ${count})`,
                  paddingTop: `${dropPx + 10 + photo.slack * 2}px`,
                  ['--ph-delay' as string]: `${delayOffset + 0.12 + i * 0.07}s`,
                }}
              >
                <PhotoCard photo={photo} onOpen={(idx) => openLightboxRef.current(idx)} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const GallerySection: React.FC = () => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  openLightboxRef.current = (index: number) => setLightboxIndex(index);

  // Lightbox keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % GALLERY_PHOTOS.length : null));
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev !== null ? (prev - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length : null
        );
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex]);

  const currentPhoto = lightboxIndex !== null ? GALLERY_PHOTOS[lightboxIndex] : null;

  return (
    <section
      id="gallery"
      className="relative bg-[#fcfcfc] py-14 sm:py-20 lg:py-24 overflow-hidden"
    >
      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <SectionLabel label="TRAVEL PHOTOS" meta="REAL TRIPS • REAL BUSES" />

        {/* Editorial header — heading left, description right */}
        <div className="mt-8 flex flex-col gap-6 lg:mt-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <div className="max-w-3xl">
            <span className="mb-4 inline-block font-mono text-xs uppercase tracking-[0.2em] text-[#FD6703]">
              OUR PHOTOS
            </span>
            <h2 className="font-display text-4xl font-semibold leading-[1.06] tracking-tight text-[#231A10] sm:text-5xl lg:text-[64px]">
              Photos from Our Travels
            </h2>
          </div>

          <p className="max-w-md text-sm leading-relaxed text-[#6B6A63] sm:text-base lg:pb-2">
            Photos from our trips — our buses, night travels, park visits, animal rides, and
            travel groups. New photos from every trip are added here.
          </p>
        </div>

        {/* Hanging gallery — desktop: one continuous garland of eight cards */}
        <div className="relative mt-12 lg:mt-16">
          <RopeDecoration className="pointer-events-none absolute inset-0 z-[5] hidden lg:block" />

          {/* Desktop garland */}
          <div className="hidden lg:block">
            <RopeRow photos={HANGING_PHOTOS} sag={1} />
          </div>

          {/* Tablet: two rows of four */}
          <div className="hidden space-y-12 sm:block lg:hidden">
            <RopeRow photos={HANGING_PHOTOS.slice(0, 4)} sag={0.6} />
            <RopeRow photos={HANGING_PHOTOS.slice(4)} sag={0.6} delayOffset={0.3} />
          </div>

          {/* Mobile: rows of two, still hanging from short rope sections */}
          <div className="space-y-10 sm:hidden">
            <RopeRow photos={HANGING_PHOTOS.slice(0, 2)} sag={0.35} />
            <RopeRow photos={HANGING_PHOTOS.slice(2, 4)} sag={0.35} delayOffset={0.15} />
            <RopeRow photos={HANGING_PHOTOS.slice(4, 6)} sag={0.35} delayOffset={0.3} />
            <RopeRow photos={HANGING_PHOTOS.slice(6)} sag={0.35} delayOffset={0.45} />
          </div>
        </div>
      </div>

      {/* Accessible lightbox modal (kept from the previous gallery) */}
      {currentPhoto && lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={currentPhoto.title}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[#231A10]/92 p-4 backdrop-blur-md sm:p-8"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="relative max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-[#FBF8F1]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex items-center justify-center bg-[#231A10]">
              <img
                src={currentPhoto.image}
                alt={currentPhoto.title}
                className="max-h-[60vh] w-auto object-contain"
              />
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex((lightboxIndex - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length)
                }
                aria-label="Previous photo"
                className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#FBF8F1]/90 text-[#231A10] transition-colors hover:bg-[#FD6703] hover:text-[#231A10]"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setLightboxIndex((lightboxIndex + 1) % GALLERY_PHOTOS.length)}
                aria-label="Next photo"
                className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#FBF8F1]/90 text-[#231A10] transition-colors hover:bg-[#FD6703] hover:text-[#231A10]"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center justify-between px-6 py-4">
              <h4 className="font-display text-lg font-semibold text-[#231A10]">
                {currentPhoto.title}
              </h4>
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                aria-label="Close photo"
                className="rounded-full border border-[#D9D1C3] p-2 text-[#231A10] transition-colors hover:border-[#FD6703] hover:text-[#FD6703]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
