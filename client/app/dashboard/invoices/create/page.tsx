'use client';

import { useState, useMemo } from 'react';
import { Formik, Form, Field, FieldArray, FieldProps } from 'formik';
import * as Yup from 'yup';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import GoBack from '@/app/components/goback';
import { useCustomersList } from '@/app/dashboard/customers/hooks/useCustomers';
import AddCustomerModal from '@/app/dashboard/customers/components/AddCustomerModal';
import { useCatalogue } from '@/app/dashboard/inventory/hooks/useCatalogue';
import AddCatalogueModal from '@/app/dashboard/inventory/components/AddCatalogueModal';
import SearchableSelect from '@/app/components/SearchableSelect';
import DateInput from '@/app/components/DateInput';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';

type LineItem = {
  description: string; // free text or picked from list
  qty: number;
  price: string; // formatted "₦" string
};

type FormValues = {
  customerId: string;
  issueDate: string; // ISO (yyyy-mm-dd)
  dueDate: string; // ISO
  items: LineItem[];
  discount: string; // "₦" string
  tax: string; // "₦" string
  notes: string;
};

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

const toNumber = (money: string) =>
  Number(String(money || '0').replace(/[^\d.-]/g, '')) || 0;

const Schema = Yup.object({
  customerId: Yup.string().required('Select a customer'),
  issueDate: Yup.string().required('Issue date is required'),
  dueDate: Yup.string().required('Due date is required'),
  items: Yup.array()
    .of(
      Yup.object({
        description: Yup.string().required('Description is required'),
        qty: Yup.number().min(1).required('Qty'),
        price: Yup.string().test(
          'money',
          'Enter a valid price',
          (val) => toNumber(val || '0') >= 0
        ),
      })
    )
    .min(1, 'Add at least one item'),
  discount: Yup.string().test(
    'money',
    'Invalid',
    (v) => toNumber(v || '0') >= 0
  ),
  tax: Yup.string().test('money', 'Invalid', (v) => toNumber(v || '0') >= 0),
  notes: Yup.string().optional(),
});

