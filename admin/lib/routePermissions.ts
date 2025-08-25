type PermissionModule =
  | 'users'
  | 'loans'
  | 'invoices'
  | 'marketplace'
  | 'transactions'
  | 'team_members';
type PermissionAction = 'view' | 'manage';

export interface Permissions {
  users: {
    view: boolean;
    manage: boolean;
  };
  loans: {
    view: boolean;
    manage: boolean;
  };
  invoices: {
    view: boolean;
    manage: boolean;
  };
  marketplace: {
    view: boolean;
    manage: boolean;
  };
  transactions: {
    view: boolean;
    manage: boolean;
  };
  team_members: {
    view: boolean;
    manage: boolean;
  };
}

export interface RoutePermission {
  module: PermissionModule;
  action: PermissionAction;
}

export interface RouteConfig {
  path: string;
  permissions?: RoutePermission[];
  requireAll?: boolean; // If true, requires all permissions; if false, requires any
  adminOnly?: boolean;
  redirectTo?: string;
}

// Define route permissions for the application
export const routePermissions: RouteConfig[] = [
  // Dashboard routes
  {
    path: '/dashboard',
    permissions: [
      { module: 'users', action: 'view' },
      { module: 'loans', action: 'view' },
      { module: 'transactions', action: 'view' },
    ],
    requireAll: false, // User needs any of these permissions to view dashboard
  },

  // User management routes
  {
    path: '/users',
    permissions: [{ module: 'users', action: 'view' }],
  },
  {
    path: '/users/[id]',
    permissions: [{ module: 'users', action: 'view' }],
  },

  // Loan management routes
  {
    path: '/loans',
    permissions: [{ module: 'loans', action: 'view' }],
  },
  {
    path: '/loans/[id]',
    permissions: [{ module: 'loans', action: 'view' }],
  },
  {
    path: '/loan-requests',
    permissions: [{ module: 'loans', action: 'view' }],
  },
  {
    path: '/loan-requests/[id]',
    permissions: [{ module: 'loans', action: 'view' }],
  },

  // Invoice routes
  {
    path: '/invoice',
    permissions: [{ module: 'invoices', action: 'view' }],
  },

  // Marketplace routes
  {
    path: '/marketplace',
    permissions: [{ module: 'marketplace', action: 'view' }],
  },
  {
    path: '/marketplace/product',
    permissions: [{ module: 'marketplace', action: 'view' }],
  },

  // Wallet/Transactions routes
  {
    path: '/wallet',
    permissions: [{ module: 'transactions', action: 'view' }],
  },

  // Settings routes (admin or team member management)
  {
    path: '/settings',
    permissions: [{ module: 'team_members', action: 'view' }],
  },
  {
    path: '/settings/teams',
    permissions: [{ module: 'team_members', action: 'manage' }],
  },
  {
    path: '/settings/categories',
    adminOnly: true, // Only admins can manage categories
  },
];

export function getRoutePermissions(pathname: string): RouteConfig | undefined {
  // First try exact match
  let routeConfig = routePermissions.find((route) => route.path === pathname);

  if (!routeConfig) {
    // Try dynamic route matching
    routeConfig = routePermissions.find((route) => {
      if (route.path.includes('[') && route.path.includes(']')) {
        const routeParts = route.path.split('/');
        const pathParts = pathname.split('/');

        if (routeParts.length !== pathParts.length) return false;

        return routeParts.every((part, index) => {
          if (part.startsWith('[') && part.endsWith(']')) {
            return true; // Dynamic segment matches anything
          }
          return part === pathParts[index];
        });
      }
      return false;
    });
  }

  return routeConfig;
}

export function checkRoutePermission(
  pathname: string,
  userPermissions: Permissions | null,
  userRole: string
): boolean {
  const routeConfig = getRoutePermissions(pathname);

  if (!routeConfig) {
    // If no specific permissions defined, allow access
    return true;
  }

  // Check if admin-only route
  if (routeConfig.adminOnly) {
    return userRole === 'admin';
  }

  // Check permissions
  if (routeConfig.permissions && routeConfig.permissions.length > 0) {
    const permissionResults = routeConfig.permissions.map(
      ({ module, action }) => {
        return userPermissions?.[module]?.[action] ?? false;
      }
    );

    return routeConfig.requireAll
      ? permissionResults.every(Boolean)
      : permissionResults.some(Boolean);
  }

  return true;
}
