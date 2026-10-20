import React from 'react';

/**
 * Subtle travel-themed decorations for the hanging gallery:
 * - The rope's wooden end posts at both edges.
 * - Small orange hand-drawn accent strokes near the rope ends.
 * - A dotted route + bus sketch bottom-left and a palm-tree sketch
 *   bottom-right (kept understated and pointer-transparent).
 */
export const RopeDecoration: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={className} aria-hidden="true">
      {/* Orange hand-drawn emphasis strokes near the rope start (top-left) */}
      <svg
        className="pointer-events-none absolute -top-1 left-6 hidden h-12 w-16 drop-shadow-sm lg:block"
        viewBox="0 0 90 60"
        fill="none"
      >
        <path
          d="M8 44c3-12 7-21 11-30"
          stroke="#FD6703"
          strokeWidth="4.5"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path
          d="M22 40c2.4-9 5.4-16.4 8.6-24"
          stroke="#FD6703"
          strokeWidth="3.6"
          strokeLinecap="round"
          opacity="0.65"
        />
      </svg>

      {/* Orange hand-drawn emphasis strokes near the rope end (top-right) */}
      <svg
        className="pointer-events-none absolute -top-1 right-6 hidden h-12 w-16 drop-shadow-sm lg:block"
        viewBox="0 0 90 60"
        fill="none"
      >
        <path
          d="M82 44c-3-12-7-21-11-30"
          stroke="#FD6703"
          strokeWidth="4.5"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path
          d="M68 40c-2.4-9-5.4-16.4-8.6-24"
          stroke="#FD6703"
          strokeWidth="3.6"
          strokeLinecap="round"
          opacity="0.65"
        />
      </svg>

      {/* Dotted route + mini bus sketch, bottom-left */}
      <svg
        className="pointer-events-none absolute bottom-2 left-6 hidden h-20 w-44 text-[#c9b89a] lg:block"
        viewBox="0 0 180 76"
        fill="none"
      >
        <path
          d="M4 60 C 30 30 58 30 78 48 S 118 70 146 40"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeDasharray="1 9"
          opacity="0.8"
        />
        {/* Mini single-decker bus */}
        <g transform="translate(126 20) rotate(-8)">
          <rect x="0" y="2" width="34" height="15" rx="3" fill="#efe8da" stroke="currentColor" strokeWidth="2.2" />
          <path d="M4 5h11v6H4z" fill="currentColor" opacity="0.45" />
          <path d="M18 5h9v6h-9z" fill="currentColor" opacity="0.25" />
          <circle cx="8" cy="19" r="3.4" fill="#efe8da" stroke="currentColor" strokeWidth="2" />
          <circle cx="26" cy="19" r="3.4" fill="#efe8da" stroke="currentColor" strokeWidth="2" />
        </g>
      </svg>

      {/* Palm-tree + birds sketch, bottom-right */}
      <svg
        className="pointer-events-none absolute bottom-2 right-8 hidden h-24 w-40 text-[#c9b89a] lg:block"
        viewBox="0 0 160 96"
        fill="none"
      >
        <path
          d="M84 92c2-26 4-46 8-58"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M92 34c-10-12-22-16-34-14 10 2 20 8 30 16z"
          fill="currentColor"
          opacity="0.75"
        />
        <path
          d="M92 34c-2-14 4-24 14-30-6 10-9 20-9 29z"
          fill="currentColor"
          opacity="0.6"
        />
        <path
          d="M92 34c10-10 22-12 32-8-10 0-22 5-29 10z"
          fill="currentColor"
          opacity="0.75"
        />
        <path
          d="M92 92c-12-2-22-8-28-18 10 6 20 10 30 14z"
          fill="currentColor"
          opacity="0.4"
        />
        {/* Birds */}
        <path d="M124 18c3-3.6 6.4-5 10-4.2-3 1.4-5.8 3-8 5.6z" fill="currentColor" opacity="0.7" />
        <path d="M138 10c2.6-3.2 5.6-4.4 9-3.6-2.6 1.2-5 2.6-6.8 5z" fill="currentColor" opacity="0.55" />
        {/* Tiny island ground */}
        <path
          d="M56 94c10-5 24-7 36-6 12 1 24 4 32 8-22-2-46-3-68-2z"
          fill="currentColor"
          opacity="0.35"
        />
      </svg>
    </div>
  );
};
