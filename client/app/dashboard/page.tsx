// app/dashboard/page.tsx
'use client';

import React from 'react';
import ReferralBanner from './components/dashboard/ReferralBanner';
import WalletBalanceCard from './components/cards/WalletBalanceCard';
import LoanBalanceCard from './components/cards/LoanBalanceCard';
import RepaymentScheduleCard from './components/cards/RepaymentScheduleCard';
import QuickActions from './components/dashboard/QuickActions';
import RecentTransactions from './components/dashboard/RecentTransactions';
import { useAuth } from '@/context/AuthContext';

function Blocked({
  children,
  reason = 'Available after verification',
}: {
  children: React.ReactNode;
  reason?: string;
}) {
  return (
    <div className="relative opacity-60 grayscale">
      {/* overlay to catch pointer events */}
      <div
        className="absolute inset-0 z-10 cursor-not-allowed rounded-xl"
        title={reason}
        aria-hidden="true"
      />
      {children}
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const isVerified = user?.account_status === 'verified';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-raisin">
        <h1 className="text-[20px] font-medium lg:text-[24px]">
          Welcome {user?.first_name ?? '—'} 👋
        </h1>
        <p className="text-[#797979] text-base">
          Let’s finance your clean energy solution
        </p>
      </div>

      {/* Layout — same structure for both states */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Left: wallet + loan + quick actions */}
        <div className="w-full space-y-6 lg:w-3/4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {isVerified ? (
              <WalletBalanceCard />
            ) : (
              <Blocked reason="Wallet actions are available after verification">
                <WalletBalanceCard />
              </Blocked>
            )}

            {isVerified ? (
              <LoanBalanceCard />
            ) : (
              <Blocked reason="Loans are available after verification">
                <LoanBalanceCard />
              </Blocked>
            )}
          </div>

          {isVerified ? (
            <QuickActions />
          ) : (
            <Blocked reason="Quick actions are available after verification">
              <QuickActions />
            </Blocked>
          )}
        </div>

        {/* Right: repayment schedule + referral banner */}
        <div className="w-full space-y-6 lg:w-1/4">
          {/* Repayment schedule can stay visible (often empty state anyway) */}
          {isVerified ? (
            <RepaymentScheduleCard />
          ) : (
            <Blocked reason="Repayment schedule is available after verification">
              <RepaymentScheduleCard />
            </Blocked>
          )}

          {/* Keep referral banner visible; block clicks if you want parity */}
          {isVerified ? (
            <ReferralBanner />
          ) : (
            <Blocked reason="Referral actions are available after verification">
              <ReferralBanner />
            </Blocked>
          )}
        </div>
      </div>
      {!isVerified && (
        <div className="flex items-center gap-2 rounded-xl border border-[#F7E3B8] bg-[#FFF6E5] px-4 py-3 text-[13px] text-[#8B5E00]">
          <svg
            className="h-4 w-4 shrink-0 text-[#F5A524]"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-medium">Account is pending verification</span>
        </div>
      )}
      {/* Recent transactions (visible; component likely shows empty state) */}

      {isVerified ? (
        <RecentTransactions />
      ) : (
        <Blocked reason="Recent transactions are available after verification">
          <RecentTransactions />
        </Blocked>
      )}
    </div>
  );
}
