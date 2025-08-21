import useSWR from 'swr';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

export interface InventoryActivityType {
  _id: string;
  desc: string;
  item_id: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

const fetcher = async (url: string): Promise<InventoryActivityType[]> => {
  try {
    const response = await axiosInstance.get(url);

    if (response.data.activities) {
      return response.data.activities;
    } else {
      throw new Error('Failed to fetch product activity');
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

export function useInventoryActivity(id: string) {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    id ? `/inventory/productactivity/${id}` : null,
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
    activities: data || [],
    isLoading,
    isValidating,
    error,
    refresh: mutate,
  };
}
