'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useInvoicePreview } from '../hooks/useInvoicePreview';
import { fmtDate, fmtNaira } from '@/lib/format';
import { Edit } from 'lucide-react';
import { toast } from 'react-toastify';
import Image from 'next/image';
import axiosInstance from '@/lib/axiosInstance';
import { useState } from 'react';
import GoBack from '@/app/components/goback';

export default function InvoicePreviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get('id');
  const [isSending, setIsSending] = useState(false);

  const { invoice, business, bank, isLoading, error } =
    useInvoicePreview(invoiceId);

  const handleAction = async (action: string) => {
    switch (action) {
      case 'download':
        if (!invoiceId) {
          toast.error('Invoice ID not found');
          return;
        }
        try {
          const res = await axiosInstance.get(
            `/invoice/${invoiceId}/download`,
            {
              responseType: 'blob',
            }
          );
          const blob = new Blob([res.data], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `invoice-${invoice?.invoice_number ?? invoiceId}.pdf`;
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
          toast.success('Invoice downloaded successfully');
        } catch (err) {
          console.error('Error downloading invoice:', err);
          toast.error('Failed to download invoice. Please try again.');
        }
        break;
      case 'send':
        if (!invoiceId) {
          toast.error('Invoice ID not found');
          return;
        }

        setIsSending(true);
        try {
          await axiosInstance.post(`/invoice/${invoiceId}/send`);
          toast.success('Invoice sent successfully via email!');
        } catch (error) {
          console.error('Error sending invoice:', error);
          toast.error('Failed to send invoice. Please try again.');
        } finally {
          setIsSending(false);
        }
        break;
      case 'edit':
        if (invoiceId) {
          router.push(`/dashboard/invoices/${invoiceId}/edit`);
        }
        break;
      case 'back':
        router.back();
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading invoice preview...</div>
      </div>
    );
  }

  if (error || (!isLoading && !invoice)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-lg text-red-600">
            {error ? 'Failed to load invoice preview' : 'Invoice not found'}
          </div>

          <div className="text-sm text-gray-600 space-y-2">
            <div>
              Invoice ID:{' '}
              <code className="bg-gray-100 px-2 py-1 rounded">
                {invoiceId || 'Missing'}
              </code>
            </div>
            {error && (
              <div className="text-xs text-red-500">
                Error: {error.message || 'Unknown error'}
              </div>
            )}
            {!invoice && !error && (
              <div className="text-xs text-amber-600">
                The invoice might not exist or hasn&apos;t been created yet.
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push('/dashboard/invoices')}
              className="px-4 py-2 bg-mikado text-raisin rounded-lg hover:bg-mikado/90"
            >
              Back to Invoices
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Retry
            </button>
            <button
              onClick={() => router.push('/dashboard/invoices/create')}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
            >
              Create Invoice
            </button>
          </div>
        </div>
      </div>
    );
  }

  // At this point, invoice is defined. Narrow to non-null local.
  const inv = invoice!;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      {/* Top bar */}
      <div className="mb-4 flex items-center justify-between">
        <GoBack />

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleAction('edit')}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium hover:bg-gray-50"
          >
            <Edit className="w-4 h-4 mr-2 inline" />
            Edit
          </button>
          <button
            onClick={() => handleAction('send')}
            disabled={isSending}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? 'Sending...' : 'Send Invoice'}
          </button>
        </div>
      </div>

      {/* Paper */}
      <div className="rounded-2xl border border-gray-200 bg-white">
        {/* Header */}
        <div className="border-b border-gray-100 px-6 py-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {business?.business_logo ? (
                <div className="relative h-10 w-28">
                  <Image
                    src={business.business_logo}
                    alt="Logo"
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="h-10 w-28 rounded bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                  {business?.business_name || 'Logo'}
                </div>
              )}
            </div>

            <div className="text-right">
              <div className="text-2xl font-semibold">Invoice</div>
              <div className="text-sm text-gray-500">
                Invoice Number{' '}
                <span className="font-medium text-gray-800">
                  #{inv.invoice_number}
                </span>
              </div>
            </div>
          </div>

          {/* Meta rows */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <div className="text-xs font-medium text-gray-500">
                Issue Date
              </div>
              <div className="mt-1 text-sm font-medium text-gray-900">
                {fmtDate(inv.issue_date)}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500">Due Date</div>
              <div className="mt-1 text-sm font-medium text-gray-900">
                {fmtDate(inv.due_date)}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {/* From */}
            <div>
              <div className="text-xs font-medium text-gray-500">
                Invoice From:
              </div>
              <div className="mt-2 space-y-0.5 text-sm">
                <div className="font-semibold text-gray-900">
                  {business?.business_name}
                </div>
                <div className="text-gray-600">
                  {business?.business_address}
                </div>
                <div className="text-gray-600">{inv.owner.email}</div>
                <div className="text-gray-600">{inv.owner.phn_no}</div>
              </div>
            </div>

            {/* To */}
            <div className="text-right">
              <div className="text-xs font-medium text-gray-500">Bill To:</div>
              <div className="mt-2 space-y-0.5 text-sm">
                <div className="font-semibold text-gray-900">
                  {inv.receipient.customer_name}
                </div>
                <div className="text-gray-600">
                  {inv.receipient.customer_email}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="px-6 py-5">
          <div className="overflow-hidden rounded-xl ">
            <div className="hidden grid-cols-[1fr_100px_140px_160px] gap-2 bg-gray-50 px-4 py-3 text-xs text-gray-500 md:grid">
              <div>Description</div>
              <div className="text-center">Qty</div>
              <div className="text-right">Price</div>
              <div className="text-right">Amount</div>
            </div>

            <div className="divide-y divide-gray-100">
              {inv.items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 gap-2 px-4 py-3 text-sm md:grid-cols-[1fr_100px_140px_160px]"
                >
                  <div className="text-gray-900">
                    {typeof item.product === 'object' &&
                    item.product?.product_name
                      ? item.product.product_name
                      : typeof item.product === 'string'
                      ? item.product
                      : `Product ID: ${item.product}`}
                  </div>
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

            {/* Subtotal / Discount / Tax */}
            <div className="border-t border-gray-100 px-4 py-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Subtotal</span>
                <span className="text-gray-900">{fmtNaira(inv.subtotal)}</span>
              </div>
              {inv.discount > 0 && (
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-gray-700">Discount</span>
                  <span className="text-gray-900">
                    -{fmtNaira(inv.discount)}
                  </span>
                </div>
              )}
              {inv.tax > 0 && (
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-gray-700">Tax</span>
                  <span className="text-gray-900">{fmtNaira(inv.tax)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Total black strip */}
          <div className="mt-3 flex justify-end">
            <div className="flex w-full max-w-xs items-center overflow-hidden rounded-xs bg-black">
              <div className="w-1/2  px-4 py-2 text-sm font-medium text-white">
                Total
              </div>
              <div className="w-1/2 text-white px-4 py-2 text-right text-sm font-semibold">
                {fmtNaira(inv.total)}
              </div>
            </div>
          </div>

          {/* Additional information */}
          {inv.additional_information && (
            <div className="mt-6">
              <div className="text-sm font-semibold text-gray-800">
                Additional information
              </div>
              <textarea
                readOnly
                className="mt-2 w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700"
                rows={2}
                value={inv.additional_information}
              />
            </div>
          )}
        </div>

        {/* Payment details */}
        {bank && (
          <div className="border-t border-gray-100 bg-[#FFF7E6] px-6 py-5">
            <div className="text-sm font-semibold text-gray-800 mb-3">
              Payment Details
            </div>
            <div className="grid gap-2 text-sm">
              <div className="grid grid-cols-[160px_1fr]">
                <div className="text-gray-600">Account Number:</div>
                <div className="font-medium text-gray-900">
                  {bank.bankAccountNumber}
                </div>
              </div>
              <div className="grid grid-cols-[160px_1fr]">
                <div className="text-gray-600">Account Name:</div>
                <div className="font-medium text-gray-900">
                  {bank.bankAccountName}
                </div>
              </div>
              <div className="grid grid-cols-[160px_1fr]">
                <div className="text-gray-600">Bank Name:</div>
                <div className="font-medium text-gray-900">{bank.bankName}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
