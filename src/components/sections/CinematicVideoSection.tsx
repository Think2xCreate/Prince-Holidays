'use client';

import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { VIDEO_ASSETS, LOCAL_IMAGES } from '../../data/business';
import { VideoScrubber, VideoScrubberHandle } from '../ui/VideoScrubber';
import { prefersReducedMotion } from '../../lib/utils';

gsap.registerPlugin(ScrollTrigger);

/**
 * SECTION 4 — THE CINEMATIC JOURNEY
 * ("MOVING INTO THE BUS & THROUGH THE PANORAMIC WINDOW" SCROLL SEQUENCE)
 *
 * Inspired by Cirrus's "Through the window — Scroll, the glass gives way" sequence:
 * - Chapter I ("Leave the Ordinary Behind."): Starts outside the luxury tourist coach
 *   gliding along the mountain corridor. As the user scrolls, the camera dollies straight
 *   INTO the tourist bus side window (`scale: 1 -> 5.4`, `transformOrigin: 54% 44%`).
 * - Chapter II ("Discover Somewhere New."): The camera crosses inside the coach cabin,
 *   looking out through the curved panoramic coach window frame with golden sunbeams.
 * - Chapter III ("Make Every Mile Matter."): The panoramic coach window frame expands past
 *   the edges of the viewport ("the glass gives way"), immersing the viewer in the full
 *   mountain horizon.
 */
