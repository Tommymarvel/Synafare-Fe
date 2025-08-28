// app/dashboard/components/cards/RepaymentScheduleCard.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import ScheduleIllustration from '@/app/assets/repayment-illustration.svg';
import { useLoans } from '../../loans/hooks/useLoans';
import { fmtDate } from '@/lib/format';

export default function RepaymentScheduleCard() {
  const { loans, isLoading, error } = useLoans();

  // Get upcoming repayments from active loans
  const upcomingRepayments = loans
    .filter(
      (loan) => loan.loanStatus === 'ACTIVE' && loan.outstandingBalance > 0
    )
    .map((loan) => ({
      id: loan.id,
      amount: loan.outstandingBalance || loan.totalRepayment,
      date: loan.nextPaymentDate || '',
      status: 'Due' as const,
      loanId: loan.id,
    }))
    .filter((repayment) => repayment.date) // Only include loans with payment dates
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3); // Show only first 3 upcoming payments

  const hasEntries = upcomingRepayments.length > 0;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <p className="text-sm font-medium text-raisin">Repayment Schedule</p>
        <Link
          href="/dashboard/loans"
          className="text-xs text-mikado hover:underline"
        >
          View all
        </Link>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-[43px] px-6">
          <p className="text-sm text-gray-500">Loading schedule...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-[43px] px-6">
          <p className="text-sm text-red-500">Failed to load schedule</p>
        </div>
      ) : hasEntries ? (
        <ul>
          {upcomingRepayments.map(({ amount, date, status, loanId }, idx) => {
            const isDue = status === 'Due';
            return (
              <li
                key={loanId}
                className={`flex items-center justify-between px-6 py-4 ${
                  idx < upcomingRepayments.length - 1
                    ? 'border-b border-gray-200'
                    : ''
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
                  <span className="text-xs text-[#797979]">
                    Due {fmtDate(date)}
                  </span>
                </div>
                <Link
                  href={`/dashboard/loans/${loanId}/liquidate`}
                  className="inline-flex items-center text-sm text-mikado hover:underline"
                >
                  <span>Pay</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
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
