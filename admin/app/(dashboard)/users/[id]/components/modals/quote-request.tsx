"use client";
import InfoDetail from "@/app/(dashboard)/loan-requests/[id]/components/detail";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogClose,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";

const QuoteRequestModal = ({
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
            <DialogTitle>Quote Request</DialogTitle>
          </DialogHeader>
          <div className="border-b border-b-gray-4 pt-[33px] pb-4 flex justify-between itesm-center">
            <h1 className="text-xl font-medium">Quote Request</h1>
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

          <div className="grid grid-cols-3  gap-[10px] justify-between">
            <InfoDetail title="Quantity" value=" 10" />
            <InfoDetail title="Quote Sent" value=" ₦900,000" />
            <InfoDetail title="Counter Amount" value=" ₦875,000" />
            <InfoDetail
              title="Delivery Address"
              value="15b, Brook Street, Lekki,Lagos"
            />
            <InfoDetail title="Customer" value=" Mary Smith" />
          </div>
          <div className="border-b-4 border-b-gray-4 pb-4">
            <span className="text-xs text-gray-3">Additional Messages</span>
            <p>
              Lorem ipsum dolor sit amet consectetur. Neque amet egestas nunc
              elementum mauris lorem erat egestas mauris. Eros eleifend eget ut
              rhoncus sit.
            </p>
          </div>
          <div>
            <div className="flex justify-between">
              <h1 className="font-medium">Request History</h1>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M9.99928 13.9995C9.41595 13.9995 8.83262 13.7745 8.39095 13.3329L2.95762 7.89954C2.71595 7.65788 2.71595 7.25788 2.95762 7.01621C3.19928 6.77454 3.59928 6.77454 3.84095 7.01621L9.27428 12.4495C9.67428 12.8495 10.3243 12.8495 10.7243 12.4495L16.1576 7.01621C16.3993 6.77454 16.7993 6.77454 17.041 7.01621C17.2826 7.25788 17.2826 7.65788 17.041 7.89954L11.6076 13.3329C11.166 13.7745 10.5826 13.9995 9.99928 13.9995Z"
                  fill="#1D1C1D"
                />
              </svg>
            </div>
            <ul className="mt-3">
              <li className="flex gap-x-1 [&>div>svg]:last:hidden [&>div+div>div]:last:border-b-0">
                <div className="w-[16px] flex flex-col justify-start items-center gap-y-[6px] shrink-0">
                  <div className="w-[18px] h-[18px] flex items-center justify-center rounded-full">
                    <span className="block w-[10px] h-[10px] bg-[#797979]  rounded-full"></span>
                  </div>
                  <svg width="1" height="46" viewBox="0 0 1 46" fill="none">
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
                <div className="grow w-full flex gap-x-1 text-gray-3">
                  <div className="border-b-[0.5px] border-b-[#E6E6E6] self-start pb-4 grow ">
                    <h4 className="text-sm text-resin-black">
                      Mary Smith negotiated amount to ₦875,000
                    </h4>
                    <p>Repayment: 12 May 2025</p>
                  </div>
                  <span className="shrink-0 self-cente text-gray-3 ">
                    12 Mar 2024
                  </span>
                </div>
              </li>

              <li className="flex gap-x-1 [&>div>svg]:last:hidden [&>div+div>div]:last:border-b-0">
                <div className="w-[16px] flex flex-col justify-start items-center gap-y-[6px] shrink-0">
                  <div className="w-[18px] h-[18px] bg-[#CCEDD6] flex items-center justify-center rounded-full">
                    <span className="block w-[10px] h-[10px] bg-[#00A331]  rounded-full"></span>
                  </div>
                  <svg width="1" height="46" viewBox="0 0 1 46" fill="none">
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
                <div className="grow w-full flex gap-x-1">
                  <div className="border-b-[0.5px] border-b-[#E6E6E6] self-start pb-4 grow ">
                    <h4 className="text-sm">₦900,000 Quotation Sent</h4>
                    <p className="text-[#E2A109] font-normal text-xs underline">
                      View Quote
                    </p>
                  </div>
                  <span className="shrink-0 self-center  text-gray-3">
                    12 Mar 2024
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuoteRequestModal;
