import useSWR from 'swr';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { StatusType } from '@/app/components/statusChip';

interface InventoryDataType {
  _id: string;
  product_name: string;
  product_category: string;
  product_sku?: number;
  quantity_in_stock?: number;
  brand?: string;
  model_number?: string;
  unit_price?: string;
  status: StatusType;
  desc?: string;
  order_count?: number;
  product_image: string[];
  product_owner: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

interface InventoryResponse {
  data: InventoryDataType[];
  meta: {
    total_stock_value: number;
    total_products: number;
    total_in_stock: number;
    total_declined: number;
    page: string;
    limit: string;
    totalPages: number;
  };
}

interface UseInventoryParams {
  id?: string;
  status?: StatusType;
  category?: string;
  page?: number;
  limit?: number;
  search?: string;
}

const fetcher = async (url: string): Promise<InventoryResponse> => {
  try {
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message ||
      axiosError.message ||
      'Failed to fetch inventory data';

    toast.error(errorMessage);
    throw error;
  }
};

export const useInventory = (params: UseInventoryParams = {}) => {
  const { id, status, category, page = 1, limit = 10, search } = params;

  // Build query parameters
  const queryParams = new URLSearchParams();
  if (id) queryParams.append('id', id);
  if (status) queryParams.append('status', status);
  if (category) queryParams.append('product_category', category);
  if (search) queryParams.append('search', search);
  queryParams.append('page', page.toString());
  queryParams.append('limit', limit.toString());

  const queryString = queryParams.toString();
  const endpoint = `/inventory/my-inventory${
    queryString ? `?${queryString}` : ''
  }`;

  const { data, error, isLoading, mutate } = useSWR<InventoryResponse>(
    endpoint,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 2,
      errorRetryInterval: 1000,
    }
  );

  return {
    data: data?.data || [],
    meta: data?.meta,
    isLoading,
    error,
    mutate, // For manual revalidation
  };
};

export type { InventoryDataType, InventoryResponse, UseInventoryParams };
