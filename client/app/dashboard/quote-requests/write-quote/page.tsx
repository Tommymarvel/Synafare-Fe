'use client';

import { Formik, Form, Field, FieldArray, FieldProps } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/app/components/ui/Button';
import { Trash2, Plus } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'react-toastify';
import GoBack from '@/app/components/goback';
import { AxiosError } from 'axios';

type QuoteItem = {
  description: string;
  qty: number;
  price: string; // Keep as string for formatting
};

interface QuoteRequestItem {
  product: string;
  quantity: number;
  _id: string;
}

interface QuoteRequestUser {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  phn_no: string;
}

interface QuoteRequest {
  _id: string;
  user: QuoteRequestUser;
  supplier: string;
  items: QuoteRequestItem[];
  status: string;
  delivery_location: string;
  additional_message: string;
  createdAt: string;
}

// Utility functions for price formatting
const formatNairaInput = (value: string): string => {
  // Remove all non-numeric characters except decimal point
  const numericValue = value.replace(/[^\d.]/g, '');

  // Handle decimal points - only allow one
  const parts = numericValue.split('.');
  if (parts.length > 2) {
    return parts[0] + '.' + parts.slice(1).join('');
  }

  // Format with commas for thousands
  if (parts[0]) {
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts[1] !== undefined ? `${integerPart}.${parts[1]}` : integerPart;
  }

  return numericValue;
};

const parseNairaInput = (formattedValue: string): number => {
  // Remove commas to get the raw numeric value
  const numericString = formattedValue.replace(/,/g, '');
  return parseFloat(numericString) || 0;
};

const Schema = Yup.object({
  items: Yup.array()
    .of(
      Yup.object({
        description: Yup.string().required('Required'),
        qty: Yup.number().min(1).required('Required'),
        price: Yup.string()
          .required('Required')
          .test('is-valid-price', 'Please enter a valid price', (value) => {
            if (!value) return false;
            const numericValue = parseNairaInput(value);
            return !isNaN(numericValue) && numericValue > 0;
          }),
      })
    )
    .min(1, 'At least one item'),
  discount: Yup.string()
    .default('0')
    .test('is-valid-discount', 'Please enter a valid discount', (value) => {
      if (!value) return true; // Optional field
      const numericValue = parseNairaInput(value);
      return !isNaN(numericValue) && numericValue >= 0;
    }),
  tax: Yup.string()
    .default('0')
    .test('is-valid-tax', 'Please enter a valid tax amount', (value) => {
      if (!value) return true; // Optional field
      const numericValue = parseNairaInput(value);
      return !isNaN(numericValue) && numericValue >= 0;
    }),
  notes: Yup.string().optional(),
});

