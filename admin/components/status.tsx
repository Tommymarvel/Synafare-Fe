import { STATUSCONST } from "@/lib/constants";
import { cn } from "@/lib/utils";

type StatusType = (typeof STATUSCONST)[keyof typeof STATUSCONST];

const Status = ({
  status,
  className,
}: {
  status: StatusType;
  className?: string;
}) => {
  if (
    status === STATUSCONST.PENDING ||
    status === STATUSCONST.PENDINGVERIFICATION ||
    status == STATUSCONST.QUOTESENT
  ) {
    return (
      <span
        className={cn(
          "bg-[#FFF8ED] text-[#E2A109] text-xs py-[2px] px-2 rounded-full",
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
    status == STATUSCONST.ACTIVE ||
    status == STATUSCONST.COMPLETED ||
    status == STATUSCONST.VERIFIED ||
    status == STATUSCONST.PUBLISHED ||
    status == STATUSCONST.ACCEPTED ||
    status == STATUSCONST.DELIVERED
  ) {
    return (
      <span
        className={cn(
          "bg-success-50/50 text-success text-xs py-[2px] px-2 rounded-full",
          className
        )}
      >
        {status}
      </span>
    );
  }
  if (
    status === STATUSCONST.REJECTED ||
    status === STATUSCONST.OVERDUE ||
    status === STATUSCONST.OUTOFSTOCK
  ) {
    return (
      <span
        className={cn(
          "bg-[#FEF3F2]/50 text-[#B42318] text-xs py-[2px] px-2 rounded-full",
          className
        )}
      >
        {status}
      </span>
    );
  }
  if (
    status === STATUSCONST.OFFERRECEIVED ||
    status == STATUSCONST.NEGOTIATED
  ) {
    return (
      <span
        className={cn(
          "bg-[#EFF8FF] text-[#175CD3] text-xs py-[2px] px-2 rounded-full",
          className
        )}
      >
        {status}
      </span>
    );
  }
  if (status === STATUSCONST.DRAFT || status == STATUSCONST.UNPUBLISHED) {
    return (
      <span
        className={cn(
          "bg-[#F2F4F7] text-[#344054] text-xs py-[2px] px-2 rounded-full",
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
        "bg-success-50/50 text-success text-xs py-[2px] px-2 rounded-full",
        className
      )}
    >
      unknown
    </span>
  );
};

export default Status;
