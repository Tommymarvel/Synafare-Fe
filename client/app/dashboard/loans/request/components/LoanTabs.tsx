'use client';

import clsx from 'clsx';

export type LoanTab = 'customer' | 'inventory';

export default function LoanTabs({
  activeTab,
  onChange,
}: {
  activeTab: LoanTab;
  onChange: (tab: LoanTab) => void;
}) {
  return (
    <div className="mt-6 flex justify-center w-full mx-auto overflow-hidden">
      <p
        onClick={() => onChange('customer')}
        className={clsx(
          'px-6 py-2 text-xl cursor-pointer',
          activeTab === 'customer' ? 'border-b-2 border-mikado font-medium' : 'text-gray-500'
        )}
      >
        Customer Installment
      </p>
      <p
        onClick={() => onChange('inventory')}
        className={clsx(
          'px-6 py-2 text-xl cursor-pointer',
          activeTab === 'inventory' ? 'border-b-2 border-mikado font-medium' : 'text-gray-500'
        )}
      >
        Inventory Financing
      </p>
    </div>
  );
}
