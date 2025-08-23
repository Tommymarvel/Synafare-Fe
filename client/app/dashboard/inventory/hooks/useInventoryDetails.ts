import useSWR from 'swr';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

export interface InventoryDetailsType {
  _id: string;
  product_name: string;
  product_sku: number;
  product_category: string;
  unit_price: string;
  quantity_in_stock: number;
  brand?: string;
  model_number?: string;
  product_image?: string[];
  desc?: string;
  status: string;
  order_count: number;
  product_owner: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const fetcher = async (url: string): Promise<InventoryDetailsType> => {
  try {
    const response = await axiosInstance.get(url);

    if (response.data.data && response.data.data.length > 0) {
      return response.data.data[0]; // Return the first item from the array
    } else {
      throw new Error('Inventory item not found');
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

export function useInventoryDetails(id: string) {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    id ? `/inventory/my-inventory?id=${id}` : null,
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
    inventory: data,
    isLoading,
    isValidating,
    error,
    refresh: mutate,
  };
}
