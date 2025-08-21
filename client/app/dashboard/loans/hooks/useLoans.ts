// hooks/useLoans.ts
'use client';

import useSWR from 'swr';
import axiosInstance from '@/lib/axiosInstance';
import type { Loan, LoanAPI } from '../types';
import { toLoan } from '../types';

// fetch raw envelope (don’t assume shape)
const fetcher = async (url: string) => {
  const res = await axiosInstance.get(url);
  return res.data;
};

// normalize helpers
function asList(envelope: { data?: LoanAPI[] | LoanAPI }): LoanAPI[] {
  if (Array.isArray(envelope)) return envelope as LoanAPI[];
  if (envelope && typeof envelope === 'object') {
    const d = envelope.data;
    if (Array.isArray(d)) return d as LoanAPI[];
    if (d && typeof d === 'object') return [d as LoanAPI];
  }
  return [];
}

function asOne(envelope: { data?: LoanAPI[] | LoanAPI | undefined }): LoanAPI | undefined {
  if (Array.isArray(envelope)) return (envelope as LoanAPI[])[0];
  if (envelope && typeof envelope === 'object') {
    const d = envelope.data;
    if (Array.isArray(d)) return (d as LoanAPI[])[0];
    if (d && typeof d === 'object') return d as LoanAPI;
    return envelope as LoanAPI;
  }
  return undefined;
}

/** LIST: /loan/myloans */
export function useLoans() {
  const key = '/loan/myloans';
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
  const key = id ? `/loan/myloans?id=${encodeURIComponent(String(id))}` : null;
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


// amount
// : 
// 23.6
// createdAt
// : 
// "2025-08-16T12:29:06.231Z"
// is_paid
// : 
// false
// loan
// : 
// "68a06b48d06572ad190dd9a6"
// repayment_date
// : 
// "2025-09-16T00:00:00.000Z"
// updatedAt
// : 
// "2025-08-16T12:29:06.231Z"
// user
// : 
// "688fe6cc5cb0234034033863"
// __v
// : 
// 0
// _id
// : 
// "68a07992d06572ad190ddae5"

interface Repay{
  result : {
    amount : number
    repayment_date : Date
    loan : string
    is_paid : boolean
  }[]
  
}

export function useRepayById(id?: string | number) {
  
  const key = id ? `/loan/${encodeURIComponent(String(id))}/repay-history` : null;
  const { data} = useSWR(
    key,
    fetcher,
    {
      revalidateOnFocus: true,
      dedupingInterval: 60_000,
      keepPreviousData: true,
    }
  );
  console.log(data)

  return{
    repayData : data as Repay
  }
  
}
