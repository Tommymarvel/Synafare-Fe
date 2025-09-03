// app/(dashboard)/wallet/components/WithdrawModal.tsx
'use client';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { X } from 'lucide-react';
import clsx from 'clsx';
import CurrencyInput from './CurrencyInput';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { AxiosError } from 'axios';

// --- Main modal ---
export default function WithdrawModal({
  open,
  onClose,
  balance,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  balance: number;
  onSuccess?: () => void;
}) {
  const { user, loading } = useAuth();

  if (!open) return null;

  const Schema = Yup.object({
    amount: Yup.number()
      .typeError('Enter a valid amount')
      .required('Amount is required')
      .min(100, 'Minimum is ₦100')
      .test('lte-balance', 'Withdrawal amount exceeds wallet balance', (v) =>
        typeof v === 'number' ? v <= balance : false
      ),
  });

  return (
    <div className="fixed inset-0 z-[70] bg-black/40 text-raisin backdrop-blur-sm">
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-lg max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-xl flex flex-col">
          <div className="flex items-center justify-between border-b px-6 py-4 flex-shrink-0">
            <h3 className="text-lg font-semibold text-raisin">Withdraw</h3>
            <button
              onClick={onClose}
              className="p-1 text-neutral-500 hover:text-neutral-700"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 min-h-0">
            <Formik
              validateOnBlur
              initialValues={{
                amount: '' as number | '',
              }}
              validationSchema={Schema}
              onSubmit={async (vals, { setSubmitting }) => {
                try {
                  setSubmitting(true);
                  if (!user?.bank_details?.set) {
                    toast.error(
                      'Please add your bank details in settings before withdrawing.'
                    );
                    return;
                  }
                  await axiosInstance.post('/payment/withdraw', {
                    amount: Number(vals.amount),
                    bank_code: user.bank_details.bank_code,
                    acc_no: user.bank_details.acc_no,
                  });
                  toast.success('Withdrawal initiated successfully');
                  if (onSuccess) onSuccess(); // Call refresh callback
                  onClose();
                } catch (error) {
                  const axiosError = error as AxiosError<{
                    message?: string;
                    errors?: string | string[];
                  }>;
                  toast.error(
                    (axiosError.response && axiosError.response.data
                      ? axiosError.response.data.errors ||
                        axiosError.response.data
                      : axiosError.message || 'An error occurred'
                    ).toString()
                  );
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ values, errors, isSubmitting }) => (
                <Form className="px-6 py-5">
                  {/* Amount */}
                  <label className="mb-1 block text-sm font-medium">
                    Amount <span className="text-red-500">*</span>
                  </label>
                  <CurrencyInput
                    name="amount"
                    placeholder=" 50,000"
                    className="text-raisin"
                  />

                  {/* Bank details display or prompt */}
                  <div className="mt-6">
                    {loading ? (
                      <p className="text-sm text-gray-500">
                        Loading bank details...
                      </p>
                    ) : user?.bank_details?.set ? (
                      <div className="p-4 rounded-xl border bg-neutral-50">
                        <div className="font-semibold text-raisin">
                          Bank Details
                        </div>
                        <div className="mt-2 text-sm">
                          <span className="block">
                            Bank: {user.bank_details.bank_name}
                          </span>
                          <span className="block">
                            Account Name: {user.bank_details.acc_name}
                          </span>
                          <span className="block">
                            Account Number: {user.bank_details.acc_no}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl border bg-red-50">
                        <div className="font-semibold text-red-700">
                          No bank details found
                        </div>
                        <div className="mt-2 text-sm text-red-700">
                          Please add your bank details in settings before
                          withdrawing.
                        </div>
                        <Link
                          href="/dashboard/settings/bank"
                          className="mt-2 inline-block text-mikado underline font-medium"
                        >
                          Go to Bank Details Settings
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="mt-6 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="h-11 flex-1 rounded-xl border border-neutral-300 bg-white font-medium text-neutral-700 hover:bg-neutral-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={
                        isSubmitting ||
                        !values.amount ||
                        !!errors.amount ||
                        !user?.bank_details?.set
                      }
                      className={clsx(
                        'h-11 flex-1 rounded-xl bg-amber-400 font-semibold text-black hover:bg-amber-300',
                        'disabled:cursor-not-allowed disabled:opacity-50'
                      )}
                    >
                      Continue
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}
