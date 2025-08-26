'use client';

import React, { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Search } from 'lucide-react';
import type { Loan } from '../types';
import { fmtDate, fmtNaira } from '@/lib/format';
import Pagination from '@/app/components/pagination';
import EmptyState from '@/app/components/EmptyState';

type DateRange = '' | '7' | '30' | '90';

const PAGE_SIZE = 10;

export default function PaidLoans({ loans }: { loans: Loan[] }) {
  const [search, setSearch] = useState('');

  const [dateRange, setDateRange] = useState<DateRange>('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Compute filtered results
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const now = new Date();

    return loans.filter((l) => {
      if (q && !l.customerName.toLowerCase().includes(q)) return false;

      if (dateRange) {
        const days = Number(dateRange);
        const since = new Date(now);
        since.setDate(now.getDate() - days);
        const requested = new Date(l.dateRequested);
        if (requested < since) return false;
      }

      return true;
    });
  }, [loans, search, dateRange]);

  // Reset page & selection when filters change
  React.useEffect(() => {
    setPage(1);
    setSelected(new Set());
  }, [search, dateRange]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const end = Math.min(start + PAGE_SIZE, filtered.length);
  const pageRows = filtered.slice(start, end);

  // Row selection (page-scoped “select all”)
  const pageIds = pageRows.map((r) => r.id);
  const allSelectedOnPage =
    pageIds.every((id) => selected.has(id)) && pageIds.length > 0;

  const toggleRow = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAllOnPage = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelectedOnPage) {
        pageIds.forEach((id) => next.delete(id));
      } else {
        pageIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  // sticky header th
  const thStyles =
    'sticky top-0 z-10 bg-[#F0F2F5] px-3 lg:px-6 py-3 font-medium text-xs leading-[18px] text-center';

  return (
    <div className="space-y-4 border rounded-lg">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-6 pt-3">
        <div className="relative w-full sm:w-64">
          <label htmlFor="loan-search" className="sr-only">
            Search
          </label>
          <input
            id="loan-search"
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
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as DateRange)}
            className="px-3 py-2 w-1/2  flex-1 text-sm border rounded-md bg-white"
          >
            <option value="">Select Date Range</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="-mx-1 md:mx-0">
        <div
          className="overflow-x-auto md:overflow-visible scrollbar-mikado px-1 md:px-0"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <table className="min-w-[500px] md:min-w-0 w-full bg-white border rounded-lg table-auto">
            <thead>
              <tr className="bg-[#F0F2F5]">
                <th className={`${thStyles} w-[48px]`}>
                  <input
                    type="checkbox"
                    className="h-5 w-5"
                    checked={allSelectedOnPage}
                    onChange={toggleAllOnPage}
                    aria-label="Select all rows on this page"
                  />
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
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-0">
                    <EmptyState
                      title="No Paid Loans Found"
                      description="You don't have any paid loans matching your current filters."
                      illustration="/empty-loan.svg"
                      className="border-0 py-10"
                    />
                  </td>
                </tr>
              ) : (
                pageRows.map((loan) => (
                  <tr key={loan.id} className="hover:bg-neutral-50 border-b">
                    <td className="px-6 py-3 text-center">
                      <input
                        type="checkbox"
                        className="h-5 w-5"
                        checked={selected.has(loan.id)}
                        onChange={() => toggleRow(loan.id)}
                        aria-label={`Select ${loan.customerName}`}
                      />
                    </td>

                    <td className="px-6 py-3">
                      <div className="font-medium text-sm text-raisin whitespace-nowrap md:whitespace-normal capitalize truncate w-[10ch]">
                        {loan?.customerName ||
                          `${loan.user?.first_name} ${loan?.user?.last_name}`}
                      </div>
                      <div className="text-xs text-[#797979] whitespace-nowrap md:whitespace-normal truncate w-[10ch]">
                        {loan?.customerEmail || loan?.user?.email}
                      </div>
                    </td>

                    <td className="px-6 py-3 text-sm text-center whitespace-nowrap">
                      ₦{loan.transactionCost.toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-sm text-center whitespace-nowrap">
                      {fmtNaira(loan.loan_amount)}
                    </td>

                    <td className="px-6 py-3 text-sm text-center hidden md:table-cell whitespace-nowrap">
                      {format(new Date(loan.dateRequested), 'MMM d, yyyy')}
                    </td>

                    <td className="px-6 py-3 text-sm text-center hidden lg:table-cell whitespace-nowrap">
                      {loan.loanDurationInMonths} months
                    </td>

                    <td className="px-6 py-3 text-sm text-center hidden lg:table-cell whitespace-nowrap">
                      {fmtDate(loan.nextPaymentDate) || 'N/A'}
                    </td>

                    <td className="px-6 py-3 text-sm text-center hidden lg:table-cell whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600">
                        {' '}
                        Completed
                      </span>
                    </td>

                    <td
                      className="px-6 py-3 text-center text-neutral-400 hover:text-neutral-600 whitespace-nowrap cursor-default"
                      onClick={() =>
                        (window.location.href = `/dashboard/loans/${loan.id}`)
                      }
                    >
                      View
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer / Pagination */}
      <div className="py-4 px-6">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
