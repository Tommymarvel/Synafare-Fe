// app/dashboard/loans/components/EmptyState.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ScheduleIllustration from '@/app/assets/repayment-illustration.svg'; 

export function EmptyState() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center h-[70dvh] space-y-6 border rounded-lg">
      <Image
        src={ScheduleIllustration}
        alt="No loan requests illustration"
        width={180}
        height={180}
      />
      <h2 className="text-lg font-semibold text-neutral-900">
        No Loan Request
      </h2>
      <p className="text-sm text-neutral-500 max-w-xs text-center">
        You do not have any loan request. Click “Request Loan” to make your
        first request.
      </p>
      <button
        onClick={() => router.push('/dashboard/loans/request')}
        className="px-6 py-3 bg-mikado text-white rounded-md hover:bg-yellow-600
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                   focus-visible:ring-mikado"
      >
        Request Loan
      </button>
    </div>
  );
}
