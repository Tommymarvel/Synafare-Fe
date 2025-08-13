import CardWrapper from "@/components/cardWrapper";
import Image from "next/image";
import { STATUSCONST } from "@/lib/constants";
const RepaymentHistory = () => {
  // This is for no payment history
  if (false)
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
      <ul className="py-5 px-4 text-xs space-y-2">
        {/* This is for overdue */}
        <li className="flex gap-x-1 last:[&>div>svg]:hidden last:[&>div+div>div]:border-b-0">
          <div className="w-[16px] flex flex-col justify-start items-center gap-y-[6px] shrink-0">
            <div className="w-[18px] h-[18px] flex items-center justify-center rounded-full">
              <span className="block w-[10px] h-[10px] bg-[#797979]  rounded-full"></span>
            </div>
            <svg
              width="1"
              height="46"
              viewBox="0 0 1 46"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="0.5"
                y1="2.18557e-08"
                x2="0.499998"
                y2="46"
                stroke="#797979"
                stroke-dasharray="3 3"
              />
            </svg>
          </div>
          <div className="grow w-full flex gap-x-1 text-[#CF0C0C]">
            <div className="border-b-[0.5px] border-b-[#E6E6E6] self-start pb-4 grow ">
              <h4 className="text-sm">₦200,000</h4>
              <p>Repayment: 12 May 2025</p>
            </div>
            <span className="shrink-0 self-cente text-gray-3">12 Mar 2024</span>
          </div>
        </li>

        {/* this is for Pending/Rejected */}

        <li className="flex gap-x-1 last:[&>div>svg]:hidden last:[&>div+div>div]:border-b-0">
          <div className="w-[16px] flex flex-col justify-start items-center gap-y-[6px] shrink-0">
            <div className="w-[18px] h-[18px] flex items-center justify-center rounded-full">
              <span className="block w-[10px] h-[10px] bg-[#797979]  rounded-full"></span>
            </div>
            <svg
              width="1"
              height="46"
              viewBox="0 0 1 46"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="0.5"
                y1="2.18557e-08"
                x2="0.499998"
                y2="46"
                stroke="#797979"
                stroke-dasharray="3 3"
              />
            </svg>
          </div>
          <div className="grow w-full flex gap-x-1 text-gray-3">
            <div className="border-b-[0.5px] border-b-[#E6E6E6] self-start pb-4 grow ">
              <h4 className="text-sm">₦200,000</h4>
              <p>Repayment: 12 May 2025</p>
            </div>
            <span className="shrink-0 self-cente text-gray-3">12 Mar 2024</span>
          </div>
        </li>

        {/* This is for Active/Completed, I no remember again */}
        <li className="flex gap-x-1 last:[&>div>svg]:hidden last:[&>div+div>div]:border-b-0">
          <div className="w-[16px] flex flex-col justify-start items-center gap-y-[6px] shrink-0">
            <div className="w-[18px] h-[18px] bg-[#CCEDD6] flex items-center justify-center rounded-full">
              <span className="block w-[10px] h-[10px] bg-[#00A331]  rounded-full"></span>
            </div>
            <svg
              width="1"
              height="46"
              viewBox="0 0 1 46"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="0.5"
                y1="2.18557e-08"
                x2="0.499998"
                y2="46"
                stroke="#797979"
                stroke-dasharray="3 3"
              />
            </svg>
          </div>
          <div className="grow w-full flex gap-x-1">
            <div className="border-b-[0.5px] border-b-[#E6E6E6] self-start pb-4 grow ">
              <h4 className="text-sm">₦26,670</h4>
              <p className="text-gray-3">Repayment: 12 May 2025</p>
            </div>
            <span className="shrink-0 self-center  text-gray-3">
              12 Mar 2024
            </span>
          </div>
        </li>
      </ul>
    </CardWrapper>
  );
};

export default RepaymentHistory;
