'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Eye } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import Empty from '@/app/assets/repayHistory-empty.png';
import BankSlip from '@/app/assets/bankslip.svg';
import { useParams } from 'next/navigation';
import { useLoanById } from '../hooks/useLoans';


type LoanStatus =
  | 'PENDING'
  | 'OFFER_RECEIVED'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'REJECTED';

const currency = (n: number) => `₦${n.toLocaleString('en-NG')}`;

const STATUS_MAP: Record<LoanStatus, readonly [string, string]> = {
  PENDING: ['Pending', 'bg-amber-50 text-amber-700'],
  OFFER_RECEIVED: ['Offer Received', 'bg-blue-50 text-blue-700'],
  ACTIVE: ['Active', 'bg-green-50 text-green-700'],
  COMPLETED: ['Completed', 'bg-emerald-50 text-emerald-700'],
  REJECTED: ['Rejected', 'bg-red-50 text-red-700'],
};

function StatusChip({ status }: { status: LoanStatus }) {
  const [label, classes] = STATUS_MAP[status];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes}`}
    >
      {label}
    </span>
  );
}

export default function LoanDetailsPage() {
  const { id } = useParams();
  const { loan, isLoading, error } = useLoanById(id as string);

  if (isLoading) {
    return <div className="p-4">Loading loan details...</div>;
  }

  if (error || !loan) {
    return <div className="p-4 text-red-500">Unable to load loan details.</div>;
  }

  const documents = [
    {
      name: 'Bank Statement',
      url: loan.bankStatement,
    },
    {
      name: 'Transaction Invoice',
      url: loan.trxInvoice,
  }]


  const customerRows = [
    { label: 'Customer’s Name', value: loan.customerName },
    { label: 'Customer’s Email Address', value: loan.customerEmail },
    { label: 'Customer’s Phone Number', value: loan.customerPhone },
  ];

  const loanDetailRows: { label: string; node: React.ReactNode }[] = [
    { label: 'Transaction Cost', node: currency(loan.transactionCost) },
    { label: 'Loan Duration', node: `${loan.loanDurationInMonths} months` },
    { label: 'Interest (per month)', node: `${loan.interest}%` },
    { label: 'Loan Amount', node: currency(loan.loanAmount) },
    {
      label: `Downpayment (${loan.downpaymentInNaira}%)`,
      node: currency(loan.downpaymentInNaira),
    },
    { label: 'Total Repayment', node: currency(loan.totalRepayment) },
    {
      label: 'Next Payment',
      node: loan.nextPaymentDate
        ? format(new Date(loan.nextPaymentDate), 'MMM d, yyyy')
        : 'N/A',
    },
    { label: 'Status', node: <StatusChip status={loan.loanStatus} /> },
  ];

  return (
    <div className="py-4 max-w-5xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/loans"
          className="inline-flex items-center gap-2 text-sm text-[#797979] hover:text-raisin"
        >
          <ArrowLeft className="h-6 w-6 p-1.5 border rounded" /> Go Back
        </Link>
        <button className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 text-sm hover:bg-gray-300">
          Liquidate Loan
        </button>
      </div>

      <h1 className="mt-3 text-2xl sm:text-3xl font-medium text-raisin">
        Loan Details
      </h1>

      {/* Summary card */}
      <div className="mt-4 rounded-xl bg-[#1a1a1a] text-white p-6 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-300">Outstanding Balance</p>
          <p className="mt-2 text-[clamp(28px,_3vw,_32px)] tracking-widest">
            {currency(loan.outstandingBalance)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-300">Duration</p>
          <p className="mt-2 text-[clamp(28px,_3vw,_32px)] lg:font-medium">
            {!loan?.elapsedMonths
              ? 'N/A'
              : `${loan?.elapsedMonths}/${loan?.loanDurationInMonths} Months`}
          </p>
        </div>
      </div>

      <div className="flex gap-4 flex-col lg:flex-row">
        <div className="mt-4 flex-1 gap-4">
          {/* Customer Information */}
          <section className="rounded-lg border">
            <header className="px-4 py-3 border-b bg-[#F0F2F5] rounded-t-lg text-sm font-medium">
              Customer Information
            </header>
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {customerRows.map((row) => (
                <div key={row.label}>
                  <p className="text-[11px] text-[#9CA3AF]">{row.label}</p>
                  <p className="mt-1 text-sm text-raisin">{row.value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Loan Details */}
          <section className="mt-4 rounded-lg border">
            <header className="px-4 py-3 border-b bg-[#F0F2F5] rounded-t-lg text-sm font-medium">
              Loan Details
            </header>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-5 gap-x-6">
              {loanDetailRows.slice(3).map((row) => (
                <div key={row.label}>
                  <p className="text-[11px] text-[#9CA3AF]">{row.label}</p>
                  <div className="mt-1 text-sm text-raisin">{row.node}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Documents */}
          <section className="mt-4 rounded-lg border">
            <header className="px-4 py-3 border-b bg-[#F0F2F5] rounded-t-lg text-sm font-medium">
              Documents
            </header>
            <ul className="p-2 sm:p-4 space-y-3">
              {documents.map((doc) => (
                <li
                  key={doc.url}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                      <Image src={BankSlip} alt="Bank Slip Icon" />
                    </span>
                    <span className="text-sm text-raisin">{doc.name}</span>
                  </div>
                  <a
                    href={doc.url}
                    className="inline-flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Eye className="w-4 h-4" />
                    View Document
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Repayment History */}
        <section className="rounded-lg border mt-4 lg:mt-4">
          <header className="px-4 py-3 border-b bg-[#F0F2F5] rounded-t-lg text-sm font-medium">
            Repayment History
          </header>
          <div className="p-6 flex items-center justify-center">
             <div className="text-center h-fit text-sm text-[#797979]">
                <Image
                  src={Empty}
                  alt="No Repayment History"
                  width={100}
                  height={100}
                />
                <p>No repayment history</p>
              </div>
            {/* {loan.repayments.length === 0 ? (
             
            ) : (
              <ul className="w-full space-y-3">
                {loan.repayments.map((r, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>{format(new Date(r.date), 'MMM d, yyyy')}</span>
                    <span className="font-medium">{currency(r.amount)}</span>
                  </li>
                ))}
              </ul>
            )} */}
          </div>
        </section>
      </div>
    </div>
  );
}
