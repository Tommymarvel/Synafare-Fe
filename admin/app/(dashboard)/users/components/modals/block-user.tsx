import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogClose,
} from '@/components/ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import Button from '@/components/button';
import { useUserActions } from '@/hooks/useUserActions';
import { useRouter } from 'next/navigation';
const ConfirmBlockUser = ({
  open,
  onOpenChange,
  userId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId?: string;
}) => {
  const { blockUser, blocking } = useUserActions();
  const router = useRouter();

  const handleBlock = async () => {
    if (!userId) return;
    try {
      await blockUser(userId);
      onOpenChange(false);
      router.refresh();
    } catch {}
  };
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="p-6 bg-white no-x  border-0 w-fit rounded-xl">
          <DialogHeader className="hidden">
            <DialogTitle>Decline User</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-y-5">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
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
                d="M27.9998 24.0002V28.0002M27.9998 32.0002H28.0098M26.2898 18.8602L17.8198 33.0002C17.6451 33.3026 17.5527 33.6455 17.5518 33.9947C17.5508 34.3439 17.6413 34.6873 17.8142 34.9907C17.9871 35.2941 18.2365 35.547 18.5375 35.7241C18.8385 35.9012 19.1806 35.9964 19.5298 36.0002H36.4698C36.819 35.9964 37.1611 35.9012 37.4621 35.7241C37.7631 35.547 38.0124 35.2941 38.1854 34.9907C38.3583 34.6873 38.4488 34.3439 38.4478 33.9947C38.4468 33.6455 38.3544 33.3026 38.1798 33.0002L29.7098 18.8602C29.5315 18.5663 29.2805 18.3233 28.981 18.1547C28.6814 17.9861 28.3435 17.8975 27.9998 17.8975C27.656 17.8975 27.3181 17.9861 27.0186 18.1547C26.7191 18.3233 26.468 18.5663 26.2898 18.8602Z"
                stroke="#CA8D1B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <div className="space-y-2 text-center mb-4">
              <h4 className="font-medium text-lg">Block User</h4>
              <p className="text-gray-3">
                Are you sure you want to block this user?
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
                onClick={handleBlock}
                disabled={blocking}
                className="px-[64px] py-4 rounded-lg bg-[#F9E8E8] text-[#C21A18] hover:bg-[#C21A18]/30"
              >
                {blocking ? 'Blocking...' : 'Yes, Block'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConfirmBlockUser;
