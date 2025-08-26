import useSWR from 'swr';
import axiosInstance from '@/lib/axiosInstance';
import { AxiosError } from 'axios';
import { mockInvoices } from '../data/mockInvoices';

// Types
export type InvoiceStatus = 'DRAFT' | 'PENDING' | 'PAID' | 'OVERDUE';

// API Response types
interface ApiInvoiceRecipient {
  _id: string;
  customer_email: string;
  customer_name: string;
}

interface ApiInvoiceItem {
  product: string; // product ID
  quantity: number;
  unit_price: number;
  amount: number;
}

interface ApiInvoice {
  _id: string;
  invoice_number: number;
  receipient: ApiInvoiceRecipient;
  items: ApiInvoiceItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: string;
  issue_date: string;
  due_date: string;
}

interface ApiInvoiceResponse {
  data: ApiInvoice[];
  meta: {
    total_invoices: number;
    page: string;
    limit: string;
    totalPages: number;
  };
}

// Transformed types for the UI
export interface Invoice {
  id: string;
  invoiceId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  subtotal: number;
  taxAmount: number;
  status: InvoiceStatus;
  items: {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  notes?: string;
}

interface UseInvoicesParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

interface UseInvoicesResult {
  data: Invoice[];
  meta: {
    total_invoices: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null;
  error: Error | null;
  isLoading: boolean;
  mutate: () => void;
}

// Transform API response to Invoice format
const transformApiResponse = (apiData: ApiInvoice[]): Invoice[] => {
  return apiData.map((item) => {
    // Map API status to InvoiceStatus enum
    let status: InvoiceStatus = 'DRAFT'; // default
    const apiStatus = item.status.toUpperCase();
    if (['DRAFT', 'PENDING', 'PAID', 'OVERDUE'].includes(apiStatus)) {
      status = apiStatus as InvoiceStatus;
    }

    return {
      id: item._id,
      invoiceId: `#${String(item.invoice_number).padStart(5, '0')}`,
      customerName: item.receipient.customer_name,
      customerEmail: item.receipient.customer_email,
      customerPhone: undefined, // Not provided in this API
      issueDate: item.issue_date,
      dueDate: item.due_date,
      amount: item.total,
      subtotal: item.subtotal,
      taxAmount: item.tax,
      status,
      items: item.items.map((apiItem, index) => ({
        id: `${item._id}_${index}`, // Generate ID since not provided
        description: `Product ${apiItem.product}`, // Use product ID as fallback
        quantity: apiItem.quantity,
        unitPrice: apiItem.unit_price,
        total: apiItem.amount,
      })),
      notes: undefined, // Not provided in this API response
    };
  });
};

// SWR fetcher function
const fetcher = async (
  url: string
): Promise<{
  data: Invoice[];
  meta: {
    total_invoices: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}> => {
  try {
    const response = await axiosInstance.get<ApiInvoiceResponse>(url);
    const transformedData = transformApiResponse(response.data.data);
    return {
      data: transformedData,
      meta: {
        total_invoices: response.data.meta.total_invoices,
        page: parseInt(response.data.meta.page),
        limit: parseInt(response.data.meta.limit),
        totalPages: response.data.meta.totalPages,
      },
    };
  } catch (error) {
    // For development/demo purposes, fall back to mock data
    console.warn('API not available, using mock data:', error);
    return {
      data: mockInvoices,
      meta: {
        total_invoices: mockInvoices.length,
        page: 1,
        limit: 10,
        totalPages: Math.ceil(mockInvoices.length / 10),
      },
    };
  }
};

// Custom hook for invoices
export const useInvoices = (
  params: UseInvoicesParams = {}
): UseInvoicesResult => {
  const { page = 1, limit = 10, status, search } = params;

  // Build query parameters
  const queryParams = new URLSearchParams();
  if (status) queryParams.append('status', status.toLowerCase());
  if (search?.trim()) queryParams.append('search', search.trim());
  queryParams.append('page', page.toString());
  queryParams.append('limit', limit.toString());

  // Create the SWR key
  const swrKey = `/invoice?${queryParams.toString()}`;

  const { data, error, isLoading, mutate } = useSWR(swrKey, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 5000, // Prevent duplicate requests within 5 seconds
    errorRetryCount: 3,
    errorRetryInterval: 1000,
  });

  return {
    data: data?.data || [],
    meta: data?.meta || null,
    error,
    isLoading,
    mutate,
  };
};

// Hook for invoice actions
export const useInvoiceActions = () => {
  const markAsPaid = async (id: string) => {
    try {
      const res = await axiosInstance.put(`/invoice/markaspaid/${id}`);
      return res.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      throw new Error(
        axiosError.response?.data?.message ||
          axiosError.message ||
          'Failed to mark invoice as paid'
      );
    }
  };

  const sendInvoice = async (id: string) => {
    try {
      const res = await axiosInstance.post(`/invoice/${id}/send`);
      return res.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      throw new Error(
        axiosError.response?.data?.message ||
          axiosError.message ||
          'Failed to send invoice'
      );
    }
  };

  const deleteInvoice = async (id: string) => {
    try {
      const res = await axiosInstance.delete('/invoice', {
        data: { invoiceIds: [id] },
      });
      return res.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      throw new Error(
        axiosError.response?.data?.message ||
          axiosError.message ||
          'Failed to delete invoice'
      );
    }
  };

  const bulkDeleteInvoices = async (invoiceIds: string[]) => {
    try {
      const res = await axiosInstance.delete('/invoice', {
        data: { invoiceIds },
      });
      return res.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      throw new Error(
        axiosError.response?.data?.message ||
          axiosError.message ||
          'Failed to delete invoices'
      );
    }
  };

  const downloadInvoice = async (id: string) => {
    try {
      const res = await axiosInstance.get(`/invoice/${id}/download`, {
        responseType: 'blob', // Important for file downloads
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { message: 'Invoice downloaded successfully' };
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      throw new Error(
        axiosError.response?.data?.message ||
          axiosError.message ||
          'Failed to download invoice'
      );
    }
  };

  return {
    markAsPaid,
    sendInvoice,
    deleteInvoice,
    bulkDeleteInvoices,
    downloadInvoice,
  };
};

// Hook for creating invoices
export const useCreateInvoice = () => {
  const createInvoice = async (invoiceData: {
    customer_id: string;
    items: Array<{
      description: string;
      quantity: number;
      unit_price: number;
    }>;
    due_date: string;
    notes?: string;
  }): Promise<Invoice> => {
    try {
      const response = await axiosInstance.post('/invoice', invoiceData);
      return transformApiResponse([response.data.data])[0];
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      throw new Error(
        axiosError.response?.data?.message ||
          axiosError.message ||
          'Failed to create invoice'
      );
    }
  };

  return { createInvoice };
};
