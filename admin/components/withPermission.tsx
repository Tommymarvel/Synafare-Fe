'use client';

import React, { ComponentType, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuth } from '@/context/AuthContext';

type PermissionModule =
  | 'users'
  | 'loans'
  | 'invoices'
  | 'marketplace'
  | 'transactions'
  | 'team_members';
type PermissionAction = 'view' | 'manage';

interface PermissionConfig {
  module: PermissionModule;
  action: PermissionAction;
  redirectTo?: string;
  fallbackComponent?: ComponentType;
}

interface MultiplePermissionConfig {
  permissions: Array<{ module: PermissionModule; action: PermissionAction }>;
  requireAll?: boolean;
  redirectTo?: string;
  fallbackComponent?: ComponentType;
}

// Default unauthorized component
const DefaultUnauthorized = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
      <p className="text-gray-600 mb-4">
        You don&apos;t have permission to view this page.
      </p>
      <button
        onClick={() => window.history.back()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Go Back
      </button>
    </div>
  </div>
);

// HOC for single permission check
export function withPermission<P extends object>(
  WrappedComponent: ComponentType<P>,
  config: PermissionConfig
) {
  return function PermissionProtectedComponent(props: P) {
    const { checkPermission } = usePermissions();
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
      if (loading) return;

      if (!user) {
        if (config.redirectTo) {
          router.push(config.redirectTo);
        } else {
          router.push('/login');
        }
        return;
      }

      const hasPermission = checkPermission(config.module, config.action);
      setIsAuthorized(hasPermission);

      if (!hasPermission && config.redirectTo) {
        router.push(config.redirectTo);
      }
    }, [user, loading, router, checkPermission]);

    if (loading || isAuthorized === null) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (!isAuthorized) {
      const FallbackComponent = config.fallbackComponent || DefaultUnauthorized;
      return <FallbackComponent />;
    }

    return <WrappedComponent {...props} />;
  };
}

// HOC for multiple permission checks
export function withMultiplePermissions<P extends object>(
  WrappedComponent: ComponentType<P>,
  config: MultiplePermissionConfig
) {
  return function MultiplePermissionProtectedComponent(props: P) {
    const { checkPermission } = usePermissions();
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
      if (loading) return;

      if (!user) {
        if (config.redirectTo) {
          router.push(config.redirectTo);
        } else {
          router.push('/login');
        }
        return;
      }

      const permissionResults = config.permissions.map(({ module, action }) =>
        checkPermission(module, action)
      );

      const hasRequiredPermissions = config.requireAll
        ? permissionResults.every(Boolean)
        : permissionResults.some(Boolean);

      setIsAuthorized(hasRequiredPermissions);

      if (!hasRequiredPermissions && config.redirectTo) {
        router.push(config.redirectTo);
      }
    }, [user, loading, router, checkPermission]);

    if (loading || isAuthorized === null) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (!isAuthorized) {
      const FallbackComponent = config.fallbackComponent || DefaultUnauthorized;
      return <FallbackComponent />;
    }

    return <WrappedComponent {...props} />;
  };
}

// HOC for admin-only pages
export function withAdminPermission<P extends object>(
  WrappedComponent: ComponentType<P>,
  config?: {
    redirectTo?: string;
    fallbackComponent?: ComponentType;
  }
) {
  return function AdminProtectedComponent(props: P) {
    const { isAdmin } = usePermissions();
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
      if (loading) return;

      if (!user) {
        if (config?.redirectTo) {
          router.push(config.redirectTo);
        } else {
          router.push('/login');
        }
        return;
      }

      const hasAdminPermission = isAdmin();
      setIsAuthorized(hasAdminPermission);

      if (!hasAdminPermission && config?.redirectTo) {
        router.push(config.redirectTo);
      }
    }, [user, loading, router, isAdmin]);

    if (loading || isAuthorized === null) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (!isAuthorized) {
      const FallbackComponent =
        config?.fallbackComponent || DefaultUnauthorized;
      return <FallbackComponent />;
    }

    return <WrappedComponent {...props} />;
  };
}
