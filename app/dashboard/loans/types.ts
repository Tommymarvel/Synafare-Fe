// UI enums
export type LoanStatus =
  | 'PENDING'
  | 'OFFER_RECEIVED'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'REJECTED';

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
  elapsedMonths: number; // Optional, not always present
  repayments: Repay[]; // Optional, not always present
  loanAmount: number; // Optional, not always present
}


interface Repay {
  amount: number;
  date: string;
}
// API format exactly as it comes
export interface LoanAPI {
  _id: string;
  customer: {
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
  outstandingBalance?: number; // Optional, not always present
  nextPaymentDate?: string; // Optional, not always present
  interest: number;
  total_repayment: number;
  bank_statement: string;
  trx_invoice: string;
  loan_status: string;
  createdAt: string;
  repayments: Repay[];
  loanAmount?: number; // Optional, not always present
}

// Mapper with no calculations — just rename fields for UI
export function toLoan(api: LoanAPI): Loan {
  return {
    id: api._id,
    customerName: api.customer.customer_name,
    customerEmail: api.customer.customer_email,
    customerPhone: api.customer.customer_phn ?? '',
    transactionCost: api.transaction_cost,
    loanDurationInMonths: api.loan_duration_in_months,
    downpaymentInPercent: api.downpayment_in_percent,
    downpaymentInNaira: api.downpayment_in_naira,
    interest: api.interest,
    totalRepayment: api.total_repayment,
    bankStatement: api.bank_statement,
    trxInvoice: api.trx_invoice,
    loanStatus: api.loan_status.toUpperCase() as LoanStatus,
    dateRequested: api.createdAt,
    nextPaymentDate: api.nextPaymentDate ?? '',
    outstandingBalance: api.outstandingBalance ?? 0,
    elapsedMonths: api.elapsedMonths ?? 0,
    repayments: api.repayments,
    loanAmount: api.loanAmount ?? 0,
  };
}
