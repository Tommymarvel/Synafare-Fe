import axiosInstance from '@/lib/axiosInstance';

export type APITransaction = {
  _id: string;
  user: string;
  trx_id: string;
  ref_id: string;
  trx_type: string; // e.g., 'down_payment' | 'loan_disbursment' | 'fund_wallet' | 'loan_repayment'
  trx_amount: number;
  trx_status: string; // 'successful' | 'pending' | etc
  trx_date?: string; // ISO
  createdAt: string; // ISO
  updatedAt: string; // ISO
  __v: number;
};

export type TransactionsAPIResponse = {
  data: APITransaction[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type TransactionsQuery = {
  page?: number;
  limit?: number;
};

export class TransactionsService {
  static async getAll(
    params?: TransactionsQuery
  ): Promise<TransactionsAPIResponse> {
    const search = new URLSearchParams();
    if (params?.page) search.set('page', String(params.page));
    if (params?.limit) search.set('limit', String(params.limit));
    const url = `/transaction/all-transactions${
      search.toString() ? `?${search.toString()}` : ''
    }`;
    const res = await axiosInstance.get<TransactionsAPIResponse>(url);
    return res.data;
  }
}
