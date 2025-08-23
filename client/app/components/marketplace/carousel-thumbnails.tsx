'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductCarouselProps {
  urls: string[];
  activeIndex?: number;
  onSlideChange?: (index: number) => void;
}

const ProductCarouselThumbNailIncluded = ({
  urls,
  activeIndex = 0,
  onSlideChange,
}: ProductCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(activeIndex);

  const goToPrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : urls.length - 1;
    setCurrentIndex(newIndex);
    onSlideChange?.(newIndex);
  };

  const goToNext = () => {
    const newIndex = currentIndex < urls.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    onSlideChange?.(newIndex);
  };

  return (
    <div className="relative w-full aspect-[489/353] bg-black rounded-md overflow-hidden">
      <div className="relative w-full h-full">
        <Image
          src={urls[currentIndex]}
          alt="Product image"
          fill
          className="object-cover object-center"
        />
      </div>

      {urls.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute top-1/2 left-4 -translate-y-1/2 size-8 rounded-full bg-[#1D1C1D4D] flex items-center justify-center text-white hover:bg-[#1D1C1D80] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            onClick={goToNext}
            className="absolute top-1/2 right-4 -translate-y-1/2 size-8 rounded-full bg-[#1D1C1D4D] flex items-center justify-center text-white hover:bg-[#1D1C1D80] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </>
      )}
    </div>
  );
};

export default ProductCarouselThumbNailIncluded;
