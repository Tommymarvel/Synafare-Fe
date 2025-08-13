"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogClose,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import LoanOfferSent from "./loan.offer.sent";
import { useState } from "react";
const ConfirmAccept = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [showSent, setShowSent] = useState(false);

  const handleShowSent = function () {
    onOpenChange(false);

    setShowSent(true);
  };
  return (
    <>
      <LoanOfferSent open={showSent} onOpenChange={setShowSent} />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="p-6 bg-white no-x  border-0 w-fit rounded-xl">
          <DialogHeader className="hidden">
            <DialogTitle>Accept Request</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-y-5">
            <svg
              width="56"
              height="56"
              viewBox="0 0 56 56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="4" y="4" width="48" height="48" rx="24" fill="#D1FADF" />
              <rect
                x="4"
                y="4"
                width="48"
                height="48"
                rx="24"
                stroke="#ECFDF3"
                strokeWidth="8"
              />
              <path
                d="M38 27.08V28C37.9988 30.1564 37.3005 32.2547 36.0093 33.9818C34.7182 35.709 32.9033 36.9725 30.8354 37.5839C28.7674 38.1953 26.5573 38.1219 24.5345 37.3746C22.5117 36.6273 20.7847 35.2461 19.611 33.4371C18.4373 31.628 17.8798 29.4881 18.0217 27.3363C18.1636 25.1846 18.9972 23.1363 20.3983 21.4971C21.7994 19.8578 23.6928 18.7154 25.7962 18.2401C27.8996 17.7649 30.1003 17.9823 32.07 18.86M38 20L28 30.01L25 27.01"
                stroke="#039855"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="space-y-2 text-center">
              <h4 className="font-semibold text-lg">Accept Request</h4>
              <p className="text-gray-3">
                Are you sure you want to accept this request?
              </p>
            </div>
            <div className="flex justify-center gap-x-3 font-medium">
              <DialogClose asChild>
                <button className="border border-resin-black hover:bg-resin-black hover:text-gray-4   px-[64px] py-4 rounded-lg">
                  Cancel
                </button>
              </DialogClose>
              <button
                onClick={handleShowSent}
                className="bg-mikado-yellow text-resin-black hover:bg-mikado-yellow/70  px-[64px] py-4 rounded-lg"
              >
                Confirm
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConfirmAccept;
