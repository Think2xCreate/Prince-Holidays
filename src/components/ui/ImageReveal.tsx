'use client';

import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn, prefersReducedMotion } from '../../lib/utils';

gsap.registerPlugin(ScrollTrigger);

interface ImageRevealProps {
  src: string;
  alt: string;
  shape?: 'rect' | 'rounded' | 'arch' | 'pill';
  aspectClassName?: string;
  className?: string;
  imgClassName?: string;
  parallaxAmount?: number;
  caption?: string;
  priority?: boolean;
}

export const ImageReveal: React.FC<ImageRevealProps> = ({
  src,
  alt,
  shape = 'rounded',
  aspectClassName = 'aspect-[4/5]',
  className,
  imgClassName,
  parallaxAmount = 7,
  caption,
  priority = false,
}) => {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const maskRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const mask = maskRef.current;
    const img = imgRef.current;
    if (!wrap || !mask || !img) return;

    if (prefersReducedMotion()) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        mask,
        {
          clipPath: 'inset(14% 8% 14% 8%)',
          opacity: 0.2,
        },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          opacity: 1,
          duration: 1.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: wrap,
            start: 'top 84%',
            toggleActions: 'play none none none',
          },
        }
      );

      if (parallaxAmount > 0) {
        gsap.fromTo(
          img,
          { yPercent: -parallaxAmount, scale: 1.12 },
          {
            yPercent: parallaxAmount,
            scale: 1.04,
            ease: 'none',
            scrollTrigger: {
              trigger: wrap,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      }
    }, wrap);

    return () => ctx.revert();
  }, [parallaxAmount]);

  const shapeStyles: Record<string, React.CSSProperties> = {
    rect: { borderRadius: '4px' },
    rounded: { borderRadius: '18px' },
    arch: { borderRadius: '999px 999px 20px 20px' },
    pill: { borderRadius: '999px' },
  };

  return (
    <figure ref={wrapRef} className={cn('relative group', className)}>
      <div
        ref={maskRef}
        style={shapeStyles[shape]}
        className={cn(
          'relative w-full overflow-hidden bg-[#231A10] border border-[#D9D1C3]',
          aspectClassName
        )}
      >
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className={cn(
            'w-full h-full object-cover object-center will-change-transform transition-transform duration-700',
            imgClassName
          )}
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#231A10]/30 via-transparent to-transparent pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {caption && (
        <figcaption className="mt-2.5 flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.14em] text-[#6B6A63]">
          <span>{caption}</span>
          <span className="text-[#FD6703]">●</span>
        </figcaption>
      )}
    </figure>
  );
};
