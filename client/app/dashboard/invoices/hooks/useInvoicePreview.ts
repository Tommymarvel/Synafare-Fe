'use client';

import axiosInstance from '@/lib/axiosInstance';
import useSWR from 'swr';

export interface InvoicePreviewData {
  bank_info: {
    data: {
      bankAccountNumber: string;
      bankAccountName: string;
      bankName: string;
    };
  };
  invoice_data: {
    _id: string;
    invoice_number: number;
    issue_date: string;
    due_date: string;
    receipient: {
      _id: string;
      customer_email: string;
      customer_name: string;
    };
    items: Array<{
      product: string;
      quantity: number;
      unit_price: number;
      amount: number;
    }>;
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    status: string;
    owner: {
      _id: string;
      email: string;
      phn_no: string;
    };
    additional_information?: string;
  };
  business_details: {
    business_logo?: string;
    business_name: string;
    business_address: string;
    reg_number: string;
  };
}

interface ApiResponse {
  message: string;
  bank_info: InvoicePreviewData['bank_info'];
  invoice_data: InvoicePreviewData['invoice_data'];
  business_details: InvoicePreviewData['business_details'];
}

const fetcher = async (url: string): Promise<InvoicePreviewData> => {
  console.log('Fetching invoice preview from URL:', url);
  const response = await axiosInstance.get<ApiResponse>(url);
  console.log('Invoice preview API response:', response.data);
  return response.data;
};

export function useInvoicePreview(invoiceId: string | null) {
  console.log('useInvoicePreview called with invoiceId:', invoiceId);

  const { data, error, isLoading, mutate } = useSWR(
    invoiceId ? `/invoice/${invoiceId}/preview` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
    }
  );

  console.log('useInvoicePreview hook state:', {
    invoiceId,
    hasData: !!data,
    hasError: !!error,
    isLoading,
    invoiceData: data?.invoice_data,
  });

  return {
    data,
    error,
    isLoading,
    mutate,
    // Helper properties for easier access
    invoice: data?.invoice_data,
    business: data?.business_details,
    bank: data?.bank_info?.data,
  };
}
