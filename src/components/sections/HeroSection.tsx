'use client';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';
import { VIDEO_ASSETS, BUSINESS_CONFIG, LOCAL_IMAGES } from '../../data/business';
import { VideoScrubber, VideoScrubberHandle } from '../ui/VideoScrubber';
import { prefersReducedMotion } from '../../lib/utils';
gsap.registerPlugin(ScrollTrigger);
interface HeroSectionProps {
  onExploreJourneys?: () => void;
  onPlanTrip?: () => void;
}
// Props kept for API stability; the overlay CTAs they served were removed.
/**
 * SECTION 1 â€” CINEMATIC HERO SECTION
 * ULTRA-REALISTIC "MOVING INTO THE BUS" 4-PHASE SCROLL EXPERIENCE
 *
 * Progression across ~350vh of scroll distance:
 * - Phase 1 (0% â€“ 22%): Warm ivory (#fcfcfc) canvas with oversized "PRINCE HOLIDAYS"
 * During Phase 1, the ivory plate is cut open only by the giant "PRINCE HOLIDAYS"
 *   letters themselves; the letters carry the video, and the bus is revealed purely
 *   through the typography. As the user begins scrolling, the masked letters expand
 *   smoothly to reveal the full luxury white tourist bus driving on a misty mountain road.
 * - Phase 2 (22% â€“ 58%): Ultra-realistic 3D camera dolly INTO the tourist bus:
 *   The camera locks onto the coach's panoramic side window bay (transformOrigin 48% 40%)  *   and physically pushes from scale 1.0 -> 3.2x toward the bus window glass.
 *   As the exterior bus body & window frame pass around the viewer, a 3D Coach Cabin
 *   Interior Frame (ceiling ambient cove light, realistic side window pillars, seat-row
 *   silhouette, and optical glass reflection sweep) surrounds the viewport and opens into
 *   the first-person interior view looking out at the misty mountain landscape.
 * - Phase 3 (58% â€“ 86%): Aboard the coach â€” pure full-screen interior panoramic
 *   mountain view, no text overlay.
 * - Phase 4 (86% â€“ 100%): Smooth forward glide and seamless editorial transition into Section 2.
 */
