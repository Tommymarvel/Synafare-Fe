// UI enums
export type LoanStatus =
  | 'PENDING'
  | 'OFFER_RECEIVED'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'REJECTED';

  export function toLoanStatus(raw?: string): LoanStatus {
    const v = (raw ?? '').toLowerCase();
    if (v === 'offer' || v === 'offer_received') return 'OFFER_RECEIVED';
    if (v === 'approved' || v === 'active') return 'ACTIVE';
    if (v === 'completed') return 'COMPLETED';
    if (v === 'rejected') return 'REJECTED';
    return 'PENDING';
  }

// This matches what we actually use in UI
export interface Loan {
  id: string;
  customerName: string;
  customerEmail: string;
  transactionCost: number;
  loanDurationInMonths: number;
  downpaymentInPercent: number;
  downpaymentInNaira: number;
  interest: number;
  totalRepayment: number;
  bankStatement: string;
  trxInvoice: string;
  loanStatus: LoanStatus;
  dateRequested: string;
  customerPhone: string; // Optional, not always present
  nextPaymentDate: string; // Optional, not always present
  outstandingBalance: number; // Optional, not always present
  monthly_repayment : number;
  elapsedMonths: number; // Optional, not always present
  repayments: Repay[]; // Optional, not always present
  loan_amount: number; // Optional, not always present
  loan_amount_offered: number
  user ?: {
  email: string;
  email_confirmed: boolean;
  first_name: string;
  last_name: string;
  phn_no: string;
  }
}


interface Repay {
  amount: number;
  date: string;
}
// API format exactly as it comes
export interface LoanAPI {
  _id: string;
  customer?: {
    _id: string;
    customer_name: string;

    customer_email: string;
    customer_phn?: string;
    date_joined?: string;
  };
  transaction_cost: number;
  loan_duration_in_months: number;
  downpayment_in_percent: number;
  downpayment_in_naira: number;
  elapsedMonths?: number; // Optional, not always present
  outstanding_bal?: number; // Optional, not always present
  nextPaymentDate?: string; // Optional, not always present
  interest: number;
  monthly_repayment : number;
  total_repayment: number;
  bank_statement: string;
  trx_invoice: string;
  loan_status: string;
  createdAt: string;
  repayments: Repay[];
  loan_amount?: number; // Optional, not always present
  loan_amount_offered: number
  user : {
  email: string;
  email_confirmed: boolean;
  first_name: string;
  last_name: string;
  phn_no: string;
  }
}

// Mapper with no calculations — just rename fields for UI
export function toLoan(api: LoanAPI): Loan {
  return {
    id: api._id,
    customerName: api.customer?.customer_name ?? '',
    customerEmail: api.customer?.customer_email ?? '',
    customerPhone: api.customer?.customer_phn ?? '',
    transactionCost: api.transaction_cost,
    loanDurationInMonths: api.loan_duration_in_months,
    downpaymentInPercent: api.downpayment_in_percent,
    downpaymentInNaira: api.downpayment_in_naira,
    monthly_repayment : api.monthly_repayment,
    interest: api.interest,
    totalRepayment: api.total_repayment,
    bankStatement: api.bank_statement,
    trxInvoice: api.trx_invoice,
    loanStatus: toLoanStatus(api.loan_status) ,
    dateRequested: api.createdAt,
    nextPaymentDate: api.nextPaymentDate ?? '',
    outstandingBalance: api.outstanding_bal ?? 0,
    elapsedMonths: api.elapsedMonths ?? 0,
    repayments: api.repayments,
    loan_amount: api.loan_amount ?? 0,
    loan_amount_offered: api.loan_amount_offered,
    user : api.user
  }
}
