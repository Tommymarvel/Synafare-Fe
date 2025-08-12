// app/dashboard/components/cards/RepaymentScheduleCard.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import ScheduleIllustration from '@/app/assets/repayment-illustration.svg'; // placeholder asset

interface ScheduleEntry {
  amount: number;
  date: string; // e.g. 'Apr 1, 2025'
  status: 'Paid' | 'Due' | 'Upcoming';
}

type Props = {
  schedule?: ScheduleEntry[];
};

export default function RepaymentScheduleCard({ schedule = [] }: Props) {
  const hasEntries = Array.isArray(schedule) && schedule.length > 0;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <p className="text-sm font-medium text-raisin">Repayment Schedule</p>
      </div>

      {hasEntries ? (
        <ul>
          {schedule.map(({ amount, date, status }, idx) => {
            const isDue = status === 'Due';
            return (
              <li
                key={idx}
                className={`flex items-center justify-between px-6 py-4 ${
                  idx < schedule.length - 1 ? 'border-b border-gray-200' : ''
                }`}
              >
                <div className="flex flex-col">
                  <span
                    className={`font-medium ${
                      isDue ? 'text-[#C92312]' : 'text-raisin'
                    }`}
                  >
                    ₦
                    {amount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <span className="text-xs text-[#797979]">Due {date}</span>
                </div>
                <button className="inline-flex items-center text-sm text-mikado ">
                  <span>Pay</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center py-[43px] px-6">
          <Image
            src={ScheduleIllustration}
            alt="No repayment schedule"
            width={65}
            height={65}
            priority
          />
          <p className="mt-4 text-sm text-gray-500">No repayment schedule</p>
        </div>
      )}
    </div>
  );
}
