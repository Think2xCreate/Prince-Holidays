'use client';

import React, { useEffect, useState } from 'react';
import gsap from 'gsap';
import { X, Send } from 'lucide-react';
import { BUSINESS_CONFIG } from '../../data/business';
import { cn, prefersReducedMotion } from '../../lib/utils';

/**
 * FirstVisitQuickContact
 *
 * A simple, warm first-visit contact card shown ONCE for first-time visitors on the
 * Home page only. Collects Name, Phone Number and a short message, then composes a  * pre-filled WhatsApp chat with our team.
 *
 * - Shown after a short settle delay (defaults to ~5s after first paint) so it never
 *   interrupts the opening hero.
 * - Dismissed state persists in localStorage ("prince-quick-contact-done"), so it
 *   appears only on the first visit and never again.
 * - Respects prefers-reduced-motion (fade only, no slide).
 * - Honest behavior: nothing is transmitted automatically — the visitor reviews their
 *   details then taps "Send on WhatsApp" which opens wa.me with the composed text.
 */
export const FirstVisitQuickContact: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    // Home page only, first visit only.
    const isHomePage = window.location.pathname === '/' || window.location.pathname === '/index.html';
    if (!isHomePage) return;
    try {
      if (localStorage.getItem('prince-quick-contact-done')) return;
    } catch {
      /* storage unavailable — still allow once per session */
    }

    const showTimer = window.setTimeout(() => {
      if (document.body.getAttribute('data-modal-open') === 'true') return;
      setMounted(true);
    }, 4000);

    return () => window.clearTimeout(showTimer);
  }, []);

  // Animate in after mount
  useEffect(() => {
    if (!mounted) return;
    const reduced = prefersReducedMotion();
    const raf = window.requestAnimationFrame(() => {
      setVisible(true);
      if (!reduced) {
        // Card slides up into place once the wrapper is already visible.
        const settleTimer = window.setTimeout(() => {
          setEntered(true);
        }, 30);
        return () => window.clearTimeout(settleTimer);
      }
      setEntered(true);
    });
    return () => window.cancelAnimationFrame(raf);
  }, [mounted]);

  const dismiss = () => {
    gsap.to('#quick-contact-card', {
      opacity: 0,
      y: 24,
      duration: prefersReducedMotion() ? 0.01 : 0.3,
      ease: 'power2.in',
      onComplete: () => {
        setVisible(false);
        setMounted(false);
      },
    });
    try {
      localStorage.setItem('prince-quick-contact-done', '1');
    } catch {
      /* ignore */
    }
  };

  const validate = (): boolean => {
    const nextErrors: { name?: string; phone?: string } = {};
    if (!name.trim()) nextErrors.name = 'Please enter your name';
    const digits = phone.replace(/\D/g, '');
    if (!digits) {
      nextErrors.phone = 'Please enter your phone number';
    } else if (digits.length < 7 || digits.length > 15) {
      nextErrors.phone = 'Enter a valid phone number (7–15 digits)';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const buildWhatsAppLink = (): string => {
    const text = [
      `Hello ${BUSINESS_CONFIG.name},`,
      ``,
      `I am ${name.trim()}.`,
      `Phone: ${phone.trim()}`,
      message.trim() ? `Message: ${message.trim()}` : `I would like to plan a trip. Please contact me.`,
    ].join('\n');
    return `${BUSINESS_CONFIG.whatsappBaseUrl}?text=${encodeURIComponent(text)}`;
  };

  const handleSend = () => {
    if (!validate()) return;
    window.open(buildWhatsAppLink(), '_blank', 'noopener,noreferrer');
    dismiss();
  };

  if (!mounted) return null;

  return (
    <div
      className={cn(
        'fixed z-50 bottom-5 right-5 left-5 sm:left-auto sm:bottom-6 sm:right-6 sm:max-w-sm transition-opacity duration-300',
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
      role="dialog"
      aria-modal="false"
      aria-label="Quick contact via WhatsApp"
    >
      <div
        id="quick-contact-card"
        className={cn(
          'relative rounded-2xl bg-[#fcfcfc] border border-[#D9D1C3] shadow-[0_20px_50px_-20px_rgba(35,26,16,0.4)] overflow-hidden transition-all duration-500 ease-out',
          entered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        )}
      >
        {/* Header strip */}
        <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-4 border-b border-[#D9D1C3]/70">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#FD6703]">
              First Visit
            </span>
            <h3 className="mt-1 font-display text-lg font-semibold text-[#231A10] leading-snug">
              Planning a trip? Say hello.
            </h3>
            <p className="mt-0.5 text-xs text-[#6B6A63]">
              Send a quick hello — we reply on WhatsApp.
            </p>
          </div>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Close quick contact"
            className="shrink-0 p-1.5 rounded-full border border-[#D9D1C3] text-[#231A10]/70 hover:text-[#FD6703] hover:border-[#FD6703] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Simple form: Name / Phone / Message */}
        <form
          className="px-5 pt-4 pb-5 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          noValidate
        >
          <div>
            <label htmlFor="qc-name" className="sr-only">
              Your name
            </label>
            <input
              id="qc-name"
              type="text"
              autoComplete="name"
              placeholder="Your name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#fcfcfc] border border-[#D9D1C3] text-sm text-[#231A10] placeholder:text-[#6B6A63]/70 focus:outline-none focus:border-[#FD6703] transition-colors"
            />
            {errors.name && <p className="mt-1 text-[11px] text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="qc-phone" className="sr-only">
              Phone number
            </label>
            <input
              id="qc-phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder="Phone number *"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#fcfcfc] border border-[#D9D1C3] text-sm text-[#231A10] placeholder:text-[#6B6A63]/70 focus:outline-none focus:border-[#FD6703] transition-colors"
            />
            {errors.phone && <p className="mt-1 text-[11px] text-red-600">{errors.phone}</p>}
          </div>

          <div>
            <label htmlFor="qc-msg" className="sr-only">
              Your message
            </label>
            <textarea
              id="qc-msg"
              rows={2}
              placeholder="Your message (destination / dates / group size)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#fcfcfc] border border-[#D9D1C3] text-sm text-[#231A10] placeholder:text-[#6B6A63]/70 focus:outline-none focus:border-[#FD6703] resize-none transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#231A10] text-[#FBF8F1] hover:bg-[#FD6703] transition-colors font-mono text-[11px] uppercase tracking-[0.18em] cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            Send on WhatsApp
          </button>

          <p className="text-center text-[10px] text-[#6B6A63]">
            Opens WhatsApp chat with {BUSINESS_CONFIG.phoneFormatted} — nothing is sent without your tap.
          </p>
        </form>
      </div>
    </div>
  );
};