export default function CreateInvoicePage() {
  const [addingCustomer, setAddingCustomer] = useState(false);
  const [addingCatalogue, setAddingCatalogue] = useState(false);
  const router = useRouter();

  // Fetch real customers
  const {
    customers,
    isLoading: loadingCustomers,
    refresh: refreshCustomers,
  } = useCustomersList();

  // Fetch real catalogue
  const { data: catalogueData, mutate: refreshCatalogue } = useCatalogue({
    limit: 1000,
  });

  // Convert customers to options format
  const customerOptions = useMemo(() => {
    return customers.map((customer) => ({
      value: customer.id,
      label: `${customer.name} — ${customer.email}`,
    }));
  }, [customers]);

  // Convert catalogue to options format
  const catalogueOptions = useMemo(() => {
    return catalogueData.map((item) => ({
      value: item.product_name,
      label: item.product_name,
      group: item.category.charAt(0).toUpperCase() + item.category.slice(1),
    }));
  }, [catalogueData]);

  const initialValues: FormValues = {
    customerId: '',
    issueDate: '',
    dueDate: '',
    items: [{ description: '', qty: 0, price: '0' }],
    discount: '0',
    tax: '0',
    notes: '',
  };

  const parseNairaInput = (formattedValue: string): number => {
    // Remove commas to get the raw numeric value
    const numericString = formattedValue.replace(/,/g, '');
    return parseFloat(numericString) || 0;
  };

  // Helper function to find product ID by name
  const findProductId = (productName: string): string | null => {
    const product = catalogueData.find(
      (item) => item.product_name === productName
    );
    return product ? product._id : null;
  };

  // Helper function to save as draft
  const saveDraft = async (values: FormValues) => {
    try {
      // For draft, we don't need all validations
      const items = values.items
        .filter((item) => item.description && item.description !== '')
        .map((item) => {
          const productId = findProductId(item.description);
          return {
            product: productId || item.description,
            quantity: item.qty || 1,
            unit_price: parseNairaInput(item.price),
          };
        });

      if (items.length === 0) {
        toast.error('Please add at least one item to save as draft');
        return;
      }

      const payload = {
        status: 'draft' as const,
        items,
        // Only include optional fields if they have values
        ...(values.customerId && { receipient: values.customerId }),
        ...(values.issueDate && { issue_date: toISOString(values.issueDate) }),
        ...(values.dueDate && { due_date: toISOString(values.dueDate) }),
        ...(parseNairaInput(values.discount) > 0 && {
          discount: parseNairaInput(values.discount),
        }),
        ...(parseNairaInput(values.tax) > 0 && {
          tax: parseNairaInput(values.tax),
        }),
        ...(values.notes && { additional_information: values.notes }),
      };

      console.log('Saving draft with payload:', payload);

      const response = await axiosInstance.post('/invoice', payload);

      toast.success('Draft saved successfully!');
      console.log('Draft saved - Full Response:', response);
      console.log('Draft saved - Response Data:', response.data);
      console.log('Draft saved - Response Data Type:', typeof response.data);
      console.log(
        'Draft saved - Response Data Keys:',
        Object.keys(response.data || {})
      );

      // Navigate to preview page with the created draft ID
      const invoiceId = response.data?.invoice?._id || response.data?._id;
      console.log('Extracted Invoice ID:', invoiceId);
      console.log(
        'ID Extraction Path 1 (response.data?.invoice?._id):',
        response.data?.invoice?._id
      );
      console.log(
        'ID Extraction Path 2 (response.data?._id):',
        response.data?._id
      );

      if (invoiceId) {
        console.log('Navigating to preview with ID:', invoiceId);
        router.push(`/dashboard/invoices/preview?id=${invoiceId}`);
      } else {
        console.log('No invoice ID found, navigating to invoice list');
        // Fallback to invoice list if no ID is returned
        router.push('/dashboard/invoices');
      }
    } catch (error) {
      console.error('Error saving draft:', error);

      const axiosError = error as AxiosError<{
        message?: string;
        errors?: string[];
      }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.errors?.join(', ') ||
        axiosError.message ||
        'Failed to save draft. Please try again.';

      toast.error(errorMessage);
    }
  };

  // Helper function to convert date to ISO string
  const toISOString = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString();
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <GoBack />
      <h1 className="mb-6 text-center text-xl font-semibold">Create Invoice</h1>

      <Formik<FormValues>
        initialValues={initialValues}
        validationSchema={Schema}
        onSubmit={async (vals, { setSubmitting }) => {
          try {
            setSubmitting(true);

            // Validate that all items have valid products (not custom)
            const invalidItems = vals.items.filter(
              (item) =>
                item.description === '[custom]' ||
                !item.description ||
                item.description === ''
            );

            if (invalidItems.length > 0) {
              toast.error(
                'Please provide valid product descriptions for all items'
              );
              return;
            }

            // Map items to API format
            const items = vals.items.map((item) => {
              let productValue: string;

              // Handle custom items
              if (item.description === '[custom]') {
                toast.error('Please enter custom item description');
                throw new Error('Custom item description required');
              }

              // Try to find product ID from catalogue
              const productId = findProductId(item.description);

              if (productId) {
                // Use product ID for catalogue items
                productValue = productId;
              } else {
                // For custom descriptions, we'll need to handle this based on API requirements
                // Since API expects product (MongoId), we might need to create the product first
                // or handle custom items differently
                console.warn(
                  `Product "${item.description}" not found in catalogue, treating as custom`
                );
                productValue = item.description; // This might need adjustment based on API behavior
              }

              return {
                product: productValue,
                quantity: item.qty,
                unit_price: parseNairaInput(item.price),
              };
            });

            // Prepare API payload
            const payload = {
              status: 'pending' as const,
              issue_date: toISOString(vals.issueDate),
              due_date: toISOString(vals.dueDate),
              receipient: vals.customerId,
              items,
              discount: parseNairaInput(vals.discount),
              tax: parseNairaInput(vals.tax),
              additional_information: vals.notes || undefined,
            };

            console.log('Creating invoice with payload:', payload);

            const response = await axiosInstance.post('/invoice', payload);

            toast.success('Invoice created successfully!');
            console.log('Invoice created - Full Response:', response);
            console.log('Invoice created - Response Data:', response.data);
            console.log(
              'Invoice created - Response Data Type:',
              typeof response.data
            );
            console.log(
              'Invoice created - Response Data Keys:',
              Object.keys(response.data || {})
            );

            // Navigate to preview page with the created invoice ID
            const invoiceId = response.data?.invoice?._id || response.data?._id;
            console.log('Extracted Invoice ID:', invoiceId);
            console.log(
              'ID Extraction Path 1 (response.data?.invoice?._id):',
              response.data?.invoice?._id
            );
            console.log(
              'ID Extraction Path 2 (response.data?._id):',
              response.data?._id
            );

            if (invoiceId) {
              console.log('Navigating to preview with ID:', invoiceId);
              router.push(`/dashboard/invoices/preview?id=${invoiceId}`);
            } else {
              console.log('No invoice ID found, navigating to invoice list');
              // Fallback to invoice list if no ID is returned
              router.push('/dashboard/invoices');
            }
          } catch (error) {
            console.error('Error creating invoice:', error);

            const axiosError = error as AxiosError<{
              message?: string;
              errors?: string[];
            }>;
            const errorMessage =
              axiosError.response?.data?.message ||
              axiosError.response?.data?.errors?.join(', ') ||
              axiosError.message ||
              'Failed to create invoice. Please try again.';

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
                  Your customer’s information
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  Provide the customer’s information to proceed
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
                      onChange={(value) => setFieldValue('customerId', value)}
                      placeholder={
                        loadingCustomers
                          ? 'Loading customers...'
                          : 'Select existing customer'
                      }
                      disabled={loadingCustomers}
                      loading={loadingCustomers}
                    />
                  </div>

                  {/* Add customer */}
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => setAddingCustomer(true)}
                      className="inline-flex items-center gap-2 rounded-lg bg-mikado px-4 py-2 text-sm font-medium text-white hover:brightness-95"
                    >
                      Add <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <DateInput
                    label="Issue Date"
                    value={values.issueDate}
                    onChange={(value) => setFieldValue('issueDate', value)}
                    required
                  />
                  <DateInput
                    label="Due Date"
                    value={values.dueDate}
                    onChange={(value) => setFieldValue('dueDate', value)}
                    required
                  />
                </div>
              </section>

              {/* PRODUCTS */}
              <section className="rounded-2xl border border-gray-100 bg-white p-5">
                <div className="text-sm font-semibold">Products</div>

                {/* header (md+) */}
                <div className="mt-4 hidden grid-cols-[1fr_90px_160px_160px_40px] items-center gap-3 text-xs text-gray-500 md:grid">
                  <div>Item Description</div>
                  <div>Qty</div>
                  <div>Price</div>
                  <div>Amount</div>
                  <div />
                </div>

                <FieldArray name="items">
                  {({ push, remove }) => (
                    <>
                      {values.items.map((item, idx) => {
                        // Removed unused variable 'amount'

                        return (
                          <div
                            key={idx}
                            className="mt-3 grid gap-3 md:grid-cols-[1fr_90px_160px_160px_40px] md:items-center"
                          >
                            {/* description (select or free text) */}
                            <div className="space-y-2">
                              <div className="md:hidden text-xs text-gray-500">
                                Item Description
                              </div>
                              <div className="flex gap-2">
                                <div className="relative w-full">
                                  <SearchableSelect
                                    options={catalogueOptions}
                                    value={values.items[idx].description}
                                    onChange={(value) => {
                                      if (value === '[add-new]') {
                                        setAddingCatalogue(true);
                                        return;
                                      }
                                      setFieldValue(
                                        `items.${idx}.description`,
                                        value
                                      );
                                    }}
                                    placeholder="Select or Add item"
                                    onAddNew={() => setAddingCatalogue(true)}
                                    showAddNew={true}
                                    showCustomOption={true}
                                    customOptionLabel="Add custom item…"
                                  />
                                </div>
                              </div>

                              {/* If custom chosen, show free text below */}
                              {values.items[idx].description === '[custom]' && (
                                <Field
                                  as="input"
                                  name={`items.${idx}.description`}
                                  placeholder="Type custom description"
                                  className="input w-full"
                                />
                              )}
                            </div>

                            {/* qty */}
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
                                        const formattedValue = formatNairaInput(
                                          `₦ ${rawValue}`
                                        );
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

                      {/* add additional item */}
                      <button
                        type="button"
                        onClick={() =>
                          push({ description: '', qty: 0, price: '0' })
                        }
                        className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-mikado"
                      >
                        <Plus size={16} /> Add additional item
                      </button>
                    </>
                  )}
                </FieldArray>

                {/* totals */}

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
              </section>

              {/* Additional information */}
              <section className="rounded-2xl border border-gray-100 bg-white p-5">
                <div className="text-sm font-semibold mb-3">
                  Additional information
                </div>
                <Field
                  as="textarea"
                  name="notes"
                  rows={3}
                  placeholder="Input any additional information"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-300 focus:ring-4 focus:ring-gray-100"
                />
              </section>

              {/* footer buttons */}
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                <Button
                  type="button"
                  variant="secondary"
                  className="rounded-xl"
                  onClick={() => saveDraft(values)}
                >
                  Save as Draft
                </Button>

                <Button
                  type="submit"
                  disabled={isSubmitting || proceedDisabled}
                  className="rounded-xl"
                >
                  {isSubmitting ? 'Processing…' : 'Create Invoice'}
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>

      {/* Customer Modal */}
      <AddCustomerModal
        open={addingCustomer}
        onClose={() => setAddingCustomer(false)}
        onCreated={() => {
          refreshCustomers();
          setAddingCustomer(false);
        }}
      />

      {/* Catalogue Modal */}
      {addingCatalogue && (
        <AddCatalogueModal
          onClose={() => setAddingCatalogue(false)}
          onSuccess={() => {
            refreshCatalogue();
            setAddingCatalogue(false);
          }}
        />
      )}
    </div>
  );
}

function formatNaira(n: number) {
  return new Intl.NumberFormat('en-NG', { maximumFractionDigits: 0 }).format(
    n || 0
  );
}
