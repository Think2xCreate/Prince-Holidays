import React from 'react';

/**
 * Decorative hanging rope for the photo gallery.
 *
 * One gentle catenary curve between two knot anchors. The rope is drawn as
 * a core line with an overlaid dash pattern so it reads as twisted jute at
 * any width, and scales with its container via preserveAspectRatio="none".
 */
export const FlexibleRope: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 1600 90"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ropeGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c99a62" />
          <stop offset="0.55" stopColor="#b3854f" />
          <stop offset="1" stopColor="#8a6238" />
        </linearGradient>
      </defs>

      {/* Soft shadow under the rope */}
      <path
        d="M 8 34 C 340 88 1260 78 1592 26"
        fill="none"
        stroke="#8a6238"
        strokeWidth="10"
        opacity="0.12"
        transform="translate(0 6)"
      />

      {/* Rope core */}
      <path
        d="M 8 34 C 340 88 1260 78 1592 26"
        fill="none"
        stroke="url(#ropeGrad)"
        strokeWidth="8"
        strokeLinecap="round"
      />

      {/* Jute twist texture */}
      <path
        d="M 8 34 C 340 88 1260 78 1592 26"
        fill="none"
        stroke="#794f1f"
        strokeWidth="8"
        strokeLinecap="butt"
        strokeDasharray="3 9"
        opacity="0.5"
      />
      <path
        d="M 8 34 C 340 88 1260 78 1592 26"
        fill="none"
        stroke="#e3bd88"
        strokeWidth="8"
        strokeLinecap="butt"
        strokeDasharray="3 9"
        strokeDashoffset="6"
        opacity="0.6"
      />

      {/* Knots at both ends */}
      <circle cx="10" cy="34" r="7" fill="#7a5530" />
      <circle cx="13" cy="31" r="4" fill="#a87b46" />
      <circle cx="1590" cy="26" r="7" fill="#7a5530" />
      <circle cx="1587" cy="23" r="4" fill="#a87b46" />
    </svg>
  );
};
