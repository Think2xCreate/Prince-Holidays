import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Wooden clothespin (peg) that clips a photo card to the gallery rope.
 * Built entirely out of styled divs so no image asset is required.
 * Rendered in front of the rope, overlapping the top edge of its card.
 */
export const Clothespin: React.FC<{ className?: string }> = ({ className }) => (
  <div
    className={cn('pointer-events-none absolute left-1/2 z-20 -translate-x-1/2', className)}
    aria-hidden="true"
  >
    <div
      className="relative h-[30px] w-[11px] rounded-[3px]"
      style={{
        background:
          'linear-gradient(90deg, #8a6238 0%, #c99a62 28%, #e6c391 50%, #c99a62 72%, #8a6238 100%)',
        boxShadow: '0 2px 4px rgba(35,26,16,0.25), inset 0 -2px 2px rgba(120,80,40,0.35)',
      }}
    >
      {/* Center groove between the two wooden halves */}
      <div className="absolute left-1/2 top-[5px] bottom-[5px] w-px -translate-x-1/2 bg-[#6d4c28]/60" />

      {/* Spring coil */}
      <svg
        className="absolute left-1/2 top-[3px] h-[6px] w-[13px] -translate-x-1/2"
        viewBox="0 0 13 6"
        fill="none"
      >
        <path
          d="M1 3c1.5-2 3-2 4.5 0S9 5 10.5 3 12.5 1 12 2"
          stroke="#5d4023"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>

      {/* Bottom taper lip that grips the card */}
      <div
        className="absolute inset-x-0 bottom-0 h-[6px] rounded-b-[3px]"
        style={{ background: 'linear-gradient(90deg, #7a5530 0%, #d4a86f 50%, #7a5530 100%)' }}
      />
    </div>
  </div>
);
