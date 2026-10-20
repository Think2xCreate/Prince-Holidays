'use client';

import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { Menu, X, ArrowUpRight, Phone } from 'lucide-react';
import { NAV_ITEMS } from '../../data/navigation';
import { BUSINESS_CONFIG } from '../../data/business';
import { cn, prefersReducedMotion } from '../../lib/utils';

interface NavbarProps {
  onPlanTrip?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onPlanTrip }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Navbar reveal state: read scrollY at most once per animation frame instead of
    // on every scroll event — keeps the main thread free at the start of a scroll.
    let rafId = 0;
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 80);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Active-section highlighting via IntersectionObserver — no offsetTop layout
    // reads on every scroll frame (the previous loop re-laid-out the page each frame).
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '0px 0px -65% 0px', threshold: 0 }
    );

    const sectionIds = ['hero', 'about', 'experiences', 'destinations', 'gallery', 'enquiry'];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      ticking = false;
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, []);

  // Lock body scroll & animate mobile menu when opened
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
      if (mobileMenuRef.current && !prefersReducedMotion()) {
        const items = mobileMenuRef.current.querySelectorAll('.mobile-nav-item');
        gsap.fromTo(
          items,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, stagger: 0.06, ease: 'power3.out' }
        );
      }
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Close mobile menu on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  const scrollToSection = (sectionId: string) => {
    setMobileOpen(false);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    }
  };

  const handlePlanTripClick = () => {
    setMobileOpen(false);
    if (onPlanTrip) {
      onPlanTrip();
    } else {
      scrollToSection('enquiry');
    }
  };

  return (
    <>
      <header
        className={cn(
          // Only transform/opacity/background transition — never backdrop-filter
          // (animating an animated blur on mobile tanks the first scroll frames).
          'fixed top-0 left-0 right-0 z-50 transition-[transform,opacity,background-color,border-color] duration-500',
          // Hidden at page open (over the hero wordmark); revealed once the visitor scrolls.
          // Backdrop blur only on sm+ : full-screen backdrop-filter over the hero
          // is a major mobile GPU cost exactly at the start of scrolling.
          isScrolled
            ? 'translate-y-0 opacity-100 bg-[#fcfcfc]/95 sm:bg-[#fcfcfc]/90 sm:backdrop-blur-md border-b border-[#D9D1C3] py-3.5'
            : '-translate-y-full opacity-0 pointer-events-none bg-transparent py-5 sm:py-6'
        )}
      >
        <div className="w-full px-3 sm:px-4 grid grid-cols-[auto_1fr_auto] items-center gap-4">
          {/* Left corner: Brand Logo & Wordmark */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('hero');
            }}
            className="group inline-flex items-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FD6703]"
            aria-label="Prince Holidays home"
          >
            <img
              src="/images/prince-holidays-logo.png"
              alt="Prince Holidays Logo"
              loading="eager"
              className="h-11 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </a>

          {/* Center: Minimal Navigation Links */}
          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex items-center justify-center gap-8"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.sectionId;
              return (
                <a
                  key={item.sectionId}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.sectionId);
                  }}
                  className={cn(
                    'relative py-1 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-300',
                    isActive
                      ? 'text-[#FD6703] font-bold'
                      : 'text-[#231A10]/80 hover:text-[#FD6703]'
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      'absolute left-0 right-0 -bottom-0.5 h-[1.5px] bg-[#FD6703] transition-transform duration-300 origin-left',
                      isActive ? 'scale-x-100' : 'scale-x-0'
                    )}
                    aria-hidden="true"
                  />
                </a>
              );
            })}
          </nav>

          {/* Right corner: Primary Action & Mobile Toggle */}
          <div className="flex items-center justify-end gap-3 sm:gap-4">
            {/* Desktop: Plan a Trip (text + icon) */}
            <button
              type="button"
              onClick={handlePlanTripClick}
              className="hidden lg:inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-[#231A10] text-[#fcfcfc] hover:bg-[#FD6703] hover:text-[#FBF8F1] font-mono text-[11px] uppercase tracking-[0.16em] transition-all duration-300 cursor-pointer"
            >
              <span>Plan a Trip</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile toggle: Menu button at the right corner */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation-drawer"
              aria-label="Open navigation menu"
              className="lg:hidden p-2 rounded-full border border-[#D9D1C3] text-[#231A10] hover:border-[#FD6703] hover:text-[#FD6703] transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div
          id="mobile-navigation-drawer"
          ref={mobileMenuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className="fixed inset-0 z-[60] bg-[#fcfcfc] flex flex-col justify-between p-6 sm:p-10 lg:hidden"
        >
          <div className="flex items-center justify-between pb-5 border-b border-[#D9D1C3]">
            <div className="flex items-center">
              <img
                src="/images/prince-holidays-logo.png"
                alt="Prince Holidays Logo"
                loading="lazy"
                className="h-10 w-auto object-contain"
              />
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation menu"
              className="p-2 rounded-full border border-[#D9D1C3] text-[#231A10] hover:border-[#FD6703] hover:text-[#FD6703] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav aria-label="Mobile navigation links" className="my-auto py-8 space-y-5">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.sectionId}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.sectionId);
                }}
                className="mobile-nav-item group flex items-baseline justify-between border-b border-[#D9D1C3]/60 pb-4 text-[#231A10] hover:text-[#FD6703] transition-colors"
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-2xl sm:text-3xl font-semibold tracking-tight">
                    {item.label}
                  </span>
                </div>
                <ArrowUpRight className="w-5 h-5 text-[#FD6703] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            ))}
          </nav>
        </div>
      )}
    </>
  );
};
