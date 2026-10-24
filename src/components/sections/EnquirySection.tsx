'use client';

import React, { useEffect, useState } from 'react';
import {
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import {
  BUSINESS_CONFIG,
  buildWhatsAppUrl,
  DEFAULT_WA_MESSAGE,
} from '../../data/business';
import { DESTINATIONS } from '../../data/destinations';
import { TRAVEL_CATEGORIES } from '../../data/travelCategories';
import { SectionLabel } from '../ui/SectionLabel';

interface EnquirySectionProps {
  preselectedDestination?: string;
  preselectedCategory?: string;
}

const MANUAL_DESTINATION_VALUE = 'other';

interface EnquiryFormState {
  fullName: string;
  phone: string;
  email: string;
  tourCategory: string;
  destination: string;
  destinationManual: string;
  startingFrom: string;
  travelDate: string;
  travellers: string;
  requirements: string;
}

/**
 * SECTION 11 — TRAVEL ENQUIRY
 *
 * Headline: "Let's Plan Your Next Journey."
 * Accessible travel enquiry form with all required fields:
 * - Full name (required)
 * - Phone number (required)
 * - Email address (optional)
 * - Tour category (required)
 * - Destination (required)
 * - Travel date (optional)
 * - Number of travellers (required)
 * - Additional requirements (optional)
 *
 * Honest Submission Behavior:
 * - Validates fields with accessible error messages.
 * - Shows a clear loading state while preparing the structured enquiry summary.
 * - Does NOT pretend the form was saved to a database or emailed when no backend is configured;
 *   instead, it transitions to a confirmation step showing the formatted enquiry summary and opens
 *   WhatsApp with the user's details only after the user explicitly confirms the action.
 */
export const EnquirySection: React.FC<EnquirySectionProps> = ({
  preselectedDestination,
  preselectedCategory,
}) => {
  const [formData, setFormData] = useState<EnquiryFormState>({
    fullName: '',
    phone: '',
    email: '',
    tourCategory: preselectedCategory || '',
    destination: preselectedDestination || '',
    destinationManual: '',
    startingFrom: '',
    travelDate: '',
    travellers: '',
    requirements: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof EnquiryFormState, string>>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReadyForWhatsApp, setIsReadyForWhatsApp] = useState(false);

  useEffect(() => {
    if (preselectedDestination) {
      const isKnownDestination = DESTINATIONS.some(
        (d) => d.name === preselectedDestination,
      );
      setFormData((prev) =>
        isKnownDestination
          ? { ...prev, destination: preselectedDestination, destinationManual: '' }
          : { ...prev, destination: MANUAL_DESTINATION_VALUE, destinationManual: preselectedDestination },
      );
      setIsReadyForWhatsApp(false);
    }
  }, [preselectedDestination]);

  useEffect(() => {
    if (preselectedCategory) {
      setFormData((prev) => ({ ...prev, tourCategory: preselectedCategory }));
      setIsReadyForWhatsApp(false);
    }
  }, [preselectedCategory]);

  const validateForm = (): boolean => {
    const nextErrors: Partial<Record<keyof EnquiryFormState, string>> = {};

    if (!formData.fullName.trim()) {
      nextErrors.fullName = 'Please enter your full name.';
    }

    const digitsOnly = formData.phone.replace(/[^\d]/g, '');
    if (!digitsOnly || digitsOnly.length < 10) {
      nextErrors.phone = 'Please enter a valid 10-digit phone or WhatsApp number.';
    }

    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        nextErrors.email = 'Please enter a valid email address or leave this field blank.';
      }
    }

    if (!formData.tourCategory.trim()) {
      nextErrors.tourCategory = 'Please select a tour category.';
    }

    if (
      formData.destination === MANUAL_DESTINATION_VALUE &&
      !formData.destinationManual.trim()
    ) {
      nextErrors.destination =
        'Please type your destination or select one from the list.';
    } else if (formData.destination !== MANUAL_DESTINATION_VALUE && !formData.destination.trim()) {
      nextErrors.destination = 'Please select your destination.';
    }

    if (!formData.startingFrom.trim()) {
      nextErrors.startingFrom = 'Please enter your starting city or place.';
    }

    if (!formData.travellers.trim()) {
      nextErrors.travellers = 'Please specify the approximate number of travellers.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const formatEnquiryMessage = (): string => {
    const lines = [
      `Hello ${BUSINESS_CONFIG.name},`,
      `I would like to plan a journey. Here are my enquiry details:`,
      ``,
      `• Full Name: ${formData.fullName.trim()}`,
      `• Phone: ${formData.phone.trim()}`,
      formData.email.trim() ? `• Email: ${formData.email.trim()}` : null,
      `• Tour Category: ${
        formData.tourCategory.trim() || 'Not selected'
      }`,
      `• Destination: ${
        formData.destination === MANUAL_DESTINATION_VALUE
          ? formData.destinationManual.trim()
          : formData.destination.trim() || 'Not selected'
      }`,
      `• Starting From: ${formData.startingFrom.trim()}`,
      `• Travel Date: ${formData.travelDate.trim() || 'Flexible / To be discussed'}`,
      `• Number of Travellers: ${formData.travellers.trim()}`,
      `• Additional Requirements: ${formData.requirements.trim() || 'None specified'}`,
    ].filter(Boolean);

    return lines.join('\n');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsProcessing(true);
    window.setTimeout(() => {
      setIsProcessing(false);
      setIsReadyForWhatsApp(true);
    }, 350);
  };

  const handleConfirmWhatsAppOpen = () => {
    const url = buildWhatsAppUrl(formatEnquiryMessage());
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      id="enquiry"
      className="relative py-14 sm:py-20 lg:py-24 bg-[#fcfcfc] border-b border-[#D9D1C3] overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <SectionLabel
          label="TRAVEL ENQUIRY"
          meta="TALK TO US DIRECTLY"
        />

        <div className="mt-8 lg:mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 lg:items-stretch">
          {/* Left Column: Editorial Introduction & Direct Contact */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div>
              <span className="inline-block font-mono text-xs uppercase tracking-[0.2em] text-[#FD6703] mb-4">
                BEGIN THE CONVERSATION
              </span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#231A10] leading-[1.06]">
                Let&apos;s Plan Your{' '}
                <span className="font-editorial-serif italic font-normal text-[#FD6703]">
                  Next Trip.
                </span>
              </h2>
              <p className="mt-5 text-base sm:text-lg text-[#6B6A63] leading-relaxed">
                Share your trip details below — where you want to go, how many people, and your dates. We will plan the bus, hotels and food, and reply with a clear quote. You can also call or WhatsApp us directly.
              </p>
            </div>

            {/* Office Contact Card */}
            <div className="rounded-[24px] bg-[#fcfcfc] border border-[#E3DED2] p-7 sm:p-8">
              <h3 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-[#231A10]">
                {BUSINESS_CONFIG.wordmark} OFFICE
              </h3>

              <div className="mt-7 space-y-7">
                {/* Phone / WhatsApp */}
                <div className="flex items-start gap-4">
                  <span className="w-11 h-11 rounded-full bg-[#FD6703]/10 text-[#FD6703] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </span>
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#6B6A63]">
                      Phone / WhatsApp
                    </span>
                    <a
                      href={`tel:${BUSINESS_CONFIG.phone}`}
                      className="block font-display text-lg font-semibold text-[#231A10] hover:text-[#FD6703] transition-colors"
                    >
                      {BUSINESS_CONFIG.phoneFormatted}
                    </a>
                  </div>
                </div>

                {/* Office Location */}
                <div className="flex items-start gap-4">
                  <span className="w-11 h-11 rounded-full bg-[#FD6703]/10 text-[#FD6703] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </span>
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#6B6A63]">
                      Office Location
                    </span>
                    <a
                      href={BUSINESS_CONFIG.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block font-display text-lg font-semibold text-[#231A10] hover:text-[#FD6703] transition-colors leading-snug"
                    >
                      {BUSINESS_CONFIG.address}
                    </a>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-start gap-4">
                  <span className="w-11 h-11 rounded-full bg-[#FD6703]/10 text-[#FD6703] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </span>
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#6B6A63]">
                      Working Hours
                    </span>
                    <p className="font-display text-lg font-semibold text-[#231A10]">
                      {BUSINESS_CONFIG.workingHours}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fast Support Callout */}
            <div className="rounded-[24px] bg-[#FD6703] p-7 sm:p-8 lg:mt-auto lg:self-stretch">
              <h3 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-[#231A10]">
                Need a Quick Quote?
              </h3>
              <p className="mt-3 text-sm sm:text-base text-[#231A10]/80 leading-relaxed">
                Connect directly with our travel team on WhatsApp for immediate trip planning — bus, stay and food all in one chat.
              </p>
              <a
                href={buildWhatsAppUrl(DEFAULT_WA_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#231A10] text-[#FBF8F1] hover:bg-white hover:text-[#231A10] font-mono text-xs uppercase tracking-[0.18em] transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Instant Support</span>
              </a>
            </div>
          </div>

          {/* Right Column: Accessible Enquiry Form & Honest WhatsApp Confirmation */}
          <div className="lg:col-span-7">
            <div className="p-7 sm:p-10 lg:p-12 rounded-[24px] bg-[#FBF8F1] border border-[#E3DED2] lg:h-full">
              {isReadyForWhatsApp ? (
                <div role="status" aria-live="polite" className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#FD6703]/15 text-[#FD6703] flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#FD6703]">
                        DETAILS OK • READY TO SEND
                      </span>
                      <h3 className="mt-1 font-display text-2xl sm:text-3xl font-semibold text-[#231A10]">
                        Confirm &amp; Send via WhatsApp
                      </h3>
                      <p className="mt-2 text-sm sm:text-base text-[#6B6A63] leading-relaxed">
                        We do not save your details anywhere. Your trip note is ready below. Click confirm to open WhatsApp and send it to{' '}
                        <strong className="text-[#231A10]">our team</strong> ({BUSINESS_CONFIG.phoneFormatted}).
                      </p>
                    </div>
                  </div>

                  {/* Formatted Message Preview */}
                  <div className="p-5 rounded-xl bg-[#fcfcfc] border border-[#D9D1C3] font-mono text-xs text-[#231A10] whitespace-pre-wrap leading-relaxed">
                    {formatEnquiryMessage()}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <button
                      type="button"
                      onClick={handleConfirmWhatsAppOpen}
                      className="inline-flex items-center gap-3 px-7 py-4 rounded-full bg-[#231A10] text-[#fcfcfc] hover:bg-[#FD6703] font-mono text-xs uppercase tracking-[0.18em] transition-all duration-300 cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Confirm &amp; Open in WhatsApp</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsReadyForWhatsApp(false)}
                      className="inline-flex items-center gap-2 px-6 py-4 rounded-full border border-[#D9D1C3] text-[#231A10] hover:border-[#FD6703] hover:text-[#FD6703] font-mono text-xs uppercase tracking-[0.18em] transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Edit Details</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  <div className="flex items-center justify-between border-b border-[#D9D1C3] pb-4">
                    <h3 className="font-display text-2xl font-semibold text-[#231A10]">
                      Trip Details
                    </h3>
                    <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#6B6A63]">
                      * Required Fields
                    </span>
                  </div>

                  {/* Row 1: Full Name & Phone Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="enquiry-full-name"
                        className="block font-mono text-[11px] uppercase tracking-[0.16em] text-[#231A10] mb-2"
                      >
                        Full Name *
                      </label>
                      <input
                        id="enquiry-full-name"
                        name="fullName"
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        placeholder="Your full name"
                        aria-invalid={Boolean(errors.fullName)}
                        aria-describedby={errors.fullName ? 'err-full-name' : undefined}
                        className={`w-full px-4 py-3 rounded-xl bg-[#fcfcfc] border text-sm text-[#231A10] placeholder:text-[#6B6A63]/60 focus:bg-white focus:outline-none focus:border-[#FD6703] transition-colors ${
                          errors.fullName ? 'border-red-600' : 'border-[#D9D1C3]'
                        }`}
                      />
                      {errors.fullName && (
                        <p
                          id="err-full-name"
                          className="mt-1.5 text-xs text-red-700 flex items-center gap-1"
                        >
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.fullName}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="enquiry-phone"
                        className="block font-mono text-[11px] uppercase tracking-[0.16em] text-[#231A10] mb-2"
                      >
                        Phone Number *
                      </label>
                      <input
                        id="enquiry-phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="10-digit mobile / WhatsApp number"
                        aria-invalid={Boolean(errors.phone)}
                        aria-describedby={errors.phone ? 'err-phone' : undefined}
                        className={`w-full px-4 py-3 rounded-xl bg-[#fcfcfc] border text-sm text-[#231A10] placeholder:text-[#6B6A63]/60 focus:bg-white focus:outline-none focus:border-[#FD6703] transition-colors ${
                          errors.phone ? 'border-red-600' : 'border-[#D9D1C3]'
                        }`}
                      />
                      {errors.phone && (
                        <p
                          id="err-phone"
                          className="mt-1.5 text-xs text-red-700 flex items-center gap-1"
                        >
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.phone}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Email (optional) & Tour Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="enquiry-email"
                        className="block font-mono text-[11px] uppercase tracking-[0.16em] text-[#231A10] mb-2"
                      >
                        Email Address <span className="text-[#6B6A63]">(Optional)</span>
                      </label>
                      <input
                        id="enquiry-email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="you@example.com"
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? 'err-email' : undefined}
                        className={`w-full px-4 py-3 rounded-xl bg-[#fcfcfc] border text-sm text-[#231A10] placeholder:text-[#6B6A63]/60 focus:bg-white focus:outline-none focus:border-[#FD6703] transition-colors ${
                          errors.email ? 'border-red-600' : 'border-[#D9D1C3]'
                        }`}
                      />
                      {errors.email && (
                        <p
                          id="err-email"
                          className="mt-1.5 text-xs text-red-700 flex items-center gap-1"
                        >
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="enquiry-category"
                        className="block font-mono text-[11px] uppercase tracking-[0.16em] text-[#231A10] mb-2"
                      >
                        Tour Category *
                      </label>
                      <select
                        id="enquiry-category"
                        name="tourCategory"
                        value={formData.tourCategory}
                        onChange={(e) =>
                          setFormData({ ...formData, tourCategory: e.target.value })
                        }
                        aria-invalid={Boolean(errors.tourCategory)}
                        aria-describedby={errors.tourCategory ? 'err-category' : undefined}
                        className={`w-full px-4 py-3 rounded-xl bg-[#fcfcfc] border text-sm text-[#231A10] focus:bg-white focus:outline-none focus:border-[#FD6703] transition-colors ${
                          errors.tourCategory ? 'border-red-600' : 'border-[#D9D1C3]'
                        }`}
                      >
                        <option value="" disabled hidden>
                          Select Tour
                        </option>
                        {TRAVEL_CATEGORIES.map((cat) => (
                          <option key={cat.id} value={cat.title}>
                            {cat.title}
                          </option>
                        ))}
                        <option value="Tourist Bus Transportation Only">
                          Tourist Bus Transportation Only
                        </option>
                        <option value="Custom Group Itinerary">
                          Custom Group Itinerary
                        </option>
                      </select>
                      {errors.tourCategory && (
                        <p
                          id="err-category"
                          className="mt-1.5 text-xs text-red-700 flex items-center gap-1"
                        >
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.tourCategory}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 3: Destination (select + manual option) & Starting From */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="enquiry-destination"
                        className="block font-mono text-[11px] uppercase tracking-[0.16em] text-[#231A10] mb-2"
                      >
                        Destination *
                      </label>
                      <select
                        id="enquiry-destination"
                        name="destination"
                        required
                        value={formData.destination}
                        onChange={(e) =>
                          setFormData({ ...formData, destination: e.target.value })
                        }
                        aria-invalid={Boolean(errors.destination)}
                        aria-describedby={
                          errors.destination ? 'err-destination' : undefined
                        }
                        className={`w-full px-4 py-3 rounded-xl bg-[#fcfcfc] border text-sm text-[#231A10] focus:bg-white focus:outline-none focus:border-[#FD6703] transition-colors ${
                          errors.destination ? 'border-red-600' : 'border-[#D9D1C3]'
                        }`}
                      >
                        <option value="" disabled hidden>
                          Select Destination
                        </option>
                        {DESTINATIONS.map((d) => (
                          <option key={d.id} value={d.name}>
                            {d.name}
                          </option>
                        ))}
                        <option value={MANUAL_DESTINATION_VALUE}>
                          Other (Type Manually)
                        </option>
                      </select>

                      {formData.destination === MANUAL_DESTINATION_VALUE && (
                        <input
                          id="enquiry-destination-manual"
                          name="destinationManual"
                          type="text"
                          value={formData.destinationManual}
                          onChange={(e) =>
                            setFormData({ ...formData, destinationManual: e.target.value })
                          }
                          placeholder="Type your destination, e.g. Rameswaram, Coimbatore"
                          className="mt-3 w-full px-4 py-3 rounded-xl bg-[#fcfcfc] border border-[#D9D1C3] text-sm text-[#231A10] placeholder:text-[#6B6A63]/60 focus:bg-white focus:outline-none focus:border-[#FD6703] transition-colors"
                        />
                      )}
                      {errors.destination && (
                        <p
                          id="err-destination"
                          className="mt-1.5 text-xs text-red-700 flex items-center gap-1"
                        >
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.destination}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="enquiry-starting-from"
                        className="block font-mono text-[11px] uppercase tracking-[0.16em] text-[#231A10] mb-2"
                      >
                        Starting From *
                      </label>
                      <input
                        id="enquiry-starting-from"
                        name="startingFrom"
                        type="text"
                        required
                        value={formData.startingFrom}
                        onChange={(e) =>
                          setFormData({ ...formData, startingFrom: e.target.value })
                        }
                        placeholder="e.g. Salem, Coimbatore, Chennai"
                        aria-invalid={Boolean(errors.startingFrom)}
                        aria-describedby={
                          errors.startingFrom ? 'err-starting-from' : undefined
                        }
                        className={`w-full px-4 py-3 rounded-xl bg-[#fcfcfc] border text-sm text-[#231A10] placeholder:text-[#6B6A63]/60 focus:bg-white focus:outline-none focus:border-[#FD6703] transition-colors ${
                          errors.startingFrom ? 'border-red-600' : 'border-[#D9D1C3]'
                        }`}
                      />
                      {errors.startingFrom && (
                        <p
                          id="err-starting-from"
                          className="mt-1.5 text-xs text-red-700 flex items-center gap-1"
                        >
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.startingFrom}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 4: Travel Date (optional) & Number of Travellers */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="enquiry-date"
                        className="block font-mono text-[11px] uppercase tracking-[0.16em] text-[#231A10] mb-2"
                      >
                        Travel Date <span className="text-[#6B6A63]">(Optional)</span>
                      </label>
                      <input
                        id="enquiry-date"
                        name="travelDate"
                        type="date"
                        value={formData.travelDate}
                        onChange={(e) =>
                          setFormData({ ...formData, travelDate: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-[#fcfcfc] border border-[#D9D1C3] text-sm text-[#231A10] focus:bg-white focus:outline-none focus:border-[#FD6703] transition-colors"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="enquiry-travellers"
                        className="block font-mono text-[11px] uppercase tracking-[0.16em] text-[#231A10] mb-2"
                      >
                        Number of Travellers *
                      </label>
                      <input
                        id="enquiry-travellers"
                        name="travellers"
                        type="text"
                        required
                        value={formData.travellers}
                        onChange={(e) =>
                          setFormData({ ...formData, travellers: e.target.value })
                        }
                        placeholder="e.g. 12 family, 45 students, 25 office staff"
                        aria-invalid={Boolean(errors.travellers)}
                        aria-describedby={errors.travellers ? 'err-travellers' : undefined}
                        className={`w-full px-4 py-3 rounded-xl bg-[#fcfcfc] border text-sm text-[#231A10] placeholder:text-[#6B6A63]/60 focus:bg-white focus:outline-none focus:border-[#FD6703] transition-colors ${
                          errors.travellers ? 'border-red-600' : 'border-[#D9D1C3]'
                        }`}
                      />
                      {errors.travellers && (
                        <p
                          id="err-travellers"
                          className="mt-1.5 text-xs text-red-700 flex items-center gap-1"
                        >
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.travellers}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 5: Additional Requirements */}
                  <div>
                    <label
                      htmlFor="enquiry-requirements"
                      className="block font-mono text-[11px] uppercase tracking-[0.16em] text-[#231A10] mb-2"
                    >
                      Additional Requirements
                    </label>
                    <textarea
                      id="enquiry-requirements"
                      name="requirements"
                      rows={4}
                      value={formData.requirements}
                      onChange={(e) =>
                        setFormData({ ...formData, requirements: e.target.value })
                      }
                      placeholder="Your starting place, food needs, places to see, safari or campfire..."
                      className="w-full px-4 py-3 rounded-xl bg-[#fcfcfc] border border-[#D9D1C3] text-sm text-[#231A10] placeholder:text-[#6B6A63]/60 focus:bg-white focus:outline-none focus:border-[#FD6703] transition-colors resize-y"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#231A10] text-[#fcfcfc] hover:bg-[#FD6703] font-mono text-xs uppercase tracking-[0.18em] transition-all duration-300 cursor-pointer disabled:opacity-50"
                    >
                      <span>
                        {isProcessing
                          ? 'Sending your details...'
                          : 'Send Trip Details'}
                      </span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>

                    <span className="font-mono text-[11px] text-[#6B6A63]">
                      Check details before opening WhatsApp
                    </span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
