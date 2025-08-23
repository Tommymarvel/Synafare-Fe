'use client';

import { useEffect, useMemo } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';

type QuoteLine = {
  id: string;
  description: string;
  qty: number;
  price: number; // per-unit in NGN
};

type QuoteCustomer = {
  name: string;
  email?: string;
  phone?: string;
  addressLines: string[]; // e.g. ["21b Brook street", "Lekki, Lagos"]
};

export interface QuotationPreviewModalProps {
  open: boolean;
  onClose: () => void;

  quotationId: string | number;
  dateText: string; // "January 01, 2025"

  customer: QuoteCustomer;
  lines: QuoteLine[];
  additionalInfo?: string;

  // Optional: highlight/outline color (the screenshot shows a blue frame)
  withOutline?: boolean;
}

export default function QuotationPreviewModal({
  open,
  onClose,
  quotationId,
  dateText,
  customer,
  lines,
  additionalInfo,
  withOutline = true,
}: QuotationPreviewModalProps) {
  // esc to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const subtotal = useMemo(
    () => lines.reduce((acc, l) => acc + l.qty * l.price, 0),
    [lines]
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Dialog */}
      <div className="absolute inset-0 grid place-items-center px-3">
        <div
          className={[
            'w-full max-w-4xl rounded-2xl bg-white shadow-xl',
            withOutline ? 'ring-2 ring-[#3B82F6]/60' : '',
          ].join(' ')}
          role="dialog"
          aria-modal="true"
        >
          {/* Header strip (Go Back + title) */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
              aria-label="Go Back"
            >
              <ArrowLeft size={16} />
              Go Back
            </button>

            <h2 className="text-lg font-semibold">Quotation</h2>

            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 pb-6 pt-4">
            {/* Top meta row */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <div className="text-xs text-gray-500">Quotation ID</div>
                <div className="text-sm font-medium">#{quotationId}</div>
              </div>
              <div className="space-y-1 text-right">
                <div className="text-xs text-gray-500">Date</div>
                <div className="text-sm font-medium">{dateText}</div>
              </div>
            </div>

            {/* Recipient block */}
            <div className="mt-6">
              <div className="text-xs font-medium text-gray-500">Quote To:</div>
              <div className="mt-2 space-y-0.5 text-sm">
                <div className="font-semibold text-gray-900">
                  {customer.name}
                </div>
                {customer.email && (
                  <div className="text-gray-600">{customer.email}</div>
                )}
                {customer.phone && (
                  <div className="text-gray-600">{customer.phone}</div>
                )}
                {customer.addressLines.map((l, i) => (
                  <div key={i} className="text-gray-600">
                    {l}
                  </div>
                ))}
              </div>
            </div>

            {/* Line items table */}
            <div className="mt-6 overflow-hidden rounded-xl border border-gray-200">
              {/* Header */}
              <div className="hidden grid-cols-[1fr_80px_140px_160px] gap-2 bg-gray-50 px-4 py-3 text-xs text-gray-500 md:grid">
                <div>Description</div>
                <div className="text-center">Qty</div>
                <div className="text-right">Price</div>
                <div className="text-right">Amount</div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-gray-100">
                {lines.map((l) => {
                  const amount = l.qty * l.price;
                  return (
                    <div
                      key={l.id}
                      className="grid grid-cols-1 gap-2 px-4 py-3 text-sm md:grid-cols-[1fr_80px_140px_160px]"
                    >
                      <div className="text-gray-900">{l.description}</div>
                      <div className="text-gray-700 md:text-center">
                        10{/* sample default, replaced below */}
                      </div>
                      {/* replace with actual values on larger screens */}
                      <div className="hidden text-right text-gray-700 md:block">
                        ₦{fmt(l.price)}
                      </div>
                      <div className="hidden text-right text-gray-900 md:block">
                        ₦{fmt(amount)}
                      </div>

                      {/* mobile meta row */}
                      <div className="mt-1 grid grid-cols-3 gap-2 md:hidden text-xs">
                        <div className="text-gray-500">Qty</div>
                        <div className="text-gray-500 text-center">Price</div>
                        <div className="text-gray-500 text-right">Amount</div>
                        <div className="text-gray-700">{l.qty}</div>
                        <div className="text-gray-700 text-center">
                          ₦{fmt(l.price)}
                        </div>
                        <div className="text-gray-900 text-right">
                          ₦{fmt(amount)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Subtotal */}
              <div className="flex items-center justify-between px-4 py-3 text-sm">
                <span className="text-gray-700">Subtotal</span>
                <span className="text-gray-900">₦{fmt(subtotal)}</span>
              </div>
            </div>

            {/* Total strip (black) */}
            <div className="mt-3 flex justify-end">
              <div className="flex w-full max-w-xs items-center overflow-hidden rounded-lg">
                <div className="w-1/2 bg-black px-4 py-2 text-sm font-medium text-white">
                  Total
                </div>
                <div className="w-1/2 bg-gray-100 px-4 py-2 text-right text-sm font-semibold text-gray-900">
                  ₦{fmt(subtotal)}
                </div>
              </div>
            </div>

            {/* Additional information */}
            {additionalInfo !== undefined && (
              <div className="mt-6 rounded-xl border border-gray-200">
                <div className="border-b border-gray-200 px-4 py-2 text-xs font-medium text-gray-600">
                  Additional information
                </div>
                <div className="px-4 py-3 text-sm text-gray-700">
                  {additionalInfo || '—'}
                </div>
              </div>
            )}

            {/* Footer actions (optional) */}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                variant="secondary"
                onClick={onClose}
                className="w-full sm:w-auto"
              >
                Close
              </Button>
              {/* Example: Print/Download hooks if you wire them later */}
              {/* <Button onClick={handlePrint} className="w-full sm:w-auto">Print</Button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- helpers ---------- */
function fmt(n: number) {
  return new Intl.NumberFormat('en-NG', {
    maximumFractionDigits: 0,
  }).format(n || 0);
}
