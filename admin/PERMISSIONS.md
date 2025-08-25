# Permission System Implementation

This document explains how to use the permission system implemented in the Synafare admin application.

## Overview

The permission system provides:

- User authentication with role-based permissions
- Module-specific permissions (view/manage)
- Route protection
- Component-level permission guards
- HOCs for page protection

## Permission Structure

```typescript
interface Permissions {
  users: { view: boolean; manage: boolean };
  loans: { view: boolean; manage: boolean };
  invoices: { view: boolean; manage: boolean };
  marketplace: { view: boolean; manage: boolean };
  transactions: { view: boolean; manage: boolean };
  team_members: { view: boolean; manage: boolean };
}
```

## Usage Examples

### 1. Using Permission Guards in Components

```tsx
import { PermissionGuard, ViewGuard, ManageGuard } from '@/components/PermissionGuard';

// Basic permission guard
<PermissionGuard module="users" action="manage">
  <button>Delete User</button>
</PermissionGuard>

// Convenience guards
<ViewGuard module="loans">
  <LoansList />
</ViewGuard>

<ManageGuard module="marketplace">
  <AddProductButton />
</ManageGuard>

// Multiple permissions (requires any)
<PermissionGuard
  module="users"
  action="view"
  permissions={[
    { module: 'users', action: 'view' },
    { module: 'loans', action: 'view' }
  ]}
  requireAll={false}
>
  <DashboardWidget />
</PermissionGuard>
```

### 2. Using Permission Hooks

```tsx
import { usePermissions } from '@/hooks/usePermissions';

function MyComponent() {
  const { checkPermission, canView, canManage, isAdmin } = usePermissions();

  const canDeleteUser = checkPermission('users', 'manage');
  const canViewLoans = canView('loans');
  const canManageTeam = canManage('team_members');
  const userIsAdmin = isAdmin();

  return (
    <div>
      {canViewLoans && <LoansSection />}
      {canDeleteUser && <DeleteButton />}
      {userIsAdmin && <AdminPanel />}
    </div>
  );
}
```

### 3. Protecting Pages with HOCs

```tsx
import {
  withPermission,
  withMultiplePermissions,
  withAdminPermission,
} from '@/components/withPermission';

// Single permission
const UsersPage = withPermission(UsersPageComponent, {
  module: 'users',
  action: 'view',
  redirectTo: '/dashboard',
});

// Multiple permissions
const DashboardPage = withMultiplePermissions(DashboardPageComponent, {
  permissions: [
    { module: 'users', action: 'view' },
    { module: 'loans', action: 'view' },
  ],
  requireAll: false, // User needs ANY of these permissions
  redirectTo: '/login',
});

// Admin only
const AdminSettingsPage = withAdminPermission(AdminSettingsPageComponent, {
  redirectTo: '/dashboard',
});
```

### 4. Route Protection

The `RouteGuard` component automatically protects routes based on the configuration in `lib/routePermissions.ts`. Add it to your layout:

```tsx
import { RouteGuard } from '@/components/RouteGuard';

export default function Layout({ children }) {
  return (
    <AuthProvider>
      <RouteGuard>{children}</RouteGuard>
    </AuthProvider>
  );
}
```

### 5. Conditional Rendering in Components

```tsx
function ActionButtons() {
  const { canManage } = usePermissions();

  return (
    <div>
      <button>View Details</button>
      {canManage('users') && <button>Edit User</button>}
      {canManage('users') && <button>Delete User</button>}
    </div>
  );
}
```

### 6. Navigation with Permissions

The sidebar navigation automatically hides/shows menu items based on user permissions. See `components/sidenav.tsx` for implementation.

## Adding New Permissions

1. Update the `Permissions` interface in `context/AuthContext.tsx`
2. Add route configuration in `lib/routePermissions.ts`
3. Update navigation in `components/sidenav.tsx`
4. Use permission guards in components

## Best Practices

1. **Always use permission guards** for sensitive actions
2. **Check permissions on both client and server side**
3. **Use specific permissions** rather than role-based checks when possible
4. **Provide fallback content** for better user experience
5. **Test with different permission levels** during development

## Error Handling

The permission system includes proper error handling and loading states. Users without permissions see appropriate fallback content or are redirected to accessible pages.
