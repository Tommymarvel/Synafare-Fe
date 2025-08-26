import useSWR from 'swr';
import axiosInstance from '@/lib/axiosInstance';
import { AxiosError } from 'axios';

// Types
export type QuoteRequestStatus =
  | 'PENDING'
  | 'QUOTE_SENT'
  | 'NEGOTIATED'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'DELIVERED';

// API Response types
interface ApiQuoteRequestUser {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  phn_no: string;
}

interface ApiQuoteRequestItem {
  product:
    | {
        _id: string;
        product_name?: string;
        product_category?: string;
        unit_price?: number;
      }
    | string; // fallback in case API returns just an id/string
  quantity: number;
  _id: string;
  unit_price?: number;
}

interface OfferHistory {
  amount_recieved?: number;
  counter_amount?: number;
  title?: string;
  date_sent: string;
  additional_message?: string;
  _id: string;
}

interface ApiQuoteRequest {
  _id: string;
  user: ApiQuoteRequestUser;
  supplier: string;
  items: ApiQuoteRequestItem[];
  status: string;
  delivery_location: string;
  additional_message: string;
  offerHistory: OfferHistory[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ApiQuoteRequestResponse {
  data: ApiQuoteRequest[];
  meta: {
    total_requests: number;
    page: string;
    limit: string;
    totalPages: number;
  };
}

// Transformed types for the UI
export interface QuoteRequest {
  id: string;
  customer: string;
  customerEmail: string;
  product: string;
  quantity: number;
  quoteSent: number | null;
  counterAmount: number | null;
  dateRequested: string;
  status: QuoteRequestStatus;
  supplierName?: string;
  productCategory?: string;
  message?: string;
  deliveryLocation?: string;
  offerHistory?: OfferHistory[]; // Add raw offer history for detailed views
  requesterId?: string; // original request owner id
  supplierId?: string; // supplier id
}

// Helper function to transform offer history for UI components
export const transformOfferHistoryForUI = (offerHistory: OfferHistory[]) => {
  return offerHistory.map((offer, index) => {
    const amount =
      typeof offer.amount_recieved === 'number'
        ? offer.amount_recieved
        : typeof offer.counter_amount === 'number'
        ? offer.counter_amount
        : 0;

    const isLatest = index === offerHistory.length - 1;

    return {
      id: offer._id,
      title:
        offer.title ||
        `Quote ${index + 1}: ₦${new Intl.NumberFormat('en-NG').format(amount)}`,
      note:
        // Prefer the explicit additional message if provided, else show amount helper
        offer.additional_message && offer.additional_message.trim()
          ? offer.additional_message.trim()
          : amount
          ? `Amount: ₦${new Intl.NumberFormat('en-NG').format(amount)}`
          : undefined,
      date: new Date(offer.date_sent).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      tone: isLatest ? ('active' as const) : ('muted' as const),
      amount,
    };
  });
};

interface UseQuoteRequestsParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

interface UseQuoteRequestsResult {
  data: QuoteRequest[];
  meta: {
    total_requests: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null;
  error: Error | null;
  isLoading: boolean;
  mutate: () => void;
}

// Transform API response to QuoteRequest format
const transformApiResponse = (apiData: ApiQuoteRequest[]): QuoteRequest[] => {
  return apiData.map((item) => {
    // Map API status to QuoteRequestStatus enum
    let status: QuoteRequestStatus = 'PENDING'; // default
    const apiStatus = item.status.toUpperCase();
    if (
      [
        'PENDING',
        'QUOTE_SENT',
        'NEGOTIATED',
        'ACCEPTED',
        'REJECTED',
        'DELIVERED',
      ].includes(apiStatus)
    ) {
      status = apiStatus as QuoteRequestStatus;
    }

    // Extract quote amounts from offerHistory (support amount_recieved or counter_amount)
    const latestOffer =
      item.offerHistory && item.offerHistory.length > 0
        ? item.offerHistory[item.offerHistory.length - 1]
        : null;

    const quoteSent = latestOffer
      ? latestOffer.amount_recieved ?? latestOffer.counter_amount ?? null
      : null;

    const counterAmount =
      item.offerHistory && item.offerHistory.length > 1
        ? item.offerHistory[item.offerHistory.length - 2].amount_recieved ??
          item.offerHistory[item.offerHistory.length - 2].counter_amount ??
          null
        : null;

    // Derive product display values safely (product can be object or string)
    const firstItem =
      item.items && item.items.length > 0 ? item.items[0] : null;
    const prod = firstItem ? firstItem.product : undefined;

    const productDisplay = firstItem
      ? typeof prod === 'string'
        ? prod
        : prod?.product_name ?? `${item.items.length} items`
      : 'No items';

    const productCategory = firstItem
      ? typeof prod === 'string'
        ? ''
        : prod?.product_category ?? ''
      : '';

    const totalQuantity = item.items.reduce((sum, i) => sum + i.quantity, 0);

    return {
      id: item._id,
      customer: `${item.user.first_name} ${item.user.last_name}`.trim(),
      customerEmail: item.user.email,
      product: productDisplay,
      quantity: totalQuantity,
      quoteSent: quoteSent,
      counterAmount: counterAmount,
      dateRequested: item.createdAt,
      status,
      supplierName: '', // API doesn't provide this
      productCategory: productCategory,
      message: item.additional_message,
      deliveryLocation: item.delivery_location,
      offerHistory: item.offerHistory || [], // Include raw offer history
      requesterId: item.user?._id,
      supplierId: item.supplier, // Extract supplier ID from API
    };
  });
};

// SWR fetcher function
const fetcher = async (
  url: string
): Promise<{
  data: QuoteRequest[];
  meta: {
    total_requests: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}> => {
  try {
    const response = await axiosInstance.get<ApiQuoteRequestResponse>(url);
    const transformedData = transformApiResponse(response.data.data);
    return {
      data: transformedData,
      meta: {
        total_requests: response.data.meta.total_requests,
        page: parseInt(response.data.meta.page),
        limit: parseInt(response.data.meta.limit),
        totalPages: response.data.meta.totalPages,
      },
    };
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(
      axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to fetch quote requests'
    );
  }
};

// Custom hook for quote requests
export const useQuoteRequests = (
  params: UseQuoteRequestsParams = {}
): UseQuoteRequestsResult => {
  const { page = 1, limit = 10, status, search } = params;

  // Build query parameters
  const queryParams = new URLSearchParams();
  if (status) queryParams.append('status', status.toLowerCase());
  if (search?.trim()) queryParams.append('search', search.trim());
  queryParams.append('page', page.toString());
  queryParams.append('limit', limit.toString());

  // Create the SWR key
  const swrKey = `/quote-requests/my-request?${queryParams.toString()}`;

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

// Hook for updating quote request status
export const useUpdateQuoteRequest = () => {
  const updateStatus = async (
    id: string,
    status: QuoteRequestStatus
  ): Promise<void> => {
    try {
      await axiosInstance.patch(`/quote-requests/${id}`, {
        status: status.toLowerCase(),
      });
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      throw new Error(
        axiosError.response?.data?.message ||
          axiosError.message ||
          'Failed to update quote request'
      );
    }
  };

  // Accept quote using the new API
  const acceptQuote = async (id: string) => {
    try {
      const res = await axiosInstance.patch(`/quote-requests/accept/${id}`);
      return res.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      throw new Error(
        axiosError.response?.data?.message ||
          axiosError.message ||
          'Failed to accept quote'
      );
    }
  };

  // Reject quote using the new API (optionally send a reason)
  const rejectQuote = async (id: string, reason?: string) => {
    try {
      const payload = reason ? { reason } : {};
      const res = await axiosInstance.patch(
        `/quote-requests/reject/${id}`,
        payload
      );
      return res.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      throw new Error(
        axiosError.response?.data?.message ||
          axiosError.message ||
          'Failed to reject quote'
      );
    }
  };

  return { updateStatus, acceptQuote, rejectQuote };
};

// Hook for sending quotes (this will add to offer history)
export const useSendQuote = () => {
  const sendQuote = async (
    quoteRequestId: string,
    quoteData: {
      items: Array<{ description: string; qty: number; price: number }>;
      discount: number;
      tax: number;
      notes?: string;
    }
  ): Promise<void> => {
    try {
      const response = await axiosInstance.post(
        `/quote-requests/${quoteRequestId}/send-quote`,
        {
          ...quoteData,
        }
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      throw new Error(
        axiosError.response?.data?.message ||
          axiosError.message ||
          'Failed to send quote'
      );
    }
  };

  return { sendQuote };
};
