// app/dashboard/loans/components/EmptyState.tsx
'use client';

import React from 'react';
import EmptyState, { EmptyStateConfigs } from '@/app/components/EmptyState';
import ScheduleIllustration from '@/app/assets/repayment-illustration.svg';

export function LoansEmptyState() {
  return (
    <EmptyState
      {...EmptyStateConfigs.loans}
      illustration={ScheduleIllustration}
    />
  );
}
