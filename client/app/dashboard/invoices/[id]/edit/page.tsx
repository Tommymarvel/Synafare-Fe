'use client';

import { useRouter } from 'next/navigation';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { AxiosError } from 'axios';

import { useInvoicePreview } from '../../hooks/useInvoicePreview';
import axiosInstance from '@/lib/axiosInstance';
import { fmtNaira } from '@/lib/format';
import SearchableSelect from '@/app/components/SearchableSelect';
import DateInput from '@/app/components/DateInput';
import {
  useCatalogue,
  type CatalogueDataType,
} from '@/app/dashboard/inventory/hooks/useCatalogue';
import { useCustomersList } from '@/app/dashboard/customers/hooks/useCustomers';

// Type definitions
type FormItem = {
  description: string;
  qty: number;
  price: string;
};

type FormValues = {
  customerId: string;
  issueDate: string;
  dueDate: string;
  items: FormItem[];
  discount: string;
  tax: string;
  notes: string;
};

const validationSchema = Yup.object({
  customerId: Yup.string().required('Customer is required'),
  issueDate: Yup.string().required('Issue date is required'),
  dueDate: Yup.string().required('Due date is required'),
  items: Yup.array()
    .of(
      Yup.object({
        description: Yup.string().required('Item description is required'),
        qty: Yup.number()
          .min(1, 'Quantity must be at least 1')
          .required('Quantity is required'),
        price: Yup.string().required('Price is required'),
      })
    )
    .min(1, 'At least one item is required'),
});

