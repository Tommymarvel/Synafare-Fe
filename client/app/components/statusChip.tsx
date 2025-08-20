import { STATUSCONST } from '@/lib/constant';
import type { LoanStatus } from '@/app/dashboard/loans/types';

export type StatusType = (typeof STATUSCONST)[keyof typeof STATUSCONST];

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
    default:
      return STATUSCONST.PENDING;
  }
}

// Generic status chip that works with any status from STATUSCONST or LoanStatus
export default function StatusChip({
  status,
  className,
}: {
  status: StatusType | LoanStatus;
  className?: string;
}) {
  // Convert LoanStatus to StatusType if needed
  const normalizedStatus: StatusType =
    typeof status === 'string' &&
    ['PENDING', 'OFFER_RECEIVED', 'ACTIVE', 'COMPLETED', 'REJECTED'].includes(
      status
    )
      ? loanStatusToStatusType(status as LoanStatus)
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
