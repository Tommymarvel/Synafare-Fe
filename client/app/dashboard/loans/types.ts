// UI enums
export type LoanStatus =
  | 'PENDING'
  | 'OFFER_RECEIVED'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'REJECTED';

export interface Loan {
  id: string;
  customerName: string;
  customerEmail: string;
  transactionCost: number;
  loanAmount: number;
  dateRequested: string; // ISO
  duration: string; // "3 months"
  nextPaymentDate?: string;
  status: LoanStatus;
}

// API (accept both camelCase & snake_case without `any`)
export interface LoanAPI {
  _id?: string;
  id?: string;
  customer_name?: string;
  customerName?: string;
  customer_email?: string;
  customerEmail?: string;
  transaction_cost?: number;
  transactionCost?: number;
  loan_amount?: number;
  loanAmount?: number;
  date_requested?: string;
  dateRequested?: string;
  duration?: string;
  next_payment_date?: string;
  nextPaymentDate?: string;
  status: LoanStatus | string;
}

export interface LoansResponse {
  data: LoanAPI[];
  meta?: { total?: number; page?: number; limit?: number; totalPages?: number };
}

// Map API → UI
export function toLoan(api: LoanAPI): Loan {
  const id = api.id ?? api._id ?? crypto.randomUUID();
  const customerName = api.customerName ?? api.customer_name ?? '—';
  const customerEmail = api.customerEmail ?? api.customer_email ?? '—';
  const transactionCost = api.transactionCost ?? api.transaction_cost ?? 0;
  const loanAmount = api.loanAmount ?? api.loan_amount ?? 0;
  const dateRequested =
    api.dateRequested ?? api.date_requested ?? new Date().toISOString();
  const duration = api.duration ?? '—';
  const nextPaymentDate = api.nextPaymentDate ?? api.next_payment_date;
  // coerce status to allowed set
  const raw = (api.status ?? '').toUpperCase();
  const status: LoanStatus =
    raw === 'PENDING' ||
    raw === 'OFFER_RECEIVED' ||
    raw === 'ACTIVE' ||
    raw === 'COMPLETED' ||
    raw === 'REJECTED'
      ? (raw as LoanStatus)
      : 'PENDING';

  return {
    id,
    customerName,
    customerEmail,
    transactionCost,
    loanAmount,
    dateRequested,
    duration,
    nextPaymentDate,
    status,
  };
}
