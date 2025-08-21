'use client';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { X, ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import CurrencyInput from './CurrencyInput';
import Panel from './Panel';

export type BankDetails = {
  bankAccountNumber: string;
  bankAccountName: string;
  bankName: string;
};

type Method = 'bank' | 'nomba';

export default function AddMoneyModal({
  open,
  onClose,
  onProceedNomba,
  onConfirmBank,
  bankMeta,
}: {
  open: boolean;
  onClose: () => void;
  onProceedNomba?: (payload: { amount: number; method: 'nomba' }) => void;
  onConfirmBank?: (payload: { amount: number; bankMeta: BankDetails }) => void;
  bankMeta: BankDetails | null;
}) {
  if (!open) return null;

  const Schema = Yup.object({
    amount: Yup.number()
      .typeError('Enter a valid amount')
      .required('Amount is required')
      .min(100, 'Minimum is ₦100'),
    method: Yup.mixed<Method>()
      .oneOf(['bank', 'nomba'])
      .required('Select a payment method'),
  });

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="text-lg font-semibold">Add Money</h3>
          <button
            onClick={onClose}
            className="p-1 text-neutral-500 hover:text-neutral-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <Formik
          validateOnBlur
          initialValues={{
            amount: '' as number | '',
            method: '' as '' | Method,
          }}
          validationSchema={Schema}
          onSubmit={(vals, { setSubmitting }) => {
            setSubmitting(true);
            if (vals.method === 'nomba') {
              onProceedNomba?.({
                amount: Number(vals.amount),
                method: 'nomba',
              });
            } else if (vals.method === 'bank' && bankMeta) {
              onConfirmBank?.({ amount: Number(vals.amount), bankMeta });
            }
            setSubmitting(false);
          }}
        >
          {({
            values,
            errors,
            touched,
            isSubmitting,
            setFieldValue,
            setFieldTouched,
          }) => (
            <Form className="px-6 py-5">
              {/* Amount */}
              <label className="mb-1 block text-sm font-medium">
                Amount <span className="text-red-500">*</span>
              </label>
              <CurrencyInput name="amount" />

              {/* Method */}
              <div className="mt-4">
                <label className="mb-1 block text-sm font-medium">
                  Payment Method <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    className={clsx(
                      'w-full appearance-none rounded-xl border border-neutral-200 bg-white px-4 py-3 pr-10 text-left outline-none',
                      'focus:border-neutral-400'
                    )}
                    value={values.method}
                    onChange={(e) => {
                      const m = e.target.value as Method;
                      setFieldValue('method', m);
                      setFieldTouched('method', true, false);
                    }}
                  >
                    <option value="" disabled>
                      Select payment method
                    </option>
                    <option value="bank">Bank Transfer</option>
                    <option value="nomba">Nomba Checkout</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                </div>
                {touched.method && errors.method ? (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.method as string}
                  </p>
                ) : null}
              </div>

              {/* Bank Transfer panel */}
              {values.method === 'bank' && bankMeta ? (
                <Panel>
                  <p className="mb-2 font-semibold">Pay to:</p>
                  <div className="grid gap-2">
                    <Row
                      label="Account Number"
                      value={bankMeta.bankAccountNumber}
                    />
                    <Row
                      label="Account Name"
                      value={bankMeta.bankAccountName}
                    />
                    <Row label="Bank Name" value={bankMeta.bankName} />
                  </div>
                </Panel>
              ) : null}

              {/* Footer */}
              <div className="mt-6 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-11 flex-1 rounded-lg border border-neutral-300 bg-white font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  Cancel
                </button>

                {values.method === 'bank' ? (
                  <button
                    type="submit"
                    disabled={isSubmitting || !values.amount || !bankMeta}
                    className={clsx(
                      'h-11 flex-1 rounded-lg bg-amber-400 font-semibold text-black',
                      'disabled:cursor-not-allowed disabled:opacity-50 hover:bg-amber-300'
                    )}
                  >
                    Confirm Payment
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting || !values.amount || !values.method}
                    className={clsx(
                      'h-11 flex-1 rounded-xl bg-amber-400 font-semibold text-black',
                      'disabled:cursor-not-allowed disabled:opacity-50 hover:bg-amber-300'
                    )}
                  >
                    Proceed
                  </button>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 rounded-lg py-2">
      <span className="text-neutral-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
