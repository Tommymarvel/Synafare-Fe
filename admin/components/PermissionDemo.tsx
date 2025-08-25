'use client';

import React from 'react';
import {
  PermissionGuard,
  ViewGuard,
  ManageGuard,
  AdminGuard,
} from './PermissionGuard';
import { usePermissions } from '@/hooks/usePermissions';

/**
 * Demo component showing various ways to use the permission system
 * This component can be used for testing and as a reference
 */
export function PermissionDemo() {
  const {
    checkPermission,
    canView,
    canManage,
    isAdmin,
    getUserRole,
    getAllPermissions,
  } = usePermissions();

  const userRole = getUserRole();
  const allPermissions = getAllPermissions();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Permission System Demo</h1>

      {/* User Info Section */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Current User Info</h2>
        <p>
          <strong>Role:</strong> {userRole}
        </p>
        <p>
          <strong>Is Admin:</strong> {isAdmin() ? 'Yes' : 'No'}
        </p>
        <details className="mt-2">
          <summary className="cursor-pointer font-medium">
            View All Permissions
          </summary>
          <pre className="mt-2 text-sm bg-white p-2 rounded">
            {JSON.stringify(allPermissions, null, 2)}
          </pre>
        </details>
      </div>

      {/* Permission Guards Demo */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Permission Guards Demo</h2>

        {/* Basic Permission Guard */}
        <div className="border p-4 rounded">
          <h3 className="font-medium mb-2">Basic Permission Guard</h3>
          <PermissionGuard
            module="users"
            action="manage"
            fallback={<p className="text-red-500">You cannot manage users</p>}
          >
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              Manage Users (requires users.manage)
            </button>
          </PermissionGuard>
        </div>

        {/* View Guard */}
        <div className="border p-4 rounded">
          <h3 className="font-medium mb-2">View Guard</h3>
          <ViewGuard
            module="loans"
            fallback={<p className="text-red-500">You cannot view loans</p>}
          >
            <div className="bg-green-100 p-2 rounded">
              ✅ You can view loans!
            </div>
          </ViewGuard>
        </div>

        {/* Manage Guard */}
        <div className="border p-4 rounded">
          <h3 className="font-medium mb-2">Manage Guard</h3>
          <ManageGuard
            module="marketplace"
            fallback={
              <p className="text-red-500">You cannot manage marketplace</p>
            }
          >
            <div className="bg-yellow-100 p-2 rounded">
              ⚙️ You can manage marketplace!
            </div>
          </ManageGuard>
        </div>

        {/* Admin Guard */}
        <div className="border p-4 rounded">
          <h3 className="font-medium mb-2">Admin Guard</h3>
          <AdminGuard
            fallback={<p className="text-red-500">Admin access required</p>}
          >
            <div className="bg-purple-100 p-2 rounded">
              👑 Admin-only content visible!
            </div>
          </AdminGuard>
        </div>

        {/* Multiple Permissions */}
        <div className="border p-4 rounded">
          <h3 className="font-medium mb-2">
            Multiple Permissions (requires ANY)
          </h3>
          <PermissionGuard
            module="users"
            action="view"
            permissions={[
              { module: 'users', action: 'view' },
              { module: 'loans', action: 'view' },
              { module: 'marketplace', action: 'view' },
            ]}
            requireAll={false}
            fallback={
              <p className="text-red-500">
                You need view access to users, loans, or marketplace
              </p>
            }
          >
            <div className="bg-blue-100 p-2 rounded">
              🔍 You can view at least one of: users, loans, or marketplace
            </div>
          </PermissionGuard>
        </div>

        {/* Multiple Permissions - Require All */}
        <div className="border p-4 rounded">
          <h3 className="font-medium mb-2">
            Multiple Permissions (requires ALL)
          </h3>
          <PermissionGuard
            module="users"
            action="view"
            permissions={[
              { module: 'users', action: 'manage' },
              { module: 'loans', action: 'manage' },
            ]}
            requireAll={true}
            fallback={
              <p className="text-red-500">
                You need manage access to both users AND loans
              </p>
            }
          >
            <div className="bg-indigo-100 p-2 rounded">
              🔒 You can manage both users and loans!
            </div>
          </PermissionGuard>
        </div>
      </div>

      {/* Hook Usage Demo */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Hook Usage Demo</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="border p-4 rounded">
            <h3 className="font-medium mb-2">View Permissions</h3>
            <ul className="space-y-1 text-sm">
              <li>Users: {canView('users') ? '✅' : '❌'}</li>
              <li>Loans: {canView('loans') ? '✅' : '❌'}</li>
              <li>Invoices: {canView('invoices') ? '✅' : '❌'}</li>
              <li>Marketplace: {canView('marketplace') ? '✅' : '❌'}</li>
              <li>Transactions: {canView('transactions') ? '✅' : '❌'}</li>
              <li>Team Members: {canView('team_members') ? '✅' : '❌'}</li>
            </ul>
          </div>

          <div className="border p-4 rounded">
            <h3 className="font-medium mb-2">Manage Permissions</h3>
            <ul className="space-y-1 text-sm">
              <li>Users: {canManage('users') ? '✅' : '❌'}</li>
              <li>Loans: {canManage('loans') ? '✅' : '❌'}</li>
              <li>Invoices: {canManage('invoices') ? '✅' : '❌'}</li>
              <li>Marketplace: {canManage('marketplace') ? '✅' : '❌'}</li>
              <li>Transactions: {canManage('transactions') ? '✅' : '❌'}</li>
              <li>Team Members: {canManage('team_members') ? '✅' : '❌'}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Conditional Rendering Demo */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Conditional Rendering Demo</h2>

        <div className="border p-4 rounded">
          <h3 className="font-medium mb-2">Action Buttons</h3>
          <div className="flex space-x-2">
            <button className="bg-gray-500 text-white px-3 py-1 rounded text-sm">
              View (Always Available)
            </button>

            {checkPermission('users', 'manage') && (
              <button className="bg-yellow-500 text-white px-3 py-1 rounded text-sm">
                Edit (Manage Users)
              </button>
            )}

            {checkPermission('users', 'manage') && (
              <button className="bg-red-500 text-white px-3 py-1 rounded text-sm">
                Delete (Manage Users)
              </button>
            )}

            {isAdmin() && (
              <button className="bg-purple-500 text-white px-3 py-1 rounded text-sm">
                Admin Action
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
