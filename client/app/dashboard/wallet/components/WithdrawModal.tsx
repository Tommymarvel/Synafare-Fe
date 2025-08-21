// app/(dashboard)/wallet/components/WithdrawModal.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { Formik, Form, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { X, ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import CurrencyInput from './CurrencyInput';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { AxiosError } from 'axios';

type Bank = { code: string; name: string; logo?: string };

// --- Auto resolver (uses hooks correctly) ---
function AccountResolver({
  onResolved,
  onError,
}: {
  onResolved: (name: string) => void;
  onError: (msg: string) => void;
}) {
  const { values } = useFormikContext<{
    bankCode: string;
    accountNumber: string;
    amount: number | '';
  }>();
  const key = useMemo(
    () =>
      values.bankCode && /^\d{10}$/.test(values.accountNumber)
        ? `${values.bankCode}:${values.accountNumber}`
        : '',
    [values.bankCode, values.accountNumber]
  );

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!key) return;
      try {
        const [bankCode, accountNumber] = key.split(':');
        const { data } = await axiosInstance.post('/payment/validate-bank', {
          bankCode,
          accountNumber,
        });
        if (!cancelled) onResolved(data?.data?.accountName || '');
      } catch {
        if (!cancelled)
          onError('Could not verify account. Check details and try again.');
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [key, onResolved, onError]);

  return null;
}

// --- Main modal ---
export default function WithdrawModal({
  open,
  onClose,
  balance,
}: {
  open: boolean;
  onClose: () => void;
  balance: number;
}) {
  const [acctName, setAcctName] = useState('');
  const [resolveErr, setResolveErr] = useState('');
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(false);

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        setLoadingBanks(true);
        const { data } = await axiosInstance.get('/payment/get-banks');

        const list: Bank[] = (data?.data || []).map((b: { code: string; name: string; logo?: string }) => ({
          code: b.code,
          name: b.name,
          logo: b.logo || '', // optional
        }));
        setBanks(list);
      } catch {
        toast.error('Could not load banks');
      } finally {
        setLoadingBanks(false);
      }
    })();
  }, [open]);

  if (!open) return null;

  const Schema = Yup.object({
    amount: Yup.number()
      .typeError('Enter a valid amount')
      .required('Amount is required')
      .min(100, 'Minimum is ₦100')
      .test('lte-balance', 'Withdrawal amount exceeds wallet balance', (v) =>
        typeof v === 'number' ? v <= balance : false
      ),
    bankCode: Yup.string().required('Select a bank'),
    accountNumber: Yup.string()
      .matches(/^\d{10}$/, 'Enter a 10-digit account number')
      .required('Account number is required'),
  });

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="text-lg font-semibold text-raisin">Withdraw</h3>
          <button
            onClick={onClose}
            className="p-1 text-neutral-500 hover:text-neutral-700"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <Formik
          validateOnBlur
          initialValues={{
            amount: '' as number | '',
            bankCode: '',
            accountNumber: '',
          }}
          validationSchema={Schema}
          onSubmit={async (vals, { setSubmitting }) => {
            try {
              setSubmitting(true);
              await axiosInstance.post('/payment/withdraw', {
                amount: Number(vals.amount),
                bank_code: vals.bankCode,
                acc_no: vals.accountNumber,
              });
              toast.success('Withdrawal initiated successfully');
              onClose();
            } catch (error) {
              const axiosError = error as AxiosError<{ message?: string, errors?: string | string[] }>;
              toast.error(
                (axiosError.response && axiosError.response.data
                  ? axiosError.response.data.errors || axiosError.response.data
                  : axiosError.message || 'An error occurred'
                ).toString()
              );
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({
            values,
            errors,
            touched,
            isSubmitting,
            setFieldValue,
            setFieldTouched,
          }) => {
            const selected = banks.find((b) => b.code === values.bankCode);
            return (
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
                {touched.amount && errors.amount && (
                  <p className="mt-1 text-sm text-red-500">{errors.amount}</p>
                )}

                {/* Bank */}
                <div className="mt-4">
                  <label className="mb-1 block text-sm font-medium">
                    Bank Name <span className="text-red-500">*</span>
                  </label>

                  <div className="relative flex items-center gap-2">
                    {/* Selected bank logo (outside of <option>) */}
                    <div className="h-8 w-8 overflow-hidden">
                      {selected?.logo ? (
                        <Image
                          src={selected.logo}
                          alt={selected.name}
                          width={32}
                          height={32}
                          // avoid Next.js remote domain config issues:
                          unoptimized
                        />
                      ) : null}
                    </div>

                    <div className="relative flex-1">
                      <select
                        value={values.bankCode}
                        disabled={loadingBanks}
                        onChange={(e) => {
                          setAcctName('');
                          setResolveErr('');
                          setFieldValue('bankCode', e.target.value);
                          setFieldTouched('bankCode', true, false);
                        }}
                        className={clsx(
                          'w-full appearance-none rounded-xl border border-neutral-200 bg-white px-4 py-3 pr-10 text-left outline-none',
                          'focus:border-neutral-400',
                          loadingBanks && 'opacity-60'
                        )}
                      >
                        <option value="" disabled>
                          {loadingBanks ? 'Loading banks…' : 'Select bank'}
                        </option>
                        {banks.map((b) => (
                          <option key={b.code} value={b.code}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                    </div>
                  </div>

                  {touched.bankCode && errors.bankCode && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.bankCode}
                    </p>
                  )}
                </div>

                {/* Account number */}
                <div className="mt-4">
                  <label className="mb-1 block text-sm font-medium">
                    Account Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    inputMode="numeric"
                    maxLength={10}
                    value={values.accountNumber}
                    onChange={(e) => {
                      const digits = e.target.value
                        .replace(/\D/g, '')
                        .slice(0, 10);
                      setFieldValue('accountNumber', digits);
                      setAcctName('');
                      setResolveErr('');
                    }}
                    onBlur={() => setFieldTouched('accountNumber', true)}
                    placeholder="0234456789"
                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 outline-none placeholder:text-neutral-400 focus:border-neutral-400"
                  />

                  {/* Auto-lookup */}
                  <AccountResolver
                    onResolved={(name) => {
                      setAcctName(name);
                      setResolveErr('');
                    }}
                    onError={(msg) => {
                      setAcctName('');
                      setResolveErr(msg);
                    }}
                  />

                  {acctName && (
                    <p className="mt-2 text-sm font-medium uppercase text-raisin">
                      {acctName}
                    </p>
                  )}
                  {resolveErr && (
                    <p className="mt-2 text-sm text-red-500">{resolveErr}</p>
                  )}
                  {touched.accountNumber && errors.accountNumber && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.accountNumber}
                    </p>
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
                      !values.bankCode ||
                      !/^\d{10}$/.test(values.accountNumber) ||
                      !acctName
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
            );
          }}
        </Formik>
      </div>
    </div>
  );
}
