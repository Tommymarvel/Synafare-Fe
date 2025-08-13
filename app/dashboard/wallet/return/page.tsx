'use client';

import { useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

export default function WalletReturn() {
  const router = useRouter();
  const params = useSearchParams();

  // Nomba may send ?orderReference / ?reference / ?txRef; fall back to localStorage
  const refFromQuery =
    params.get('orderReference') ||
    params.get('reference') ||
    params.get('txRef') ||
    '';

  const orderReference = useMemo(() => {
    if (refFromQuery) return refFromQuery;
    try {
      return localStorage.getItem('nomba_order_ref') || '';
    } catch {
      return '';
    }
  }, [refFromQuery]);

  useEffect(() => {
    (async () => {
      if (!orderReference) {
        toast.error('Missing order reference');
        router.replace('/wallet');
        return;
      }
      try {
        // Adjust this endpoint to yours (e.g. /payment/verify or /payment/verify-payment)
        const { data } = await axiosInstance.post('/payment/verify', {
          orderReference,
        });
        if (data?.status === 'success') {
          toast.success('Payment successful! Wallet updated.');
        } else {
          toast.info('Payment processing. We’ll update your wallet shortly.');
        }
      } catch (error) {
        const axiosError = error as AxiosError<{
          message?: string;
          errors?: string | string[];
        }>;
        toast.error(
          (axiosError.response && axiosError.response.data
            ? axiosError.response.data.errors || axiosError.response.data
            : axiosError.message || 'An error occurred'
          ).toString()
        );
      } finally {
        router.replace('/wallet');
      }
    })();
  }, [orderReference, router]);

  return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="rounded-lg border px-6 py-4 text-sm text-neutral-600">
        Finalizing your payment…
      </div>
    </div>
  );
}
