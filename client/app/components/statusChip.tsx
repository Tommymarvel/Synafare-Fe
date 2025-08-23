import { STATUSCONST } from '@/lib/constant';
import type { LoanStatus } from '@/app/dashboard/loans/types';

export type StatusType = (typeof STATUSCONST)[keyof typeof STATUSCONST];

// Quote Request status type
export type QuoteRequestStatus =
  | 'PENDING'
  | 'QUOTE_SENT'
  | 'NEGOTIATED'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'DELIVERED';

// Helper function to convert LoanStatus to StatusType
function loanStatusToStatusType(loanStatus: LoanStatus): StatusType {
  switch (loanStatus) {
    case 'PENDING':
      return STATUSCONST.PENDING;
    case 'OFFER_RECEIVED':
      return STATUSCONST.OFFER_RECEIVED;
    case 'ACTIVE':
      return STATUSCONST.ACTIVE;
    case 'COMPLETED':
      return STATUSCONST.COMPLETED;
    case 'REJECTED':
      return STATUSCONST.REJECTED;
    case 'AWAITING DOWNPAYMENT':
      return STATUSCONST.AWAITING_DOWNPAYMENT;
    case 'AWAITING DISBURSEMENT':
      return STATUSCONST.AWAITING_LOAN_DISBURSEMENT;
    default:
      return STATUSCONST.PENDING;
  }
}

// Helper function to convert QuoteRequestStatus to StatusType
function quoteRequestStatusToStatusType(
  quoteStatus: QuoteRequestStatus
): StatusType {
  switch (quoteStatus) {
    case 'PENDING':
      return STATUSCONST.PENDING;
    case 'QUOTE_SENT':
      return STATUSCONST.QUOTESENT;
    case 'NEGOTIATED':
      return STATUSCONST.NEGOTIATED;
    case 'ACCEPTED':
      return STATUSCONST.ACCEPTED;
    case 'REJECTED':
      return STATUSCONST.REJECTED;
    case 'DELIVERED':
      return STATUSCONST.DELIVERED;
    default:
      return STATUSCONST.PENDING;
  }
}

// Helper function to convert generic string status to StatusType for inventory
function inventoryStatusToStatusType(status: string): StatusType {
  const upperStatus = status.toUpperCase();
  switch (upperStatus) {
    case 'PUBLISHED':
      return STATUSCONST.PUBLISHED;
    case 'UNPUBLISHED':
      return STATUSCONST.UNPUBLISHED;
    case 'DRAFT':
      return STATUSCONST.DRAFT;
    case 'OUT OF STOCK':
    case 'OUTOFSTOCK':
      return STATUSCONST.OUTOFSTOCK;
    case 'PENDING':
      return STATUSCONST.PENDING;
    // Quote request statuses
    case 'QUOTE_SENT':
      return STATUSCONST.QUOTESENT;
    case 'NEGOTIATED':
      return STATUSCONST.NEGOTIATED;
    case 'ACCEPTED':
      return STATUSCONST.ACCEPTED;
    case 'DELIVERED':
      return STATUSCONST.DELIVERED;
    case 'REJECTED':
      return STATUSCONST.REJECTED;
    default:
      return STATUSCONST.PUBLISHED; // Default to published for inventory
  }
}

// Generic status chip that works with any status from STATUSCONST, LoanStatus, QuoteRequestStatus, or string
export default function StatusChip({
  status,
  className,
}: {
  status: StatusType | LoanStatus | QuoteRequestStatus | string;
  className?: string;
}) {
  // Convert different status types to StatusType
  const normalizedStatus: StatusType =
    typeof status === 'string'
      ? [
          'PENDING',
          'OFFER_RECEIVED',
          'ACTIVE',
          'COMPLETED',
          'REJECTED',
          'AWAITING DOWNPAYMENT',
          'AWAITING DISBURSEMENT',
        ].includes(status)
        ? loanStatusToStatusType(status as LoanStatus)
        : [
            'PENDING',
            'QUOTE_SENT',
            'NEGOTIATED',
            'ACCEPTED',
            'REJECTED',
            'DELIVERED',
          ].includes(status)
        ? quoteRequestStatusToStatusType(status as QuoteRequestStatus)
        : inventoryStatusToStatusType(status)
      : (status as StatusType);

  // Helper function to get status styling
  const getStatusStyle = (status: StatusType): string => {
    // Pending/Processing statuses - Yellow/Orange
    if (
      status === STATUSCONST.PENDING ||
      status === STATUSCONST.OFFER_RECEIVED ||
      status === STATUSCONST.PENDINGVERIFICATION ||
      status === STATUSCONST.NEGOTIATED ||
      status === STATUSCONST.QUOTESENT ||
      status === STATUSCONST.AWAITING_DOWNPAYMENT ||
      status === STATUSCONST.AWAITING_LOAN_DISBURSEMENT
    ) {
      return 'bg-yellow-50 text-yellow-600';
    }

    // Success/Active statuses - Green
    if (
      status === STATUSCONST.ACTIVE ||
      status === STATUSCONST.COMPLETED ||
      status === STATUSCONST.SUCCESS ||
      status === STATUSCONST.PAID ||
      status === STATUSCONST.VERIFIED ||
      status === STATUSCONST.ACCEPTED ||
      status === STATUSCONST.DELIVERED ||
      status === STATUSCONST.PUBLISHED
    ) {
      return 'bg-green-50 text-green-600';
    }

    // Error/Rejected statuses - Red
    if (
      status === STATUSCONST.REJECTED ||
      status === STATUSCONST.OVERDUE ||
      status === STATUSCONST.OUTOFSTOCK
    ) {
      return 'bg-red-50 text-red-600';
    }

    // Draft/Unpublished - Gray
    if (status === STATUSCONST.DRAFT || status === STATUSCONST.UNPUBLISHED) {
      return 'bg-gray-50 text-gray-600';
    }

    // Default - Neutral
    return 'bg-neutral-50 text-neutral-600';
  };

  const statusClasses = getStatusStyle(normalizedStatus);

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusClasses} ${
        className || ''
      }`}
    >
      {normalizedStatus}
    </span>
  );
}