// Allow any here because Next's generated PageProps types expect Promise-like params
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function EditInvoicePage(props: any) {
  const { params } = props as { params: { id: string } };
  const router = useRouter();

  const { invoice, isLoading, error } = useInvoicePreview(params.id);

  // Fetch customers data
  const { customers, isLoading: loadingCustomers } = useCustomersList();

  // Fetch catalogue data
  const { data: catalogueData, isLoading: loadingCatalogue } = useCatalogue({
    limit: 1000,
  });

  const catalogue: CatalogueDataType[] = catalogueData || [];

  // Utility functions for price formatting
  const formatNairaInput = (value: string): string => {
    const numericValue = value.replace(/[^\d.]/g, '');
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    if (parts[0]) {
      const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return parts[1] !== undefined
        ? `${integerPart}.${parts[1]}`
        : integerPart;
    }
    return numericValue;
  };

  const toNumber = (money: string) =>
    Number(String(money || '0').replace(/[^\d.-]/g, '')) || 0;

  const parseNairaInput = (input: string): number => {
    return Number(input.replace(/[^\d.-]/g, '')) || 0;
  };

  const toISOString = (dateString: string): string => {
    if (!dateString) return '';
    return new Date(dateString).toISOString();
  };

  const findProductId = (description: string): string | null => {
    const product = catalogue.find((p) => p.product_name === description);
    return product?._id || null;
  };

  // Convert invoice data to form values
  const getInitialValues = (): FormValues => {
    if (!invoice) {
      return {
        customerId: '',
        issueDate: '',
        dueDate: '',
        items: [{ description: '', qty: 1, price: '' }],
        discount: '',
        tax: '',
        notes: '',
      };
    }

    return {
      customerId: invoice.receipient._id,
      issueDate: new Date(invoice.issue_date).toISOString().split('T')[0],
      dueDate: new Date(invoice.due_date).toISOString().split('T')[0],
      items: invoice.items.map((item) => {
        const product = catalogue.find((p) => p._id === item.product);
        const description = product
          ? product.product_name
          : `Product ID: ${item.product}`;

        return {
          description,
          qty: item.quantity,
          price: formatNairaInput(item.unit_price.toString()),
        };
      }),
      discount: invoice.discount
        ? formatNairaInput(invoice.discount.toString())
        : '',
      tax: invoice.tax ? formatNairaInput(invoice.tax.toString()) : '',
      notes: invoice.additional_information || '',
    };
  };

  // Options for dropdowns
  const customerOptions = customers.map((c) => ({
    label: c.name,
    value: c.id,
    group: 'Customers',
  }));

  const catalogueOptions = catalogue.map((item) => ({
    label: item.product_name,
    value: item.product_name,
    group: 'Catalogue',
  }));

  const itemOptions = [
    ...catalogueOptions,
    { label: '[Enter custom item]', value: '[custom]', group: 'Custom' },
  ];

  if (isLoading || loadingCustomers || loadingCatalogue) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading invoice data...</div>
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Edit Invoice #{invoice.invoice_number}
          </h1>
          <p className="text-sm text-gray-600">
            Update invoice details and save changes
          </p>
        </div>
      </div>

      <Formik
        initialValues={getInitialValues()}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={async (values, { setSubmitting }) => {
          try {
            // Prepare items for API
            const items = values.items.map((item) => {
              // Handle custom items
              if (item.description === '[custom]') {
                toast.error('Please enter custom item description');
                throw new Error('Custom item description required');
              }

              // Try to find product ID from catalogue
              const productId = findProductId(item.description);

              return {
                product:
                  productId || item.description.replace('Product ID: ', ''),
                quantity: item.qty,
                unit_price: parseNairaInput(item.price),
              };
            });

            const payload = {
              status: invoice.status, // Keep existing status
              issue_date: toISOString(values.issueDate),
              due_date: toISOString(values.dueDate),
              receipient: values.customerId,
              items,
              discount: parseNairaInput(values.discount),
              tax: parseNairaInput(values.tax),
              additional_information: values.notes || undefined,
            };

            console.log('Updating invoice with payload:', payload);

            const response = await axiosInstance.put(
              `/invoice/${params.id}`,
              payload
            );

            toast.success('Invoice updated successfully!');
            console.log('Invoice updated:', response.data);

            // Navigate to preview page with the updated invoice
            router.push(`/dashboard/invoices/preview?id=${params.id}`);
          } catch (error) {
            console.error('Error updating invoice:', error);

            const axiosError = error as AxiosError<{
              message?: string;
              errors?: string[];
            }>;
            const errorMessage =
              axiosError.response?.data?.message ||
              axiosError.response?.data?.errors?.join(', ') ||
              axiosError.message ||
              'Failed to update invoice. Please try again.';

            toast.error(errorMessage);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, setFieldValue, isSubmitting, isValid, dirty }) => {
          const subtotal = values.items.reduce(
            (s, it) => s + (it.qty || 0) * toNumber(it.price),
            0
          );
          const total = Math.max(
            0,
            subtotal - toNumber(values.discount) + toNumber(values.tax)
          );

          const proceedDisabled =
            !isValid ||
            !dirty ||
            !values.customerId ||
            !values.issueDate ||
            !values.dueDate ||
            values.items.length === 0;

          return (
            <Form className="space-y-6">
              {/* CUSTOMER + DATES */}
              <section className="rounded-2xl border border-gray-100 bg-white p-5">
                <div className="text-sm font-semibold mb-1">
                  Customer information
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  Update the customer&apos;s information
                </div>

                <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                  {/* Customer select */}
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Customer *
                    </label>
                    <SearchableSelect
                      options={customerOptions}
                      value={values.customerId}
                      onChange={(value: string) =>
                        setFieldValue('customerId', value)
                      }
                      placeholder={
                        loadingCustomers
                          ? 'Loading customers...'
                          : 'Select customer'
                      }
                      disabled={loadingCustomers}
                    />
                  </div>

                  {/* Issue and Due dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <DateInput
                      label="Issue Date"
                      value={values.issueDate}
                      onChange={(value: string) =>
                        setFieldValue('issueDate', value)
                      }
                      required
                    />
                    <DateInput
                      label="Due Date"
                      value={values.dueDate}
                      onChange={(value: string) =>
                        setFieldValue('dueDate', value)
                      }
                      required
                    />
                  </div>
                </div>
              </section>

              {/* ITEMS */}
              <section className="rounded-2xl border border-gray-100 bg-white p-5">
                <div className="text-sm font-semibold mb-1">Items</div>
                <div className="text-sm text-gray-500 mb-4">
                  Update items in this invoice
                </div>

                <FieldArray name="items">
                  {({ push, remove }) => (
                    <div className="space-y-4">
                      {values.items.map((item, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-1 gap-3 rounded-lg border border-gray-200 p-4 md:grid-cols-[2fr_100px_140px_auto]"
                        >
                          {/* Description */}
                          <div>
                            <label className="mb-1 block text-xs text-gray-500">
                              Item Description
                            </label>
                            <SearchableSelect
                              options={itemOptions}
                              value={item.description}
                              onChange={(value: string) => {
                                setFieldValue(
                                  `items.${index}.description`,
                                  value
                                );
                              }}
                              placeholder={
                                loadingCatalogue
                                  ? 'Loading...'
                                  : 'Select or search items'
                              }
                              disabled={loadingCatalogue}
                            />
                          </div>

                          {/* Quantity */}
                          <div>
                            <label className="mb-1 block text-xs text-gray-500">
                              Qty
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={item.qty}
                              onChange={(e) =>
                                setFieldValue(
                                  `items.${index}.qty`,
                                  parseInt(e.target.value) || 1
                                )
                              }
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            />
                          </div>

                          {/* Price */}
                          <div>
                            <label className="mb-1 block text-xs text-gray-500">
                              Price (₦)
                            </label>
                            <input
                              type="text"
                              value={item.price}
                              onChange={(e) =>
                                setFieldValue(
                                  `items.${index}.price`,
                                  formatNairaInput(e.target.value)
                                )
                              }
                              placeholder="0"
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            />
                          </div>

                          {/* Delete button */}
                          <div className="flex items-end">
                            {values.items.length > 1 && (
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="rounded-lg border border-red-300 p-2 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Add Item Button */}
                      <button
                        type="button"
                        onClick={() =>
                          push({ description: '', qty: 1, price: '' })
                        }
                        className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-4 text-sm text-gray-600 hover:border-gray-400 hover:text-gray-700"
                      >
                        <Plus className="h-4 w-4" />
                        Add Item
                      </button>
                    </div>
                  )}
                </FieldArray>
              </section>

              {/* DISCOUNT, TAX, NOTES */}
              <section className="rounded-2xl border border-gray-100 bg-white p-5">
                <div className="text-sm font-semibold mb-1">
                  Additional Information
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  Update discount, tax, and notes
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Discount (₦)
                    </label>
                    <input
                      type="text"
                      value={values.discount}
                      onChange={(e) =>
                        setFieldValue(
                          'discount',
                          formatNairaInput(e.target.value)
                        )
                      }
                      placeholder="0"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Tax (₦)
                    </label>
                    <input
                      type="text"
                      value={values.tax}
                      onChange={(e) =>
                        setFieldValue('tax', formatNairaInput(e.target.value))
                      }
                      placeholder="0"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="mb-1 block text-sm font-medium">
                    Additional Notes
                  </label>
                  <textarea
                    value={values.notes}
                    onChange={(e) => setFieldValue('notes', e.target.value)}
                    placeholder="Enter any additional information or terms..."
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                </div>
              </section>

              {/* SUMMARY */}
              <section className="rounded-2xl border border-gray-100 bg-white p-5">
                <div className="text-sm font-semibold mb-4">
                  Invoice Summary
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>{fmtNaira(subtotal)}</span>
                  </div>
                  {toNumber(values.discount) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount:</span>
                      <span className="text-red-600">
                        -{fmtNaira(toNumber(values.discount))}
                      </span>
                    </div>
                  )}
                  {toNumber(values.tax) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax:</span>
                      <span>{fmtNaira(toNumber(values.tax))}</span>
                    </div>
                  )}
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total:</span>
                      <span>{fmtNaira(total)}</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* ACTION BUTTONS */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={proceedDisabled || isSubmitting}
                  className="rounded-lg bg-mikado px-6 py-2 text-sm font-medium text-raisin hover:bg-mikado/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Updating...' : 'Update Invoice'}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
