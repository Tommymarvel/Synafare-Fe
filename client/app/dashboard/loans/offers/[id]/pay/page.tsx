'use client';

import React, { useMemo, useState } from 'react';
import { ArrowLeft, Wallet2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

const N = (v: number) => `₦${v.toLocaleString('en-NG')}`;

export default function PayDownpaymentPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  // MOCK: replace with real fetch by params.id
  const transactionCost = 1_250_000;
  const downPct = 30;
  const downAmount = useMemo(
    () => Math.round((transactionCost * downPct) ),
    [transactionCost]
  );

  const [method, setMethod] = useState<'wallet' | 'flutterwave' | ''>('');
  const walletBalance = 140_000.56;

  const canPay =
    method !== '' && (method === 'flutterwave' || walletBalance >= downAmount);

  return (
    <div className=" lg:px-8 py-4 max-w-2xl mx-auto">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm text-[#797979] hover:text-raisin"
      >
        <ArrowLeft className="h-6 w-6 p-1.5 border rounded" /> Go Back
      </button>

      <h1 className="mt-3 text-2xl font-semibold text-center">
        Pay Downpayment
      </h1>
      <p className="text-center text-sm text-[#645D5D]">
        Select your payment method and proceed to accept offer
      </p>

      {/* Wallet card */}
      <div className="mt-6 rounded-xl overflow-hidden bg-[#225046] text-white">
        <div className="px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-200">Wallet Balance</p>
            <p className="mt-2 text-2xl font-semibold">
              {N(Math.floor(walletBalance))}
              <sup className="text-sm align-super">{`${(walletBalance % 1)
                .toFixed(2)
                .slice(2)}`}</sup>
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-mikado flex items-center justify-center">
            <Wallet2 className="text-raisin" />
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Downpayment Amount <span className="text-red-500">*</span>
          </label>
          <input
            value={N(downAmount)}
            readOnly
            className="mt-1 w-full rounded-md border bg-gray-100 px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Payment Method <span className="text-red-500">*</span>
          </label>
          <select
            value={method}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setMethod(e.target.value as 'wallet' | 'flutterwave' | '')}
            className="mt-1 w-full rounded-md border px-4 py-3 bg-white"
          >
            <option value="">Select payment method</option>
            <option value="wallet">Wallet</option>
            <option value="flutterwave">Flutterwave</option>
          </select>
          {method === 'wallet' && walletBalance < downAmount && (
            <p className="mt-1 text-xs text-red-600">
              Insufficient wallet balance to complete this payment.
            </p>
          )}
        </div>

        <button
          disabled={!canPay}
          onClick={() =>
            router.push(`/dashboard/loans/offers/${params.id}/success`)
          }
          className="w-full py-4 rounded-md bg-mikado text-raisin font-medium disabled:bg-[#D0D5DD] disabled:cursor-not-allowed hover:bg-mikado/90"
        >
          Pay
        </button>
      </div>
    </div>
  );
}
