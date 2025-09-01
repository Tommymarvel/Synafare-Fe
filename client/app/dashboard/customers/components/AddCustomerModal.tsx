'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage, type FieldProps } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/app/components/form/Input';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void; // call to refresh table
};

type FormValues = {
  customer_name: string;
  customer_email: string;
  countryCode: string;
  customer_phn: string;
  customer_bvn?: string;
  customer_dob?: string;
};

type APIPayload = {
  customer_name: string;
  customer_email: string;
  customer_phn: string;
  customer_bvn?: string;
  customer_dob?: string;
};

const schema: Yup.ObjectSchema<FormValues> = Yup.object({
  customer_name: Yup.string()
    .trim()
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must not exceed 50 characters')
    .matches(
      /^[A-Za-z\s'-]+$/,
      'Name can only contain letters, spaces, hyphens, and apostrophes'
    )
    .required('Required'),
  customer_email: Yup.string()
    .trim()
    .email('Invalid email format')
    .required('Required'),
  countryCode: Yup.string().required('Required'),
  customer_phn: Yup.string()
    .trim()
    .matches(/^[0-9]{11}$/, 'Phone number must be exactly 11 digits')
    .required('Required'),
  customer_bvn: Yup.string()
    .trim()
    .matches(/^[0-9]{11}$/, 'BVN must be exactly 11 digits'),
  customer_dob: Yup.string(),
});

export default function AddCustomerModal({ open, onClose, onCreated }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  // lock background scroll + focus trap entry
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const handleVerifyBvn = async (
    bvnNumber: string,
    setFieldError: (field: string, message: string) => void
  ) => {
    if (!bvnNumber || bvnNumber.length !== 11) return; // verify only when 11 digits present
    try {
      await axiosInstance.get(
        `/idlookup/verify/?doctype=bvn&doc_number=${bvnNumber}`
      );
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      setFieldError(
        'customer_bvn',
        axiosError.response?.data?.message || 'BVN verification failed'
      );
    }
  };

  if (!open) return null;

  const initialValues: FormValues = {
    customer_name: '',
    customer_email: '',
    countryCode: '+234',
    customer_phn: '',
    customer_bvn: '',
    customer_dob: '',
  };

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-customer-title"
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* panel */}
      <div className="absolute inset-0 flex items-start justify-center p-4 sm:p-6">
        <div
          ref={panelRef}
          tabIndex={-1}
          className="mt-12 w-full max-w-[560px] rounded-lg bg-white shadow-2xl outline-none"
        >
          {/* header */}
          <div className="relative px-5 py-4 sm:px-6">
            <h2
              id="add-customer-title"
              className="text-xl font-semibold text-raisin"
            >
              Add New Customer
            </h2>
            <button
              aria-label="Close"
              onClick={onClose}
              className="absolute right-3 top-3 rounded-full p-2 text-raisin/70 hover:bg-neutral-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <Formik<FormValues>
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitting(true);
              try {
                // Prepare the data with proper formatting
                const payload: APIPayload = {
                  customer_name: values.customer_name,
                  customer_email: values.customer_email,
                  customer_phn: values.customer_phn,
                };

                // Add BVN as number string if provided
                if (values.customer_bvn && values.customer_bvn.trim()) {
                  payload.customer_bvn = values.customer_bvn.trim();
                }

                // Convert date to timestamp if provided
                if (values.customer_dob && values.customer_dob.trim()) {
                  const dateTimestamp = new Date(values.customer_dob).getTime();
                  payload.customer_dob = dateTimestamp.toString();
                }

                const res = await axiosInstance.post('/customer/add', payload);

                toast.success(
                  res.data.message || 'Customer added successfully'
                );
                onCreated?.();
                onClose();
              } catch (error) {
                const axiosError = error as AxiosError<{ errors?: string }>;
                const errorMessage =
                  axiosError.response?.data?.errors ||
                  axiosError.message ||
                  'An error occurred';
                toast.error(errorMessage);
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="px-5 sm:px-6 pb-2 space-y-4">
                  {/* Full name */}
                  <Field name="customer_name">
                    {({ field, meta }: FieldProps<string>) => (
                      <Input
                        {...field}
                        label="Customer's Full Name *"
                        placeholder="e.g David John"
                        hasError={!!(meta.touched && meta.error)}
                        className="rounded-2xl"
                        lettersOnly
                        maxLength={50}
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="customer_name"
                    component="p"
                    className="text-xs text-red-600"
                  />

                  {/* Email */}
                  <Field name="customer_email">
                    {({ field, meta }: FieldProps<string>) => (
                      <Input
                        {...field}
                        type="email"
                        label="Customer Email Address *"
                        placeholder="Enter Email address"
                        hasError={!!(meta.touched && meta.error)}
                        className="rounded-2xl"
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="customer_email"
                    component="p"
                    className="text-xs text-red-600"
                  />

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Phone Number *
                    </label>
                    <div className="flex">
                      <Field
                        as="select"
                        name="countryCode"
                        className="w-24 rounded-l-lg border py-2.5 px-2 bg-white"
                      >
                        <option value="+234">+234</option>
                        {/* add more options if needed */}
                      </Field>
                      <Field name="customer_phn">
                        {({ field, meta }: FieldProps<string>) => (
                          <Input
                            {...field}
                            placeholder="Enter 11-digit phone number"
                            hasError={!!(meta.touched && meta.error)}
                            className="rounded-r-lg text-sm rounded-l-none border-l-0"
                            size="lg"
                            numericOnly
                            maxLength={11}
                          />
                        )}
                      </Field>
                    </div>
                    <ErrorMessage
                      name="customer_phn"
                      component="p"
                      className="mt-1 text-xs text-red-600"
                    />
                  </div>

                  {/* BVN */}
                  <Field name="customer_bvn">
                    {({ field, meta, form }: FieldProps<string>) => (
                      <Input
                        {...field}
                        label="Customer BVN "
                        placeholder="Enter 11-digit BVN"
                        hasError={!!(meta.touched && meta.error)}
                        className="rounded-2xl"
                        numericOnly
                        maxLength={11}
                        onBlur={(e) => {
                          field.onBlur(e);
                          handleVerifyBvn(
                            (form.values as FormValues).customer_bvn || '',
                            form.setFieldError
                          );
                        }}
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="customer_bvn"
                    component="p"
                    className="text-xs text-red-600"
                  />

                  {/* Date of Birth */}
                  <Field name="customer_dob">
                    {({ field, meta }: FieldProps<string>) => (
                      <Input
                        {...field}
                        type="date"
                        label="Customer Date of Birth "
                        hasError={!!(meta.touched && meta.error)}
                        className="rounded-2xl"
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="customer_dob"
                    component="p"
                    className="text-xs text-red-600"
                  />
                </div>

                {/* footer */}
                <div className="px-5 sm:px-6 py-7 sm:py-6 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="h-11 rounded-lg border px-5 text-raisin hover:bg-neutral-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-11 rounded-lg bg-mikado px-6 text-raisin font-medium hover:bg-mikado/90 disabled:opacity-60"
                  >
                    {isSubmitting ? 'Adding…' : 'Add Customer'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
