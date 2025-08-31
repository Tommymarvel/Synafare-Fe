'use client';

import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Send } from 'lucide-react';
import { fmtDate, fmtNaira } from '@/lib/format';
import StatusChip from '@/app/components/statusChip';
import { toast } from 'react-toastify';
import { useInvoicePreview } from '../hooks/useInvoicePreview';
import GoBack from '@/app/components/goback';
import { useInvoiceActions } from '../hooks/useInvoices';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function InvoiceDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [isSending, setIsSending] = useState(false);
  const { invoice, business, bank, isLoading, error, mutate } =
    useInvoicePreview(id);
  const { markAsPaid, sendInvoice } = useInvoiceActions();

  const handleAction = async (action: string) => {
    switch (action) {
      case 'edit':
        router.push(`/dashboard/invoices/${id}/edit`);
        break;
      case 'send':
        setIsSending(true);
        try {
          if (!invoice?._id) throw new Error('Invoice ID not found');
          const res = await sendInvoice(invoice._id);
          toast.success(res?.message || 'Invoice sent successfully');
          await mutate();
        } catch (err) {
          const msg =
            err instanceof Error ? err.message : 'Failed to send invoice';
          toast.error(msg);
        } finally {
          setIsSending(false);
        }
        break;
      case 'markPaid':
        try {
          if (!invoice?._id) throw new Error('Invoice ID not found');
          const res = await markAsPaid(invoice._id);
          toast.success(res?.message || 'Invoice marked as paid');
          await mutate();
        } catch (err) {
          const msg =
            err instanceof Error
              ? err.message
              : 'Failed to mark invoice as paid';
          toast.error(msg);
        }
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading invoice...</div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">
          {error ? 'Failed to load invoice' : 'Invoice not found'}
        </div>
      </div>
    );
  }

  return (
    <div className=" space-y-4">
      <GoBack />
      <div className="mx-auto max-w-4xl py-6 space-y-4">
        {/* Top bar: Status + actions */}
        <div className="flex items-center justify-between ">
          <StatusChip status={invoice.status} />
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => handleAction('send')}
              disabled={isSending}
              className="inline-flex items-center gap-2 lg:px-3 px-1.5 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              {isSending ? 'Sending…' : 'Resend Invoice'}
            </button>
            {invoice.status?.toUpperCase() === 'PAID' ? (
              <span className="px-3 py-1.5 text-xs font-medium rounded-full bg-green-100 text-green-700">
                Paid
              </span>
            ) : (
              <button
                onClick={() => handleAction('markPaid')}
                className="inline-flex items-center gap-2 lg:px-3 px-1.5 py-1.5 text-sm bg-mikado text-raisin rounded-lg hover:bg-mikado/90"
              >
                Mark as Paid
              </button>
            )}
          </div>
        </div>
        {/* Invoice Content */}
        <div className="bg-white rounded-lg shadow-sm border p-6 md:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Brand header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                {business?.business_logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={business.business_logo}
                    alt={`${business.business_name || 'Business'} logo`}
                    className="h-10 w-auto object-contain"
                  />
                ) : (
                  <div className="text-xl font-semibold text-gray-900">
                    {business?.business_name}
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-2xl md:text-3xl font-semibold">
                  Invoice
                </div>
                <div className="text-sm text-gray-500">
                  Invoice Number #
                  {String(invoice.invoice_number).padStart(5, '0')}
                </div>
              </div>
            </div>

            {/* Parties */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-sm font-semibold text-gray-900 mb-2">
                  Invoice From:
                </h2>
                <div className="text-sm text-gray-700 space-y-1">
                  <p className="font-medium">{business?.business_name}</p>
                  <p>{business?.business_address}</p>
                  <p>{invoice.owner.phn_no}</p>
                  <p>{invoice.owner.email}</p>
                </div>
              </div>

              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Issue Date</p>
                    <p className="text-base font-medium">
                      {fmtDate(invoice.issue_date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Due Date</p>
                    <p className="text-base font-medium">
                      {fmtDate(invoice.due_date)}
                    </p>
                  </div>
                </div>
                <div className='text-end'>
                  <h2 className="text-sm font-semibold text-gray-900 mb-2">
                    Bill To:
                  </h2>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p className="font-medium">
                      {invoice.receipient.customer_name}
                    </p>
                    <p>{invoice.receipient.customer_email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Items
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Qty
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoice.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {typeof item.product === 'object' &&
                          item.product?.product_name
                            ? item.product.product_name
                            : typeof item.product === 'string'
                            ? item.product
                            : `Product ID: ${item.product}`}
                        </td>
                        <td className="px-6 py-4 text-sm text-center text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 text-sm text-right text-gray-900">
                          {fmtNaira(item.unit_price)}
                        </td>
                        <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">
                          {fmtNaira(item.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary */}
            <div className="flex justify-end mb-8">
              <div className="w-full max-w-sm space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">
                    {fmtNaira(invoice.subtotal)}
                  </span>
                </div>
                {invoice.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount:</span>
                    <span className="font-medium">
                      -{fmtNaira(invoice.discount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium">{fmtNaira(invoice.tax)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>{fmtNaira(invoice.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            {invoice.additional_information && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Additional information
                </h3>
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                  {invoice.additional_information}
                </div>
              </div>
            )}

            {/* Payment Details */}
            {bank && (
              <div className="border-t pt-6 mt-6 bg-[#FFF7E6] p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Payment Details
                </h3>
                <div className="grid gap-2 text-sm">
                  <div className="grid lg:grid-cols-[160px_1fr]">
                    <div className="text-gray-600">Account Number:</div>
                    <div className="font-medium text-gray-900">
                      {bank.bankAccountNumber}
                    </div>
                  </div>
                  <div className="grid lg:grid-cols-[160px_1fr]">
                    <div className="text-gray-600">Account Name:</div>
                    <div className="font-medium text-gray-900">
                      {bank.bankAccountName}
                    </div>
                  </div>
                  <div className="grid lg:grid-cols-[160px_1fr]">
                    <div className="text-gray-600">Bank Name:</div>
                    <div className="font-medium text-gray-900">
                      {bank.bankName}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
