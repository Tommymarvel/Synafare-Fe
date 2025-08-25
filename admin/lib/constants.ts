// lib/constants.ts
export const STATUSCONST = {
  PENDINGVERIFICATION: 'Pending Verification',
  VERIFIED: 'Verified',
  NEGOTIATED: 'Negotiated',
  ACCEPTED: 'Accepted',
  QUOTESENT: 'Quote sent',
  DELIVERED: 'Delivered',
  DRAFT: 'Draft',
  UNPUBLISHED: 'Unpublished',
  PUBLISHED: 'Published',
  OUTOFSTOCK: 'Out of Stock',
  PENDING: 'Pending',
  pending: 'pending',
  OFFER_RECEIVED: 'Offer Received',
  ACTIVE: 'Active',
  COMPLETED: 'Completed',
  REJECTED: 'Rejected',
  OVERDUE: 'Overdue',
  SUCCESS: 'Success',
  successful: 'successful',
  PAID: 'Paid',
  AWAITING_DOWNPAYMENT: 'Awaiting Downpayment',
  AWAITING_LOAN_DISBURSEMENT: 'Awaiting Loan Disbursement',
} as const;

export const TRANSACTIONTYPE = {
  DOWNPAYMENT: "Downpayment",
  LOANDISBURSAL: "Loan Disbursal",
  LOANREPAYMENT: "Loan Repayment	",
};
