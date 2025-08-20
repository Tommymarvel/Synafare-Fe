import React from "react";

const InfoDetail = ({
  title,
  value,
  children,
  className = "",
}: {
  title: string;
  value: string;
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <p className="text-xs text-gray-3 capitalize">{title}</p>
      <h4 className="font-medium text-resin-black ">
        {value} {children}
      </h4>
    </div>
  );
};

export default InfoDetail;
