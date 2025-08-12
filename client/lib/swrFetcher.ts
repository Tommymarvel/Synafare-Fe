import type { AxiosError } from 'axios';
import axiosInstance from './axiosInstance';

export interface ApiError {
  message?: string;
  code?: string;
}
export type SWRError = AxiosError<ApiError>;

// Typed GET using your axios instance
export async function swrGet<
  T,
  P extends Record<string, unknown> | undefined = undefined
>(url: string, params?: P): Promise<T> {
  const res = await axiosInstance.get<T>(url, { params });
  return res.data;
}
