'use client';

import { X } from 'lucide-react';
import React from 'react';
import type { Loan } from '../types';
import { fmtNaira } from '@/lib/format';

export default function FinancingOfferModal({
  open,
  loan,
  onClose,
  onReject,
  onAccept,
}: {
  open: boolean;
  loan: Loan | null;
  onClose: () => void;
  onReject: (loan: Loan) => void;
  onAccept: (loan: Loan) => void;
}) {
  if (!open || !loan) return null;
 

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: 'Transaction Cost', value: fmtNaira(loan.transactionCost) },
    { label: 'Amount Requested', value: fmtNaira(loan.loan_amount) },
    { label: 'Amount Offered', value: fmtNaira(loan.loan_amount) },
    { label: 'Loan Duration', value: `${loan.loanDurationInMonths} months` },
    { label: 'Interest (per month)', value: `${loan.interest*100}%` },
    { label: `Downpayment (${loan.downpaymentInPercent}%)`, value: fmtNaira(loan.downpaymentInNaira) },
    { label: 'Total Repayment', value: fmtNaira(loan.totalRepayment) },
    { label: 'Monthly installment', value: fmtNaira(loan.monthly_repayment) },
  ];

  return (
    <div className="fixed  inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      {/* dialog */}
      <div className="relative z-10 w-[min(92vw,720px)] rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-raisin">Financing Offer</h3>
          <button onClick={onClose} className="p-2 rounded hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
            {rows.map((r) => (
              <div key={r.label}>
                <p className="text-[11px] text-[#9CA3AF]">{r.label}</p>
                <p className="mt-1 text-sm text-raisin">{r.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-row gap-3">
            <button
              onClick={() => onReject(loan)}
              className="flex-1 py-3 rounded-lg border hover:bg-gray-50"
            >
              Reject Offer
            </button>
            <button
              onClick={() => onAccept(loan)}
              className="flex-1 py-3 rounded-lg bg-mikado text-raisin hover:bg-mikado/90"
            >
              Accept Offer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
