'use client';

import { useEffect, useState, useMemo } from 'react';
import { Formik, Form, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { X, ChevronDown } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import Image from 'next/image';
import clsx from 'clsx';

type Bank = { code: string; name: string; logo?: string };

export type BankFormValues = {
  bank_code: string;
  bank_name: string;
  account_number: string;
  account_name: string;
};

// --- Auto resolver for account name (uses hooks correctly) ---
function AccountResolver({
  onResolved,
  onError,
}: {
  onResolved: (name: string) => void;
  onError: (msg: string) => void;
}) {
  const { values } = useFormikContext<BankFormValues>();
  const key = useMemo(
    () =>
      values.bank_code && /^\d{10}$/.test(values.account_number)
        ? `${values.bank_code}:${values.account_number}`
        : '',
    [values.bank_code, values.account_number]
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

const Schema = Yup.object({
  bank_code: Yup.string().required('Select bank'),
  account_number: Yup.string()
    .matches(/^\d{10}$/, 'Enter a valid 10-digit account number')
    .required('Account number is required'),
  account_name: Yup.string().trim().required('Account name is required'),
});

export default function BankInfoModal({
  open,
  onClose,
  initialValues,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  initialValues: BankFormValues;
  onSuccess?: (values: BankFormValues) => void;
}) {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [acctName, setAcctName] = useState('');
  const [resolveErr, setResolveErr] = useState('');

  // Load banks when modal opens
  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        setLoadingBanks(true);
        const { data } = await axiosInstance.get('/payment/get-banks');

        const list: Bank[] = (data?.data || []).map(
          (b: { code: string; name: string; logo?: string }) => ({
            code: b.code,
            name: b.name,
            logo: b.logo || '',
          })
        );
        setBanks(list);
      } catch {
        toast.error('Could not load banks');
      } finally {
        setLoadingBanks(false);
      }
    })();
  }, [open]);
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
            onSubmit={async (vals, { setSubmitting }) => {
              try {
                await axiosInstance.post('/user/add-bank', {
                  bank_code: vals.bank_code,
                  bank_name: vals.bank_name,
                  acc_no: vals.account_number,
                  acc_name: vals.account_name,
                });

                toast.success('Bank details saved successfully');
                if (onSuccess) onSuccess(vals);
                onClose();
              } catch (error) {
                const axiosError = error as AxiosError<{
                  message?: string;
                  errors?: string | string[];
                }>;
                const errorData = axiosError.response?.data;
                const errorMessage =
                  errorData?.errors ||
                  errorData?.message ||
                  axiosError.message ||
                  'Failed to save bank details';

                toast.error(
                  typeof errorMessage === 'string'
                    ? errorMessage
                    : JSON.stringify(errorMessage)
                );
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({
              values,
              setFieldValue,
              isSubmitting,
              errors,
              touched,
              setFieldTouched,
            }) => {
              const selected = banks.find((b) => b.code === values.bank_code);
              return (
                <Form className="px-6 py-5 space-y-4">
                  {/* Auto-lookup for account name */}
                  <AccountResolver
                    onResolved={(name) => {
                      setAcctName(name);
                      setResolveErr('');
                      setFieldValue('account_name', name);
                    }}
                    onError={(msg) => {
                      setAcctName('');
                      setResolveErr(msg);
                      setFieldValue('account_name', '');
                    }}
                  />

                  {/* Bank name */}
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Bank Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center gap-2">
                      {/* Selected bank logo */}
                      <div className="h-8 w-8 overflow-hidden">
                        {selected?.logo ? (
                          <Image
                            src={selected.logo}
                            alt={selected.name}
                            width={32}
                            height={32}
                            unoptimized
                          />
                        ) : null}
                      </div>

                      <div className="relative flex-1">
                        <select
                          className={clsx(
                            'input w-full appearance-none pr-8',
                            loadingBanks && 'opacity-60'
                          )}
                          value={values.bank_code}
                          disabled={loadingBanks}
                          onChange={(e) => {
                            const selectedBank = banks.find(
                              (b) => b.code === e.target.value
                            );
                            setFieldValue('bank_code', e.target.value);
                            setFieldValue(
                              'bank_name',
                              selectedBank?.name || ''
                            );
                            setFieldTouched('bank_code', true, false);
                            setAcctName('');
                            setResolveErr('');
                            setFieldValue('account_name', '');
                          }}
                        >
                          <option value="">
                            {loadingBanks ? 'Loading banks…' : 'Select bank'}
                          </option>
                          {banks.map((b) => (
                            <option key={b.code} value={b.code}>
                              {b.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={16}
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                      </div>
                    </div>
                    {touched.bank_code && errors.bank_code ? (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.bank_code}
                      </p>
                    ) : null}
                  </div>

                  {/* Account number */}
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Account Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      inputMode="numeric"
                      maxLength={10}
                      value={values.account_number}
                      onChange={(e) => {
                        const digits = e.target.value
                          .replace(/\D/g, '')
                          .slice(0, 10);
                        setFieldValue('account_number', digits);
                        setAcctName('');
                        setResolveErr('');
                        setFieldValue('account_name', '');
                      }}
                      onBlur={() => setFieldTouched('account_number', true)}
                      placeholder="Enter account number"
                      className="input w-full"
                    />
                    {touched.account_number && errors.account_number ? (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.account_number}
                      </p>
                    ) : null}
                    {resolveErr && (
                      <p className="mt-2 text-sm text-red-500">{resolveErr}</p>
                    )}
                  </div>

                  {/* Account name */}
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Account Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="account_name"
                      value={values.account_name}
                      onChange={(e) =>
                        setFieldValue('account_name', e.target.value)
                      }
                      placeholder="Account name"
                      readOnly={!!acctName}
                      className={clsx(
                        'input w-full',
                        acctName &&
                          'bg-gray-50 font-medium uppercase text-raisin'
                      )}
                    />
                    {acctName && (
                      <p className="mt-1 text-xs text-green-600">
                        ✓ Account verified
                      </p>
                    )}
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
                    <Button
                      type="submit"
                      disabled={
                        isSubmitting ||
                        !values.bank_code ||
                        !/^\d{10}$/.test(values.account_number) ||
                        !acctName
                      }
                    >
                      {isSubmitting ? 'Saving…' : 'Save'}
                    </Button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
}
