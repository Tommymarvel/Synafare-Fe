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

const sampleTransactions = [
  {
    id: '#ID023005',
    type: 'Fund Wallet',
    amount: 1181675,
    date: 'Jan 6, 2025',
    status: 'Successful',
    href: '/dashboard/transactions/ID023005',
  } as const,
  {
    id: '#ID023006',
    type: 'Invoice Payment',
    amount: 256000,
    date: 'Jan 7, 2025',
    status: 'Successful',
    href: '/dashboard/transactions/ID023006',
  } as const,
  {
    id: '#ID023007',
    type: 'Withdrawal',
    amount: 50000,
    date: 'Jan 8, 2025',
    status: 'Successful',
    href: '/dashboard/transactions/ID023007',
  } as const,
  {
    id: '#ID023008',
    type: 'Loan Repayment',
    amount: 190900,
    date: 'Apr 1, 2025',
    status: 'Successful',
    href: '/dashboard/transactions/ID023008',
  } as const,
  {
    id: '#ID023009',
    type: 'Loan Disbursal',
    amount: 500000,
    date: 'May 15, 2025',
    status: 'Pending',
    href: '/dashboard/transactions/ID023009',
  } as const,
];

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
          <RepaymentScheduleCard
            schedule={[
              { amount: 10000, date: 'Apr 1, 2025', status: 'Upcoming' },
              { amount: 15000, date: 'May 1, 2025', status: 'Due' },
              { amount: 20000, date: 'Jun 1, 2025', status: 'Paid' },
            ]}
          />

          <ReferralBanner />
        </div>
      </div>

      {/* Recent Transactions */}
      <RecentTransactions transactions={sampleTransactions} />
      
    </div>
  );
}
