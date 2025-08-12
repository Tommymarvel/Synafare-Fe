import CardWrapper from "@/components/cardWrapper";
import Image from "next/image";

const RepaymentHistory = ({ data }: { data: any[] }) => {
  if (!data || !data.length)
    return (
      <CardWrapper className="p-0 shrink-0 w-[316px] self-start">
        <h2 className="bg-border-gray p-4 pb-[10px] font-medium text-[16px]">
          Repayment History
        </h2>
        <div className="flex items-center justify-center min-h-[248px]">
          <div className="space-y-1">
            <Image
              src="/money-bag.svg"
              width={61}
              height={70}
              className="w-[60px] block mx-auto"
              alt="empty repayment history"
            />
            <p className="text-gray-3 italic">No repayment history</p>
          </div>
        </div>
      </CardWrapper>
    );
  return (
    <CardWrapper className="p-0 shrink-0 w-[316px] self-start">
      <h2 className="bg-border-gray p-4 pb-[10px] font-medium text-[16px]">
        Repayment History
      </h2>
      <ul className="py-5 px-4">
        <li></li>
      </ul>
    </CardWrapper>
  );
};

export default RepaymentHistory;
