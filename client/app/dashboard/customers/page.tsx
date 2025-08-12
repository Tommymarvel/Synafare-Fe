'use client';

import { UsersRound } from 'lucide-react';
import { useCustomersList } from './hooks/useCustomers';
import CustomersEmptyState from './components/CustomersEmptyState';
import CustomersTable from './components/CustomersTable';
import AddCustomerModal from './components/AddCustomerModal';
import { useState } from 'react';

export default function CustomersPage() {
  const { customers, total, isLoading, error, refresh } = useCustomersList();
   const [showAdd, setShowAdd] = useState(false);

  return (
    <div className=" space-y-6">
      {/* header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium text-raisin">Customers</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2.5 px-3 py-2 bg-mikado text-raisin rounded-lg hover:bg-yellow-600"
        >
          {' '}
          <span className="text-xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M10.8337 7.49984C10.8337 7.0396 10.4606 6.6665 10.0003 6.6665C9.54009 6.6665 9.16699 7.0396 9.16699 7.49984V9.1665H7.50033C7.04009 9.1665 6.66699 9.5396 6.66699 9.99984C6.66699 10.4601 7.04009 10.8332 7.50033 10.8332H9.16699V12.4998C9.16699 12.9601 9.54009 13.3332 10.0003 13.3332C10.4606 13.3332 10.8337 12.9601 10.8337 12.4998V10.8332H12.5003C12.9606 10.8332 13.3337 10.4601 13.3337 9.99984C13.3337 9.5396 12.9606 9.1665 12.5003 9.1665H10.8337V7.49984Z"
                fill="#1D1C1D"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M10.0003 1.6665C5.39795 1.6665 1.66699 5.39746 1.66699 9.99984C1.66699 14.6022 5.39795 18.3332 10.0003 18.3332C14.6027 18.3332 18.3337 14.6022 18.3337 9.99984C18.3337 5.39746 14.6027 1.6665 10.0003 1.6665ZM3.33366 9.99984C3.33366 6.31794 6.31843 3.33317 10.0003 3.33317C13.6822 3.33317 16.667 6.31794 16.667 9.99984C16.667 13.6817 13.6822 16.6665 10.0003 16.6665C6.31843 16.6665 3.33366 13.6817 3.33366 9.99984Z"
                fill="#1D1C1D"
              />
            </svg>
          </span>
          <p className="text-sm"> Add Customer</p>
        </button>
      </div>

      {/* stat card */}
      <div className="rounded-xl border  p-4 w-[260px]">
        <div className="flex items-center justify-between text-sm text-raisin">
          <span>Total Customers</span>
          <span className="inline-grid place-items-center h-10 w-10 rounded-full bg-mikado/20 text-mikado">
            <UsersRound className="h-4 w-4" />
          </span>
        </div>
        <div className="mt-2 text-3xl font-semibold text-raisin">{total}</div>
      </div>

      {/* content */}
      {isLoading ? (
        <div className="rounded-xl border bg-white p-8">Loading…</div>
      ) : error ? (
        <div className="rounded-xl border bg-white p-8 text-red-600">
          Failed to load.
        </div>
      ) : customers.length === 0 ? (
        <CustomersEmptyState
          onAdd={() => window.location.assign('/dashboard/customers/new')}
        />
      ) : (
        <CustomersTable customers={customers} />
      )}
      <AddCustomerModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onCreated={() => refresh()} 
      />
    </div>
  );
}
