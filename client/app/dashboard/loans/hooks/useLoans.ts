// hooks/useLoans.ts
'use client';

import useSWR from 'swr';
import axiosInstance from '@/lib/axiosInstance';
import type { Loan, LoanAPI } from '../types';
import { toLoan } from '../types';

// The API sometimes returns {data: [...] | {...}, meta?}, sometimes raw [...]/{}
type Envelope = { data: LoanAPI[] | LoanAPI; meta?: { total?: number } } | LoanAPI[] | LoanAPI;

const fetcher = async (url: string): Promise<Envelope> => {
  const res = await axiosInstance.get(url);
  return res.data;
};

export function useLoan(id?: string | number) {
  // If id is present -> /loan/myloans/:id, else list -> /loan/myloans
  const key = id
    ? `/loan/myloans?id=${encodeURIComponent(String(id))}`
    : '/loan/myloans';

  const { data, error, isLoading, isValidating, mutate } = useSWR<Envelope>(
    key,
    fetcher,
    {
      revalidateOnFocus: true,
      dedupingInterval: 60_000,
      keepPreviousData: true,
    }
  );

  // Normalize payload to an array of LoanAPI
  const payload =
    data && typeof data === 'object' && 'data' in data
      ? (data as { data: LoanAPI[] | LoanAPI }).data
      : data;

  const arr: LoanAPI[] = Array.isArray(payload)
    ? payload
    : payload
    ? [payload as LoanAPI]
    : [];

  const loans: Loan[] = arr.map(toLoan);
  const loan: Loan | null = loans[0] ?? null;
  const total = (data as { meta?: { total?: number } })?.meta?.total ?? loans.length;

  const loading = typeof isLoading === 'boolean' ? isLoading : !data && !error;

  return {
    loans,
    loan,
    total,
    isLoading: loading,
    isValidating,
    error,
    refresh: mutate,
  };
}

// (Optional) thin convenience wrappers if you prefer explicit names:
export const useLoansList = () => useLoan();
export const useLoanById = (id?: string | number) => {
  const { loan, ...rest } = useLoan(id);
  return { loan, ...rest };
};
