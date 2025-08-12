import React from "react";

const InfoDetail = ({
  title,
  value,
  children,
}: {
  title: string;
  value: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-3">{title}</p>
      <h4 className="font-medium text-resin-black">
        {value} {children}
      </h4>
    </div>
  );
};

export default InfoDetail;
