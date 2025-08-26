'use client';

import React, { useMemo } from 'react';
import { Wallet2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import axiosInstance from '@/lib/axiosInstance';
import GoBack from '@/app/components/goback';
import useSWR from 'swr';

const N = (v: number) => `₦${v.toLocaleString('en-NG')}`;

type ApiQuote = {
  _id: string;
  status?: string;
  current_total_amount?: number | string | null;
  offerHistory?: Array<{ amount_recieved?: number; counter_amount?: number }>;
};

type SingleQuoteResponse = {
  data: ApiQuote[];
};

type PayResponse = {
  message?: string;
  amount?: number;
  quoteId?: string;
};

export default function PayQuotePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { user, refreshUser } = useAuth();

  // Fetch the quote request details (single)
  const {
    data: quote,
    isLoading,
    mutate,
  } = useSWR<ApiQuote | null>(
    params?.id ? `/quote-requests/my-request?id=${params.id}` : null,
    async (url: string) => {
      const res = await axiosInstance.get<SingleQuoteResponse>(url);
      return res.data?.data?.[0] || null;
    }
  );

  const amountToPay = useMemo(() => {
    if (!quote) return 0;
    const direct = quote.current_total_amount;
    if (direct != null) {
      const num = typeof direct === 'string' ? Number(direct) : direct;
      return Number.isFinite(num) ? Number(num) : 0;
    }
    const hist = quote.offerHistory || [];
    const last = hist[hist.length - 1];
    const amt = last?.amount_recieved ?? last?.counter_amount ?? 0;
    return typeof amt === 'number' && Number.isFinite(amt) ? amt : 0;
  }, [quote]);

  const statusRaw = quote?.status || '';
  const statusAllowsPay = ['accepted', 'ACCEPTED'].includes(statusRaw);

  const walletBalance = user?.wallet_balance ?? 0;

  const hasFunds = walletBalance >= amountToPay && amountToPay > 0;
  const canPay = statusAllowsPay && hasFunds && !isLoading;

  const handleSubmit = async () => {
    if (!params?.id) return;
    if (!statusAllowsPay) {
      toast.error('Only accepted quotes can be paid.');
      return;
    }
    try {
      const { data } = await axiosInstance.post<PayResponse>(
        `/quotes-requests/pay/${params.id}`
      );
      // Refresh wallet and this quote
      const tasks: Array<Promise<unknown>> = [mutate()];
      if (typeof refreshUser === 'function') tasks.push(refreshUser());
      await Promise.allSettled(tasks);
      toast.success(data?.message || 'Payment processed successfully');
      router.push(`/dashboard/quote-requests`);
    } catch (error) {
      const axiosError = error as AxiosError<
        { message?: string; statusCode?: number } | string
      >;
      const respData = axiosError.response?.data;
      const msg =
        (typeof respData === 'string' ? respData : respData?.message) ||
        axiosError.message ||
        'An error occurred';
      toast.error(msg);
    }
  };

  return (
    <div className=" lg:px-8 py-4 max-w-2xl mx-auto">
      <GoBack />

      <h1 className="mt-3 text-2xl font-semibold text-center">Pay Quote</h1>
      <p className="text-center text-sm text-[#645D5D]">
        Select your payment method and proceed to make payment
      </p>

      {/* Wallet card */}
      <div className="mt-6 rounded-xl overflow-hidden bg-[#225046] text-white">
        <div className="px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-200">Wallet Balance</p>
            <p className="mt-2 text-2xl font-semibold">
              {N(Math.floor(walletBalance))}
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-mikado flex items-center justify-center">
            <Wallet2 className="text-raisin" />
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="mt-4 text-sm text-gray-600">
        <p>
          Quote Status:{' '}
          <span className="font-medium capitalize">
            {statusRaw || (isLoading ? 'loading...' : '-')}
          </span>
        </p>
      </div>

      {/* Form */}
      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Amount <span className="text-red-500">*</span>
          </label>
          <input
            value={N(amountToPay)}
            readOnly
            className="mt-1 w-full rounded-md border bg-gray-100 px-4 py-3"
          />
          {!statusAllowsPay && !isLoading && (
            <p className="mt-1 text-xs text-red-600">
              Only accepted quotes can be paid.
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Payment Method
          </label>
          <input
            value="Wallet"
            readOnly
            className="mt-1 w-full rounded-md border px-4 py-3 bg-gray-100"
          />
          {!hasFunds && (
            <p className="mt-1 text-xs text-red-600">
              Insufficient wallet balance to complete this payment.
            </p>
          )}
        </div>

        <button
          disabled={!canPay}
          onClick={handleSubmit}
          className="w-full py-4 rounded-md bg-mikado text-raisin font-medium disabled:bg-[#D0D5DD] disabled:cursor-not-allowed hover:bg-mikado/90"
        >
          Pay
        </button>
      </div>
    </div>
  );
}
