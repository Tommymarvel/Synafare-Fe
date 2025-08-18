"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogClose,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useState } from "react";
import DeclinedRequestMessage from "./loan.declined.request";
import Button from "@/components/button";
const ConfirmDecline = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [showRequestDelined, setRequestDelined] = useState(false);

  const handleShowRequestDelined = function () {
    onOpenChange(false);

    setRequestDelined(true);
  };
  return (
    <>
      <DeclinedRequestMessage
        open={showRequestDelined}
        onOpenChange={setRequestDelined}
      />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="p-6 bg-white no-x  border-0 w-fit rounded-xl">
          <DialogHeader className="hidden">
            <DialogTitle>Decline Request</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-y-5">
            <svg
              width="56"
              height="56"
              viewBox="0 0 56 56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="4" y="4" width="48" height="48" rx="24" fill="#FEE7BA" />
              <rect
                x="4"
                y="4"
                width="48"
                height="48"
                rx="24"
                stroke="#FFF7E9"
                strokeWidth="8"
              />
              <path
                d="M27.9988 24V28M27.9988 32H28.0088M26.2888 18.86L17.8188 33C17.6442 33.3024 17.5518 33.6453 17.5508 33.9945C17.5498 34.3437 17.6403 34.6871 17.8132 34.9905C17.9862 35.2939 18.2355 35.5467 18.5365 35.7238C18.8375 35.9009 19.1796 35.9962 19.5288 36H36.4688C36.818 35.9962 37.1601 35.9009 37.4611 35.7238C37.7621 35.5467 38.0114 35.2939 38.1844 34.9905C38.3573 34.6871 38.4478 34.3437 38.4468 33.9945C38.4458 33.6453 38.3534 33.3024 38.1788 33L29.7088 18.86C29.5305 18.5661 29.2795 18.3231 28.98 18.1545C28.6805 17.9858 28.3425 17.8972 27.9988 17.8972C27.6551 17.8972 27.3171 17.9858 27.0176 18.1545C26.7181 18.3231 26.4671 18.5661 26.2888 18.86Z"
                stroke="#CA8D1B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <div className="space-y-2 text-center">
              <h4 className="font-medium text-lg">Decline Request</h4>
              <p className="text-gray-3">
                Are you sure you want to decline this request?
              </p>
            </div>
            <div className="flex justify-center gap-x-3 font-medium">
              <DialogClose asChild>
                <Button
                  variant="Colored"
                  className="px-[64px] py-4"
                  onClick={handleShowRequestDelined}
                >
                  Cancel
                </Button>
              </DialogClose>

              <Button
                className="px-[64px] py-4"
                onClick={handleShowRequestDelined}
              >
                Confirm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConfirmDecline;
