'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { Formik, Form, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { X, ChevronDown } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import Image from 'next/image';
import clsx from 'clsx';
import TimeCircle from '@/app/assets/Time-Circle.svg';
import { useAuth } from '@/context/AuthContext';

type Bank = { code: string; name: string; logo?: string };

export type BankFormValues = {
  bank_code: string;
  bank_name: string;
  account_number: string;
  account_name: string;
};

const OTP_LENGTH = 5;

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

  // Use refs to store the latest callback values
  const onResolvedRef = useRef(onResolved);
  const onErrorRef = useRef(onError);

  // Update refs when callbacks change
  useEffect(() => {
    onResolvedRef.current = onResolved;
  }, [onResolved]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

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
        if (!cancelled) onResolvedRef.current(data?.data?.accountName || '');
      } catch {
        if (!cancelled)
          onErrorRef.current(
            'Could not verify account. Check details and try again.'
          );
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [key]); // Only depend on key since we use refs for callbacks

  return null;
}

const Schema = Yup.object({
  bank_code: Yup.string().required('Select bank'),
  account_number: Yup.string()
    .matches(/^\d{10}$/, 'Enter a valid 10-digit account number')
    .required('Account number is required'),
  account_name: Yup.string().trim().required('Account name is required'),
});

// OTP Modal Component
function OtpModal({
  open,
  onClose,
  bankData,
  userEmail,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  bankData: BankFormValues;
  userEmail: string;
  onSuccess?: (values: BankFormValues) => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [verificationCode, setVerificationCode] = useState<string[]>(
    Array(OTP_LENGTH).fill('')
  );
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isShaking, setIsShaking] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Timer logic
  useEffect(() => {
    if (!open) return;

    const expiryTime = Date.now() + 300 * 1000; // 5 minutes
    const tick = () => {
      const secs = Math.max(0, Math.floor((expiryTime - Date.now()) / 1000));
      setTimeLeft(secs);
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [open]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  // Input handlers
  const handleInput = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...verificationCode];
    next[i] = val;
    setVerificationCode(next);
    if (val && i < OTP_LENGTH - 1) {
      inputRefs.current[i + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    i: number
  ) => {
    if (e.key === 'Backspace' && !verificationCode[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    i: number
  ) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').trim();
    if (!/^\d+$/.test(paste)) return;
    const digits = paste.split('');
    const next = [...verificationCode];
    for (let j = i; j < OTP_LENGTH && digits.length; j++) {
      next[j] = digits.shift()!;
    }
    setVerificationCode(next);
    const firstEmpty = next.findIndex((d) => !d);
    inputRefs.current[firstEmpty > -1 ? firstEmpty : OTP_LENGTH - 1]?.focus();
  };

  // Request/Resend OTP function
  const requestOtp = async () => {
    if (!userEmail) {
      toast.error('User email not found');
      return;
    }

    setSubmitting(true);
    try {
      await axiosInstance.post('/otp/request', {
        email: userEmail,
      });

      toast.success('Verification code sent to your email');
      // Reset timer
      setTimeLeft(300);
    } catch (error) {
      const axiosError = error as AxiosError<{
        message?: string;
        errors?: string | string[];
      }>;
      toast.error(axiosError.response?.data?.message || 'Failed to send OTP');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async () => {
    setSubmitting(true);
    const otp = verificationCode.join('');

    // Validate OTP format
    if (otp.length !== OTP_LENGTH || !/^\d{5}$/.test(otp)) {
      shake();
      setSubmitting(false);
      return;
    }

    try {
      // Save the bank details with OTP validation
      await axiosInstance.post('/user/add-bank', {
        bank_code: bankData.bank_code,
        bank_name: bankData.bank_name,
        acc_no: bankData.account_number,
        acc_name: bankData.account_name,
        otp, // Include the OTP for validation
      });

      toast.success('Bank details saved successfully');
      if (onSuccess) onSuccess(bankData);
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
        'Failed to verify OTP or save bank details';

      toast.error(
        typeof errorMessage === 'string'
          ? errorMessage
          : JSON.stringify(errorMessage)
      );
      shake();
    } finally {
      setSubmitting(false);
    }
  };

  const shake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 600);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md max-h-[90vh] rounded-2xl bg-white shadow-xl flex flex-col">
          {/* Header */}
          <div className="relative border-b border-gray-100 px-6 py-4 flex-shrink-0">
            <h2 className="text-base font-semibold">Verify Bank Details</h2>
            <button
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-5 overflow-y-auto flex-1 min-h-0">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-raisin mb-2">
                Enter Verification Code
              </h3>
              <p className="text-sm text-gray-600">
                Enter the 5-digit verification code sent to your registered
                email address
              </p>
            </div>

            <div className="flex gap-2 justify-center mb-6">
              {verificationCode.map((code, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={code}
                  onChange={(e) => handleInput(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  onPaste={(e) => handlePaste(e, i)}
                  className="w-12 h-12 text-center border border-gray-300 rounded-md text-raisin text-xl focus:ring-2 focus:ring-mikado focus:ring-offset-0 focus:outline-none"
                />
              ))}
            </div>

            <div className="flex gap-1 mb-4 justify-center items-center text-gray-500 text-sm">
              {formatTime(timeLeft) !== '0:00' ? (
                <>
                  <Image src={TimeCircle} alt="" width={16} height={16} />
                  <span>Expires in </span>
                  <span className="text-gray-700 font-medium">
                    {formatTime(timeLeft)}
                  </span>
                </>
              ) : (
                <div className="text-center">
                  <span className="text-red-500 block mb-2">
                    Code expired. Please try again.
                  </span>
                  <button
                    onClick={requestOtp}
                    disabled={submitting}
                    className="text-mikado hover:text-mikado-dark font-medium"
                  >
                    {submitting ? 'Sending...' : 'Resend Code'}
                  </button>
                </div>
              )}
            </div>

            <div className="text-center mb-6">
              <span className="text-sm text-gray-500">
                Didn&apos;t receive a code?
              </span>
              <button
                onClick={requestOtp}
                disabled={submitting}
                className="text-mikado hover:text-mikado-dark font-medium text-sm ml-1"
              >
                {submitting ? 'Sending...' : 'Resend'}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t flex-shrink-0">
            <div className={isShaking ? 'animate-pulse' : ''}>
              <Button
                onClick={handleVerify}
                disabled={
                  submitting || verificationCode.join('').length < OTP_LENGTH
                }
                className="w-full"
              >
                {submitting ? 'Verifying...' : 'Verify & Save'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  const { user } = useAuth();
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [acctName, setAcctName] = useState('');
  const [resolveErr, setResolveErr] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [pendingBankData, setPendingBankData] = useState<BankFormValues | null>(
    null
  );

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

  const handleContinue = async (values: BankFormValues) => {
    try {
      // Request OTP using the standard OTP request endpoint
      await axiosInstance.post('/otp/request', {
        email: user?.email || '', // Use user's email from auth context
      });

      setPendingBankData(values);
      setShowOtpModal(true);
      toast.success('Verification code sent to your registered email address');
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
        'Failed to send verification code';

      toast.error(
        typeof errorMessage === 'string'
          ? errorMessage
          : JSON.stringify(errorMessage)
      );
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50">
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div
            className="w-full max-w-2xl max-h-[90vh] rounded-2xl bg-white shadow-xl flex flex-col"
            role="dialog"
            aria-modal="true"
          >
            {/* header */}
            <div className="relative border-b border-gray-100 px-6 py-4 flex-shrink-0">
              <h2 className="text-base font-semibold">Bank Information</h2>
              <button
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                onClick={onClose}
              >
                <X size={18} />
              </button>
            </div>

            {/* scrollable content */}
            <div className="overflow-y-auto flex-1 min-h-0">
              <Formik<BankFormValues>
                initialValues={initialValues}
                validationSchema={Schema}
                onSubmit={handleContinue}
              >
                {({
                  values,
                  setFieldValue,
                  isSubmitting,
                  errors,
                  touched,
                  setFieldTouched,
                }) => {
                  const selected = banks.find(
                    (b) => b.code === values.bank_code
                  );
                  return (
                    <Form className="flex flex-col h-full">
                      <div className="px-6 py-5 space-y-4 flex-1">
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
                                  {loadingBanks
                                    ? 'Loading banks…'
                                    : 'Select bank'}
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
                            Account Number{' '}
                            <span className="text-red-500">*</span>
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
                            onBlur={() =>
                              setFieldTouched('account_number', true)
                            }
                            placeholder="Enter account number"
                            className="input w-full"
                          />
                          {touched.account_number && errors.account_number ? (
                            <p className="mt-1 text-xs text-red-600">
                              {errors.account_number}
                            </p>
                          ) : null}
                          {resolveErr && (
                            <p className="mt-2 text-sm text-red-500">
                              {resolveErr}
                            </p>
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
                      </div>

                      {/* footer */}
                      <div className="px-6 py-4 border-t flex-shrink-0">
                        <div className="flex justify-end gap-3">
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                          >
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
                            {isSubmitting ? 'Continue' : 'Continue'}
                          </Button>
                        </div>
                      </div>
                    </Form>
                  );
                }}
              </Formik>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && pendingBankData && (
        <OtpModal
          open={showOtpModal}
          onClose={() => {
            setShowOtpModal(false);
            setPendingBankData(null);
          }}
          bankData={pendingBankData}
          userEmail={user?.email || ''}
          onSuccess={(values) => {
            setShowOtpModal(false);
            setPendingBankData(null);
            if (onSuccess) onSuccess(values);
            onClose();
          }}
        />
      )}
    </>
  );
}
