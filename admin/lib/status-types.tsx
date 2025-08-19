import { STATUSCONST } from '@/lib/constants';

// All keys from STATUSCONST
export type StatusKeyAll = keyof typeof STATUSCONST;

// Keys we actually want to filter by
export type StatusKey =
  | 'ALL'
  | 'PENDING'
  | 'OFFER_RECEIVED'
  | 'REJECTED'
  | 'SUCCESS'
  | 'AWAITING_DOWNPAYMENT'
  | 'AWAITING_LOAN_DISBURSEMENT'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'OVERDUE'
  | 'PAID';

// LoanStatusFilter = just the StatusKey now (no "")
export type LoanStatusFilter = StatusKey;

// Map label -> key (if needed)
export const STATUS_KEY_BY_LABEL: Record<string, StatusKeyAll> =
  Object.fromEntries(
    Object.entries(STATUSCONST).map(([key, label]) => [
      label,
      key as StatusKeyAll,
    ])
  ) as Record<string, StatusKeyAll>;
