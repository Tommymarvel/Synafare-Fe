// app/dashboard/page.tsx
'use client';

import React from 'react';
// import ReferralBanner from './components/dashboard/ReferralBanner';
// import RecentTransactions from './components/RecentTransactions';
// import WalletBalanceCard from './components/cards/WalletBalanceCard';
// import LoanBalanceCard from './components/cards/LoanBalanceCard';
// import RepaymentScheduleCard from './components/cards/RepaymentScheduleCard';
// import QuickActions from './components/dashboard/QuickActions';

export default function DashboardPage() {
  return (
    // <div className="space-y-6">
    //   {/* Quick Actions Row */}

    //   {/* <QuickActions /> */}

    //   {/* Overview Cards */}
    //   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    //     {/* <WalletBalanceCard />
    //     <LoanBalanceCard />
    //     <RepaymentScheduleCard /> */}
    //   </div>

    //   {/* Referral Banner */}
    //   {/* <ReferralBanner /> */}

    //   {/* Recent Transactions */}
    //   {/* <RecentTransactions /> */}
    // </div>
    <>
    <div className="animate-fade-in text-center p-4 bg-gray-100 rounded-lg shadow-md">
      <p className="text-lg font-semibold text-gray-700">
      Welcome to your dashboard, building in progress
      </p>
    </div>

    <style jsx>{`
      @keyframes fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
      }
      .animate-fade-in {
      animation: fade-in 1.5s ease-in-out;
      }
    `}</style></>
  );
}
