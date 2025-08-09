'use client';

import React, { useMemo, useState } from 'react';
import { EmptyState } from './components/EmptyState';
import { LoansTable } from './components/LoansTable';
import LoanAgreementModal from './components/LoanAgreeementModal';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useLoans } from './hooks/useLoans';

const TABS = [
  { key: 'all', label: 'All Loans' },
  { key: 'offers', label: 'Loan Offers' },
  { key: 'active', label: 'Active Loans' },
  { key: 'repaid', label: 'Repaid Loans' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export default function LoansPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const { user } = useAuth();
  const router = useRouter();
  const [showAgreement, setShowAgreement] = useState(false);

  const { loans, isLoading, error } = useLoans();

  const offersCount = useMemo(
    () => loans.filter((l) => l.status === 'OFFER_RECEIVED').length,
    [loans]
  );

  const loansForTab = useMemo(() => {
    switch (activeTab) {
      case 'offers':
        return loans.filter((l) => l.status === 'OFFER_RECEIVED');
      case 'active':
        return loans.filter((l) => l.status === 'ACTIVE');
      case 'repaid':
        return loans.filter((l) => l.status === 'COMPLETED');
      default:
        return loans;
    }
  }, [activeTab, loans]);

  const handleAccept = () => setShowAgreement(false);

  const handleRequestLoan = () => {
    if (user?.loan_agreement === 'not_signed') setShowAgreement(true);
    else router.push('/dashboard/loans/request');
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
          <span className="">＋</span>
          <p className="text-sm lg:text-xl">Request Loan</p>
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

      {/* Content */}
      <div className="mt-5">
        {isLoading ? (
          <p className="p-6">Loading…</p>
        ) : error ? (
          <p className="p-6 text-red-600">Error loading loans</p>
        ) : loansForTab.length === 0 ? (
          <EmptyState />
        ) : (
          <LoansTable loans={loansForTab} />
        )}
      </div>

      <LoanAgreementModal
        open={showAgreement}
        onClose={() => setShowAgreement(false)}
        onAccept={handleAccept}
      />
    </div>
  );
}
