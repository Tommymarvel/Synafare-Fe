'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import { Search, ChevronRight, ChevronLeft } from 'lucide-react';
import type { Loan, LoanStatus } from '../types';


export function LoansTable({ loans }: { loans: Loan[] }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateRange, setDateRange] = useState<string>('');

  // basic filtering
  let filtered = loans.filter((l) =>
    l.customerName.toLowerCase().includes(search.toLowerCase())
  );
  if (statusFilter)
    filtered = filtered.filter((l) => l.status === statusFilter);

  // sticky header th
  const thStyles =
    'sticky top-0 z-10 bg-[#F0F2F5] px-3 lg:px-6 py-3 font-medium text-xs leading-[18px] text-center';

  return (
    <div className="space-y-4 border rounded-lg">
      {/* Filters (static) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-6 pt-3">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2.5 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-mikado"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            <Search className="w-5 h-5" />
          </span>
        </div>

        <div className="flex max-w-full gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 w-1/2 border text-sm rounded-md bg-white"
          >
            <option value="">Status</option>
            <option value="PENDING">Pending</option>
            <option value="OFFER_RECEIVED">Offer Received</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 w-1/2  flex-1 text-sm border rounded-md bg-white"
          >
            <option value="">Select Date Range</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* ONLY this table scrolls on small screens */}
      <div className="-mx-1 md:mx-0">
        <div
          className="overflow-x-auto md:overflow-visible scrollbar-mikado px-1 md:px-0"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <table className="min-w-[500px] md:min-w-0 w-full bg-white border rounded-lg table-auto">
            <thead>
              <tr className="bg-[#F0F2F5]">
                <th className={`${thStyles} w-[48px]`}>
                  <input type="checkbox" className="h-5 w-5" />
                </th>
                <th className={`${thStyles} text-left`}>Customer</th>
                <th className={thStyles}>Transaction Cost</th>
                <th className={thStyles}>Loan Amount</th>
                <th className={`${thStyles} hidden md:table-cell`}>
                  Date Requested
                </th>
                <th className={`${thStyles} hidden lg:table-cell`}>Duration</th>
                <th className={`${thStyles} hidden lg:table-cell`}>
                  Next Payment
                </th>
                <th className={`${thStyles} hidden lg:table-cell`}>Status</th>
                <th className={thStyles}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((loan) => (
                <tr key={loan.id} className="hover:bg-neutral-50 border-b">
                  <td className="px-6 py-3 text-center">
                    <input type="checkbox" className="h-5 w-5" />
                  </td>

                  <td className="px-6 py-3">
                    <div className="font-medium text-sm text-raisin whitespace-nowrap md:whitespace-normal">
                      {loan.customerName}
                    </div>
                    <div className="text-xs text-[#797979] whitespace-nowrap md:whitespace-normal">
                      {loan.customerEmail}
                    </div>
                  </td>

                  <td className="px-6 py-3 text-sm text-center whitespace-nowrap">
                    ₦{loan.transactionCost.toLocaleString()}
                  </td>
                  <td className="px-6 py-3 text-sm text-center whitespace-nowrap">
                    ₦{loan.loanAmount.toLocaleString()}
                  </td>

                  <td className="px-6 py-3 text-sm text-center hidden md:table-cell whitespace-nowrap">
                    {format(new Date(loan.dateRequested), 'MMM d, yyyy')}
                  </td>

                  <td className="px-6 py-3 text-sm text-center hidden lg:table-cell whitespace-nowrap">
                    {loan.duration}
                  </td>

                  <td className="px-6 py-3 text-sm text-center hidden lg:table-cell whitespace-nowrap">
                    {loan.nextPaymentDate
                      ? format(new Date(loan.nextPaymentDate), 'MMM d, yyyy')
                      : '— — —'}
                  </td>

                  <td className="px-6 py-3 text-sm text-center hidden lg:table-cell whitespace-nowrap">
                    <StatusChip status={loan.status} />
                  </td>

                  <td className="px-6 py-3 text-center text-neutral-400 hover:text-neutral-600 whitespace-nowrap">
                    ⋮
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between py-4 px-6">
        <button className="inline-flex items-center px-3 py-2 border rounded-md hover:bg-gray-50">
          <ChevronLeft className="w-4 h-4 mr-1" /> Previous
        </button>
        <div className="flex items-center space-x-1">
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              className={`px-2 py-1 rounded-md ${
                page === 1
                  ? 'bg-yellow-100 text-yellow-600'
                  : 'hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}
          <span>…</span>
          <button className="px-2 py-1 rounded-md hover:bg-gray-100">10</button>
        </div>
        <button className="inline-flex items-center px-3 py-2 border rounded-md hover:bg-gray-50">
          Next <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
}

const STATUS_MAP: Record<LoanStatus, readonly [string, string]> = {
  PENDING: ['Pending', 'bg-yellow-50 text-yellow-600'],
  OFFER_RECEIVED: ['Offer Received', 'bg-blue-50 text-blue-600'],
  ACTIVE: ['Active', 'bg-green-50 text-green-600'],
  COMPLETED: ['Completed', 'bg-emerald-50 text-emerald-600'],
  REJECTED: ['Rejected', 'bg-red-50 text-red-600'],
};

function StatusChip({ status }: { status: LoanStatus }) {
  const [label, classes] = STATUS_MAP[status];
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${classes}`}
    >
      {label}
    </span>
  );
}
