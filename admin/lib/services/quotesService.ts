import api from '@/lib/axiosInstance';

export interface RawQuoteProduct {
  _id: string;
  product_name: string;
  product_category: string;
  unit_price: number;
}

export interface RawQuoteItem {
  product: RawQuoteProduct;
  quantity: number;
  _id: string;
}

export interface RawOfferHistory {
  amount_recieved?: number;
  counter_amount?: number;
  additional_message?: string;
  title?: string;
  date_sent?: string;
  _id: string;
}

export interface RawQuoteRequest {
  _id: string;
  user: {
    _id: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    phn_no?: string;
  };
  supplier: string;
  items: RawQuoteItem[];
  status: string;
  delivery_location?: string;
  additional_message?: string;
  offerHistory: RawOfferHistory[];
  createdAt?: string;
  updatedAt?: string;
  current_total_amount?: number;
}

export interface QuotesAPIResponse {
  data: RawQuoteRequest[];
  meta?: unknown;
}

export class QuotesService {
  static async getQuoteRequestsByUser(
    userId: string
  ): Promise<QuotesAPIResponse> {
    const { data } = await api.get(`/quote-requests/admin/${userId}`);
    return data as QuotesAPIResponse;
  }
}
