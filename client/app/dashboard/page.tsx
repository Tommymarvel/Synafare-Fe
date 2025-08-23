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

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="text-raisin ">
        <h1 className="text-[20px] font-medium lg:text-[24px]">
          Welcome {user?.first_name} 👋
        </h1>
        <p className="text-[#797979] text-base ">
          Let’s finance your clean energy solution
        </p>
      </div>

      {/* Overview Cards */}
      <div className="flex flex-col lg:flex-row gap-6">
        {' '}
        <div className="w-full lg:w-3/4 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WalletBalanceCard />
            <LoanBalanceCard />
          </div>
          <QuickActions />
        </div>
        <div className="w-full lg:w-1/4 space-y-6">
          <RepaymentScheduleCard />
          <ReferralBanner />
        </div>
      </div>

      {/* Recent Transactions */}
      <RecentTransactions />
    </div>
  );
}
