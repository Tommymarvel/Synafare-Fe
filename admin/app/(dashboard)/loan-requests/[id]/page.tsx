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
          <button className="bg-mikado-yellow hover:bg-mikado-yellow/70  px-[30px] py-2 rounded-lg">
            Accept Request
          </button>
          <button className="border border-resin-black hover:bg-resin-black hover:text-gray-4   px-[30px] py-2 rounded-lg">
            Decline Request
          </button>
          <button className="border border-resin-black hover:bg-resin-black fill-resin-black hover:text-gray-4 hover:fill-gray-4   px-[30px] py-2 rounded-lg flex gap-x-2">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="inherit">
              <path
                d="M14.166 17.7083H5.83268C2.79102 17.7083 1.04102 15.9583 1.04102 12.9166V7.08329C1.04102 4.04163 2.79102 2.29163 5.83268 2.29163H14.166C17.2077 2.29163 18.9577 4.04163 18.9577 7.08329V12.9166C18.9577 15.9583 17.2077 17.7083 14.166 17.7083ZM5.83268 3.54163C3.44935 3.54163 2.29102 4.69996 2.29102 7.08329V12.9166C2.29102 15.3 3.44935 16.4583 5.83268 16.4583H14.166C16.5493 16.4583 17.7077 15.3 17.7077 12.9166V7.08329C17.7077 4.69996 16.5493 3.54163 14.166 3.54163H5.83268Z"
                fill="inherit"
              />
              <path
                d="M9.999 10.725C9.299 10.725 8.59067 10.5083 8.049 10.0666L5.44067 7.98331C5.174 7.76664 5.124 7.37497 5.34067 7.10831C5.55734 6.84164 5.94901 6.79164 6.21567 7.00831L8.824 9.09164C9.45733 9.59998 10.5323 9.59998 11.1657 9.09164L13.774 7.00831C14.0407 6.79164 14.4407 6.83331 14.649 7.10831C14.8657 7.37497 14.824 7.77498 14.549 7.98331L11.9407 10.0666C11.4073 10.5083 10.699 10.725 9.999 10.725Z"
                fill="inherit"
              />
            </svg>
            Send Reminder
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

      <div className="mt-[10px] flex gap-x-5">
        <div className="grow space-y-5">
          <div className="border py-3 rounded-[10px] items-center border-[#CF0C0C] text-[#CF0C0C] bg-[#F8DBDB] flex justify-center gap-x-1">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_864_205037)">
                <path
                  d="M8.00065 10.6666V7.99992M8.00065 5.33325H8.00732M14.6673 7.99992C14.6673 11.6818 11.6826 14.6666 8.00065 14.6666C4.31875 14.6666 1.33398 11.6818 1.33398 7.99992C1.33398 4.31802 4.31875 1.33325 8.00065 1.33325C11.6826 1.33325 14.6673 4.31802 14.6673 7.99992Z"
                  stroke="#CF0C0C"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_864_205037">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
            Loan is overdue
          </div>
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
        <RepaymentHistory />
      </div>
    </div>
  );
};

export default LoanRequestDetail;
