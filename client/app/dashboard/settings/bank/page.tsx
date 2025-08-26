'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/Button';
import BankInfoModal, { BankFormValues } from './BankInfoModal';
import { useAuth } from '@/context/AuthContext';

// type BankInfo = {
//   bank_name?: string | null;
//   account_number?: string | null;
//   account_name?: string | null;
// };

export default function BankInfoPanel() {
  const [open, setOpen] = useState(false);
  const { user, loading } = useAuth();

  const filled = Boolean(
    user?.bank_details?.bank_name &&
      user?.bank_details?.acc_no &&
      user?.bank_details?.acc_name
  );

  const locked = Boolean(user?.bank_details?.set);

  const initialValues: BankFormValues = {
    bank_name: user?.bank_details?.bank_name || '',
    account_number: user?.bank_details?.acc_no || '',
    account_name: user?.bank_details?.acc_name || '',
  };

  return (
    <>
      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="text-base font-semibold">Bank Information</h3>

        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
          <KV label="Bank Name" value={user?.bank_details?.bank_name || '–'} />
          <KV
            label="Account Number"
            value={user?.bank_details?.acc_no || '–'}
          />
          <KV
            label="Account Name"
            value={user?.bank_details?.acc_name || '–'}
          />
        </div>

        <div className="mt-5 ">
          <Button
            onClick={() => setOpen(true)}
            disabled={loading || !user || locked}
          >
            {locked ? 'Locked' : filled ? 'Edit' : 'Add'}
          </Button>
        </div>
      </section>

      {/* notice */}
      <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <span className="mr-1">⚠️</span>
        Please note that your bank details can only be updated once. Contact{' '}
        <a href="#" className="underline">
          customer support
        </a>{' '}
        to update your bank details.
      </div>

      {open && !locked && (
        <BankInfoModal
          open={open}
          onClose={() => setOpen(false)}
          initialValues={initialValues}
          // onSuccess={(patch) => {
          //   onUpdated?.(patch);
          //   setOpen(false);
          // }}
        />
      )}
    </>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-1 text-sm font-medium text-gray-900">{value}</div>
    </div>
  );
}
