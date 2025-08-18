"use client";
import InfoDetail from "@/app/(dashboard)/loan-requests/[id]/components/detail";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogClose,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";

const ViewOfferModal = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="px-[27px] bg-white no-x py-0 max-w-[555px] pb-10 border-0 rounded-xl">
          <DialogHeader className="hidden">
            <DialogTitle>Accept Request</DialogTitle>
          </DialogHeader>
          <div className="border-b border-b-gray-4 pt-[33px] pb-4 flex justify-between itesm-center">
            <h1 className="text-xl font-medium">Financing Offer</h1>
            <DialogClose asChild>
              <span className="block cursor-pointer">
                <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
                  <path
                    d="M10.9969 28.5077C10.3473 29.1572 10.3163 30.317 11.0124 30.982C11.6775 31.6778 12.8531 31.6469 13.5028 30.9974L21.0048 23.4974L28.5069 30.9974C29.172 31.6624 30.3167 31.6778 30.9818 30.982C31.6779 30.317 31.6624 29.1572 30.9973 28.4923L23.4952 20.9923L30.9973 13.5077C31.6624 12.8273 31.6779 11.683 30.9818 11.018C30.3167 10.3222 29.172 10.3376 28.5069 11.0026L21.0048 18.5026L13.5028 11.0026C12.8531 10.3531 11.6775 10.3222 11.0124 11.018C10.3163 11.683 10.3473 12.8428 10.9969 13.4923L18.499 20.9923L10.9969 28.5077Z"
                    fill="#344054"
                  />
                </svg>
              </span>
            </DialogClose>
          </div>

          <div className="grid grid-cols-3  gap-[35px] justify-between">
            <InfoDetail title="Transaction Cost" value=" ₦1,250,000" />
            <InfoDetail title="Amount Requested" value=" ₦850,000" />
            <InfoDetail title="Amount Offered" value=" ₦850,000" />
            <InfoDetail title="Loan Duration" value=" 3 months" />
            <InfoDetail title="Interest (per month)" value="6%" />
            <InfoDetail title="Downpayment (30%)" value="₦375,000" />
            <InfoDetail title="Total Repayment" value="₦980,000" />
            <InfoDetail title="Monthly instalment" value="₦326,670" />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ViewOfferModal;
