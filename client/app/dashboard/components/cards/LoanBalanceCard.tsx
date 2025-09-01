'use client';

import React from 'react';
import Link from 'next/link';
import { Banknote } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { fmtNaira } from '@/lib/format';

export default function LoanBalanceCard() {
  const { user } = useAuth();
  const SplitCurrency = ({
    amount,
    className = 'text-[32px] font-medium',
    decimalClassName = 'text-sm',
  }: {
    amount: number;
    className?: string;
    decimalClassName?: string;
  }) => {
    const formatted = fmtNaira(amount);
    const [integerPart, decimalPart] = formatted.split('.');
  
    return (
      <div className={`flex items-end ${className}`}>
        {integerPart}
        {decimalPart && (
          <span className={`${decimalClassName} self-end mb-1`}>
            .{decimalPart}
          </span>
        )}
      </div>
    );
  };
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
          
            <SplitCurrency
              amount={user?.loan_balance ?? 0}
              className="text-[32px] font-medium"
              decimalClassName="text-sm"
            />
          </div>
          {/* Available credit */}
          <p className="text-xs text-[#797979]">
            Available Credit: {fmtNaira(user?.available_credit ?? 0)}
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