export const CinematicVideoSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const exteriorCoachLayerRef = useRef<HTMLDivElement | null>(null);
  const windowMaskOverlayRef = useRef<HTMLDivElement | null>(null);
  const windowCutoutRectRef = useRef<SVGRectElement | null>(null);
  const windowInnerRimRef = useRef<SVGRectElement | null>(null);
  const glassFlashRef = useRef<HTMLDivElement | null>(null);
  const windowHintRef = useRef<HTMLDivElement | null>(null);
  const slide1Ref = useRef<HTMLDivElement | null>(null);
  const slide2Ref = useRef<HTMLDivElement | null>(null);
  const slide3Ref = useRef<HTMLDivElement | null>(null);
  const progressFillRef = useRef<HTMLDivElement | null>(null);
  const journeyScrubberRef = useRef<VideoScrubberHandle | null>(null);

  useLayoutEffect(() => {
     const section = sectionRef.current;
     const exteriorCoach = exteriorCoachLayerRef.current;
     const windowMaskOverlay = windowMaskOverlayRef.current;
     const windowCutoutRect = windowCutoutRectRef.current;
     const windowInnerRim = windowInnerRimRef.current;
     const glassFlash = glassFlashRef.current;
     const windowHint = windowHintRef.current;
     const s1 = slide1Ref.current;
     const s2 = slide2Ref.current;
     const s3 = slide3Ref.current;
     const progressFill = progressFillRef.current;
     const journeyScrubber = journeyScrubberRef.current;

     if (!section || !exteriorCoach || !windowMaskOverlay || !windowCutoutRect || !windowInnerRim || !glassFlash || !windowHint || !s1 || !s2 || !s3 || !progressFill || !journeyScrubber) return;

     if (prefersReducedMotion()) {
       if (exteriorCoach) gsap.set(exteriorCoach, { autoAlpha: 0 });
       if (windowMaskOverlay) gsap.set(windowMaskOverlay, { autoAlpha: 0 });
       gsap.set([s1, s2], { autoAlpha: 0 });
       gsap.set(s3, { autoAlpha: 1, y: 0 });
       return;
     }

     const ctx = gsap.context(() => {
       gsap.set([s1, s2, s3], { autoAlpha: 0 });
       if (exteriorCoach) {
         gsap.set(exteriorCoach, {
           scale: 1,
           autoAlpha: 1,
           transformOrigin: '52% 44%',
         });
       }
       if (windowMaskOverlay) {
         gsap.set(windowMaskOverlay, { autoAlpha: 0 });
       }

       const tl = gsap.timeline({
         scrollTrigger: {
           trigger: section,
           start: 'top top',
           end: 'bottom bottom',
           scrub: 0.55,
           onUpdate: (self) => {
             // Imperative progress push — avoids a 60fps React re-render of this heavy section.
             journeyScrubberRef.current?.setProgress(self.progress);
             if (progressFill) {
               progressFill.style.transform = `scaleX(${self.progress.toFixed(4)})`;
             }
           },
           onToggle: (self) => {
             journeyScrubberRef.current?.setActive(self.isActive);
           },
         },
       });

       // Step 1 (0.00 -> 0.34): Camera pushes from outside the coach straight INTO the bus window
       if (exteriorCoach) {
         tl.to(
           exteriorCoach,
           {
             scale: 5.2,
             xPercent: -3,
             yPercent: 6,
             duration: 0.34,
             ease: 'power2.in',
           },
           0
         );
         tl.to(
           exteriorCoach,
           {
             autoAlpha: 0,
             duration: 0.1,
             ease: 'power2.inOut',
           },
           0.26
         );
       }

       if (glassFlash) {
         tl.fromTo(
           glassFlash,
           { xPercent: -120, opacity: 0 },
           { xPercent: 120, opacity: 0.85, duration: 0.22, ease: 'power2.inOut' },
           0.20
         );
         tl.to(glassFlash, { opacity: 0, duration: 0.08 }, 0.40);
       }

       // Step 2 (0.24 -> 0.68): Inside the Coach Looking Through the Panoramic Window Frame,
       // which then expands past the edges of the screen ("the glass gives way")
       if (windowMaskOverlay) {
         tl.to(windowMaskOverlay, { autoAlpha: 1, duration: 0.08 }, 0.24);
       }

        if (windowCutoutRect) {
          tl.fromTo(
            windowCutoutRect,
            {
              attr: {
                x: 240,
                y: 120,
                width: 1440,
                height: 840,
                rx: 120,
              },
            },
            {
              attr: {
                x: -180,
                y: -180,
                width: 2280,
                height: 1440,
                rx: 0,
              },
              ease: 'power2.inOut',
              duration: 0.38,
            }
          ),
          0.32
        };

        if (windowInnerRim) {
          tl.fromTo(
            windowInnerRim,
            {
              attr: {
                x: 240,
                y: 120,
                width: 1440,
                height: 840,
                rx: 120,
              },
              opacity: 0.75,
            },
            {
              attr: {
                x: -180,
                y: -180,
                width: 2280,
                height: 1440,
                rx: 0,
              },
              opacity: 0,
              ease: 'power2.inOut',
              duration: 0.38,
            }
          ),
          0.32
        };

       if (windowMaskOverlay) {
         tl.to(windowMaskOverlay, { autoAlpha: 0, duration: 0.08 }, 0.66);
       }

       if (windowHint) {
         tl.to(windowHint, { autoAlpha: 0, y: -16, duration: 0.15 }, 0.58);
       }

       // Chapters: simple scroll-driven statements so the scrub feels alive
       // even when the MP4 fallback image is showing instead of real video.
       tl.fromTo(s1, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.12, ease: 'power2.out' }, 0.04);
       tl.to(s1, { autoAlpha: 0, y: -30, duration: 0.1, ease: 'power2.in' }, 0.24);
       tl.fromTo(s2, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.12, ease: 'power2.out' }, 0.34);
       tl.to(s2, { autoAlpha: 0, y: -30, duration: 0.1, ease: 'power2.in' }, 0.58);
       tl.fromTo(s3, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.12, ease: 'power2.out' }, 0.68);
       tl.to(s3, { autoAlpha: 0.9, y: -12, duration: 0.14, ease: 'power1.out' }, 0.9);
     }, section);

     return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="The Cinematic Journey"
      className="relative w-full h-[280vh] md:h-[340vh] bg-[#231A10]"
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-between">
        {/* Inner Layer: Scroll-Scrubbed Scenic Landscape Seen Through the Bus Window */}
        <div className="absolute inset-0 z-0">
          <VideoScrubber
            ref={journeyScrubberRef}
            id={VIDEO_ASSETS.scenicJourney.id}
            videoSrc={VIDEO_ASSETS.scenicJourney.videoSrc}
            posterSrc={VIDEO_ASSETS.scenicJourney.posterSrc}
            fallbackImg={LOCAL_IMAGES.galleryRealTeamBusHills}
            alt="Real tourist bus with travellers on mountain hills"
            cameraMode="cabin-window-glide"
            overlayClassName="bg-gradient-to-b from-[#231A10]/65 via-[#231A10]/30 to-[#231A10]/75"
          />
        </div>

        {/* Outer Layer (Chapter I): Luxury Tourist Coach Exterior that the camera zooms INTO */}
        <div
          ref={exteriorCoachLayerRef}
          className="absolute inset-0 z-10 overflow-hidden will-change-transform pointer-events-none"
        >
          <img
            src={LOCAL_IMAGES.galleryRealBusFront}
            alt="Real luxury tourist coach front on a scenic mountain road"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="w-full h-full object-cover object-center"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#231A10]/65 via-[#231A10]/30 to-[#231A10]/75"
            aria-hidden="true"
          />
        </div>

        {/* Optical Glass Sweep as Camera Enters the Bus Window */}
        <div
          ref={glassFlashRef}
          className="pointer-events-none absolute inset-y-0 -left-1/4 w-2/3 z-18 skew-x-[-22deg] will-change-transform opacity-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(251,248,241,0) 0%, rgba(251,248,241,0.35) 50%, rgba(126,42,59,0.22) 70%, rgba(251,248,241,0) 100%)',
          }}
          aria-hidden="true"
        />

        {/* Panoramic Coach Window Frame Overlay ("Through the Window — Scroll, the glass gives way") */}
        <div
          ref={windowMaskOverlayRef}
          className="pointer-events-none absolute inset-0 z-15 select-none overflow-hidden"
          aria-hidden="true"
        >
          <svg
            className="w-full h-full"
            viewBox="0 0 1920 1080"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <mask id="prince-coach-window-mask" maskUnits="userSpaceOnUse">
                <rect x="0" y="0" width="1920" height="1080" fill="white" />
                <rect
                  ref={windowCutoutRectRef}
                  x="240"
                  y="120"
                  width="1440"
                  height="840"
                  rx="120"
                  fill="black"
                />
              </mask>
            </defs>

            {/* Dark Espresso Cabin Surround Masked by the Panoramic Window */}
            <rect
              x="0"
              y="0"
              width="1920"
              height="1080"
              fill="#19120B"
              mask="url(#prince-coach-window-mask)"
            />

            {/* Window rim removed — no outline lines while scrolling */}
            <rect
              ref={windowInnerRimRef}
              x="240"
              y="120"
              width="1440"
              height="840"
              rx="120"
              fill="none"
              stroke="#FD6703"
              strokeWidth="0"
              strokeOpacity="0"
            />
          </svg>
        </div>

        {/* Scroll chapters — plain words over the moving view */}
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6">
          <div ref={slide1Ref} className="absolute max-w-2xl text-center opacity-0">
            <p className="text-xs uppercase tracking-[0.2em] text-white/70">College trips, school picnics, family holidays</p>
            <h3 className="mt-3 font-display text-4xl sm:text-5xl font-semibold text-white">Leave your busy days behind.</h3>
          </div>
          <div ref={slide2Ref} className="absolute max-w-2xl text-center opacity-0">
            <p className="text-xs uppercase tracking-[0.2em] text-white/70">Hills, waterfalls and open roads</p>
            <h3 className="mt-3 font-display text-4xl sm:text-5xl font-semibold text-white">Discover new places with your friends.</h3>
          </div>
          <div ref={slide3Ref} className="absolute max-w-2xl text-center opacity-0">
            <p className="text-xs uppercase tracking-[0.2em] text-white/70">Every trip is full of memories</p>
            <h3 className="mt-3 font-display text-4xl sm:text-5xl font-semibold text-white">Enjoy every mile of the journey.</h3>
          </div>
        </div>

        {/* Top HUD Bar */}
        <div className="relative z-20 pt-24 sm:pt-28 px-5 sm:px-8 lg:px-12">
          <div className="max-w-[1440px] mx-auto flex items-center justify-between border-b border-[#fcfcfc]/20 pb-3.5 text-[11px] font-mono uppercase tracking-[0.2em] text-[#fcfcfc]/85">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#FD6703]" />
              <span className="text-[#FD6703] font-bold">03</span>
              <span>THE CINEMATIC JOURNEY</span>
            </div>
            <div
              ref={windowHintRef}
              className="hidden sm:flex items-center gap-2 text-[#FD6703]"
            >
              <span>SCROLL • STEP INTO THE BUS</span>
            </div>
          </div>
        </div>

        {/* Bottom Telemetry & Progress */}
        <div className="relative z-20 pb-10 px-5 sm:px-8 lg:px-12">
          <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.2em] text-[#fcfcfc]/80">
              <span>PRINCE HOLIDAYS</span>
              <span>•</span>
              <span>PANORAMIC COACH VIEW</span>
            </div>

            <div className="w-full sm:w-56 h-[2px] bg-[#fcfcfc]/20 overflow-hidden rounded-full">
              <div
                ref={progressFillRef}
                className="h-full w-full bg-[#FD6703] origin-left scale-x-0"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
