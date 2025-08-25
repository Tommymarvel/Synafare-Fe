"use client";
import Status from "@/components/status";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { WalletTransactions } from "@/types/market.place.types";
import { format } from "date-fns";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from "react";
// text-
const ViewTransactionReceipt = ({
  open,
  onOpenChange,
  receipt,
}: {
  open: boolean;
  onOpenChange: (x: boolean) => void;
  receipt?: WalletTransactions;
}) => {
  const receiptRef = useRef<HTMLDivElement | null>(null);

  if (!receipt) return null;
  const downloadReceipt = async () => {
    const element = receiptRef.current;
    if (!element) return;
    // Take snapshot of the component
    const canvas = await html2canvas(element, {
      backgroundColor: "#febe04",
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
    });
    const imgData = canvas.toDataURL("image/png");

    // Create PDF
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(receipt.name + receipt.date + ".pdf");
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="px-[25px] py-4 bg-[#9D7604] no-x  max-w-[555px] pb-[17px] border-none rounded-none focus:ring-0 ">
        <DialogHeader className="hidden">
          <DialogTitle>Tranasction Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <DialogClose asChild>
            <span className="block cursor-pointer ms-auto w-fit">
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.996932 18.5077C0.347268 19.1572 0.316332 20.317 1.0124 20.982C1.67753 21.6778 2.85311 21.6469 3.50278 20.9974L11.0048 13.4974L18.5069 20.9974C19.172 21.6624 20.3167 21.6778 20.9818 20.982C21.6779 20.317 21.6624 19.1572 20.9973 18.4923L13.4952 10.9923L20.9973 3.50773C21.6624 2.82732 21.6779 1.68299 20.9818 1.01804C20.3167 0.322165 19.172 0.337629 18.5069 1.00258L11.0048 8.50258L3.50278 1.00258C2.85311 0.353093 1.67753 0.322165 1.0124 1.01804C0.316332 1.68299 0.347268 2.84278 0.996932 3.49227L8.499 10.9923L0.996932 18.5077Z"
                  fill="white"
                />
              </svg>
            </span>
          </DialogClose>

          <div ref={receiptRef} className="bg-[#9D7604]">
            <div className="bg-[url('/transactions-bg.png')] pt-[57px] pb-[73px] px-6  bg-cover">
              <h1 className="text-xl font-medium pb-[50px] border-b border-b-gray">
                Transaction Details
              </h1>
              <div className=" pt-[50px] mb-[100px]">
                <ul className="text-[#515151] space-y-[30px]">
                  <li className="flex justify-between">
                    <div>Transaction Date</div>
                    <div>
                      {format(
                        new Date(receipt.date),
                        "MMM dd, yyyy - HH:mm:ss"
                      )}
                    </div>
                  </li>
                  <li className="flex justify-between">
                    <div>Transaction Type</div>
                    <div>{receipt.transactionType}</div>
                  </li>
                  <li className="flex justify-between">
                    <div>Amount</div>
                    <div>
                      {receipt.amount.toLocaleString("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      })}
                    </div>
                  </li>

                  <li className="h-px bg-gray"></li>

                  <li className="flex justify-between">
                    <div>Ref Code</div>
                    <div>{receipt.transactionRef}</div>
                  </li>
                  <li className="flex justify-between">
                    <div>Status</div>
                    <div>
                      <Status status={receipt.status} />
                    </div>
                  </li>
                </ul>
              </div>

              <button
                onClick={downloadReceipt}
                className="p-4 w-full max-w-[441px] mx-auto flex items-center gap-x-2 justify-center bg-mikado-yellow hover:bg-mikado-yellow/60 rounded-lg"
              >
                <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
                  <path
                    d="M15.76 22.7503H9.23998C4.32998 22.7503 2.22998 20.6503 2.22998 15.7403V15.6103C2.22998 11.1703 3.97998 9.03027 7.89998 8.66027C8.29998 8.63027 8.67998 8.93027 8.71998 9.34027C8.75998 9.75027 8.45998 10.1203 8.03998 10.1603C4.89998 10.4503 3.72998 11.9303 3.72998 15.6203V15.7503C3.72998 19.8203 5.16998 21.2603 9.23998 21.2603H15.76C19.83 21.2603 21.27 19.8203 21.27 15.7503V15.6203C21.27 11.9103 20.08 10.4303 16.88 10.1603C16.47 10.1203 16.16 9.76027 16.2 9.35027C16.24 8.94027 16.59 8.63027 17.01 8.67027C20.99 9.01027 22.77 11.1603 22.77 15.6303V15.7603C22.77 20.6503 20.67 22.7503 15.76 22.7503Z"
                    fill="#1D1C1D"
                  />
                  <path
                    d="M12.5 16.2491C12.09 16.2491 11.75 15.9091 11.75 15.4991V4.11914C11.75 3.70914 12.09 3.36914 12.5 3.36914C12.91 3.36914 13.25 3.70914 13.25 4.11914V15.4991C13.25 15.9091 12.91 16.2491 12.5 16.2491Z"
                    fill="#1D1C1D"
                  />
                  <path
                    d="M15.8498 7.09945C15.6598 7.09945 15.4698 7.02945 15.3198 6.87945L12.4998 4.05945L9.67984 6.87945C9.38984 7.16945 8.90984 7.16945 8.61984 6.87945C8.32984 6.58945 8.32984 6.10945 8.61984 5.81945L11.9698 2.46945C12.2598 2.17945 12.7398 2.17945 13.0298 2.46945L16.3798 5.81945C16.6698 6.10945 16.6698 6.58945 16.3798 6.87945C16.2398 7.02945 16.0398 7.09945 15.8498 7.09945Z"
                    fill="#1D1C1D"
                  />
                </svg>
                <p className="text-[16px]">Download Receipt</p>
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewTransactionReceipt;