export default function SendQuotationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [quoteRequest, setQuoteRequest] = useState<QuoteRequest | null>(null);
  const [loading, setLoading] = useState(true);

  const requestId = searchParams.get('requestId');

  useEffect(() => {
    // If user is not a supplier, redirect to dashboard (only suppliers can write quotes)
    if (user && user.nature_of_solar_business !== 'supplier') {
      router.push('/dashboard');
      return;
    }

    // Fetch actual quote request data
    const fetchQuoteRequest = async () => {
      if (!requestId) {
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get(
          `/quote-requests/my-request?id=${requestId}`
        );
        setQuoteRequest(response.data.data[0]);
        console.log('Fetched quote request:', response.data.data);
      } catch (error) {
        console.error('Failed to fetch quote request:', error);
        toast.error('Failed to load quote request details');
      } finally {
        setLoading(false);
      }
    };

    if (requestId) {
      fetchQuoteRequest();
    } else {
      setLoading(false);
    }
  }, [requestId, user, router]);

  const handleSubmit = async (payload: {
    items: QuoteItem[];
    discount: string;
    tax: string;
    notes?: string;
  }) => {
    try {
      if (!requestId) {
        toast.error('No requestId found');
        return;
      }

      // Transform items for backend schema
      const formattedItems = payload.items.map((item, idx) => {
        const baseProductId = quoteRequest?.items[idx]?.product;
        return {
          product: baseProductId, // product ID from original request
          quantity: item.qty,
          unit_price: parseNairaInput(item.price),
        };
      });

      const body = {
        items: formattedItems,
        discount: parseNairaInput(payload.discount),
        tax: parseNairaInput(payload.tax),
        additional_information: payload.notes || '',
      };

      const response = await axiosInstance.post(
        `/quote/create/${requestId}`,
        body
      );

      toast.success('Quote sent successfully');
      console.log('Quote created:', response.data);

      // Optionally redirect back
      router.push('/dashboard/quote-requests');
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      toast.error(
        (axiosError.response && axiosError.response.data
          ? axiosError.response.data.message || axiosError.response.data
          : axiosError.message || 'An error occurred'
        ).toString()
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Loading quote request...</div>
      </div>
    );
  }

  // Show access denied for non-suppliers (only suppliers can write quotes)
  if (user && user.nature_of_solar_business !== 'supplier') {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Access Restricted
          </h2>
          <p className="text-gray-600 mb-4">
            Only suppliers can create and send quotes.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-mikado text-white px-4 py-2 rounded-lg hover:bg-mikado/90"
          >
            Go to Dashboard
          </button>
        </div>
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

  const customerName = `${quoteRequest?.user?.first_name ?? ''} ${
    quoteRequest?.user?.last_name ?? ''
  }`.trim();

  // Get the first item for the base item, or create a default
  const firstItem = quoteRequest?.items[0];
  const baseItem = firstItem
    ? {
        description: firstItem.product,
        qty: firstItem.quantity,
      }
    : {
        description: 'Product not specified',
        qty: 1,
      };
  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <GoBack />
      <h1 className="mb-6 text-center text-xl font-semibold">Send Quotation</h1>

      {/* Customer card */}
      <div className="">
        <div className="text-lg font-semibold">Customer Information</div>
        <div className="mt-3 ">
          <p className="text-sm">Customer *</p>
          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <div className="text-base font-medium capitalize text-raisin">
              {customerName}
            </div>
            <div className="flex">
              {' '}
              <div className="text-xs text-[#797979]">
                {quoteRequest?.user?.email || 'No email'}
              </div>
              <span className="mx-2 text-lg text-gray-300">·</span>
              <div className="text-xs text-[#797979]">
                {quoteRequest?.user?.phn_no || 'No phone'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Formik
        initialValues={{
          items: [
            {
              description: baseItem?.description || '',
              qty: baseItem?.qty || 1,
              price: '0',
            },
          ] as QuoteItem[],
          discount: '0',
          tax: '0',
          notes: quoteRequest?.additional_message,
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
            (acc, it) => acc + it.qty * parseNairaInput(it.price),
            0
          );
          const total = Math.max(
            0,
            subtotal -
              parseNairaInput(values.discount) +
              parseNairaInput(values.tax)
          );

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
                          return (
                            <div
                              key={idx}
                              className="grid gap-3 md:grid-cols-[1fr_90px_160px_160px] md:items-center"
                            >
                              {/* Description → full width on mobile */}
                              <div className="col-span-full md:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1 md:hidden">
                                  Description
                                </label>
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

                              {/* Qty + Price + Amount → 3 cols on mobile */}
                              <div className="grid grid-cols-3 gap-3 md:contents">
                                {/* Qty */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1 md:hidden">
                                    Qty
                                  </label>
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
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1 md:hidden">
                                    Price
                                  </label>
                                  <Field name={`items.${idx}.price`}>
                                    {({ field, form }: FieldProps<string>) => (
                                      <input
                                        {...field}
                                        type="text"
                                        placeholder="0"
                                        className="input w-full pl-7"
                                        onChange={(e) => {
                                          const rawValue = e.target.value;
                                          const formattedValue =
                                            formatNairaInput(`₦ ${rawValue}`);
                                          form.setFieldValue(
                                            field.name,
                                            formattedValue
                                          );
                                        }}
                                        onBlur={field.onBlur}
                                      />
                                    )}
                                  </Field>
                                </div>

                                {/* Amount */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1 md:hidden">
                                    Amount
                                  </label>
                                  <input
                                    readOnly
                                    value={formatNaira(
                                      item.qty * parseNairaInput(item.price)
                                    )}
                                    className="input w-full pl-7"
                                  />
                                </div>
                              </div>

                              {/* Delete button (only extras) */}
                              {idx > 0 && (
                                <div className="col-span-full md:col-span-4 flex justify-end">
                                  <button
                                    type="button"
                                    onClick={() => remove(idx)}
                                    className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 size={16} />
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
                            push({ description: '', qty: 1, price: '0' })
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
                  <hr />
                  <div className="flex justify-end items-center gap-3">
                    <span className="text-lg font-medium text-raisin">
                      Subtotal
                    </span>
                    <div className="">
                      <span className=" w-full text-lg pl-7 rounded-md">{`₦${formatNaira(
                        subtotal
                      )}`}</span>
                    </div>
                  </div>

                  <hr />

                  <div className="flex flex-col gap-3 md:gap-6">
                    <div className="flex justify-end items-center gap-3">
                      <span className="text-lg font-medium text-raisin">
                        Discount
                      </span>
                      <div className="relative">
                        <Field name="discount">
                          {({ field, form }: FieldProps<string>) => (
                            <input
                              {...field}
                              type="text"
                              placeholder="0"
                              className="input w-full pl-7"
                              onChange={(e) => {
                                const rawValue = e.target.value;
                                const formattedValue = formatNairaInput(
                                  `₦ ${rawValue}`
                                );
                                form.setFieldValue(field.name, formattedValue);
                              }}
                              onBlur={field.onBlur}
                            />
                          )}
                        </Field>
                      </div>
                    </div>

                    <div className="flex justify-end items-center gap-3">
                      <span className="text-lg font-medium text-raisin">
                        Tax
                      </span>
                      <div className="relative">
                        <Field name="tax">
                          {({ field, form }: FieldProps<string>) => (
                            <input
                              {...field}
                              type="text"
                              placeholder="0"
                              className="input w-full pl-7"
                              onChange={(e) => {
                                const rawValue = e.target.value;
                                const formattedValue = formatNairaInput(
                                  `n ${rawValue}`
                                );
                                form.setFieldValue(field.name, formattedValue);
                              }}
                              onBlur={field.onBlur}
                            />
                          )}
                        </Field>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="flex justify-end items-center gap-3">
                    <span className="text-lg font-medium text-raisin">
                      Total
                    </span>
                    <div className="">
                      <span className=" w-full text-lg pl-7 rounded-md">{`₦${formatNaira(
                        total
                      )}`}</span>
                    </div>
                  </div>
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

function formatNaira(n: number) {
  return new Intl.NumberFormat('en-NG', { maximumFractionDigits: 0 }).format(
    n || 0
  );
}
