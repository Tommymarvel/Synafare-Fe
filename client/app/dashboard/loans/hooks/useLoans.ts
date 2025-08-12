'use client';

import useSWR from 'swr';
import axiosInstance from '@/lib/axiosInstance';
import type { LoansResponse, Loan } from '../types';
import { toLoan } from '../types';

const URL = '/loan/myloans' as const;
type Key = readonly [typeof URL];

const fetcher: (k: Key) => Promise<LoansResponse> = async ([url]) => {
  const { data } = await axiosInstance.get<LoansResponse>(url);
  return data;
};

export function useLoans() {
  const key = [URL] as const;
  const { data, error, isLoading, mutate } = useSWR<
    LoansResponse,
    unknown,
    Key
  >(key, fetcher, {
    revalidateOnFocus: true,
    dedupingInterval: 60_000,
  });

  const loans: Loan[] = (data?.data ?? []).map(toLoan);
  const total = data?.meta?.total ?? loans.length;

  return { loans, total, isLoading, error, refresh: mutate };
}
