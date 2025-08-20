// hooks/useLoans.ts
'use client';

import useSWR from 'swr';
import axiosInstance from '@/lib/axiosInstance';
import { Loan, LoanAPI, toLoan } from '../types';


// fetch raw envelope (don’t assume shape)
const fetcher = async (url: string) => {
  const res = await axiosInstance.get(url);
  return res.data;
  
};

// normalize helpers
function asList(envelope: unknown): LoanAPI[] {
  if (Array.isArray(envelope)) return envelope as LoanAPI[];
  if (envelope && typeof envelope === 'object') {
    const d = (envelope as { data?: LoanAPI[] | LoanAPI }).data;
    if (Array.isArray(d)) return d as LoanAPI[];
    if (d && typeof d === 'object') return [d as LoanAPI];
  }
  return [];
}

function asOne(envelope: unknown): LoanAPI | undefined {
  if (Array.isArray(envelope)) return (envelope as LoanAPI[])[0];
  if (envelope && typeof envelope === 'object') {
    const d = (envelope as { data?: LoanAPI[] | LoanAPI }).data;
    if (Array.isArray(d)) return (d as LoanAPI[])[0];
    if (d && typeof d === 'object') return d as LoanAPI;
    return envelope as LoanAPI;
  }
  return undefined;
}

/** LIST: /loan/myloans */
export function useLoans() {
  const key = '/loan/admin/all-loans';
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    key,
    fetcher,
    {
      revalidateOnFocus: true,
      dedupingInterval: 60_000,
      keepPreviousData: true,
    }
  );

  const apis = asList(data);
  const loans: Loan[] = apis.map(toLoan);
  const total = (data as { meta?: { total?: number } })?.meta?.total ?? loans.length;
  // const total_accepted = data?.meta?.total_acc ?? loans.length;
  const loading = typeof isLoading === 'boolean' ? isLoading : !data && !error;

  return {
    loans,
    total,
    isLoading: loading,
    isValidating,
    error,
    refresh: mutate,
  };
}

/** DETAIL: /loan/myloans/:id  (path param, not query) */
export function useLoanById(id?: string | number) {
  const key = id
    ? `/loan/admin/all-loans?id=${encodeURIComponent(String(id))}`
    : null;
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    key,
    fetcher,
    {
      revalidateOnFocus: true,
      dedupingInterval: 60_000,
      keepPreviousData: true,
    }
  );

  const api = asOne(data);
  const loan: Loan | null = api ? toLoan(api) : null;
  const loading = typeof isLoading === 'boolean' ? isLoading : !data && !error;

  return { loan, isLoading: loading, isValidating, error, refresh: mutate };
}


interface Repay {
  result: {
    amount: number;
    repayment_date: Date;
    loan: string;
    is_paid: boolean;
  }[];
}

export function useRepayById(id?: string | number) {
  const key = id
    ? `/loan/${encodeURIComponent(String(id))}/repay-history`
    : null;
  const { data } = useSWR(key, fetcher, {
    revalidateOnFocus: true,
    dedupingInterval: 60_000,
    keepPreviousData: true,
  });
  console.log(data);

  return {
    repayData: data as Repay,
  };
}
