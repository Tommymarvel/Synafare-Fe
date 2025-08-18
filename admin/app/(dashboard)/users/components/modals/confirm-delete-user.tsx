import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogClose,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import Button from "@/components/button";
const ConfirmDeleteUser = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="p-6 bg-white no-x  border-0 w-fit rounded-xl">
          <DialogHeader className="hidden">
            <DialogTitle>Decline User</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-y-5">
            <svg
              width="56"
              height="56"
              viewBox="0 0 56 56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="4" y="4" width="48" height="48" rx="24" fill="#FEE4E2" />
              <rect
                x="4"
                y="4"
                width="48"
                height="48"
                rx="24"
                stroke="#FEF3F2"
                strokeWidth="8"
              />
              <path
                d="M28 24V28M28 32H28.01M38 28C38 33.5228 33.5228 38 28 38C22.4772 38 18 33.5228 18 28C18 22.4772 22.4772 18 28 18C33.5228 18 38 22.4772 38 28Z"
                stroke="#D92D20"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <div className="space-y-2 text-center mb-4">
              <h4 className="font-medium text-lg">Delete User</h4>
              <p className="text-gray-3 max-w-[352px]">
                Are you sure you want to delete this user? This action can not
                be undone.
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
              <Button className="px-[64px] py-4 rounded-lg bg-[#F9E8E8] text-[#C21A18] hover:bg-[#C21A18]/30">
                Yes, Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConfirmDeleteUser;
