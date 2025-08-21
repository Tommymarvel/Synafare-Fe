import useSWR from 'swr';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

export interface InventoryOrderHistoryType {
  _id: string;
  invoice_id: string;
  customer: string;
  issue_date: string;
  due_date: string;
  amount: number;
  status: string;
  item_id: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

const fetcher = async (url: string): Promise<InventoryOrderHistoryType[]> => {
  try {
    const response = await axiosInstance.get(url);

    if (response.data.history) {
      return response.data.history;
    } else {
      throw new Error('Failed to fetch order history');
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message ||
      axiosError.message ||
      'An error occurred';
    toast.error(errorMessage);
    throw error;
  }
};

export function useInventoryOrderHistory(id: string) {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    id ? `/inventory/orderhistory/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
      keepPreviousData: true,
      errorRetryCount: 3,
      errorRetryInterval: 1000,
    }
  );

  return {
    orderHistory: data || [],
    isLoading,
    isValidating,
    error,
    refresh: mutate,
  };
}
