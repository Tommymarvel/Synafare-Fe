'use client';

import React from 'react';
import Link from 'next/link';
import { Banknote } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoanBalanceCard() {
  const { user } = useAuth();
  return (
    <div className="relative bg-white rounded-2xl border border-gray-200 p-4">
      {/* Top-right icon badge */}
      <div className="absolute top-4 right-4 bg-[#FFF8E2] p-2 rounded-full text-mikado">
        <Banknote className="h-6 w-6" />
      </div>

      <div className="">
        {/* Title */}
        <p className="text-sm text-[#797979]">Loan Balance</p>

        <div className="mt-[25px]">
          {/* Balance amount */}
          <div className="mt-1 text-raisin text-[32px] font-medium">
            ₦<span className="text-sm">{user?.loan_balance || 0.0}</span>
          </div>
          {/* Available credit */}
          <p className="text-xs text-[#797979]">
            Available Credit: ₦ 5,000,000.00
          </p>
        </div>

        {/* Action button */}
        <Link
          href="/dashboard/loans"
          className="mt-4 w-fit inline-flex justify-center px-4 py-2 bg-[#FFF8E2] text-mikado font-medium rounded-lg hover:bg-[#FFE5B4] transition"
        >
          Pay Loan
        </Link>
      </div>
    </div>
  );
}
