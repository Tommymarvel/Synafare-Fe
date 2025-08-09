// app/pending-verification/page.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/app/components/ui/Button';
import illustration from '@/app/assets/pending-verification.svg'; // your pending illustration

export default function PendingVerificationPage() {
  return (
    <div className=" bg-white flex flex-col">
      {/* Centered content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 text-center space-y-6">
        {/* Illustration */}
        <div className="w-full max-w-xs mx-auto">
          <Image
            src={illustration}
            alt="Pending Verification Illustration"
            width={400}
            height={300}
            className="w-full h-auto"
          />
        </div>

        {/* Heading & description */}
        <h1 className="text-2xl md:text-3xl font-semibold text-raisin">
          Pending Verification
        </h1>
        <p className="text-sm text-[#797979] max-w-md">
          Your account verification is in progress. You’ll receive an email with
          the next steps. For questions, please contact our&nbsp;
          <a href="/support" className="underline text-raisin">
            support team
          </a>
          .
        </p>

        {/* Proceed button */}
        <div className="w-full max-w-xs">
          <Button
            variant="default"
            className="w-full"
            onClick={() => window.location.assign('/dashboard')}
          >
            Proceed Dashboard
          </Button>
        </div>
      </main>
    </div>
  );
}
