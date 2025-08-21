// components/status.tsx
import { STATUSCONST } from '@/lib/constants';
import { cn } from '@/lib/utils';

export type StatusType = (typeof STATUSCONST)[keyof typeof STATUSCONST];

type Props = {
  status: StatusType;
  className?: string;

};

export default function Status({ status, className }: Props) {
  if (status === STATUSCONST.PENDING || status === STATUSCONST.OFFER_RECEIVED) {
    return (
      <span
        className={cn(
          'bg-[#FFF8ED] text-[#E2A109] text-xs py-[2px] px-2 rounded-full',
          className
        )}
      >
        {status}
      </span>
    );
  }

  if (
    status === STATUSCONST.SUCCESS ||
    status === STATUSCONST.PAID ||


    status === STATUSCONST.ACTIVE ||
    status === STATUSCONST.COMPLETED
  ) {
    return (
      <span
        className={cn(
          'bg-success-50/50 text-success text-xs py-[2px] px-2 rounded-full',
          className
        )}
      >
        {status}
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
        {status}
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
      {status}
    </span>
  );
}
