'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogClose,
} from '@/components/ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';

const LoanOfferSent = ({
  open,
  onOpenChange,
  offerDetails,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offerDetails: {
    amountOffered: number;
    offerDetails: {
      userFirstName: string;
      userLastName: string;
    };
  };
}) => {
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="px-20 py-[50] bg-white no-x  border-0 w-fit rounded-xl">
          <DialogHeader className="hidden">
            <DialogTitle>Accept Request</DialogTitle>
          </DialogHeader>
          <div className="flex relative">
            <DialogClose asChild>
              <span className="block cursor-pointer absolute right-[-35px] top-[-10px] ">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.996932 18.5077C0.347268 19.1572 0.316332 20.317 1.0124 20.982C1.67753 21.6778 2.85311 21.6469 3.50278 20.9974L11.0048 13.4974L18.5069 20.9974C19.172 21.6624 20.3167 21.6778 20.9818 20.982C21.6779 20.317 21.6624 19.1572 20.9973 18.4923L13.4952 10.9923L20.9973 3.50773C21.6624 2.82732 21.6779 1.68299 20.9818 1.01804C20.3167 0.322165 19.172 0.337629 18.5069 1.00258L11.0048 8.50258L3.50278 1.00258C2.85311 0.353093 1.67753 0.322165 1.0124 1.01804C0.316332 1.68299 0.347268 2.84278 0.996932 3.49227L8.499 10.9923L0.996932 18.5077Z"
                    fill="#344054"
                  />
                </svg>
              </span>
            </DialogClose>
          </div>
          <div className="flex flex-col items-center gap-y-5">
            <svg
              width="120"
              height="119"
              viewBox="0 0 120 119"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                opacity="0.2"
                cx="60"
                cy="59.6045"
                r="59.1045"
                fill="#E2A109"
              />
              <circle
                opacity="0.3"
                cx="60.0002"
                cy="59.603"
                r="44.3284"
                fill="#E2A109"
              />
              <circle cx="59.6802" cy="59.2853" r="24.4898" fill="#E2A109" />
              <path
                d="M68.3207 50.4689C69.3199 49.4697 70.9656 49.4697 71.9648 50.4689C72.9639 51.4974 72.9639 53.1137 71.9648 54.1129L58.0057 68.072C57.5061 68.5715 56.8596 68.8066 56.1837 68.8066C55.5372 68.8066 54.8906 68.5715 54.3911 68.072L47.3968 61.1071C46.3977 60.0786 46.3977 58.4623 47.3968 57.4631C48.396 56.4639 50.0417 56.4639 51.0409 57.4631L56.1837 62.6059L68.3207 50.4689Z"
                fill="white"
              />
            </svg>

            <div className="space-y-2 text-center">
              <h4 className="font-medium text-lg">Loan Offer Sent</h4>
              <p className="text-gray-3">
                You sent a loan offer of{' '}
                <span className="text-resin-black">
                  {offerDetails.amountOffered}
                </span>{' '}
                to <b className='capitalize text-resin-black'> {offerDetails.offerDetails.userFirstName} {offerDetails.offerDetails.userLastName}.</b>
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LoanOfferSent;
