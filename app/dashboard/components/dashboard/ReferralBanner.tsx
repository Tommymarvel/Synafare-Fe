// app/dashboard/components/ReferralBanner.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Megaphone from '@/app/assets/megaphone.svg';
import Link from 'next/link';

export default function ReferralBanner() {
  return (
    <Link
      href="/dashboard/referrals"
      className="group block relative overflow-hidden rounded-2xl bg-teal p-6 sm:p-6 h-[101px]"
    >
      {/* Megaphone Icon */}
      <div className="absolute -left-2  top-1/2 -translate-y-1/2">
        <Image
          src={Megaphone}
          alt="Megaphone"
          width={106}
          height={106}
          className="opacity-90 transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* Text */}
      <p className="ml-16 text-center items-center sm:text-left text-white font-medium text-sm sm:text-base">
        Stand a chance to earn rewards
     
        when you refer an installer
      </p>

      {/* Hover Overlay */}
      <span className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
    </Link>
  );
}
