type TimeframeType = "Weekly" | "Annually";

const CashFlowButton = ({
  timeframe,
  curr,
  setTimeframe,
  children,
}: {
  timeframe: string;
  curr: TimeframeType;
  setTimeframe: React.Dispatch<React.SetStateAction<TimeframeType>>;
  children: React.ReactNode;
}) => {
  return (
    <button
      onClick={() => setTimeframe(curr)}
      className={`px-3 py-1 text-sm rounded-full transition-colors duration-500 cursor-pointer ${
        timeframe == curr
          ? "bg-mikado-yellow font-medium text-resin-black"
          : "text-gray-3 hover:text-resin-black"
      }`}
    >
      {children}
    </button>
  );
};

export default CashFlowButton;
