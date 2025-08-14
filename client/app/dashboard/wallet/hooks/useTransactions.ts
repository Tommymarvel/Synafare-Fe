// app/hooks/useTransactions.ts
'use client';

import useSWR from 'swr';
import axiosInstance from '@/lib/axiosInstance';

const URL = '/transaction/my-transactions' as const;

export type TransactionDTO = {
  _id: string;
  user: string;
  trx_id: string;
  ref_id: string;
  trx_type: string; // e.g. "fund_wallet"
  trx_amount: number; // NOTE: if your API returns KOBO, divide by 100 when displaying
  trx_status: string; // "successful" | "pending" | "failed" | ...
  trx_date: string; // ISO string "2025-08-13T15:08:07.000Z"
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type TransactionsResponse = {
  data: TransactionDTO[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type Transaction = {
  id: string;
  refId: string;
  type: string;
  amount: number;
  status: string;
  date: string; // ISO
  createdAt: string; // ISO
};

const toTransaction = (t: TransactionDTO): Transaction => ({
  id: t._id,
  refId: t.ref_id,
  type: t.trx_type,
  amount: t.trx_amount,
  status: t.trx_status,
  date: t.trx_date,
  createdAt: t.createdAt,
});

type Params = {
  page?: number; // default 1
  limit?: number; // default 10
  trx_type?: string; // optional filter
  trx_status?: string; // optional filter
  from?: string; // ISO date
  to?: string; // ISO date
};

type Key = readonly [typeof URL, Params];

const fetcher: (k: Key) => Promise<TransactionsResponse> = async ([
  url,
  params,
]) => {
  const qs = new URLSearchParams();
  if (params.page) qs.set('page', String(params.page));
  if (params.limit) qs.set('limit', String(params.limit));
  if (params.trx_type) qs.set('trx_type', params.trx_type);
  if (params.trx_status) qs.set('trx_status', params.trx_status);
  if (params.from) qs.set('from', params.from);
  if (params.to) qs.set('to', params.to);

  const path = qs.toString() ? `${url}?${qs.toString()}` : url;
  const { data } = await axiosInstance.get<TransactionsResponse>(path);
  return data;
};

export function useTransactions(params: Params = { page: 1, limit: 10 }) {
  const key = [URL, params] as const;
  const { data, error, isLoading, mutate } = useSWR<
    TransactionsResponse,
    unknown,
    Key
  >(key, fetcher, {
    revalidateOnFocus: true,
    dedupingInterval: 60_000,
  });

  const transactions: Transaction[] = (data?.data ?? []).map(toTransaction);
  const meta = data?.meta ?? {
    total: transactions.length,
    page: params.page ?? 1,
    limit: params.limit ?? 10,
    totalPages: Math.max(
      1,
      Math.ceil((transactions.length || 1) / (params.limit ?? 10))
    ),
  };

  return {
    transactions,
    meta,
    isLoading,
    error,
    refresh: mutate,
  };
}
