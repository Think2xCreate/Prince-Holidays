import React from 'react';
import { Clothespin } from './Clothespin';
import type { HangingPhoto } from '../../data/galleryHanging';

interface PhotoCardProps {
  photo: HangingPhoto;
  onOpen: (index: number) => void;
}

/**
 * A single Polaroid-style travel photograph hanging from the rope.
 *
 * The card itself is the animated element: it swings gently from its
 * clothespin while the whole card keeps the rotation and vertical offset
 * defined in the data file.
 */
export const PhotoCard: React.FC<PhotoCardProps> = ({ photo, onOpen }) => {
  return (
    <div
      className="gallery-card-direction relative"
      style={{
        rotate: `${photo.rotation}deg`,
        marginTop: `${photo.slack * 2}px`,
      }}
    >
      {/* Gentle swing around the clothespin pinch point */}
      <div
        className="gallery-card-swing"
        style={{
          animationDuration: `${photo.swingDuration}s`,
          animationDelay: `-${photo.swingDelay}s`,
          transformOrigin: '50% -14px',
        }}
      >
        <button
          type="button"
          onClick={() => onOpen(photo.lightboxIndex)}
          aria-label={`See bigger photo: ${photo.alt}`}
          className={
            'gallery-polaroid group relative block w-full cursor-pointer overflow-visible rounded-[10px] ' +
            'bg-[#FBF9F4] ring-1 ring-[#E3DED2] focus-visible:outline-2 focus-visible:outline-[#FD6703] ' +
            'shadow-[0_10px_24px_-8px_rgba(35,26,16,0.28),0_22px_50px_-18px_rgba(35,26,16,0.25)] ' +
            'transition-[transform,box-shadow] duration-300 ease-out ' +
            'will-change-transform hover:-translate-y-1.5 hover:shadow-[0_18px_34px_-10px_rgba(35,26,16,0.32),0_30px_60px_-20px_rgba(35,26,16,0.3)]'
          }
        >
          {/* Photo area */}
          <span className="block overflow-hidden rounded-[6px] p-[7px] pb-0">
            <span className="block aspect-[1/1.08] w-full overflow-hidden rounded-[4px] bg-[#EDEAE3]">
              <img
                src={photo.image}
                alt={photo.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                style={{ objectPosition: photo.objectPosition }}
              />
            </span>
          </span>

          {/* Thicker white bottom border with handwritten caption */}
          <span className="block px-2 pb-3 pt-2.5 text-center">
            <span className="font-hand text-[13.5px] leading-none text-[#3d2f21] sm:text-[15px]">
              {photo.caption}
            </span>
          </span>

          {/* Wooden clothespin clipping the card to the rope */}
          <Clothespin className="-top-[24px]" />
        </button>
      </div>
    </div>
  );
};
