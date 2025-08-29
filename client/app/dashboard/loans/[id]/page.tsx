'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Eye } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import BankSlip from '@/app/assets/bankslip.svg';
import { useParams, useRouter } from 'next/navigation';
import { useLoanById, useRepayById } from '../hooks/useLoans';
import StatusChip from '@/app/components/statusChip';
import EmptyState from '@/app/components/EmptyState';

const currency = (n: number) => `₦${n.toLocaleString('en-NG')}`;

export default function LoanDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const { loan, isLoading, error } = useLoanById(id as string);
  const { repayData } = useRepayById(id as string);

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
    },
  ];

  const customerRows = [
    {
      label: 'Customer’s Name',
      value:
        loan.customerName || `${loan.user?.first_name} ${loan.user?.last_name}`,
    },
    {
      label: 'Customer’s Email Address',
      value: loan.customerEmail || loan.user?.email,
    },
    {
      label: 'Customer’s Phone Number',
      value: loan.customerPhone || loan.user?.phn_no,
    },
  ];

  const nextRepay = repayData?.result?.find((r) => r.is_paid === false);

  const loanDetailRows: { label: string; node: React.ReactNode }[] = [
    { label: 'Transaction Cost', node: currency(loan.transactionCost) },
    { label: 'Loan Duration', node: `${loan.loanDurationInMonths} months` },
    { label: 'Interest (per month)', node: `${loan.interest * 100}%` },
    { label: 'Loan Amount', node: currency(loan.loan_amount) },
    {
      label: `Downpayment (${Math.round(
        loan.downpaymentInPercent * 100
      )}%)`,
      node: currency(loan.downpaymentInNaira),
    },
    { label: 'Total Repayment', node: currency(loan.totalRepayment) },
    {
      label: 'Next Payment',
      node: nextRepay?.repayment_date
        ? format(new Date(nextRepay?.repayment_date), 'MMM d, yyyy')
        : 'N/A',
    },
    { label: 'Status', node: <StatusChip status={loan.loanStatus} /> },
  ];

  return (
    <div className="py-4 max-w- mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/loans"
          className="inline-flex items-center gap-2 text-sm text-[#797979] hover:text-raisin"
        >
          <ArrowLeft className="h-6 w-6 p-1.5 border rounded" /> Go Back
        </Link>
        <button
          disabled={loan.loanStatus !== 'ACTIVE'}
          className="px-4 py-2 rounded-lg bg-[#FEBE04] disabled:bg-gray-200 text-[#1D1C1D] text-sm hover:bg-[#FEBE04]/30"
          onClick={() => router.push(`${loan.id}/liquidate`)}
        >
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
            {currency(Number(loan.outstandingBalance.toFixed(1)))}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-300">Duration</p>
          <p className="mt-2 text-[clamp(28px,_3vw,_32px)] lg:font-medium">
            {!loan?.paidDuration
              ? 'N/A'
              : `${loan?.paidDuration}/${loan?.loanDurationInMonths} Months`}
          </p>
        </div>
      </div>

      <div className="flex gap-4 flex-col lg:flex-row lg:items-start">
        <div className="mt-4 flex-1 gap-4 lg:w-[70%]">
          {/* Customer Information */}
          <section className="rounded-lg border ">
            <header className="px-4 py-3 border-b bg-[#F0F2F5] rounded-t-lg text-sm font-medium">
              Customer Information
            </header>
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 ">
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
              {loanDetailRows.map((row) => (
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
        <section className="rounded-lg border mt-4 lg:mt-4 lg:w-[30%]">
          <header className="px-4 py-3 border-b bg-[#F0F2F5] rounded-t-lg text-sm font-medium">
            Repayment History
          </header>
          <div className="p-6 flex items-center justify-center">
            {repayData?.result?.length === 0 ? (
              <EmptyState
                title="No Repayment History"
                description="This loan doesn't have any repayment history yet."
                illustration="/empty-loan.svg"
                illustrationWidth={100}
                illustrationHeight={100}
                className="text-center h-fit text-sm text-[#797979]"
              />
            ) : (
              <ul className="w-full space-y-3">
                {repayData?.result.map((r, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <div className="flex flex-col justify-center items-center gap-2">
                      <Image
                        src={r.is_paid ? '/repay-dot.svg' : '/notrepay-dot.svg'}
                        alt=""
                        className=""
                        width={10}
                        height={10}
                      />
                      <Image
                        src={'/notrepay-line.svg'}
                        alt=""
                        className=""
                        width={1}
                        height={10}
                      />
                    </div>
                    <div>
                      <h4 className="font-medium lg:text-base">
                        {currency(r.amount)}
                      </h4>
                      <p>
                        Repayment:{' '}
                        {format(new Date(r?.repayment_date), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
