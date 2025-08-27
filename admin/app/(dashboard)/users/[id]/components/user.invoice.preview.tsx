'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useInvoicePreview } from '@/hooks/useInvoicePreview';
import { fmtDate, fmtNaira } from '@/lib/format';
import Image from 'next/image';

interface InvoicePreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string | null;
  invoiceId: string | null;
}

export default function InvoicePreviewModal({
  open,
  onOpenChange,
  userId,
  invoiceId,
}: InvoicePreviewModalProps) {
  const { invoice, business, bank, isLoading, error } = useInvoicePreview(
    userId,
    invoiceId
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-white min-w-[822px] h-[989px] flex flex-col"
       
      >
        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-10">
            <p>Loading invoice…</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center justify-center py-10">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Render invoice */}
        {invoice && (
          <div className="flex flex-col flex-grow p-8">
            {/* Header */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-start justify-between">
                {business?.business_logo ? (
                  <div className="relative h-12 w-32">
                    <Image
                      src={business.business_logo}
                      alt="Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="h-12 w-32 rounded bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                    {business?.business_name || 'Logo'}
                  </div>
                )}
                <div className="text-right">
                  <div className="text-2xl font-semibold">Invoice</div>
                  <div className="text-sm text-gray-500">
                    Invoice Number{' '}
                    <span className="font-medium text-gray-800">
                      #{invoice.invoice_number}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Issue Date
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {fmtDate(invoice.issue_date)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Due Date</p>
                  <p className="text-sm font-medium text-gray-900">
                    {fmtDate(invoice.due_date)}
                  </p>
                </div>
              </div>

              {/* From / To */}
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Invoice From:
                  </p>
                  <div className="mt-2 space-y-1 text-sm">
                    <p className="font-semibold text-gray-900">
                      {business?.business_name}
                    </p>
                    <p className="text-gray-600">
                      {business?.business_address}
                    </p>
                    <p className="text-gray-600">{invoice.owner.email}</p>
                    <p className="text-gray-600">{invoice.owner.phn_no}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-gray-500">Bill To:</p>
                  <div className="mt-2 space-y-1 text-sm">
                    <p className="font-semibold text-gray-900">
                      {invoice.receipient.customer_name}
                    </p>
                    <p className="text-gray-600">
                      {invoice.receipient.customer_email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="py-6 flex-grow">
              <div className="hidden md:grid grid-cols-[1fr_100px_140px_160px] gap-2 bg-gray-50 px-4 py-3 text-xs text-gray-500 rounded-t">
                <div>Description</div>
                <div className="text-center">Qty</div>
                <div className="text-right">Price</div>
                <div className="text-right">Amount</div>
              </div>

              <div className="divide-y divide-gray-200 border rounded-b">
                {invoice.items.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-[1fr_100px_140px_160px] gap-2 px-4 py-3 text-sm"
                  >
                    <div className="text-gray-900">Product: {item.product}</div>
                    <div className="text-gray-700 md:text-center">
                      {item.quantity}
                    </div>
                    <div className="text-gray-700 md:text-right">
                      {fmtNaira(item.unit_price)}
                    </div>
                    <div className="text-gray-900 md:text-right">
                      {fmtNaira(item.amount)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-6 text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{fmtNaira(invoice.subtotal)}</span>
                </div>
                {invoice.discount > 0 && (
                  <div className="flex justify-between">
                    <span>Discount</span>
                    <span>-{fmtNaira(invoice.discount)}</span>
                  </div>
                )}
                {invoice.tax > 0 && (
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{fmtNaira(invoice.tax)}</span>
                  </div>
                )}
              </div>

              {/* Total bar */}
              <div className="mt-4 flex justify-end">
                <div className="flex w-full max-w-xs bg-black text-white rounded">
                  <div className="w-1/2 px-4 py-2">Total</div>
                  <div className="w-1/2 px-4 py-2 text-right font-semibold">
                    {fmtNaira(invoice.total)}
                  </div>
                </div>
              </div>

              {/* Additional info */}
              {invoice.additional_information && (
                <div className="mt-6">
                  <p className="text-sm font-semibold text-gray-800">
                    Additional information
                  </p>
                  <textarea
                    readOnly
                    rows={2}
                    value={invoice.additional_information}
                    className="mt-2 w-full resize-none rounded border border-gray-300 p-2 text-sm"
                  />
                </div>
              )}
            </div>

            {/* Bank details at bottom */}
            {bank && (
              <div className="mt-auto border-t border-gray-200 bg-[#FFF7E6] px-6 py-5">
                <p className="text-sm font-semibold text-gray-800 mb-3">
                  Payment Details
                </p>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Number:</span>
                    <span className="font-medium text-gray-900">
                      {bank.bankAccountNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Name:</span>
                    <span className="font-medium text-gray-900">
                      {bank.bankAccountName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bank Name:</span>
                    <span className="font-medium text-gray-900">
                      {bank.bankName}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
