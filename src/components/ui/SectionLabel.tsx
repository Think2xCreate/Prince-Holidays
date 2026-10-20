import React from 'react';
import { cn } from '../../lib/utils';

interface SectionLabelProps {
  index?: string;
  label: string;
  meta?: string;
  light?: boolean;
  className?: string;
}

export const SectionLabel: React.FC<SectionLabelProps> = ({
  label,
  meta,
  light = false,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 border-b pb-3.5 text-xs uppercase tracking-wider font-medium',
        light
          ? 'border-[#fcfcfc]/20 text-[#fcfcfc]/85'
          : 'border-[#D9D1C3] text-[#231A10]/80',
        className
      )}
    >
      <div className="flex items-center gap-2.5">
        <span className="inline-block w-2 h-2 rounded-full bg-[#FD6703]" aria-hidden="true" />
        <span className={light ? 'text-[#FBF8F1] font-semibold' : 'text-[#231A10] font-semibold'}>{label}</span>
      </div>

      {meta && (
        <span className={cn('hidden sm:inline-block text-[11px] font-normal tracking-wide', light ? 'text-[#fcfcfc]/60' : 'text-[#6B6A63]')}>
          {meta}
        </span>
      )}
    </div>
  );
};
