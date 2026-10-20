'use client';

import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import {
  CameraMotionMode,
  createVideoScrubber,
  VideoScrubberController,
} from '../../lib/videoScrubber';
import { cn, isLowDataOrMobileConnection, prefersReducedMotion } from '../../lib/utils';

export interface VideoScrubberHandle {
  /** Imperative, allocation-free progress updates (avoids parent re-renders at 60fps) */
  setProgress: (progress: number) => void;
  setActive: (active: boolean) => void;
}

export interface VideoScrubberProps {
  /** Unique ID for coordinating active scrubber instance */
  id: string;
  /** Expected video path in /public/videos/... */
  videoSrc: string;
  /** Poster image path in /public/images/... */
  posterSrc: string;
  /** Bundled fallback image if poster path or video is missing */
  fallbackImg?: string;
  /** Accessible description of the scenic footage */
  alt: string;
  /** Normalized scroll progress (0 to 1) driven by parent ScrollTrigger.
   *  Optional when driving updates imperatively via the `handle` ref. */
  progress?: number;
  /** Whether the parent section is currently active or near the viewport */
  isActive?: boolean;
  /** Preload immediately (e.g., for hero) vs lazy load when near viewport */
  priority?: boolean;
  /** 3D camera motion profile for scroll-driven depth */
  cameraMode?: CameraMotionMode;
  /** Interpolation factor (0.05 - 0.35). Higher = tighter tracking, less lag */
  lerpFactor?: number;
  /** Optional className for wrapper */
  className?: string;
  /** Optional dark readability overlay opacity (0 to 1) */
  overlayClassName?: string;
}

/**
 * Reusable Scroll-Controlled Video & 3D Spatial Camera Fallback Component.
 *
 * Expected generated AI video placements:
 * - Hero section: `/public/videos/prince-holidays-hero.mp4`
 * - Scenic Journey section: `/public/videos/scenic-bus-journey.mp4`
 * - Closing CTA section: `/public/videos/prince-holidays-closing.mp4`
 *
 * Synchronizes video frame seeking and a multi-plane 3D camera dolly with scroll position
 * in both forward and reverse directions.
 */
