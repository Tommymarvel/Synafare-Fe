'use client';

import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/app/components/form/Input';
import { Button } from '@/app/components/ui/Button';
import { Trash2, Plus } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

type QuoteItem = {
  description: string;
  qty: number;
  price: number; // in naira
};

interface QuoteRequest {
  id: string;
  customer: string;
  product: string;
  quantity: number;
  customerEmail?: string;
  message?: string;
}

const Schema = Yup.object({
  items: Yup.array()
    .of(
      Yup.object({
        description: Yup.string().required('Required'),
        qty: Yup.number().min(1).required('Required'),
        price: Yup.number().min(0).required('Required'),
      })
    )
    .min(1, 'At least one item'),
  discount: Yup.number().min(0).default(0),
  tax: Yup.number().min(0).default(0),
  notes: Yup.string().optional(),
});

export default function SendQuotationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [quoteRequest, setQuoteRequest] = useState<QuoteRequest | null>(null);
  const [loading, setLoading] = useState(true);

  const requestId = searchParams.get('requestId');

  useEffect(() => {
    // Mock data - replace with actual API call
    if (requestId) {
      // Simulate API call to get quote request details
      setTimeout(() => {
        setQuoteRequest({
          id: requestId,
          customer: 'Mary Thomas',
          product: '1.5kVa 2.4kWh LT Solar Inverter',
          quantity: 10,
          customerEmail: 'mary.thomas@example.com',
          message: 'Need this for residential installation',
        });
        setLoading(false);
      }, 500);
    }
  }, [requestId]);

  const handleSubmit = async (payload: {
    items: QuoteItem[];
    discount: number;
    tax: number;
    notes?: string;
  }) => {
    try {
      // Submit quote logic here
      console.log('Submitting quote:', payload);

      // Show success and navigate back
      router.push('/dashboard/quote-requests');
    } catch (error) {
      console.error('Failed to submit quote:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Loading quote request...</div>
      </div>
    );
  }

  if (!quoteRequest) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-red-500">Quote request not found</div>
      </div>
    );
  }

  const customerDisplay = `${quoteRequest.customer} · ${
    quoteRequest.customerEmail || 'No email'
  } · Request #${quoteRequest.id}`;
  const baseItem = {
    description: quoteRequest.product,
    qty: quoteRequest.quantity,
  };
  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <button
        onClick={() => router.back()}
        className="mb-3 text-sm text-gray-500 hover:text-gray-700"
      >
        &larr; Go Back
      </button>
      <h1 className="mb-6 text-center text-xl font-semibold">Send Quotation</h1>

      {/* Customer card */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        <div className="text-sm font-semibold">Customer Information</div>
        <div className="mt-3">
          <Input
            name="customer_display"
            label="Customer *"
            value={customerDisplay}
            readOnly
          />
        </div>
      </div>

      <Formik
        initialValues={{
          items: [
            {
              description: baseItem?.description || '',
              qty: baseItem?.qty || 1,
              price: 0,
            },
          ] as QuoteItem[],
          discount: 0,
          tax: 0,
          notes: '',
        }}
        validationSchema={Schema}
        onSubmit={async (values, helpers) => {
          await handleSubmit({
            items: values.items,
            discount: values.discount,
            tax: values.tax,
            notes: values.notes || undefined,
          });
          helpers.setSubmitting(false);
        }}
      >
        {({ values, isSubmitting }) => {
          const subtotal = values.items.reduce(
            (acc, it) => acc + it.qty * it.price,
            0
          );
          const total = Math.max(0, subtotal - values.discount + values.tax);

          return (
            <Form className="mt-6 space-y-6">
              {/* Product section */}
              <div className="rounded-2xl border border-gray-100 bg-white p-5">
                <div className="text-sm font-semibold">Product</div>

                <div className="mt-4 grid grid-cols-1 gap-4">
                  {/* Header (md+) */}
                  <div className="hidden grid-cols-[1fr_90px_160px_160px] items-center gap-3 text-xs text-gray-500 md:grid">
                    <div>Item Description</div>
                    <div>Qty</div>
                    <div>Price</div>
                    <div>Amount</div>
                  </div>

                  <FieldArray name="items">
                    {({ push, remove }) => (
                      <>
                        {values.items.map((item, idx) => {
                          const amount = item.qty * item.price;

                          return (
                            <div
                              key={idx}
                              className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_90px_160px_160px] md:items-center md:gap-3"
                            >
                              {/* Description */}
                              <div>
                                <Field
                                  as="input"
                                  name={`items.${idx}.description`}
                                  placeholder={
                                    idx === 0
                                      ? baseItem?.description ||
                                        'Item description'
                                      : 'Input additional cost'
                                  }
                                  className="input w-full"
                                  readOnly={
                                    idx === 0 &&
                                    baseItem?.description &&
                                    item.description === baseItem.description
                                  }
                                />
                              </div>

                              {/* Qty */}
                              <div>
                                <Field
                                  as="input"
                                  type="number"
                                  name={`items.${idx}.qty`}
                                  min={1}
                                  className="input w-full"
                                  readOnly={idx === 0}
                                />
                              </div>

                              {/* Price */}
                              <div className="relative">
                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                  ₦
                                </span>
                                <Field
                                  as="input"
                                  type="number"
                                  name={`items.${idx}.price`}
                                  min={0}
                                  placeholder="0"
                                  className="input w-full pl-7"
                                />
                              </div>

                              {/* Amount */}
                              <div className="relative">
                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                  ₦
                                </span>
                                <input
                                  readOnly
                                  value={formatNaira(amount)}
                                  className="input w-full pl-7"
                                />
                              </div>

                              {/* Delete (only extras) */}
                              {idx > 0 && (
                                <div className="mt-1 flex md:col-span-4 md:mt-0">
                                  <button
                                    type="button"
                                    onClick={() => remove(idx)}
                                    className="ml-auto inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 size={16} /> Remove
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {/* Add additional item */}
                        <button
                          type="button"
                          onClick={() =>
                            push({ description: '', qty: 1, price: 0 })
                          }
                          className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-mikado"
                        >
                          <Plus size={16} />
                          Add additional item
                        </button>
                      </>
                    )}
                  </FieldArray>
                </div>

                {/* Totals */}
                <div className="mt-6 space-y-4">
                  <Row label="Subtotal" value={`₦${formatNaira(subtotal)}`} />
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="grid grid-cols-[1fr_160px] items-center gap-3">
                      <span className="text-sm text-gray-700">Discount</span>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          ₦
                        </span>
                        <Field
                          as="input"
                          type="number"
                          name="discount"
                          min={0}
                          className="input w-full pl-7"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-[1fr_160px] items-center gap-3">
                      <span className="text-sm text-gray-700">Tax</span>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          ₦
                        </span>
                        <Field
                          as="input"
                          type="number"
                          name="tax"
                          min={0}
                          className="input w-full pl-7"
                        />
                      </div>
                    </div>
                  </div>
                  <Row label="Total" value={`₦${formatNaira(total)}`} strong />
                </div>
              </div>

              {/* Additional information */}
              <div className="rounded-2xl border border-gray-100 bg-white p-5">
                <div className="text-sm font-semibold">
                  Additional information
                </div>
                <Field
                  as="textarea"
                  name="notes"
                  placeholder="Input additional information"
                  rows={3}
                  className="mt-3 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-300 focus:ring-4 focus:ring-gray-100"
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending…' : 'Send Quote'}
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}

function Row({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-t border-gray-100 pt-3">
      <span className="text-sm text-gray-700">{label}</span>
      <span className={`text-sm ${strong ? 'font-semibold' : 'text-gray-900'}`}>
        {value}
      </span>
    </div>
  );
}

function formatNaira(n: number) {
  return new Intl.NumberFormat('en-NG', { maximumFractionDigits: 0 }).format(
    n || 0
  );
}
