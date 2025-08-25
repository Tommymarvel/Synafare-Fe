import { useAuth } from '@/context/AuthContext';

type PermissionModule =
  | 'users'
  | 'loans'
  | 'invoices'
  | 'marketplace'
  | 'transactions'
  | 'team_members';
type PermissionAction = 'view' | 'manage';

export function usePermissions() {
  const { hasPermission, canView, canManage, user } = useAuth();

  const checkPermission = (
    module: PermissionModule,
    action: PermissionAction
  ): boolean => {
    return hasPermission(module, action);
  };

  const checkViewPermission = (module: PermissionModule): boolean => {
    return canView(module);
  };

  const checkManagePermission = (module: PermissionModule): boolean => {
    return canManage(module);
  };

  const isAdmin = (): boolean => {
    return user?.role === 'admin';
  };

  const getUserRole = (): string | null => {
    return user?.role || null;
  };

  const getAllPermissions = () => {
    return user?.permissions || null;
  };

  return {
    checkPermission,
    checkViewPermission,
    checkManagePermission,
    isAdmin,
    getUserRole,
    getAllPermissions,
    hasPermission,
    canView,
    canManage,
  };
}
