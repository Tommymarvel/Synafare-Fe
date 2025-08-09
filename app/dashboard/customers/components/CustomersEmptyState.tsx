'use client';

import Image from 'next/image';
import EmptyStateIllustration from '@/app/assets/empty-customers.svg';

export default function CustomersEmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="rounded-xl border p-6 min-h-[60vh] grid place-items-center">
      <div className="text-center">
        <Image
          src={EmptyStateIllustration}
          alt=""
          width={220}
          height={140}
          className="mx-auto"
        />
        <h3 className="mt-6 text-raisin font-semibold">No Customer</h3>
        <p className="mt-1 text-sm text-raisin/70">
          You do not have any customer. Click “Add Customer” to add one
        </p>
        <button
          onClick={onAdd}
          className="mt-6 inline-flex items-center justify-center rounded-md bg-mikado text-white px-6 py-3 hover:bg-mikado/90"
        >
          Add Customer
        </button>
      </div>
    </div>
  );
}
