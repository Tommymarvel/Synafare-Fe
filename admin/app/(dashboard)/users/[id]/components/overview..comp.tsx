import CardWrapper from "@/components/cardWrapper";
import UserInforCol from "./user.info.col";
import Document from "@/components/document";

const OverviewComponents = () => {
  return (
    <div className="flex gap-x-5 w-full">
      <div className="space-y-5 grow">
        <CardWrapper className="rounded-lg w-full p-0">
          <h2 className="border-b border-b-gray-4 p-4 pb-[10px] font-medium text-[16px]">
            User Information
          </h2>
          <div className="pt-[27px] pb-[18px] px-[18px] grid grid-cols-4 gap-5 justify-between ">
            <UserInforCol title="First Name" value="David" />
            <UserInforCol title="Last Name" value="Smith" />
            <UserInforCol title="Bvn" value="2227123456" />
            <UserInforCol title="Nature of Business" value="Installer" />
            <UserInforCol title="Business Name" value="David & Sons Ltd" />
            <UserInforCol title="Registration No." value="RC3466789" />
            <UserInforCol title="ID Type" value="Voters Card" />
            <UserInforCol title="ID Number" value="234567905432" />
            <UserInforCol
              title="Address"
              value="21b brook street, Lekki, Lagos"
            />
            <UserInforCol title="City" value="Lagos" />
            <UserInforCol title="State" value="Lagos" />
            <UserInforCol title="Country" value="Nigeria" />
          </div>
        </CardWrapper>

        <CardWrapper className="p-0 w-full mb-4">
          <h2 className="border-b border-b-gray-4 p-4 pb-[10px] font-medium text-[16px]">
            Documents
          </h2>
          <ul>
            <Document name="Bank Statement.pdf" />
            <Document name="Invoice.pdf" />
          </ul>
        </CardWrapper>
      </div>

      <div className="space-y-5 shrink-0">
        <div className="border border-border-gray bg-resin-black rounded-2xl p-[14px] pb-[39px] space-y-[10px] w-[316px] bg-[url('/card-backgrround.png')] bg-contain bg-no-repeat bg-bottom-right ">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#D0D5DD]">Wallet Balance</p>
            <span className="w-10 h-10 flex items-center justify-center bg-mikado-yellow rounded-full">
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                <path
                  d="M14.0416 10.6562H7.79163C7.36454 10.6562 7.01038 10.3021 7.01038 9.875C7.01038 9.44792 7.36454 9.09375 7.79163 9.09375H14.0416C14.4687 9.09375 14.8229 9.44792 14.8229 9.875C14.8229 10.3021 14.4687 10.6562 14.0416 10.6562Z"
                  fill="#1D1C1D"
                />
                <path
                  d="M20.3332 15.9168C18.7603 15.9168 17.427 14.7501 17.302 13.2501C17.2186 12.3856 17.5311 11.5418 18.1561 10.9272C18.677 10.3856 19.4165 10.0835 20.1978 10.0835H22.3749C23.4061 10.1147 24.1978 10.9272 24.1978 11.9272V14.0731C24.1978 15.0731 23.4061 15.8856 22.4061 15.9168H20.3332ZM22.3436 11.646H20.2082C19.8436 11.646 19.5103 11.7814 19.2707 12.0314C18.9686 12.3231 18.8228 12.7189 18.8645 13.1147C18.9165 13.8022 19.5832 14.3543 20.3332 14.3543H22.3749C22.5103 14.3543 22.6353 14.2293 22.6353 14.0731V11.9272C22.6353 11.771 22.5103 11.6564 22.3436 11.646Z"
                  fill="#1D1C1D"
                />
                <path
                  d="M17.1667 22.6356H7.79171C4.20837 22.6356 1.80212 20.2293 1.80212 16.646V9.35433C1.80212 6.146 3.78127 3.82309 6.85418 3.43767C7.13543 3.396 7.45837 3.36475 7.79171 3.36475H17.1667C17.4167 3.36475 17.7396 3.37516 18.073 3.42724C21.1459 3.78141 23.1563 6.11475 23.1563 9.35433V10.8648C23.1563 11.2918 22.8021 11.646 22.375 11.646H20.2084C19.8438 11.646 19.5105 11.7814 19.2709 12.0314L19.2605 12.0418C18.9688 12.3231 18.8334 12.7085 18.8646 13.1043C18.9167 13.7918 19.5834 14.3439 20.3334 14.3439H22.375C22.8021 14.3439 23.1563 14.6981 23.1563 15.1251V16.6356C23.1563 20.2293 20.75 22.6356 17.1667 22.6356ZM7.79171 4.92725C7.54171 4.92725 7.30211 4.94807 7.06253 4.97932C4.77086 5.27098 3.36462 6.93766 3.36462 9.35433V16.646C3.36462 19.3335 5.10421 21.0731 7.79171 21.0731H17.1667C19.8542 21.0731 21.5938 19.3335 21.5938 16.646V15.9168H20.3334C18.7604 15.9168 17.4271 14.7502 17.3021 13.2502C17.2188 12.396 17.5313 11.5418 18.1563 10.9377C18.698 10.3856 19.4271 10.0835 20.2084 10.0835H21.5938V9.35433C21.5938 6.91683 20.1667 5.23972 17.8542 4.96889C17.6042 4.92722 17.3855 4.92725 17.1667 4.92725H7.79171V4.92725Z"
                  fill="#1D1C1D"
                />
              </svg>
            </span>
          </div>
          <div>
            <h1 className="text-[32px] font-medium text-white">
              ₦0<span className="text-xl text-gray-400">.00</span>
            </h1>
          </div>
        </div>
        <div className="border border-border-gray rounded-2xl p-[14px] pb-[27px] space-y-[10px] w-[316px]">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-3">Loan Balance</p>
            <span className="w-10 h-10 flex items-center justify-center bg-secondary-4 rounded-full">
              <svg
                width="27"
                height="26"
                viewBox="0 0 27 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.6319 22.34H8.01359C4.13792 22.34 1.90808 20.167 1.90808 16.3901V9.14669C1.90808 5.36979 4.13792 3.19678 8.01359 3.19678H18.6319C22.5075 3.19678 24.7374 5.36979 24.7374 9.14669V16.3901C24.7374 20.167 22.5075 22.34 18.6319 22.34ZM8.01359 4.74893C4.97676 4.74893 3.50082 6.18726 3.50082 9.14669V16.3901C3.50082 19.3495 4.97676 20.7878 8.01359 20.7878H18.6319C21.6687 20.7878 23.1446 19.3495 23.1446 16.3901V9.14669C23.1446 6.18726 21.6687 4.74893 18.6319 4.74893H8.01359Z"
                  fill="#FEBE04"
                />
                <path
                  d="M13.3224 16.6485C11.1244 16.6485 9.34058 14.91 9.34058 12.7681C9.34058 10.6261 11.1244 8.8877 13.3224 8.8877C15.5204 8.8877 17.3043 10.6261 17.3043 12.7681C17.3043 14.91 15.5204 16.6485 13.3224 16.6485ZM13.3224 10.4398C12.0058 10.4398 10.9333 11.485 10.9333 12.7681C10.9333 14.0512 12.0058 15.0963 13.3224 15.0963C14.6391 15.0963 15.7115 14.0512 15.7115 12.7681C15.7115 11.485 14.6391 10.4398 13.3224 10.4398Z"
                  fill="#FEBE04"
                />
                <path
                  d="M6.42052 16.1313C5.98517 16.1313 5.62415 15.7794 5.62415 15.3552V10.1813C5.62415 9.75709 5.98517 9.40527 6.42052 9.40527C6.85587 9.40527 7.21689 9.75709 7.21689 10.1813V15.3552C7.21689 15.7794 6.85587 16.1313 6.42052 16.1313Z"
                  fill="#FEBE04"
                />
                <path
                  d="M20.2246 16.1313C19.7892 16.1313 19.4282 15.7794 19.4282 15.3552V10.1813C19.4282 9.75709 19.7892 9.40527 20.2246 9.40527C20.6599 9.40527 21.021 9.75709 21.021 10.1813V15.3552C21.021 15.7794 20.6599 16.1313 20.2246 16.1313Z"
                  fill="#FEBE04"
                />
              </svg>
            </span>
          </div>
          <div>
            <h1 className="text-[32px] font-medium">
              ₦0<span className="text-xl">.00</span>
            </h1>
            <p className="text-xs text-gray-3">
              Available Credit: ₦ 5,000,000.00
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewComponents;
