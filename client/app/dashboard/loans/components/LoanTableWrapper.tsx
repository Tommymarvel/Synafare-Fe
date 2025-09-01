'use client';

import { Search } from 'lucide-react';
import type { LoanStatus } from '../types';

type DateRange = '' | '1' | '2' | '7' | '30' | '90';

interface LoanTableWrapperProps {
  children: React.ReactNode;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  statusFilter?: LoanStatus | '';
  onStatusChange?: (value: LoanStatus | '') => void;
  dateRangeFilter?: DateRange;
  onDateRangeChange?: (value: DateRange) => void;
}

const LoanTableWrapper = ({
  children,
  searchValue = '',
  onSearchChange = () => {},
  statusFilter = '',
  onStatusChange = () => {},
  dateRangeFilter = '',
  onDateRangeChange = () => {},
}: LoanTableWrapperProps) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <div className="space-y-4 border rounded-lg bg-white">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-6 pt-4">
        <div className="relative w-full sm:w-64">
          <label htmlFor="loan-search" className="sr-only">
            Search loans
          </label>
          <input
            id="loan-search"
            type="text"
            placeholder="Search customers..."
            value={searchValue}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-3.5 py-2.5 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-mikado"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            <Search className="w-5 h-5" />
          </span>
        </div>

        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value as LoanStatus | '')}
            className="px-3 py-2 border text-sm rounded-md bg-white min-w-[140px]"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="OFFER_RECEIVED">Offer Received</option>
            <option value="AWAITING_DOWNPAYMENT">Awaiting Downpayment</option>
            <option value="AWAITING_DISBURSEMENT">Awaiting Disbursement</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <select
            value={dateRangeFilter}
            onChange={(e) => onDateRangeChange(e.target.value as DateRange)}
            className="px-3 py-2 border text-sm rounded-md bg-white min-w-[160px]"
          >
            <option value="">All Time</option>
            <option value="1">Today</option>
            <option value="2">Yesterday</option>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
          </select>
        </div>
      </div>

      {children}
    </div>
  );
};

export default LoanTableWrapper;
