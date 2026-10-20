'use client';

import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { VIDEO_ASSETS, BUSINESS_CONFIG, buildWhatsAppUrl } from '../../data/business';
import { VideoScrubber, VideoScrubberHandle } from '../ui/VideoScrubber';
import { prefersReducedMotion } from '../../lib/utils';

gsap.registerPlugin(ScrollTrigger);

interface ClosingSectionProps {
  onPlanTrip?: () => void;
}

/**
 * SECTION 12 — FINAL CINEMATIC CTA
 *
 * Full-screen closing section with a scenic bus journey:
 * - Expected video: `/public/videos/prince-holidays-closing.mp4`
 * - Poster fallback: `/public/images/cta_mountain_road.jpg`
 * - Headline: "The Road Is Calling."
 * - Supporting copy: "Your next memorable journey is just one conversation away."
 * - Buttons: "Plan Your Trip" and "Chat on WhatsApp"
 * - Subtle scroll-driven video reveal and graceful transition into the footer.
 */
export const ClosingSection: React.FC<ClosingSectionProps> = ({ onPlanTrip }) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const videoWrapRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const closingScrubberRef = useRef<VideoScrubberHandle | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    const videoWrap = videoWrapRef.current;
    const content = contentRef.current;
    if (!section || !frame || !content) return;

    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Scroll-driven video scrub and frame reveal
      gsap.fromTo(
        frame,
        { clipPath: 'inset(6% 3% 0% 3% round 28px 28px 0px 0px)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)',
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            end: 'bottom top',
            scrub: 0.6,
            onUpdate: (self) => {
              // Imperative progress push — renders zero React updates while scrubbing.
              closingScrubberRef.current?.setProgress(self.progress);
            },
            onToggle: (self) => {
              closingScrubberRef.current?.setActive(self.isActive);
            },
          },
        }
      );

      // Continuation of the video-scroll above: keep drifting the frame as you scroll.
      gsap.fromTo(
        content,
        { y: 50 },
        {
          y: -50,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
        }
      );

      // Ending video-scroll: as the footer approaches, push into the video
      // and fade the words away so the section closes on motion, not a hard cut.
      if (videoWrap) {
        gsap.fromTo(
          videoWrap,
          { scale: 1 },
          {
            scale: 1.18,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'center center',
              end: 'bottom top',
              scrub: 0.6,
            },
          }
        );
      }
      gsap.to(content, {
        autoAlpha: 0,
        y: -70,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'center 60%',
          end: 'bottom top',
          scrub: 0.6,
        },
      });

      const items = content.querySelectorAll('.closing-reveal');
      if (items.length) {
        gsap.fromTo(
          items,
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 68%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const handlePlanClick = () => {
    if (onPlanTrip) {
      onPlanTrip();
      return;
    }
    const enquiryEl = document.getElementById('enquiry');
    if (enquiryEl) {
      enquiryEl.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    }
  };

  const whatsappHref = buildWhatsAppUrl(
    `Hello ${BUSINESS_CONFIG.name}, I would like to plan a trip with your team.`
  );

  return (
    <section
      ref={sectionRef}
      aria-label="The Road Is Calling"
      className="relative w-full min-h-[60vh] sm:min-h-[65vh] bg-[#fcfcfc] pt-0 sm:pt-0 flex flex-col"
    >
      <div
        ref={frameRef}
        className="relative flex-1 min-h-[55vh] sm:min-h-[60vh] w-full overflow-hidden bg-[#231A10] flex flex-col justify-between"
      >
        {/* Scroll-Scrubbed Closing Video + Poster Fallback */}
        <div ref={videoWrapRef} className="absolute inset-0 z-0 will-change-transform">
          <VideoScrubber
            ref={closingScrubberRef}
            id={VIDEO_ASSETS.closing.id}
            videoSrc={VIDEO_ASSETS.closing.videoSrc}
            posterSrc={VIDEO_ASSETS.closing.posterSrc}
            fallbackImg={VIDEO_ASSETS.closing.fallbackImg}
            alt={VIDEO_ASSETS.closing.alt}
            cameraMode="horizon-departure"
            overlayClassName="bg-gradient-to-t from-[#231A10] via-[#231A10]/55 to-[#231A10]/40"
          />
        </div>

        {/* Top Editorial Metadata */}
        <div className="relative z-10 pt-12 sm:pt-16 px-5 sm:px-8 lg:px-12">
          <div className="max-w-[1440px] mx-auto flex items-center justify-between border-b border-[#fcfcfc]/20 pb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-[#fcfcfc]/80">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#FD6703]" />
              <span>11 • FINAL HORIZON</span>
            </div>
            <span>{BUSINESS_CONFIG.wordmark}</span>
          </div>
        </div>

        {/* Center Closing Headline & Actions */}
        <div
          ref={contentRef}
          className="relative z-10 my-auto px-5 sm:px-8 lg:px-12 py-16 text-center"
        >
          <div className="max-w-3xl mx-auto">
            <span className="closing-reveal inline-block font-mono text-xs uppercase tracking-[0.24em] text-[#FD6703] mb-4">
              Ready when you are — final step
            </span>

            <h2 className="closing-reveal font-display text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-[#FBF8F1] leading-[1.04]">
              The Road Is{' '}
              <span className="font-editorial-serif italic font-normal text-[#FD6703]">
                Calling.
              </span>
            </h2>

            <p className="closing-reveal mt-5 text-base sm:text-xl text-[#fcfcfc]/90 max-w-xl mx-auto leading-relaxed">
              One call or WhatsApp message is all it takes. Tell us your place and dates — we do the rest.
            </p>

            <div className="closing-reveal mt-10 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={handlePlanClick}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#FD6703] text-[#FBF8F1] hover:bg-[#fcfcfc] hover:text-[#231A10] font-mono text-xs uppercase tracking-[0.18em] transition-all duration-300 cursor-pointer shadow-sm"
              >
                <span>Plan Your Trip</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#FBF8F1]/10 backdrop-blur-sm border border-[#fcfcfc]/40 text-[#FBF8F1] hover:bg-[#FBF8F1] hover:text-[#231A10] font-mono text-xs uppercase tracking-[0.18em] transition-all duration-300"
              >
                <MessageCircle className="w-4 h-4 text-[#FD6703]" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Graceful Gradient Transition into Footer */}
        <div className="relative z-10 h-16 bg-gradient-to-b from-transparent to-[#231A10]" />
      </div>
    </section>
  );
};
