'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import CustomerLoanForm from './components/CustomerLoanForm';
import LoanTabs, { LoanTab } from './components/LoanTabs';
import InventoryLoanForm from './components/InventoryLoanForm';

export default function RequestLoanPage() {
  const [active, setActive] = useState<LoanTab>('customer');

  return (
    <div className="py-4 max-w-3xl mx-auto">
      <Link
        href="/dashboard/loans"
        className="inline-flex items-center gap-2 text-sm text-[#797979] hover:text-raisin"
      >
        <ArrowLeft className="h-6 w-6 p-1.5 border rounded" /> Go Back
      </Link>

      <header className="mt-5 text-center">
        <h1 className="text-2xl sm:text-3xl font-medium text-raisin">
          Request Loan
        </h1>
        <p className="mt-2 text-sm text-[#645D5D]">
          Provide details to submit your loan application
        </p>
      </header>

      <LoanTabs activeTab={active} onChange={setActive} />

      {active === 'customer' ? <CustomerLoanForm /> : <InventoryLoanForm />}
    </div>
  );
}
