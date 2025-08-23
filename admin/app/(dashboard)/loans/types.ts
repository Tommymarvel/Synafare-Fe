// app/dashboard/loans/types.ts
import { STATUSCONST } from '@/lib/constants';

/* ----------------------------- Shared value types ---------------------------- */

export type StatusConstValue = (typeof STATUSCONST)[keyof typeof STATUSCONST];

export interface Repay {
  amount: number;
  date: string;
}

/* -------------------------------- UI model --------------------------------- */

export interface Loan {
  id: string;
  customerName: string;
  customerEmail: string;
  userFirstName: string;
  userLastName: string;
  userPhnNo: string;
  transactionCost: number;
  loanDurationInMonths: number;
  downpaymentInPercent: number;
  downpaymentInNaira: number;
  interest: number;
  totalRepayment: number;
  bankStatement: string;
  trxInvoice: string;
  loanStatus: StatusConstValue; // exact type <Status /> expects
  dateRequested: string;
  customerPhone: string;
  nextPaymentDate: string;
  outstandingBalance: number;
  elapsedMonths: number;
  repayments: Repay[];
  loanAmount: number;
  userType?: string;
  datePaid: string | null;
  equityAmount: number;
  userEmail: string;
}

/* -------------------------------- API model -------------------------------- */

export interface LoanAPI {
  _id: string;

  customer?: {
    _id?: string;
    customer_name?: string;
    customer_email?: string;
    customer_phn?: string;
    date_joined?: string;
  };

  user?: {
    _id?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    phn_no?: string;
    nature_of_solar_business: string;
  };
  next_payment: string; // Optional, not always present
  transaction_cost?: number;
  loan_duration_in_months?: number;
  downpayment_in_percent?: number;
  downpayment_in_naira?: number;

  loan_amount_requested?: number;
  loan_amount?: number;
  loan_amount_offered?: number;

  interest?: number;
  total_repayment?: number;
  bank_statement?: string;
  trx_invoice?: string;
  loan_status?: string; // e.g. "pending" | "offer" | "completed"
  createdAt?: string;

  outstanding_bal?: number;
  monthly_repayment?: number;
  monthly_interest_value?: number;
  user_type?: string;
  date_paid?: string; // date when the loan was paid
  repayments?: Repay[];
}

/** Typical list envelope */
export interface LoansEnvelope {
  data?: LoanAPI[] | LoanAPI;
  meta?: {
    total?: number;
    total_accepted?: number;
    total_declined?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}

/* --------------------------------- Guards ---------------------------------- */

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

function isLoanAPI(v: unknown): v is LoanAPI {
  return isObject(v) && typeof v._id === 'string';
}

function isLoanAPIArray(v: unknown): v is LoanAPI[] {
  return Array.isArray(v) && v.every(isLoanAPI);
}

/* -------------------------- Envelope normalizers --------------------------- */

export function asList(envelope: unknown): LoanAPI[] {
  if (isLoanAPIArray(envelope)) return envelope;

  if (isObject(envelope)) {
    const d = (envelope as LoansEnvelope).data;
    if (isLoanAPIArray(d)) return d;
    if (isLoanAPI(d)) return [d];
  }

  return [];
}

export function asOne(envelope: unknown): LoanAPI | undefined {
  if (isLoanAPIArray(envelope)) return envelope[0];

  if (isObject(envelope)) {
    const d = (envelope as LoansEnvelope).data;
    if (isLoanAPIArray(d)) return d[0];
    if (isLoanAPI(d)) return d;

    // some APIs return the object directly without "data"
    if (isLoanAPI(envelope)) return envelope as LoanAPI;
  }

  return undefined;
}

/* ------------------------------ Status mapping ----------------------------- */

export function mapApiStatusToConst(s?: string): StatusConstValue {
  const v = (s ?? '').toLowerCase();
  if (v === 'pending') return STATUSCONST.PENDING;
  if (v === 'offer' || v === 'offer_received')
    return STATUSCONST.OFFER_RECEIVED;
  if (v === 'active') return STATUSCONST.ACTIVE;
  if (v === 'completed' || v === 'paid' || v === 'success')
    return STATUSCONST.COMPLETED;
  if (v === 'rejected' || v === 'declined') return STATUSCONST.REJECTED;
  if (v === 'overdue') return STATUSCONST.OVERDUE;
  if (v === 'awaiting_downpayment' || v === 'awaiting_down_payment')
    return STATUSCONST.AWAITING_DOWNPAYMENT;
  if (v === 'awaiting_loan_disbursement' || v === 'awaiting_disbursement')
    return STATUSCONST.AWAITING_LOAN_DISBURSEMENT;
  return STATUSCONST.PENDING;
}

/* ------------------------------- Main mapper ------------------------------- */

export function toLoan(api: LoanAPI): Loan {
  const amount =
    api.loan_amount ??
    api.loan_amount_offered ??
    api.loan_amount_requested ??
    0;

  return {
    id: api._id,
    customerName: api.customer?.customer_name ?? '-',
    customerEmail: api.customer?.customer_email ?? '—',
    customerPhone: api.customer?.customer_phn ?? '',
    userFirstName: api.user?.first_name ?? '—',
    userLastName: api.user?.last_name ?? '—',
    userPhnNo: api.user?.phn_no ?? '—',
    userEmail: api.user?.email ?? '—',
    transactionCost: api.transaction_cost ?? 0,
    loanDurationInMonths: api.loan_duration_in_months ?? 0,
    downpaymentInPercent: api.downpayment_in_percent ?? 0,
    downpaymentInNaira: api.downpayment_in_naira ?? 0,
    interest: api.interest ?? 0,
    totalRepayment: api.total_repayment ?? 0,
    bankStatement: api.bank_statement ?? '',
    trxInvoice: api.trx_invoice ?? '',
    loanStatus: mapApiStatusToConst(api.loan_status),
    dateRequested: api.createdAt ?? '',
    nextPaymentDate: api.next_payment, // fill when backend provides
    outstandingBalance: api.outstanding_bal ?? 0,
    elapsedMonths: 0, // fill when backend provides
    repayments: api.repayments ?? [],
    loanAmount: amount,
    userType: api.user?.nature_of_solar_business,
    datePaid: api.date_paid ?? null,
    equityAmount: api.monthly_repayment ?? 0,
  };
}
