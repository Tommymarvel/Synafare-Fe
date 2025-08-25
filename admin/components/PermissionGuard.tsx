'use client';

import React, { ReactNode } from 'react';
import { usePermissions } from '@/hooks/usePermissions';

type PermissionModule =
  | 'users'
  | 'loans'
  | 'invoices'
  | 'marketplace'
  | 'transactions'
  | 'team_members';
type PermissionAction = 'view' | 'manage';

interface PermissionGuardProps {
  module: PermissionModule;
  action: PermissionAction;
  children: ReactNode;
  fallback?: ReactNode;
  requireAll?: boolean; // If true, requires all permissions; if false, requires any
  permissions?: Array<{ module: PermissionModule; action: PermissionAction }>;
}

export function PermissionGuard({
  module,
  action,
  children,
  fallback = null,
  requireAll = true,
  permissions,
}: PermissionGuardProps) {
  const { checkPermission } = usePermissions();

  // If specific permissions array is provided, check those instead
  if (permissions && permissions.length > 0) {
    const permissionResults = permissions.map(
      ({ module: permModule, action: permAction }) =>
        checkPermission(permModule, permAction)
    );

    const hasRequiredPermissions = requireAll
      ? permissionResults.every(Boolean)
      : permissionResults.some(Boolean);

    return hasRequiredPermissions ? <>{children}</> : <>{fallback}</>;
  }

  // Default single permission check
  const hasPermission = checkPermission(module, action);

  return hasPermission ? <>{children}</> : <>{fallback}</>;
}

// Convenience component for view permissions
export function ViewGuard({
  module,
  children,
  fallback = null,
}: {
  module: PermissionModule;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <PermissionGuard module={module} action="view" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

// Convenience component for manage permissions
export function ManageGuard({
  module,
  children,
  fallback = null,
}: {
  module: PermissionModule;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <PermissionGuard module={module} action="manage" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

// Component for admin-only content
export function AdminGuard({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { isAdmin } = usePermissions();

  return isAdmin() ? <>{children}</> : <>{fallback}</>;
}
