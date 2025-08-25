'use client';

import React from 'react';
import { withPermission } from '@/components/withPermission';
import {
  PermissionGuard,
  ViewGuard,
  ManageGuard,
} from '@/components/PermissionGuard';
import { usePermissions } from '@/hooks/usePermissions';
import PageIntro from '@/components/page-intro';
import CardWrapper from '@/components/cardWrapper';

/**
 * Example component showing how to implement permissions in a loan management page
 * This demonstrates various permission patterns and best practices
 */
function LoanManagementPageComponent() {
  const { canManage, checkPermission, isAdmin } = usePermissions();

  return (
    <div className="space-y-6">
      <PageIntro>Loan Management</PageIntro>

      {/* Permission-based content sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Loan Overview - View permission required */}
        <ViewGuard module="loans">
          <CardWrapper>
            <h2 className="text-xl font-semibold mb-4">Loan Overview</h2>
            <div className="space-y-2">
              <p>Total Active Loans: 125</p>
              <p>Pending Approvals: 12</p>
              <p>Overdue Loans: 5</p>
            </div>
          </CardWrapper>
        </ViewGuard>

        {/* Loan Actions - Manage permission required */}
        <ManageGuard module="loans">
          <CardWrapper>
            <h2 className="text-xl font-semibold mb-4">Loan Actions</h2>
            <div className="space-y-2">
              <button className="w-full bg-blue-500 text-white py-2 px-4 rounded">
                Approve Pending Loans
              </button>
              <button className="w-full bg-yellow-500 text-white py-2 px-4 rounded">
                Review Applications
              </button>
              <button className="w-full bg-red-500 text-white py-2 px-4 rounded">
                Mark as Overdue
              </button>
            </div>
          </CardWrapper>
        </ManageGuard>
      </div>

      {/* Conditional action buttons based on permissions */}
      <CardWrapper>
        <h2 className="text-xl font-semibold mb-4">Available Actions</h2>
        <div className="flex flex-wrap gap-2">
          {/* Always available action */}
          <button className="bg-gray-500 text-white py-2 px-4 rounded">
            View Loan Details
          </button>

          {/* Conditional actions based on permissions */}
          {checkPermission('loans', 'manage') && (
            <>
              <button className="bg-green-500 text-white py-2 px-4 rounded">
                Approve Loan
              </button>
              <button className="bg-red-500 text-white py-2 px-4 rounded">
                Reject Loan
              </button>
            </>
          )}

          {canManage('loans') && (
            <button className="bg-purple-500 text-white py-2 px-4 rounded">
              Modify Terms
            </button>
          )}

          {isAdmin() && (
            <button className="bg-black text-white py-2 px-4 rounded">
              Admin Override
            </button>
          )}
        </div>
      </CardWrapper>

      {/* Multiple permission requirements */}
      <PermissionGuard
        module="loans"
        action="manage"
        permissions={[
          { module: 'loans', action: 'manage' },
          { module: 'transactions', action: 'view' },
        ]}
        requireAll={true}
        fallback={
          <CardWrapper>
            <div className="text-center py-8">
              <p className="text-gray-600">
                You need both loan management and transaction view permissions
                to access advanced loan features.
              </p>
            </div>
          </CardWrapper>
        }
      >
        <CardWrapper>
          <h2 className="text-xl font-semibold mb-4">
            Advanced Loan Management
          </h2>
          <p>
            This section requires both loan management and transaction view
            permissions.
          </p>
          <div className="mt-4 space-y-2">
            <button className="w-full bg-indigo-500 text-white py-2 px-4 rounded">
              Bulk Loan Processing
            </button>
            <button className="w-full bg-cyan-500 text-white py-2 px-4 rounded">
              Financial Analysis
            </button>
          </div>
        </CardWrapper>
      </PermissionGuard>

      {/* Admin-only section */}
      <PermissionGuard
        module="loans"
        action="manage"
        permissions={[]}
        fallback={
          <CardWrapper>
            <div className="text-center py-8">
              <p className="text-gray-600">
                Admin access required for system configuration.
              </p>
            </div>
          </CardWrapper>
        }
      >
        {isAdmin() && (
          <CardWrapper>
            <h2 className="text-xl font-semibold mb-4">System Configuration</h2>
            <p>Admin-only loan system settings and configurations.</p>
            <div className="mt-4 space-y-2">
              <button className="w-full bg-red-600 text-white py-2 px-4 rounded">
                Reset Loan Algorithms
              </button>
              <button className="w-full bg-orange-600 text-white py-2 px-4 rounded">
                Configure Interest Rates
              </button>
            </div>
          </CardWrapper>
        )}
      </PermissionGuard>
    </div>
  );
}

// Export the component wrapped with permission protection
// This ensures the entire page is protected and users without 'loans.view' permission cannot access it
const LoanManagementPage = withPermission(LoanManagementPageComponent, {
  module: 'loans',
  action: 'view',
  redirectTo: '/dashboard',
});

export default LoanManagementPage;
