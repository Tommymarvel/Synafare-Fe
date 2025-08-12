import PageIntro from "@/components/page-intro";
import GoBack from "./components/goback";
import CardWrapper from "@/components/cardWrapper";
import InfoDetail from "./components/detail";
import Status from "@/components/status";
import Document from "./components/document";
import Image from "next/image";
import RepaymentHistory from "./components/repayment-history";

const LoanRequestDetail = () => {
  return (
    <div>
      <GoBack href="/loan-requests" className="mt-5 mb-3" />
      <div className="flex items-center mb-5">
        <PageIntro>David Smith</PageIntro>
        <div className="flex items-center gap-x-3 ms-auto text-resin-black font-medium">
          <button className="bg-mikado-yellow  px-[30px] py-2 rounded-lg">
            Accept Request
          </button>
          <button className="border border-resin-black  px-[30px] py-2 rounded-lg">
            Decline Request
          </button>
        </div>
      </div>

      <div className="bg-resin-black text-gray-4 rounded-4 p-10 flex justify-between rounded-2xl">
        <div className="space-y-[10px]">
          <p className="text-sm">Outstanding Balance</p>
          <h3 className="font-bold text-[28px]/[100%]">-----------</h3>
        </div>
        <div>
          <p className="text-sm">Duration</p>
          <h3 className="text-[32px]/[100%] font-medium">0/3 Months</h3>
        </div>
      </div>

      <div className="mt-6 flex gap-x-5">
        <div className="grow space-y-5">
          <CardWrapper className="p-0 w-full ps-[18px] pb-6">
            <h2 className="border-b border-b-gray-4 p-4 pb-[10px] font-medium text-[16px]">
              Loan Details
            </h2>

            <div className="flex justify-between pt-7">
              <div className="grid grid-cols-2 flex-1 gap-[15px]">
                <InfoDetail title="Transaction Cost" value=" ₦1,250,000" />
                <InfoDetail title="Loan Duration" value=" 3 months" />
                <InfoDetail title="Downpayment (30%)" value="₦375,000" />
                <InfoDetail title="Total Repayment" value="₦375,000" />
              </div>

              <div className="grid grid-cols-2 flex-1 gap-[15px]">
                <InfoDetail title="Interest (per month)" value="₦1,250,000" />
                <InfoDetail title="Loan Amount" value="₦1,250,000" />
                <InfoDetail title="Next Payment" value="N/A" />
                <InfoDetail title="status" value="">
                  <Status status="Pending" className="font-medium" />
                </InfoDetail>
              </div>
            </div>
          </CardWrapper>

          {/* display this only when its Rejected */}
          <CardWrapper className="p-0 w-full ps-[18px] pb-10 pt-4">
            <InfoDetail title="Reason for Decline" value="Invoice is invalid" />
          </CardWrapper>
          {/* ######### */}

          <CardWrapper className="p-0 w-full">
            <h2 className="border-b border-b-gray-4 p-4 pb-[10px] font-medium text-[16px]">
              Customer Information
            </h2>
            <div className="flex justify-between py-[27px] px-[18px]">
              <InfoDetail
                title="Customer’s Name"
                value="Customer’s Email Address"
              />
              <InfoDetail
                title="Customer’s Email Address"
                value="mayree12@gmail.com"
              />
              <InfoDetail
                title="Customer’s Phone Number"
                value="+2348123456789"
              />
            </div>
          </CardWrapper>

          <CardWrapper className="p-0 w-full mb-4">
            <h2 className="border-b border-b-gray-4 p-4 pb-[10px] font-medium text-[16px]">
              Documents
            </h2>
            <ul>
              {/* I no know whether the view document is link or popup */}
              <Document name="Bank Statement.pdf" />
              <Document name="Invoice.pdf" />
            </ul>
          </CardWrapper>
        </div>
        <RepaymentHistory data={[]} />
      </div>
    </div>
  );
};

export default LoanRequestDetail;
