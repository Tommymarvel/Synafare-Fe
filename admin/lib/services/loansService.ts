import axiosInstance from '@/lib/axiosInstance';

export interface APILoanItem {
  _id: string;
  loan_type?: string;
  transaction_cost?: number;
  loan_duration_in_months?: number;
  downpayment_in_percent?: number;
  downpayment_in_naira?: number;
  loan_amount_requested?: number;
  loan_amount?: number;
  interest?: number;
  total_repayment?: number;
  bank_statement?: string;
  trx_invoice?: string;
  loan_status?: string;
  bank_code?: string;
  acc_no?: string;
  loan_agreement?: string;
  user?: {
    _id: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    nature_of_solar_business?: string;
    phn_no?: string;
    role?: string;
  };
  createdAt?: string;
  updatedAt?: string;
  loan_amount_offered?: number;
  monthly_interest_value?: number;
  monthly_repayment?: number;
  next_payment?: string;
  outstanding_bal?: number;
}

export interface APILoansResponse {
  data: APILoanItem[];
}

export class LoansService {
  static async getLoansByUser(userId: string): Promise<APILoanItem[]> {
    const { data } = await axiosInstance.get<APILoansResponse>(
      `/loan/admin/view/${userId}`
    );
    return data.data || [];
  }

  static async getLoansByUserCustomer(
    userId: string,
    customerId: string
  ): Promise<APILoanItem[]> {
    // Endpoint returns { customer_loans: [...] }
    const { data } = await axiosInstance.get<{ customer_loans: APILoanItem[] }>(
      `/loan/admin/view/user/${userId}/customer/${customerId}`
    );
    return data.customer_loans || [];
  }
}