export const VideoScrubber = React.forwardRef<VideoScrubberHandle, VideoScrubberProps>(({
  id,
  videoSrc,
  posterSrc,
  fallbackImg,
  alt,
  progress,
  isActive = true,
  priority = false,
  cameraMode = 'dolly-into-bus',
  lerpFactor = 0.14,
  className,
  overlayClassName,
}, ref) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fallbackWrapRef = useRef<HTMLDivElement | null>(null);
  const atmosphereRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<VideoScrubberController | null>(null);

  const [isVideoReady, setIsVideoReady] = useState(false);
  const [posterSource, setPosterSource] = useState<string>(posterSrc || fallbackImg || '');
  // Initialized to 'screen' to match server-rendered HTML; updated after mount
  // so coarse-pointer devices switch to 'normal' without a hydration mismatch.
  const [mixBlendMode, setMixBlendMode] = useState<'normal' | 'screen'>('screen');

  useEffect(() => {
    setPosterSource(posterSrc || fallbackImg || '');
  }, [posterSrc, fallbackImg]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
      setMixBlendMode('normal');
    }
  }, []);

  // Expose imperative handle so scroll-driven parents can push progress without re-rendering React.
  useImperativeHandle(ref, () => ({
    setProgress: (value: number) => {
      controllerRef.current?.setProgress(value);
    },
    setActive: (value: boolean) => {
      controllerRef.current?.setActive(value);
    },
  }), []);

  // Read scrollProgress from the parent before initializing the scrubber (avoid stale close).
  const scrollRef = useRef(progress);
  scrollRef.current = progress;

  // Initialize shared video scrubber controller
  useEffect(() => {
    const videoEl = videoRef.current;
    const fallbackEl = fallbackWrapRef.current;
    const atmosphereEl = atmosphereRef.current;
    if (!videoEl) return;

    const reducedMotion = prefersReducedMotion();
    const lowData = isLowDataOrMobileConnection();

    const controller = createVideoScrubber({
      id,
      video: videoEl,
      fallbackElement: reducedMotion ? null : fallbackEl,
      atmosphereElement: reducedMotion ? null : atmosphereEl,
      cameraMode,
      lerpFactor,
      onStateChange: ({ isVideoReady: ready }) => {
        setIsVideoReady(ready);
      },
    });
    controllerRef.current = controller;

    let observer: IntersectionObserver | null = null;
    let rAFId: number | null = null;

    if (!lowData) {
      if (priority) {
        controller.loadVideo();
        controller.setActive(true);
        // Push the initial scroll position so the first scroll frame already scrubs.
        rAFId = window.requestAnimationFrame(() => {
          controller.setProgress(scrollRef.current || 0);
        });
      } else if (typeof IntersectionObserver !== 'undefined' && containerRef.current) {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                controller.loadVideo();
                controller.setActive(true);
              } else {
                controller.setActive(false);
              }
            });
          },
          { rootMargin: '350px 0px 350px 0px', threshold: 0.01 }
        );
        observer.observe(containerRef.current);
      }
    }    const handleResize = () => {
      controller.refresh();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (observer) observer.disconnect();
      controller.destroy();
      controllerRef.current = null;
      if (rAFId) window.cancelAnimationFrame(rAFId);
      if (fallbackWrapRef.current) {
        fallbackWrapRef.current.style.transform = '';
        fallbackWrapRef.current.style.transformOrigin = '';
      }
      if (atmosphereRef.current) {
        atmosphereRef.current.style.transform = '';
        atmosphereRef.current.style.opacity = '';
      }
    };
  }, [id, priority, cameraMode, lerpFactor]);

  // Sync scroll progress & active state (skipped when progress is driven imperatively via the handle)
  useEffect(() => {
    const controller = controllerRef.current;
    if (!controller) return;
    controller.setActive(isActive);
    if (progress !== undefined) {
      controller.setProgress(progress);
    }
  }, [progress, isActive]);

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full h-full overflow-hidden bg-[#231A10] select-none', className)}
    >
      {/*
        High-Resolution 3D Camera-Tracked Poster Fallback Layer.
        Remains visible until the local MP4 video file at `videoSrc` has loaded metadata
        and can seek frames. Also animates with a realistic 3D camera push into the bus
        when the MP4 file has not been added to /public/videos/ yet.
      */}
      <div
        ref={fallbackWrapRef}
        className={cn(
          'absolute inset-0 w-full h-full will-change-transform transition-opacity duration-500',
          isVideoReady ? 'opacity-0 pointer-events-none' : 'opacity-100'
        )}
      >
        <img
          src={posterSource}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          onError={() => {
            if (fallbackImg && posterSource !== fallbackImg) {
              setPosterSource(fallbackImg);
            }
          }}
          className="w-full h-full object-cover object-center"
          decoding="async"
          draggable={false}
          {...(priority ? { fetchPriority: 'high' as const } : {})}
        />
      </div>

      {/*
        Scroll-Scrubbed HTML5 Video Element.
        Place generated AI video at: {videoSrc} (e.g. /public/videos/prince-holidays-hero.mp4)
      */}
      <video
        ref={videoRef}
        data-src={videoSrc}
        poster={posterSource}
        muted
        playsInline
        preload="metadata"
        tabIndex={-1}
        aria-label={alt}
        // Media load errors (e.g., missing MP4) are handled by handleError via
        // addEventListener in createVideoScrubber. This React handler acknowledges
        // them so React 19 does not surface the native Event as "[object Event]".
        onError={() => {}}
        className={cn(
          'absolute inset-0 w-full h-full object-cover object-center pointer-events-none transition-opacity duration-500',
          isVideoReady ? 'opacity-100' : 'opacity-0'
        )}
      />

      {/* Dynamic Golden-Hour Sunbeam & Coach Window Reflection Layer.
          mix-blend-mode: screen forces the compositor to re-blend this full-screen
          layer on every scroll frame — skipped on coarse pointers where it is a
          major mobile GPU cost during the first screens of scrolling. */}
      <div
        ref={atmosphereRef}
        className="pointer-events-none absolute -inset-1/4 z-10 will-change-transform"
        style={{
          background:
            'radial-gradient(ellipse 45% 35% at 62% 38%, rgba(126, 42, 59, 0.36) 0%, rgba(251, 248, 241, 0.14) 38%, rgba(35, 26, 16, 0) 75%)',
          mixBlendMode,
        }}
        aria-hidden="true"
      />

      {/* Warm golden-hour atmospheric grading */}
      <div
        className="absolute inset-0 bg-gradient-to-tr from-[#231A10]/45 via-transparent to-[#FD6703]/15 pointer-events-none"
        aria-hidden="true"
      />

      {overlayClassName && (
        <div
          className={cn('absolute inset-0 pointer-events-none', overlayClassName)}
          aria-hidden="true"
        />
      )}
    </div>
  );
});

VideoScrubber.displayName = 'VideoScrubber';
