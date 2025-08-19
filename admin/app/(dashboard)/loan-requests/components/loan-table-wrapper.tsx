// components/loan-table-wrapper.tsx
'use client';

import React, { useEffect, useState } from 'react';
import CardWrapper from '@/components/cardWrapper';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import SearchInput from '@/components/search.input';
import { LoanStatusFilter } from '@/lib/status-types';

export type DateRangePreset = 'all' | '7' | '30' | '90';

function useDebounced<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}



const LoanTableWrapper = ({
  children,
  hideStatus = false,

  search,
  status,
  dateRange,

  onSearchChange,
  onStatusChange, // React setter accepted
  onDateRangeChange,
}: {
  children: React.ReactNode;
  hideStatus?: boolean;

  search?: string;
  status?: LoanStatusFilter;
  dateRange?: DateRangePreset;

  onSearchChange?: React.Dispatch<React.SetStateAction<string>>;
  onStatusChange?: React.Dispatch<React.SetStateAction<LoanStatusFilter>>;
  onDateRangeChange?: React.Dispatch<React.SetStateAction<DateRangePreset>>;
}) => {
  // uncontrolled fallbacks
  const [localSearch, setLocalSearch] = useState(search ?? '');
  const [localStatus, setLocalStatus] = useState<LoanStatusFilter>(
    status ?? 'ALL'
  );
  const [localDateRange, setLocalDateRange] = useState<DateRangePreset>(
    dateRange ?? 'all'
  );

  useEffect(() => {
    if (search !== undefined) setLocalSearch(search);
  }, [search]);
  useEffect(() => {
    if (status !== undefined) setLocalStatus(status);
  }, [status]);
  useEffect(() => {
    if (dateRange !== undefined) setLocalDateRange(dateRange);
  }, [dateRange]);

  const debouncedSearch = useDebounced(localSearch, 300);

  useEffect(() => {
    onSearchChange?.(debouncedSearch);
  }, [debouncedSearch, onSearchChange]);

  return (
    <CardWrapper className="px-0 py-0 rounded-lg">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between px-6 py-3">
        <div className="max-w-[334px] w-full">
          <SearchInput
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search loans…"
          />
        </div>

        <div className="gap-x-[10px] flex">
          {!hideStatus && (
            <Select
              value={localStatus || ''}
              onValueChange={(v) => {
                const val = v as LoanStatusFilter;
                setLocalStatus(val);
                onStatusChange?.(val);
              }}
            >
              <SelectTrigger className="border p-3 border-border-gray rounded-md">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="OFFER_RECEIVED">Offer Received</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="SUCCESS">Success</SelectItem>
                <SelectItem value="AWAITING_DOWNPAYMENT">
                  Awaiting Downpayment
                </SelectItem>
                <SelectItem value="AWAITING_LOAN_DISBURSEMENT">
                  Awaiting Loan Disbursement
                </SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="OVERDUE">Overdue</SelectItem>
                <SelectItem value="SUCCESS">Success</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
              </SelectContent>
            </Select>
          )}

          <Select
            value={localDateRange}
            onValueChange={(v) => {
              const val = (v as DateRangePreset) || 'all';
              setLocalDateRange(val);
              onDateRangeChange?.(val);
            }}
          >
            <SelectTrigger className="border p-3 border-border-gray rounded-md">
              <SelectValue placeholder="Select Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All time</SelectItem>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {children}
    </CardWrapper>
  );
};

export default LoanTableWrapper;
