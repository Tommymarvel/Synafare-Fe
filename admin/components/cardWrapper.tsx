import { cn } from "@/lib/utils";
import React from "react";

const CardWrapper = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(` rounded-md p-[18px] border border-[#E4E7EC]`, className)}
    >
      {children}
    </div>
  );
};

export default CardWrapper;
