'use client';

import { useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { X, ChevronDown } from 'lucide-react';
import { Input } from '@/app/components/form/Input';
import { Button } from '@/app/components/ui/Button';
// import axiosInstance from '@/lib/axiosInstance';
// import { toast } from 'react-toastify';

export type BankFormValues = {
  bank_name: string;
  account_number: string;
  account_name: string;
};

const Schema = Yup.object({
  bank_name: Yup.string().required('Select bank'),
  account_number: Yup.string()
    .matches(/^\d{8,12}$/, 'Enter a valid account number')
    .required('Account number is required'),
  account_name: Yup.string().trim().required('Account name is required'),
});

// Replace with your real bank list or load from API
const BANKS = [
  'Access Bank',
  'First Bank',
  'GTBank',
  'Providus Bank',
  'Zenith Bank',
  'United Bank for Africa',
];

export default function BankInfoModal({
  open,
  onClose,
  initialValues,
  // onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  initialValues: BankFormValues;
  // onSuccess: (patch: Partial<BankFormValues>) => void;
}) {
  // lock scroll + esc to close
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="absolute inset-0 grid place-items-center px-3">
        <div
          className="w-full max-w-2xl rounded-2xl bg-white shadow-xl"
          role="dialog"
          aria-modal="true"
        >
          {/* header */}
          <div className="relative border-b border-gray-100 px-6 py-4">
            <h2 className="text-base font-semibold">Bank Information</h2>
            <button
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              <X size={18} />
            </button>
          </div>

          <Formik<BankFormValues>
            initialValues={initialValues}
            validationSchema={Schema}
            onSubmit={ () => {
              console.log('submit');
              // try {
              //   // 🔗 Enable & adjust when your endpoint is ready
              //   // await axiosInstance.patch('/auth/bank', {
              //   //   bank_name: vals.bank_name,
              //   //   account_number: vals.account_number,
              //   //   account_name: vals.account_name,
              //   // });

              //   toast.success('Bank details saved');
              //   onSuccess(vals);
              // } catch (e: any) {
              //   toast.error(
              //     e?.response?.data?.message || 'Failed to save bank details'
              //   );
              // } finally {
              //   setSubmitting(false);
              // }
            }}
          >
            {({ values, setFieldValue, isSubmitting, errors, touched }) => (
              <Form className="px-6 py-5 space-y-4">
                {/* Bank name */}
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Bank Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      className="input w-full appearance-none pr-8"
                      value={values.bank_name}
                      onChange={(e) =>
                        setFieldValue('bank_name', e.target.value)
                      }
                    >
                      <option value="">Select bank</option>
                      {BANKS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                  </div>
                  {touched.bank_name && errors.bank_name ? (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.bank_name}
                    </p>
                  ) : null}
                </div>

                {/* Account number */}
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Account Number <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as={Input}
                    name="account_number"
                    inputMode="numeric"
                    placeholder="Enter account number"
                  />
                  {touched.account_number && errors.account_number ? (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.account_number}
                    </p>
                  ) : null}
                </div>

                {/* Account name */}
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Account Name <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as={Input}
                    name="account_name"
                    placeholder="Account name"
                  />
                  {touched.account_name && errors.account_name ? (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.account_name}
                    </p>
                  ) : null}
                </div>

                {/* footer */}
                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="secondary" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving…' : 'Save'}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
