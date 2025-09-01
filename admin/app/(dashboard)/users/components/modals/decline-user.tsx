import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogClose,
} from '@/components/ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import { useState } from 'react';
import Button from '@/components/button';
import ConfirmDeclineUser from './confirm-decline-user';

const DeclineUserModal = ({
  open,
  onOpenChange,
  userId,
  onUserUpdated,
}: {
  open: boolean;
  onOpenChange: (x: boolean) => void;
  userId?: string;
  onUserUpdated?: () => void;
}) => {
  const [confirmDeclineModal, setConfirmDeclineModal] = useState(false);
  const [reason, setReason] = useState('');

  const handleDeclineUser = function () {
    if (!reason.trim()) {
      // You might want to show an error here
      return;
    }

    onOpenChange(false);
    setConfirmDeclineModal(true);
  };

  const handleSuccess = () => {
    setReason('');
    setConfirmDeclineModal(false);
    onUserUpdated?.();
  };

  const handleCancel = () => {
    setReason('');
    onOpenChange(false);
  };
  return (
    <>
      <ConfirmDeclineUser
        onOpenChange={setConfirmDeclineModal}
        open={confirmDeclineModal}
        userId={userId}
        reason={reason}
        onSuccess={handleSuccess}
      />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="px-[27px] bg-white no-x py-0 max-w-[555px] pb-[17px] border-0 rounded-xl">
          <DialogHeader className="hidden">
            <DialogTitle>Decline Request</DialogTitle>
          </DialogHeader>
          <div className="border-b-2 border-b-gray-4 pt-[33px] pb-4 flex justify-between itesm-center">
            <h1 className="text-xl font-medium">Decline Request</h1>
            <DialogClose asChild>
              <span className="block cursor-pointer" onClick={handleCancel}>
                <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
                  <path
                    d="M10.9969 28.5077C10.3473 29.1572 10.3163 30.317 11.0124 30.982C11.6775 31.6778 12.8531 31.6469 13.5028 30.9974L21.0048 23.4974L28.5069 30.9974C29.172 31.6624 30.3167 31.6778 30.9818 30.982C31.6779 30.317 31.6624 29.1572 30.9973 28.4923L23.4952 20.9923L30.9973 13.5077C31.6624 12.8273 31.6779 11.683 30.9818 11.018C30.3167 10.3222 29.172 10.3376 28.5069 11.0026L21.0048 18.5026L13.5028 11.0026C12.8531 10.3531 11.6775 10.3222 11.0124 11.018C10.3163 11.683 10.3473 12.8428 10.9969 13.4923L18.499 20.9923L10.9969 28.5077Z"
                    fill="#344054"
                  />
                </svg>
              </span>
            </DialogClose>
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="font-medium block">Reason for Decline</label>

              <textarea
                placeholder="Enter reason for declining this user..."
                className="placeholder:text-gray-3 border border-gray-300 p-4 rounded-md w-full h-[131px]"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>

            <div className="flex gap-x-4  mt-5 font-medium text-[16px] justify-end">
              <DialogClose asChild>
                <Button
                  variant="Colored"
                  className="px-[64px] py-4"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </DialogClose>

              <Button
                onClick={handleDeclineUser}
                className="px-[64px] py-4"
                disabled={!reason.trim()}
              >
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeclineUserModal;
