'use client';

import useSWR from 'swr';
import axiosInstance from '@/lib/axiosInstance';
import type { AxiosError } from 'axios';
import {
  type CustomerAPI,
  type CustomersListResponse,
  type Customer,
  toCustomer,
} from '../types';

type ApiError = { message?: string; code?: string };
type SWRError = AxiosError<ApiError>;

const URL = '/customer/getcustomers' as const;

/* -------------------------- LIST: /customer/getcustomers -------------------------- */

export type ListQuery = Readonly<{
  page?: number;
  limit?: number;
  q?: string;
}>;

type ListKey = readonly [typeof URL, ListQuery];

const listFetcher: (k: ListKey) => Promise<CustomersListResponse> = async (
  k
) => {
  const [url, params] = k; // readonly tuple is fine to destructure *after* typing
  const { data } = await axiosInstance.get<CustomersListResponse>(url, {
    params,
  });
  return data;
};

export function useCustomersList(params: ListQuery = {}) {
  const key = [URL, params] as const satisfies ListKey;

  const { data, error, isLoading, mutate } = useSWR<
    CustomersListResponse,
    SWRError,
    ListKey
  >(key, listFetcher, { revalidateOnFocus: true, dedupingInterval: 60_000 });

  const customers: Customer[] = (data?.data ?? []).map(toCustomer);
  const total = data?.meta.total ?? customers.length;

  return { customers, total, isLoading, error, refresh: mutate };
}

/* ---------------------- SINGLE BY ID: same endpoint + ?id= ----------------------- */

type SingleParams = Readonly<{ id: string }>;
type SingleKey = readonly [typeof URL, SingleParams];

// Some backends return `{ data: {...} }`, some `{ data: [...] }` for single.
// We normalize both.
type SingleResponse = { data: CustomerAPI | CustomerAPI[] };

const singleFetcher: (k: SingleKey) => Promise<SingleResponse> = async (k) => {
  const [url, params] = k;
  const { data } = await axiosInstance.get<SingleResponse>(url, { params });
  return data;
};

export function useCustomerById(id?: string) {
  const key = (id ? ([URL, { id }] as const) : null) as SingleKey | null;

  const { data, error, isLoading, mutate } = useSWR<
    SingleResponse,
    SWRError
  >(key, singleFetcher, { revalidateOnFocus: true });

  const raw = Array.isArray(data?.data) ? data?.data[0] : data?.data;
  const customer: Customer | undefined = raw ? toCustomer(raw) : undefined;

  return { customer, isLoading, error, refresh: mutate };
}
