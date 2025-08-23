import useSWR from 'swr';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

interface CatalogueDataType {
  _id: string;
  product_name: string;
  category: string;
  catalogue_owner: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

interface CatalogueResponse {
  data: CatalogueDataType[];
  meta: {
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface UseCatalogueParams {
  id?: string;
  category?: string;
  page?: number;
  limit?: number;
  search?: string;
}

const fetcher = async (url: string): Promise<CatalogueResponse> => {
  try {
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message ||
      axiosError.message ||
      'Failed to fetch catalogue data';

    toast.error(errorMessage);
    throw error;
  }
};

export const useCatalogue = (params: UseCatalogueParams = {}) => {
  const { id, category, page = 1, limit = 10, search } = params;

  // Build query parameters
  const queryParams = new URLSearchParams();
  if (id) queryParams.append('id', id);
  if (category) queryParams.append('category', category);
  if (search) queryParams.append('search', search);
  queryParams.append('page', page.toString());
  queryParams.append('limit', limit.toString());

  const queryString = queryParams.toString();
  const endpoint = `/catalogue/my-catalogue${
    queryString ? `?${queryString}` : ''
  }`;

  const { data, error, isLoading, mutate } = useSWR<CatalogueResponse>(
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

// Add catalogue item function
export const addCatalogueItem = async (data: {
  product_name: string;
  category: string;
}) => {
  try {
    const response = await axiosInstance.post('/catalogue/add', data);
    toast.success('Product added to catalogue successfully ✅');
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message ||
      axiosError.message ||
      'Failed to add product to catalogue';

    toast.error(errorMessage);
    throw error;
  }
};

// Edit catalogue item function
export const editCatalogueItem = async (
  id: string,
  data: {
    product_name?: string;
    category?: string;
  }
) => {
  try {
    const response = await axiosInstance.patch(`/catalogue/edit/${id}`, data);
    toast.success('Catalogue item updated successfully ✅');
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message ||
      axiosError.message ||
      'Failed to update catalogue item';

    toast.error(errorMessage);
    throw error;
  }
};

// Delete catalogue items function
export const deleteCatalogueItems = async (catalogueIds: string[]) => {
  try {
    const response = await axiosInstance.delete('/catalogue/delete', {
      data: { catalogueIds },
    });
    toast.success('Items deleted successfully ✅');
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message ||
      axiosError.message ||
      'Failed to delete catalogue items';

    toast.error(errorMessage);
    throw error;
  }
};

export type { CatalogueDataType, CatalogueResponse, UseCatalogueParams };
