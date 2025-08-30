'use client';

import EmptyState from '@/app/components/EmptyState';

export default function CustomersEmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <EmptyState
      title="No Customer"
      description="You do not have any customer. Click 'Add Customer' to add one"
      actionLabel="Add Customer"
      onAction={onAdd}
      illustration='/empty.svg'
      illustrationWidth={220}
      illustrationHeight={140}
      className="rounded-xl border p-6 min-h-[60vh] grid place-items-center"
    />
  );
}
