import CardWrapper from "@/components/cardWrapper";

const ProductActivity = () => {
  return (
    <CardWrapper className="p-0">
      <ul className="py-5 px-4 text-xs space-y-2">
        <li className="flex gap-x-1 [&>div>svg]:last:hidden [&>div+div>div]:last:border-b-0">
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
                strokeDasharray="3 3"
              />
            </svg>
          </div>
          <div className="grow w-full text-gray-3">
            <div className="border-b-[0.5px] border-b-[#E6E6E6] self-start pb-4 grow ">
              <h4 className="text-sm text-resin-black">
                You are running low on stock
              </h4>
              <p>12 May 2025</p>
            </div>
          </div>
        </li>
        <li className="flex gap-x-1 [&>div>svg]:last:hidden [&>div+div>div]:last:border-b-0">
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
                strokeDasharray="3 3"
              />
            </svg>
          </div>
          <div className="grow w-full text-gray-3">
            <div className="border-b-[0.5px] border-b-[#E6E6E6] self-start pb-4 grow ">
              <h4 className="text-sm text-resin-black">
                Mary Smith paid for this product
              </h4>
              <p>12 May 2025</p>
            </div>
          </div>
        </li>
        <li className="flex gap-x-1 [&>div>svg]:last:hidden [&>div+div>div]:last:border-b-0">
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
                strokeDasharray="3 3"
              />
            </svg>
          </div>
          <div className="grow w-full text-gray-3">
            <div className="border-b-[0.5px] border-b-[#E6E6E6] self-start pb-4 grow ">
              <h4 className="text-sm text-resin-black">
                An invoice for Mary Smith was created for this product
              </h4>
              <p>12 May 2025</p>
            </div>
          </div>
        </li>
      </ul>
    </CardWrapper>
  );
};

export default ProductActivity;
