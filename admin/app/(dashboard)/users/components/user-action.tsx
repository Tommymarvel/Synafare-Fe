'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { STATUSCONST } from '@/lib/constants';
import { UserStatus } from '@/types/usertypes';
import { useUserActions } from '@/hooks/useUserActions';
import { ManageGuard } from '@/components/PermissionGuard';
import { useState } from 'react';
import ConfirmActionModal from './modals/confirm-action-modal';

type booleanSetFunc = (x: boolean) => void;
const nullfunc = () => null;

const UserActionButton = ({
  id,
  firebaseUid,
  status,
  openDeclineModal = nullfunc,
  onUserUpdated,
}: {
  id: string;
  firebaseUid?: string;
  status: UserStatus;
  openDeclineModal?: booleanSetFunc;
  onUserUpdated?: () => void;
}) => {
  const { verifyUser, blockUser, deleteUser, verifying, blocking, deleting } =
    useUserActions();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: 'verify' | 'block' | 'delete';
    title: string;
    message: string;
    action: () => Promise<unknown>;
  } | null>(null);

  const handleAction = async (action: () => Promise<unknown>) => {
    try {
      await action();
      onUserUpdated?.(); // Refresh data
    } catch {
      // Error handling is done in the useUserActions hook
    }
  };

  const confirmAction = (
    type: 'verify' | 'block' | 'delete',
    title: string,
    message: string,
    action: () => Promise<unknown>
  ) => {
    setPendingAction({ type, title, message, action });
    setShowConfirmModal(true);
  };

  const executeConfirmedAction = async () => {
    if (pendingAction) {
      await handleAction(pendingAction.action);
      setShowConfirmModal(false);
      setPendingAction(null);
    }
  };

  const cancelAction = () => {
    setShowConfirmModal(false);
    setPendingAction(null);
  };

  const handleVerifyUser = () => {
    confirmAction(
      'verify',
      'Verify User',
      'Are you sure you want to verify this user? This will change their account status to verified.',
      () => verifyUser(id)
    );
  };

  const handleBlockUser = () => {
    confirmAction(
      'block',
      'Block User',
      'Are you sure you want to block this user? This will prevent them from accessing the platform.',
      () => blockUser(id)
    );
  };

  const handleDeleteUser = () => {
    const targetId = firebaseUid || id; // prefer firebaseUid for delete as backend expects it
    confirmAction(
      'delete',
      'Delete User',
      'Are you sure you want to delete this user? This action cannot be undone and will permanently remove all user data.',
      () => deleteUser(targetId)
    );
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="cursor-pointer"
            disabled={verifying || blocking || deleting}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M9.99984 10.8333C10.4601 10.8333 10.8332 10.4602 10.8332 10C10.8332 9.53977 10.4601 9.16668 9.99984 9.16668C9.5396 9.16668 9.1665 9.53977 9.1665 10C9.1665 10.4602 9.5396 10.8333 9.99984 10.8333Z"
                stroke="#98A2B3"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9.99984 5.00001C10.4601 5.00001 10.8332 4.62691 10.8332 4.16668C10.8332 3.70644 10.4601 3.33334 9.99984 3.33334C9.5396 3.33334 9.1665 3.70644 9.1665 4.16668C9.1665 4.62691 9.5396 5.00001 9.99984 5.00001Z"
                stroke="#98A2B3"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9.99984 16.6667C10.4601 16.6667 10.8332 16.2936 10.8332 15.8333C10.8332 15.3731 10.4601 15 9.99984 15C9.5396 15 9.1665 15.3731 9.1665 15.8333C9.1665 16.2936 9.5396 16.6667 9.99984 16.6667Z"
                stroke="#98A2B3"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white py-0 border-none px-0">
          <DropdownMenuItem className="border-b border-b-border-gray py-3 px-5 rounded-none">
            <a href={'/users/' + id}>View User</a>
          </DropdownMenuItem>

          {status == STATUSCONST.PENDINGVERIFICATION && (
            <ManageGuard module="users">
              <DropdownMenuItem
                onClick={handleVerifyUser}
                disabled={verifying}
                className="border-b border-b-border-gray py-3 px-5 rounded-none"
              >
                {verifying ? 'Verifying...' : 'Verify User'}
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => openDeclineModal(true)}
                className="border-b border-b-border-gray py-3 px-5 rounded-none"
              >
                Decline
              </DropdownMenuItem>
            </ManageGuard>
          )}

          {status == STATUSCONST.VERIFIED && (
            <>
             
              
              <ManageGuard module="users">
                <DropdownMenuItem
                  onClick={handleBlockUser}
                  disabled={blocking}
                  className="border-b border-b-border-gray py-3 px-5 rounded-none"
                >
                  {blocking ? 'Blocking...' : 'Block User'}
                </DropdownMenuItem>
              </ManageGuard>
            </>
          )}

          <ManageGuard module="users">
            <DropdownMenuItem
              onClick={handleDeleteUser}
              disabled={deleting}
              className="border-b border-b-border-gray py-3 px-5 rounded-none text-red-600"
            >
              {deleting ? 'Deleting...' : 'Delete User'}
            </DropdownMenuItem>
          </ManageGuard>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Confirmation Modal */}
      <ConfirmActionModal
        open={showConfirmModal}
        onOpenChange={setShowConfirmModal}
        title={pendingAction?.title || ''}
        message={pendingAction?.message || ''}
        onConfirm={executeConfirmedAction}
        onCancel={cancelAction}
        loading={verifying || blocking || deleting}
        destructive={pendingAction?.type === 'delete'}
      />
    </>
  );
};

export default UserActionButton;
