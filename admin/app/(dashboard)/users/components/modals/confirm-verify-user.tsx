import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogClose,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import Button from "@/components/button";
import { toast } from "sonner";
import ToastDivComponent from "@/components/toast.component";
const ConfirmVerifyUserModal = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const handleVerifyUser = function () {
    onOpenChange(false);

    toast.custom(
      (id) => (
        <ToastDivComponent
          title="New category created"
          sub="Your category has been added to inventory"
          id={id}
        />
      ),
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
