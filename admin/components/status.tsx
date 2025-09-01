// components/status.tsx
import { STATUSCONST } from '@/lib/constants';
import { cn } from '@/lib/utils';

export type StatusType = (typeof STATUSCONST)[keyof typeof STATUSCONST];

type Props = {
  status: StatusType;
  className?: string;
};

export default function Status({ status, className }: Props) {
  // Normalize status to handle both cases and capitalize for display
  const normalizedStatus = status?.toLowerCase();
  const displayStatus =
    typeof status === 'string'
      ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
      : status;

  if (
    normalizedStatus === 'pending' ||
    status === STATUSCONST.PENDING ||
    status === STATUSCONST.OFFER_RECEIVED ||
    status === STATUSCONST.PENDINGVERIFICATION
  ) {
    return (
      <span
        className={cn(
          'bg-[#FFF8ED] text-[#E2A109] text-xs py-[2px] px-2 rounded-full',
          className
        )}
      >
        {displayStatus}
      </span>
    );
  }

  if (
    status === STATUSCONST.AWAITING_DOWNPAYMENT ||
    status === STATUSCONST.AWAITING_LOAN_DISBURSEMENT
  ) {
    return (
      <span
        className={cn(
          'bg-blue-50 text-blue-600 text-xs py-[2px] px-2 rounded-full',
          className
        )}
      >
        {displayStatus}
      </span>
    );
  }

  if (
    normalizedStatus === 'successful' ||
    status === STATUSCONST.successful ||
    status === STATUSCONST.SUCCESS ||
    status === STATUSCONST.PAID ||
    status === STATUSCONST.VERIFIED ||
    status === STATUSCONST.ACTIVE ||
    status === STATUSCONST.COMPLETED ||
    status === STATUSCONST.ACCEPTED ||
    status === STATUSCONST.PUBLISHED
  ) {
    return (
      <span
        className={cn(
          'bg-[#ECFDF3] text-[#027A48] text-xs py-[2px] px-2 rounded-full',
          className
        )}
      >
        {displayStatus}
      </span>
    );
  }

  if (status === STATUSCONST.REJECTED || status === STATUSCONST.OVERDUE) {
    return (
      <span
        className={cn(
          'bg-[#FEF3F2]/50 text-[#B42318] text-xs py-[2px] px-2 rounded-full',
          className
        )}
      >
        {displayStatus}
      </span>
    );
  }

  return (
    <span
      className={cn(
        'bg-neutral-100 text-neutral-600 text-xs py-[2px] px-2 rounded-full',
        className
      )}
    >
      {displayStatus}
    </span>
  );
}
