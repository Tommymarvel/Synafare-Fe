import { useState } from 'react';
import { UsersService, UpdateUserData } from '@/lib/services/usersService';
import { APIUser } from '@/types/usertypes';
import { toast } from 'sonner';

interface UseUserActionsReturn {
  // Action states
  verifying: boolean;
  declining: boolean;
  blocking: boolean;
  updating: boolean;
  deleting: boolean;

  // Action methods
  verifyUser: (userId: string) => Promise<APIUser | null>;
  declineUser: (userId: string, reason?: string) => Promise<APIUser | null>;
  blockUser: (userId: string) => Promise<APIUser | null>;
  updateUser: (
    userId: string,
    userData: UpdateUserData
  ) => Promise<APIUser | null>;
  deleteUser: (userId: string) => Promise<boolean>;

  // Generic action method
  executeAction: <T>(
    action: () => Promise<T>,
    successMessage: string,
    errorMessage: string
  ) => Promise<T>;
}

export function useUserActions(): UseUserActionsReturn {
  const [verifying, setVerifying] = useState(false);
  const [declining, setDeclining] = useState(false);
  const [blocking, setBlocking] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const executeAction = async <T>(
    action: () => Promise<T>,
    successMessage: string,
    errorMessage: string
  ): Promise<T> => {
    try {
      const result = await action();
      toast.success(successMessage);
      return result;
    } catch (error) {
      console.error('User action error:', error);
      const message = error instanceof Error ? error.message : errorMessage;
      toast.error(message);
      throw error;
    }
  };

  const verifyUser = async (userId: string): Promise<APIUser | null> => {
    setVerifying(true);
    try {
      return await executeAction(
        () => UsersService.verifyUser(userId),
        'User verified successfully!',
        'Failed to verify user'
      );
    } finally {
      setVerifying(false);
    }
  };

  const declineUser = async (userId: string, reason?: string): Promise<APIUser | null> => {
    setDeclining(true);
    try {
      return await executeAction(
        () => UsersService.declineUser(userId, reason),
        'User declined successfully!',
        'Failed to decline user'
      );
    } finally {
      setDeclining(false);
    }
  };

  const blockUser = async (userId: string): Promise<APIUser | null> => {
    setBlocking(true);
    try {
      return await executeAction(
        () => UsersService.blockUser(userId),
        'User blocked successfully!',
        'Failed to block user'
      );
    } finally {
      setBlocking(false);
    }
  };

  const updateUser = async (
    userId: string,
    userData: UpdateUserData
  ): Promise<APIUser | null> => {
    setUpdating(true);
    try {
      return await executeAction(
        () => UsersService.updateUser(userId, userData),
        'User updated successfully!',
        'Failed to update user'
      );
    } finally {
      setUpdating(false);
    }
  };

  const deleteUser = async (userId: string): Promise<boolean> => {
    setDeleting(true);
    try {
      await executeAction(
        () => UsersService.deleteUser(userId),
        'User deleted successfully!',
        'Failed to delete user'
      );
      return true;
    } catch {
      return false;
    } finally {
      setDeleting(false);
    }
  };

  return {
    // States
    verifying,
    declining,
    blocking,
    updating,
    deleting,

    // Actions
    verifyUser,
    declineUser,
    blockUser,
    updateUser,
    deleteUser,
    executeAction,
  };
}

// Hook for individual user actions with confirmation
export function useUserActionWithConfirmation() {
  const userActions = useUserActions();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    action: () => Promise<unknown>;
    title: string;
    message: string;
  } | null>(null);

  const confirmAction = async () => {
    if (pendingAction) {
      try {
        await pendingAction.action();
        setShowConfirmDialog(false);
        setPendingAction(null);
      } catch {
        // Error handling is done in the action itself
      }
    }
  };

  const requestConfirmation = (
    action: () => Promise<unknown>,
    title: string,
    message: string
  ) => {
    setPendingAction({ action, title, message });
    setShowConfirmDialog(true);
  };

  const cancelAction = () => {
    setShowConfirmDialog(false);
    setPendingAction(null);
  };

  return {
    ...userActions,
    showConfirmDialog,
    pendingAction,
    confirmAction,
    requestConfirmation,
    cancelAction,
  };
}