export const HeroSection: React.FC<HeroSectionProps> = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  // Layer 1: Exterior Tourist Bus on Mountain Road (scales 1 -> 3.2 toward the bus window)
  const exteriorBusLayerRef = useRef<HTMLDivElement | null>(null);
  // Layer 2: Interior Cabin Panoramic View (revealed as camera crosses through the bus window)
  const interiorCabinLayerRef = useRef<HTMLDivElement | null>(null);
  const interiorLandscapeRef = useRef<HTMLDivElement | null>(null);
  const cabinFrameOverlayRef = useRef<HTMLDivElement | null>(null);
  const glassSweepRef = useRef<HTMLDivElement | null>(null);
  // Layer 3: Oversized PRINCE HOLIDAYS SVG Mask Plate
  const maskOverlayRef = useRef<HTMLDivElement | null>(null);
  // Layer 4: HUD, Headline & Transition Veil
  const phase1HudRef = useRef<HTMLDivElement | null>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement | null>(null);
  const bottomTransitionVeilRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const heroScrubberRef = useRef<VideoScrubberHandle | null>(null);
  const isHeroActiveRef = useRef(true);
  // NOTE: must start with the same fixed defaults the server rendered (1440x900).
  // A window-based lazy initializer causes a hydration attribute mismatch on the
  // hero SVG mask; the mount effect below syncs real dimensions immediately after.
  const [viewport, setViewport] = useState<{ width: number; height: number }>({
    width: 1440,
    height: 900,
  });
  useEffect(() => {
    // Debounced + thresholded: mobile URL-bar resize must not re-render the SVG mask per pixel.
    // Listens on window resize + orientationchange only. visualViewport is intentionally
    // excluded: on mobile it fires continuously while scrolling (URL bar shows/hides),
    // which would re-render the whole hero SVG mask mid-scroll and cause lag at the start
    // of a scroll. A 40px threshold keeps a slightly stale viewBox imperceptible.
    let scrollEndTimer: ReturnType<typeof setTimeout> | null = null;
    let isScrolling = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const onScroll = () => {
      isScrolling = true;
      if (scrollEndTimer) clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(() => {
        isScrolling = false;
        readSize();
      }, 150);
    };

    const readSize = () => {
      const w = Math.round(window.innerWidth) || 1440;
      const h = Math.round(window.innerHeight) || 900;
      setViewport((prev) =>
        Math.abs(prev.width - w) < 40 && Math.abs(prev.height - h) < 40
          ? prev
          : { width: w, height: h }
      );
    };
    const updateViewport = () => {
      // Don't re-render the SVG mask while the user is actively scrolling.
      if (isScrolling) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(updateViewport, 150);
        return;
      }
      if (timer) clearTimeout(timer);
      timer = setTimeout(readSize, 300);
    };
    // Sync once in case the viewport changed between first paint and effect.
    readSize();
    window.addEventListener('resize', updateViewport, { passive: true });
    window.addEventListener('orientationchange', updateViewport, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
      window.removeEventListener('scroll', onScroll);
      if (timer) clearTimeout(timer);
      if (scrollEndTimer) clearTimeout(scrollEndTimer);
    };
  }, []);
  // Scroll cue: drop the visitor one screen past the hero (the bus-boarding
  // moment), falling back to the next section if the DOM order shifts.
  const handleScrollCueClick = () => {
    const next = sectionRef.current?.nextElementSibling as HTMLElement | null;
    if (next) {
      next.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'start',
      });
      return;
    }
    window.scrollBy({
      top: window.innerHeight,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  };
  const vw = viewport.width;
  const vh = viewport.height;
  const cx = vw / 2;
  const cy = vh / 2;
  const availW = vw * 0.88;
  const princeFontSize = Math.round(Math.min(availW / 4.3, vh * 0.195));
  const holidaysFontSize = Math.round(Math.min(availW / 5.6, vh * 0.16));
  const princeY = Math.round(cy - vh * 0.16);
  const holidaysY = Math.round(cy + holidaysFontSize * 0.08);
  // Scroll cue sits just beneath the HOLIDAYS baseline (central-baseline text
  // extends ~0.36em below its anchor) with a small breathing gap.
  const cueTop = Math.round(holidaysY + holidaysFontSize * 0.36 + 22);
  // Touch/coarse-pointer devices get a lighter scroll timeline: fewer expensive
  // full-viewport layer transforms and more scroll smoothing so the very first
  // scroll stays buttery on mobile GPUs.
  const isTouchDevice =
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const exteriorBus = exteriorBusLayerRef.current;
    const interiorCabin = interiorCabinLayerRef.current;
    const interiorLandscape = interiorLandscapeRef.current;
    const cabinFrameOverlay = cabinFrameOverlayRef.current;
    const glassSweep = glassSweepRef.current;
    const maskOverlay = maskOverlayRef.current;
    const phase1Hud = phase1HudRef.current;
    const scrollIndicator = scrollIndicatorRef.current;
    const bottomVeil = bottomTransitionVeilRef.current;
    const progressBar = progressBarRef.current;
    if (!section || !sticky) return;
    const reducedMotion = prefersReducedMotion();
    const ctx = gsap.context(() => {
      if (reducedMotion) {
        if (maskOverlay) gsap.set(maskOverlay, { autoAlpha: 0 });
        if (exteriorBus) gsap.set(exteriorBus, { autoAlpha: 0 });
        if (interiorCabin) gsap.set(interiorCabin, { autoAlpha: 1, scale: 1 });
        if (scrollIndicator) gsap.set(scrollIndicator, { autoAlpha: 0 });
        return;
      }
      // Reset initial states
      if (bottomVeil) {
        gsap.set(bottomVeil, { opacity: 0 });
      }
      if (exteriorBus) {
        gsap.set(exteriorBus, {
          scale: 1,
          xPercent: 0,
          yPercent: 0,
          rotationX: 0,
          rotationY: 0,
          autoAlpha: 1,
          transformOrigin: '48% 40%',
        });
      }
      if (interiorCabin) {
        gsap.set(interiorCabin, {
          autoAlpha: 0,
          scale: 0.55,
          rotationX: 0,
          rotationY: 0,
          transformOrigin: '50% 50%',
        });
      }
      if (cabinFrameOverlay) {
        gsap.set(cabinFrameOverlay, {
          scale: 0.78,
          opacity: 0,
          transformOrigin: '50% 50%',
        });
      }
      if (interiorLandscape) {
        gsap.set(interiorLandscape, { yPercent: 0, scale: 1 });
      }
       const tl = gsap.timeline({
         scrollTrigger: {
           trigger: section,
           start: 'top top',
           end: 'bottom bottom',
           // Low smoothing so fast flings track the finger instead of
           // lagging ~1s behind (the old 0.8 read as stuck/frozen mid-fling).
           scrub: isTouchDevice ? 0.3 : 0.4,
           // NOTE: no invalidateOnRefresh â€” tween values are fixed at mount,
           // so re-recording them on every refresh (image/font load) only
           // caused visible jumps and flashing at the top and bottom.
           onUpdate: (self) => {
             const p = self.progress;
             // Drive the video scrubber imperatively â€” no React re-render at 60fps.
             heroScrubberRef.current?.setProgress(p);
             if (progressBar && !(self.direction < 0 && p <= 0.01)) {
               progressBar.style.transform = `scaleX(${p.toFixed(4)})`;
             }
           },
           onToggle: (self) => {
             isHeroActiveRef.current = self.isActive;
             heroScrubberRef.current?.setActive(self.isActive);
           },
         },
       });
      // =========================================================================
      // PHASE 1 -> PHASE 2A (0.00 -> 0.24):
      // Expand PRINCE HOLIDAYS wordmark mask to reveal the full luxury tourist bus
      // =========================================================================
      if (scrollIndicator) {
        tl.to(
          scrollIndicator,
          { autoAlpha: 0, y: -14, duration: 0.08, ease: 'power2.out' },
          0.01
        );
      }
      if (phase1Hud) {
        tl.to(
          phase1Hud,
          { autoAlpha: 0, y: -18, duration: 0.12, ease: 'power2.inOut' },
          0.06
        );
      }
      // Capped at 3.5x: beyond ~4x the letters exceed the viewport and the
      // frame degenerates into giant ivory shards (the fractured/striped look
      // on fast scrolls). The plate dissolves as the letters swell instead.
      // The zoom runs on the overlay DIV (an HTML box: 50% 50% is exact),
      // never on the inner SVG <g> â€” GSAP measures an SVG group's bbox once
      // (often pre-font, wrong width) and both the old pixel svgOrigin and
      // the bbox transformOrigin slid the text sideways (left on mobile,
      // right on desktop). A full-viewport div scaled about its own center
      // is symmetric on every screen by construction.
      // Full-viewport mask scale is the most compositor-heavy tween â€” skip it
      // on touch devices (the wordmark plate still fades out, which is cheap).
      if (!isTouchDevice && maskOverlay) {
        tl.fromTo(
          maskOverlay,
          {
            scale: 1,
            transformOrigin: '50% 50%',
          },
          {
            scale: 3.5,
            transformOrigin: '50% 50%',
            ease: 'power2.inOut',
            duration: 0.2,
          },
          0
        );
      }
      if (maskOverlay) {
        tl.to(
          maskOverlay,
          {
            autoAlpha: 0,
            duration: 0.08,
            ease: 'power2.out',
          },
          0.12
        );
      }
      // =========================================================================
      // PHASE 2B (0.18 -> 0.56):
      // ULTRA-REALISTIC CAMERA DOLLY DIRECTLY INTO THE TOURIST BUS WINDOW!
      // The exterior bus zooms from 1.0x -> 3.2x centered on the panoramic glass bay
      // (48% 40%), so the viewer physically flies right into the side window of the bus.
      // =========================================================================
      // Large-image scale tween â€” skipped on touch devices; the bus still
      // dissolves into the cabin via autoAlpha (compositor-cheap).
      if (!isTouchDevice && exteriorBus) {
        tl.to(
          exteriorBus,
          {
            scale: 3.2,
            xPercent: 2,
            yPercent: 6,
            ease: 'power2.in',
            duration: 0.36,
          },
          0.18
        );
      }
      // As the camera crosses through the window glass (0.42 -> 0.56), dissolve exterior glass into interior cabin
      if (exteriorBus) {
        tl.to(
          exteriorBus,
          {
            autoAlpha: 0,
            duration: 0.14,
            ease: 'power2.inOut',
          },
          0.42
        );
      }
      // NOTE: no standalone tweens on `sticky` or `interiorLandscape` here.
      // They were driven twice (once here, once in the main timeline) and the
      // two scrubbers fought over the same properties â€” that caused flicker.
      // The main timeline below is now the single driver of landscape motion.
      // Optical glass reflection sweep â€” skipped on touch devices (large layer,
      // xPercent transform every scroll frame).
      if (!isTouchDevice && glassSweep) {
        tl.fromTo(
          glassSweep,
          { xPercent: -130, opacity: 0 },
          { xPercent: 130, opacity: 0.9, duration: 0.24, ease: 'power2.inOut' },
          0.32
        );
        tl.to(glassSweep, { opacity: 0, duration: 0.08 }, 0.54);
      }
      // Interior Coach Cabin & Panoramic View emerges from inside the bus window
      if (interiorCabin) {
        tl.to(
          interiorCabin,
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.26,
            ease: 'power2.out',
          },
          0.34
        );
      }
      // 3D Coach Cabin Frame â€” on touch devices just fade it in (no per-frame scale
      // transforms on the large SVG frame layer).
      if (cabinFrameOverlay) {
        tl.to(
          cabinFrameOverlay,
          {
            opacity: 1,
            scale: 1,
            duration: 0.18,
            ease: 'power2.out',
          },
          0.35
        );
        // Slowly push cabin pillars outward as we settle into the front panoramic deck
        if (!isTouchDevice) {
          tl.to(
            cabinFrameOverlay,
            {
              scale: 1.18,
              opacity: 0.85,
              duration: 0.42,
              ease: 'none',
            },
            0.53
          );
        }
      }
      // Continuous forward motion of the mountain landscape â€” skipped on touch
      // devices (large image layer scaling every frame).
      if (!isTouchDevice && interiorLandscape) {
        tl.fromTo(
          interiorLandscape,
          { scale: 1.05, yPercent: 2 },
          { scale: 1.24, yPercent: -4, ease: 'none', duration: 0.62 },
          0.36
        );
      }
      // =========================================================================
      // PHASE 3 (0.48 -> 0.84): ABOARD THE BUS â€” pure panoramic view, no overlay.
      // =========================================================================
      // =========================================================================
      // PHASE 4 (0.85 -> 1.00):
      // Smooth Editorial Transition into Section 2
      // =========================================================================
      if (bottomVeil) {
        tl.to(
          bottomVeil,
          {
            opacity: 1,
            duration: 0.16,
            ease: 'power1.inOut',
          },
          0.84
        );
      }
      // NOTE: global ticker/beforeunload side-effects removed â€” they leaked
      // listeners on every mount and disturbed the shared Lenis ticker.
    }, section);
    return () => ctx.revert();
  }, []);
  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-label="Prince Holidays Cinematic Introduction"
      className="relative w-full h-[310vh] md:h-[350vh] bg-[#fcfcfc]"
    >
      {/* Sticky Full-Screen 3D Viewport */}
      <div
        ref={stickyRef}
        className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-between bg-[#231A10]"
        style={{ perspective: '1400px' }}
      >
        {/* =====================================================================
            LAYER 1: EXTERIOR LUXURY TOURIST BUS ON MOUNTAIN ROAD
            Zooms 1.0x -> 3.2x directly toward the coach's panoramic window bay
           ===================================================================== */}
        <div
          ref={exteriorBusLayerRef}
          className="absolute inset-0 z-10 will-change-transform"
        >
          <VideoScrubber
            ref={heroScrubberRef}
            id={VIDEO_ASSETS.hero.id}
            videoSrc={VIDEO_ASSETS.hero.videoSrc}
            posterSrc={VIDEO_ASSETS.hero.posterSrc}
            fallbackImg={VIDEO_ASSETS.hero.fallbackImg}
            alt={VIDEO_ASSETS.hero.alt}
            priority
            lerpFactor={isTouchDevice ? 0.35 : 1}
            cameraMode="dolly-into-bus"
            overlayClassName="bg-gradient-to-t from-[#231A10]/65 via-transparent to-[#231A10]/20"
          />
        </div>
        {/* =====================================================================
            LAYER 2: INTERIOR COACH CABIN & PANORAMIC WINDSHIELD VIEW
            Revealed as the camera crosses through the tourist bus window glass
           ===================================================================== */}
        <div
          ref={interiorCabinLayerRef}
          className="absolute inset-0 z-12 overflow-hidden will-change-transform opacity-0 invisible"
        >
          {/* Scenic Mountain Road Gliding Outside the Bus Panoramic Glass */}
          <div
            ref={interiorLandscapeRef}
            className="absolute inset-0 w-full h-full will-change-transform"
          >
            <img
              src={LOCAL_IMAGES.munnar}
              alt="Panoramic mountain tea hills viewed from inside the luxury tourist bus"
              loading="eager"
              className="w-full h-full object-cover object-center"
              decoding="async"
              draggable={false}
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#231A10]/85 via-[#231A10]/30 to-[#231A10]/55"
              aria-hidden="true"
            />
          </div>
          {/* 3D Realistic Tourist Bus Cabin Architecture Frame (Window Pillars, Roof Cove Light, Seat Silhouettes) */}
          <div
            ref={cabinFrameOverlayRef}
            className="pointer-events-none absolute inset-0 z-10 will-change-transform"
            aria-hidden="true"
          >
            <svg
              className="w-full h-full"
              viewBox="0 0 1920 1080"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="cabinRoofGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16100A" stopOpacity="0.96" />
                  <stop offset="65%" stopColor="#231A10" stopOpacity="0.78" />
                  <stop offset="100%" stopColor="#231A10" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="cabinDashGrad" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#140E08" stopOpacity="0.96" />
                  <stop offset="60%" stopColor="#231A10" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#231A10" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="wineCoveLight" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#FD6703" stopOpacity="0" />
                  <stop offset="20%" stopColor="#FD6703" stopOpacity="0.85" />
                  <stop offset="50%" stopColor="#FBF8F1" stopOpacity="0.95" />
                  <stop offset="80%" stopColor="#FD6703" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#FD6703" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Top Coach Ceiling Canopy & Overhead Parcel Rack Silhouette */}
              <path
                d="M0,0 L1920,0 L1920,165 Q960,95 0,165 Z"
                fill="url(#cabinRoofGrad)"
              />
              {/* Warm Golden Ambient LED Cove Strip along the Coach Ceiling */}
              <path
                d="M140,128 Q960,68 1780,128"
                fill="none"
                stroke="url(#wineCoveLight)"
                strokeWidth="3"
              />
              {/* Loveseat-style side reading lamps between the front and rear window bays */}
              <g fill="#FD6703" opacity="0.9">
                <circle cx="620" cy="156" r="2.2" />
                <circle cx="820" cy="156" r="2.2" />
                <circle cx="1100" cy="156" r="2.2" />
                <circle cx="1300" cy="156" r="2.2" />
                <circle cx="1500" cy="156" r="2.2" />
              </g>
              {/* Left & Right Panoramic Coach Window Pillars (A-Pillars) */}
              <path
                d="M0,0 L150,0 L95,1080 L0,1080 Z"
                fill="#16100A"
                opacity="0.88"
              />
              <path
                d="M1920,0 L1770,0 L1825,1080 L1920,1080 Z"
                fill="#16100A"
                opacity="0.88"
              />
              {/* Interior hand-rail / grab handle running along the roofline */}
              <path
                d="M170,138 L1750,138"
                fill="none"
                stroke="#FBF8F1"
                strokeWidth="1.2"
                strokeOpacity="0.22"
              />
              {/* Bottom Cabin Dashboard / Panoramic Sill Vignette */}
              <path
                d="M0,1080 L1920,1080 L1920,910 Q960,965 0,910 Z"
                fill="url(#cabinDashGrad)"
              />
              {/* No windshield rim or center divider â€” removed per request to keep the view clean */}              </svg>
          </div>
        </div>
        {/* Optical Window Glass Reflection Sweep as Camera Crosses Into the Bus */}
        <div
          ref={glassSweepRef}
          className="pointer-events-none absolute inset-y-0 -left-1/4 w-2/3 z-25 skew-x-[-24deg] will-change-transform opacity-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(251,248,241,0) 0%, rgba(251,248,241,0.42) 42%, rgba(126,42,59,0.32) 60%, rgba(20,14,8,0.55) 88%, rgba(251,248,241,0) 100%)',
          }}
          aria-hidden="true"
        />
        {/* =====================================================================
            LAYER 3: OVERSIZED SVG MASKED WORDMARK ("PRINCE HOLIDAYS")
           ===================================================================== */}
        <div
          ref={maskOverlayRef}
          className="absolute inset-0 z-20 pointer-events-none select-none overflow-hidden"
          aria-hidden="true"
        >
          <svg
            className="w-full h-full"
            viewBox={`0 0 ${vw} ${vh}`}
            preserveAspectRatio="none"
          >
            <defs>
              <mask id="prince-holidays-hero-mask" maskUnits="userSpaceOnUse">
                <rect x="0" y="0" width={vw} height={vh} fill="white" />
                <g>
                  <text
                    x={cx}
                    y={princeY}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="black"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 700,
                      fontSize: `${princeFontSize}px`,
                      letterSpacing: '-0.03em',
                    }}
                  >
                    PRINCE
                  </text>
                  <text
                    x={cx}
                    y={holidaysY}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="black"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 700,
                      fontSize: `${holidaysFontSize}px`,
                      letterSpacing: '-0.025em',
                    }}
                  >
                    HOLIDAYS
                  </text>
                </g>
              </mask>
            </defs>
            {/* Warm Ivory Plate Masked by the Oversized Wordmark */}
            <rect
              x="0"
              y="0"
              width={vw}
              height={vh}
              fill="#fcfcfc"
              mask="url(#prince-holidays-hero-mask)"
            />
          </svg>
        </div>
        {/* Phase 3 â€” pure panoramic view, no text overlay */}
        {/* Scroll cue â€” plain editorial instruction set directly beneath the
            HOLIDAYS baseline, tappable so the visitor knows to scroll on. */}
        <div
          ref={scrollIndicatorRef}
          className="absolute inset-x-0 z-30 flex justify-center pointer-events-none px-6"
          style={{ top: cueTop }}
        >
          <button
            type="button"
            onClick={handleScrollCueClick}
            aria-label="Scroll down to step inside the bus"
            className="pointer-events-auto group flex flex-col items-center gap-2 cursor-pointer px-4 py-1"
          >
            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.24em] text-[#231A10]">
              Scroll to step inside the bus
            </span>
            <span className="flex flex-col items-center" aria-hidden="true">
              <span className="w-[1px] h-6 bg-gradient-to-b from-[#FD6703] to-[#FD6703]/10" />
              <ChevronDown className="w-4 h-4 -mt-1 text-[#FD6703] motion-safe:animate-bounce" />
            </span>
          </button>
        </div>
        {/* Phase 4 Smooth Editorial Transition Veil into Section 2 */}
        <div
          ref={bottomTransitionVeilRef}
          className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#fcfcfc] via-[#fcfcfc]/65 to-transparent z-25 opacity-0"
          aria-hidden="true"
        />
      </div>
    </section>
  );
};

