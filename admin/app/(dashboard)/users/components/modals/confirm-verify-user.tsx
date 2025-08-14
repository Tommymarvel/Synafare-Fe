import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogClose,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import Button from "@/components/button";
import { toast } from "sonner";
const ConfirmVerifyUserModal = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const handleVerifyUser = function () {
    onOpenChange(false);

    toast(
      <div className="flex rounded-[10px] gap-x-4 items-center bg-white p-4 w-[500px] shadow-[0px_0px_24px_0px_#0000001F]">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          className="shrink-0"
        >
          <path
            d="M19.627 11.7198L13.907 17.4532L11.707 15.2532C11.5875 15.1136 11.4404 15.0002 11.275 14.9202C11.1095 14.8402 10.9294 14.7952 10.7457 14.7881C10.5621 14.781 10.379 14.812 10.2079 14.879C10.0368 14.946 9.8814 15.0477 9.75146 15.1776C9.62152 15.3076 9.51985 15.463 9.45282 15.6341C9.38578 15.8052 9.35484 15.9883 9.36193 16.1719C9.36903 16.3555 9.414 16.5357 9.49403 16.7011C9.57406 16.8666 9.68742 17.0136 9.827 17.1332L12.9603 20.2798C13.0849 20.4034 13.2327 20.5012 13.3951 20.5675C13.5576 20.6339 13.7315 20.6675 13.907 20.6665C14.2568 20.665 14.592 20.5262 14.8403 20.2798L21.507 13.6132C21.632 13.4892 21.7312 13.3418 21.7989 13.1793C21.8665 13.0168 21.9014 12.8425 21.9014 12.6665C21.9014 12.4905 21.8665 12.3162 21.7989 12.1537C21.7312 11.9913 21.632 11.8438 21.507 11.7198C21.2572 11.4715 20.9192 11.3321 20.567 11.3321C20.2148 11.3321 19.8768 11.4715 19.627 11.7198ZM16.0003 2.6665C13.3632 2.6665 10.7854 3.44849 8.59273 4.91358C6.40007 6.37866 4.69111 8.46104 3.68194 10.8974C2.67277 13.3337 2.40872 16.0146 2.92319 18.601C3.43766 21.1875 4.70754 23.5632 6.57224 25.4279C8.43694 27.2926 10.8127 28.5625 13.3991 29.077C15.9855 29.5914 18.6664 29.3274 21.1028 28.3182C23.5391 27.3091 25.6215 25.6001 27.0866 23.4074C28.5517 21.2148 29.3337 18.6369 29.3337 15.9998C29.3337 14.2489 28.9888 12.5151 28.3187 10.8974C27.6487 9.27972 26.6665 7.80986 25.4284 6.57175C24.1903 5.33363 22.7205 4.35151 21.1028 3.68144C19.4851 3.01138 17.7513 2.6665 16.0003 2.6665ZM16.0003 26.6665C13.8907 26.6665 11.8284 26.0409 10.0742 24.8688C8.32012 23.6968 6.95295 22.0309 6.14562 20.0818C5.33828 18.1327 5.12705 15.988 5.53862 13.9189C5.9502 11.8497 6.9661 9.94913 8.45786 8.45737C9.94962 6.96561 11.8502 5.9497 13.9194 5.53813C15.9885 5.12655 18.1332 5.33779 20.0823 6.14512C22.0314 6.95246 23.6973 8.31963 24.8693 10.0738C26.0414 11.8279 26.667 13.8902 26.667 15.9998C26.667 18.8288 25.5432 21.5419 23.5428 23.5423C21.5424 25.5427 18.8293 26.6665 16.0003 26.6665Z"
            fill="#2CB44E"
          />
        </svg>
        <div className="font-normal grow">
          <h3 className=" text-lg">User Verified</h3>
          <p className="text-gray-3 text-[16px]">
            User has been verified successfully
          </p>
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="shrink-0"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3.43451 3.43451C3.74693 3.12209 4.25346 3.12209 4.56588 3.43451L8.0002 6.86882L11.4345 3.43451C11.7469 3.12209 12.2535 3.12209 12.5659 3.43451C12.8783 3.74693 12.8783 4.25346 12.5659 4.56588L9.13157 8.0002L12.5659 11.4345C12.8783 11.7469 12.8783 12.2535 12.5659 12.5659C12.2535 12.8783 11.7469 12.8783 11.4345 12.5659L8.0002 9.13157L4.56588 12.5659C4.25346 12.8783 3.74693 12.8783 3.43451 12.5659C3.12209 12.2535 3.12209 11.7469 3.43451 11.4345L6.86882 8.0002L3.43451 4.56588C3.12209 4.25346 3.12209 3.74693 3.43451 3.43451Z"
            fill="#A0A0A1"
          />
        </svg>
      </div>,
      {
        position: "top-right",
        unstyled: true,
      }
    );
  };
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="p-6 bg-white no-x  border-0 w-fit rounded-xl">
          <DialogHeader className="hidden">
            <DialogTitle>Verify User</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-y-5">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
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
                d="M38 27.0799V27.9999C37.9988 30.1563 37.3005 32.2545 36.0093 33.9817C34.7182 35.7088 32.9033 36.9723 30.8354 37.5838C28.7674 38.1952 26.5573 38.1218 24.5345 37.3744C22.5117 36.6271 20.7847 35.246 19.611 33.4369C18.4373 31.6279 17.8798 29.4879 18.0217 27.3362C18.1636 25.1844 18.9972 23.1362 20.3983 21.4969C21.7994 19.8577 23.6928 18.7152 25.7962 18.24C27.8996 17.7648 30.1003 17.9822 32.07 18.8599M38 19.9999L28 30.0099L25 27.0099"
                stroke="#039855"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <div className="space-y-2 text-center mb-4">
              <h4 className="font-medium text-lg">Verify User</h4>
              <p className="text-gray-3">
                Are you sure you want to verify this user?
              </p>
            </div>
            <div className="flex justify-center gap-x-3 font-medium text-[16px]">
              <DialogClose asChild>
                <Button
                  variant="Colored"
                  className="px-[64px] py-4 rounded-lg border-gray-300"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                onClick={handleVerifyUser}
                className="px-[64px] py-4 rounded-lg"
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

export default ConfirmVerifyUserModal;
