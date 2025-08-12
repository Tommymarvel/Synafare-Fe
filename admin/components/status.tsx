import { cn } from "@/lib/utils";

type StatusType = "Successful" | "Pending" | "Rejected" | "Paid";

const Status = ({
  status,
  className,
}: {
  status: StatusType;
  className?: string;
}) => {
  if (status === "Pending") {
    return (
      <span
        className={cn(
          "bg-[#FFF8ED] text-[#E2A109] text-xs py-[2px] px-2 rounded-full",
          className
        )}
      >
        Pending
      </span>
    );
  }
  if (status === "Successful" || status === "Paid") {
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
  if (status === "Rejected") {
    return (
      <span
        className={cn(
          "bg-[#FEF3F2]/50 text-[#B42318] text-xs py-[2px] px-2 rounded-full",
          className
        )}
      >
        Rejected
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
