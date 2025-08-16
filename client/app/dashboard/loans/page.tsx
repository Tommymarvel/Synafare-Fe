'use client';

import React, { useMemo, useState } from 'react';
import { EmptyState } from './components/EmptyState';
import LoanAgreementModal from './components/LoanAgreeementModal';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { LoansOffers } from './components/LoanOffers';
import ActiveLoans from './components/ActiveLoans';
import LoansTable from './components/LoansTable';
import PaidLoans from './components/PaidLoans';
import { useLoans } from './hooks/useLoans';


const TABS = [
  { key: 'all', label: 'All Loans' },
  { key: 'offers', label: 'Loan Offers' },
  { key: 'active', label: 'Active Loans' },
  { key: 'paid', label: 'Paid Loans' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export default function LoansPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const { user } = useAuth();
  const router = useRouter();
  const [showAgreement, setShowAgreement] = useState(false);

  const { loans, isLoading, error,refresh } = useLoans();

  const offersCount = useMemo(
    () => loans.filter((loan) => loan.loanStatus === 'OFFER_RECEIVED').length,
    [loans]
  );

  const handleAccept = () => setShowAgreement(false);

  const handleRequestLoan = () => {
    if (user?.loan_agreement === 'not_signed') setShowAgreement(true);
    else router.push('/dashboard/loans/request');
  };

  const renderTabContent = () => {
    if (isLoading) return <p className="p-6">Loading…</p>;
    if (error) return <p className="p-6 text-red-600">Error loading loans</p>;

    const list = loans ?? [];

    const offers = list.filter((l) => l.loanStatus === 'OFFER_RECEIVED');
    const active = list.filter((l) => l.loanStatus === 'ACTIVE');
    const repaid = list.filter((l) => l.loanStatus === 'COMPLETED');

  switch (activeTab) {
    case 'offers':
      return <LoansOffers loans={offers} refresh={refresh} />;
    case 'active':
      return <ActiveLoans loans={active}/>;
    case 'paid': // <- not "paid" if your tab key is 'repaid'
      return <PaidLoans loans={repaid} />;
    default:
      return <LoansTable loans={list} refresh={refresh} />;
  }
  };

 

  return (
    <div>
      {/* Header + CTA */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">Loans</h1>
        <button
          onClick={handleRequestLoan}
          className="inline-flex items-center gap-2.5 px-3 py-2 bg-mikado text-raisin rounded-lg hover:bg-yellow-600"
        >
          <span className="text-xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M10.8337 7.49984C10.8337 7.0396 10.4606 6.6665 10.0003 6.6665C9.54009 6.6665 9.16699 7.0396 9.16699 7.49984V9.1665H7.50033C7.04009 9.1665 6.66699 9.5396 6.66699 9.99984C6.66699 10.4601 7.04009 10.8332 7.50033 10.8332H9.16699V12.4998C9.16699 12.9601 9.54009 13.3332 10.0003 13.3332C10.4606 13.3332 10.8337 12.9601 10.8337 12.4998V10.8332H12.5003C12.9606 10.8332 13.3337 10.4601 13.3337 9.99984C13.3337 9.5396 12.9606 9.1665 12.5003 9.1665H10.8337V7.49984Z"
                fill="#1D1C1D"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M10.0003 1.6665C5.39795 1.6665 1.66699 5.39746 1.66699 9.99984C1.66699 14.6022 5.39795 18.3332 10.0003 18.3332C14.6027 18.3332 18.3337 14.6022 18.3337 9.99984C18.3337 5.39746 14.6027 1.6665 10.0003 1.6665ZM3.33366 9.99984C3.33366 6.31794 6.31843 3.33317 10.0003 3.33317C13.6822 3.33317 16.667 6.31794 16.667 9.99984C16.667 13.6817 13.6822 16.6665 10.0003 16.6665C6.31843 16.6665 3.33366 13.6817 3.33366 9.99984Z"
                fill="#1D1C1D"
              />
            </svg>
          </span>
          <p className="text-sm ">Request Loan</p>
        </button>
      </div>

      {/* Tabs */}
      <nav className="flex gap-6 border-b mt-5">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const badge =
            tab.key === 'offers' && offersCount > 0 ? (
              <span className="ml-2 inline-block bg-neutral-200 text-neutral-700 text-xs px-1 rounded">
                {offersCount}
              </span>
            ) : null;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative pb-2 text-xs md:text-sm font-medium ${
                isActive
                  ? 'text-mikado border-b-2 border-mikado'
                  : 'text-[#797979] hover:text-neutral-800'
              }`}
            >
              {tab.label}
              {badge}
            </button>
          );
        })}
      </nav>

      {Array.isArray(loans) && loans.length === 0 && !isLoading ? (
        <div className="mt-5">
          <EmptyState />
        </div>
      ) : (
        <div className="mt-5">{renderTabContent()}</div>
      )}

      <LoanAgreementModal
        open={showAgreement}
        onClose={() => setShowAgreement(false)}
        onAccept={handleAccept}
      />
    </div>
  );
}
