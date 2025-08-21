'use client';

import { useEffect, useMemo } from 'react';
import { useFormikContext } from 'formik';
import axiosInstance from '@/lib/axiosInstance';

export default function AccountResolver({
  onResolved,
  onError,
}: {
  onResolved: (name: string) => void;
  onError: (msg: string) => void;
}) {
  const { values } = useFormikContext<{
    bankCode: string;
    accountNumber: string;
  }>();

  const key = useMemo(
    () =>
      values.bankCode && /^\d{10}$/.test(values.accountNumber)
        ? `${values.bankCode}:${values.accountNumber}`
        : '',
    [values.bankCode, values.accountNumber]
  );

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!key) return;
      try {
        const [bankCode, accountNumber] = key.split(':');
        const { data } = await axiosInstance.post('/payment/validate-bank', {
          bankCode,
          accountNumber,
        });
        if (!cancelled) onResolved(data?.data?.accountName || '');
      } catch {
        if (!cancelled)
          onError('Could not verify account. Check details and try again.');
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [key, onResolved, onError]);

  return null;
}
