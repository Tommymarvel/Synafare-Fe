import React from "react";

const CardWrapper = ({
  className,
  children,
}: {
  className: string | undefined;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={` rounded-md p-[18px] border border-[#E4E7EC] ${className}`}
    >
      {children}
    </div>
  );
};

export default CardWrapper;
