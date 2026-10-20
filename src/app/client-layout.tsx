'use client';

import React, { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scheduleScrollTriggerRefresh } from '../lib/animations';
import { prefersReducedMotion } from '../lib/utils';

gsap.registerPlugin(ScrollTrigger);

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  // Initialize Lenis smooth scrolling integrated with GSAP's ticker & ScrollTrigger
  useEffect(() => {
    if (typeof window === 'undefined' || prefersReducedMotion()) {
      return;
    }

    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    // Touch devices scroll natively: Lenis' touch smoothing stacked a second
    // interpolator on top of the hero scroll-scrub timeline, which made the
    // page feel laggy/stuck at the start on mobile. ScrollTrigger reads
    // window.scrollY natively, so native touch scrolling is both smoother
    // (no double interpolation) and lower-CPU on phones.
    if (!isTouchDevice) {
      const lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
      });

      lenis.on('scroll', ScrollTrigger.update);

      const updateTicker = (time: number) => {
        lenis.raf(time * 1000);
      };

      gsap.ticker.add(updateTicker);

      const cleanupRefresh = scheduleScrollTriggerRefresh();

      return () => {
        cleanupRefresh();
        gsap.ticker.remove(updateTicker);
        lenis.destroy();
      };
    }

    const cleanupRefreshTouch = scheduleScrollTriggerRefresh();
    return () => {
      cleanupRefreshTouch();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#231A10] flex flex-col font-sans selection:bg-[#FD6703]/20 selection:text-[#231A10] relative">
      {children}
    </div>
  );
}