'use client';

import { Formik, Form, Field, FieldProps } from 'formik';
import * as Yup from 'yup';
import axiosInstance from '@/lib/axiosInstance';
import Error, {
  BankDropzone,
  TransactionDropzone,
} from '../components/DropAreas';
import LoanAgreementModal from '../../components/LoanAgreeementModal';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import Image from 'next/image';
import clsx from 'clsx';
import AccountResolver from '../components/AccountResolver';
import { ChevronDown } from 'lucide-react';
import { computeDownpayment, isAllowedType } from '../libs/utils';
import { Input } from '@/app/components/form/Input';

type Bank = { code: string; name: string; logo?: string };

export type InventoryFormValues = {
  transactionCost: string;
  duration: '' | '3' | '4' | '5' | '6';
  bankStatement: File | null;
  invoice: File | null;
  agree: boolean;
  downPercent: '' | '30' | '40' | '50' | '60' | '70';
  bankCode: string;
  accountNumber: string;
};

const schema: Yup.ObjectSchema<InventoryFormValues> = Yup.object({
  transactionCost: Yup.string()
    .matches(
      /^\d+(\.\d{1,2})?$/,
      'Enter a valid amount (numbers, up to 2 decimals)'
    )
    .required('Transaction cost is required'),
  duration: Yup.mixed<'3' | '4' | '5' | '6'>()
    .oneOf(['3', '4', '5', '6'], 'Select a loan duration')
    .required('Loan duration is required'),
  downPercent: Yup.mixed<'30' | '40' | '50' | '60' | '70'>()
    .oneOf(['30', '40', '50', '60', '70'], 'Select a downpayment percentage')
    .required('Downpayment is required'),
  bankStatement: Yup.mixed<File>()
    .required('Bank statement is required')
    .test('fileType', 'Only PDF/JPEG/PNG are allowed', (f) => isAllowedType(f))
    .test(
      'fileSize',
      'File must be 5MB or smaller',
      (f) => !!f && f.size <= 5 * 1024 * 1024
    ),
  invoice: Yup.mixed<File>()
    .required('Transaction invoice is required')
    .test('fileType', 'Only PDF/JPEG/PNG are allowed', (f) => isAllowedType(f))
    .test(
      'fileSize',
      'File must be 5MB or smaller',
      (f) => !!f && f.size <= 5 * 1024 * 1024
    ),

  bankCode: Yup.string().required('Bank is required'),
  accountNumber: Yup.string()
    .matches(/^\d{10}$/, 'Enter a valid 10-digit account number')
    .required('Account number is required'),
  agree: Yup.boolean()
    .oneOf([true], 'You must accept the loan agreement')
    .required(),
}).required();

export default function InventoryLoanForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [showAgreement, setShowAgreement] = useState(false);

  const [banks, setBanks] = useState<Bank[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [acctName, setAcctName] = useState('');
  const [resolveErr, setResolveErr] = useState('');

  useEffect(() => {
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
  }, []);

  const initialValues: InventoryFormValues = {
    transactionCost: '',
    duration: '',
    bankStatement: null,
    invoice: null,
    agree: false,
    bankCode: '',
    accountNumber: '',
    downPercent: '',
  };

  const selectedBank = (code?: string) => banks.find((b) => b.code === code);

  return (
    <>
      <Formik<InventoryFormValues>
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          try {
            const transaction_cost = Number(values.transactionCost);
            const loan_duration_in_months = Number(values.duration);
            const downpayment_in_percent = Number(values.downPercent) / 100;
            const downpayment_in_naira = computeDownpayment(
              values.transactionCost,
              values.downPercent
            );

            const fd = new FormData();
            fd.append('loan_type', 'inventory_financing');
            fd.append('transaction_cost', String(transaction_cost));
            fd.append(
              'loan_duration_in_months',
              String(loan_duration_in_months)
            );

            fd.append('downpayment_in_percent', String(downpayment_in_percent));
            fd.append('downpayment_in_naira', String(downpayment_in_naira));

            // inventory-only fields
            fd.append('bank_code', values.bankCode);
            fd.append('acc_no', values.accountNumber);

            if (values.invoice instanceof File)
              fd.append('trx_invoice', values.invoice, values.invoice.name);
            if (values.bankStatement instanceof File)
              fd.append(
                'bank_statement',
                values.bankStatement,
                values.bankStatement.name
              );

            await axiosInstance.post('/loan/apply', fd);
            onSuccess();
          } catch (error) {
            const axiosError = error as AxiosError<{
              message?: string;
              errors?: string[] | string;
            }>;
            const msg =
              axiosError.response?.data?.errors ??
              axiosError.response?.data?.message ??
              axiosError.message ??
              'An error occurred';
            toast.error(Array.isArray(msg) ? msg.join(', ') : String(msg));
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({
          values,
          setFieldValue,
          setFieldTouched,
          isSubmitting,
          isValid,
        }) => {
          const sel = selectedBank(values.bankCode);
          const downAmount = computeDownpayment(
            values.transactionCost,
            values.downPercent
          );
          return (
            <Form className="mt-8 space-y-6">
              {/* Loan details (shared) */}
              <section>
                <h2 className="text-lg leading-[120%] font-medium text-raisin">
                  Loan Details
                </h2>
                <p className="text-sm mt-2 leading-[145%] text-[#645D5D]">
                  Provide the details to create your loan request
                </p>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Transaction Cost */}
                  <div>
                    <Field name="transactionCost">
                      {({ field, meta }: FieldProps<string>) => (
                        <div>
                          <Input
                            {...field}
                            label="Transaction Cost (₦) *"
                            placeholder="Enter total cost"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            hasError={!!(meta.touched && meta.error)}
                            className="rounded-md text-sm"
                            size="lg"
                          />
                          <p className="mt-1 text-xs text-[#667185]">
                            {values.downPercent
                              ? `You will be required to make a ${values.downPercent}% downpayment`
                              : 'You will be required to make a 30% downpayment'}
                          </p>
                          <Error name="transactionCost" />
                        </div>
                      )}
                    </Field>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Loan Duration *
                    </label>
                    <Field
                      as="select"
                      name="duration"
                      className="w-full rounded-md mt-1 text-sm border py-3 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-mikado"
                    >
                      <option value="">Select duration</option>
                      <option value="3">3 Months</option>
                      <option value="4">4 Months</option>
                      <option value="5">5 Months</option>
                      <option value="6">6 Months</option>
                    </Field>
                    <Error name="duration" />
                  </div>
                  {/* Downpayment % */}

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Select Downpayment (%) *
                    </label>
                    <Field
                      as="select"
                      name="downPercent"
                      className="w-full mt-1 rounded-md text-sm border py-2.5 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-mikado"
                    >
                      <option value="">Select downpayment</option>
                      <option value="30">30%</option>
                      <option value="40">40%</option>
                      <option value="50">50%</option>
                      <option value="60">60%</option>
                      <option value="70">70%</option>
                    </Field>
                    <Error name="downPercent" />
                  </div>

                  {/* Downpayment ₦ (read-only) */}
                  <Input
                    label="Downpayment (₦)"
                    value={downAmount ? `₦${downAmount.toLocaleString()}` : ''}
                    readOnly
                    className="rounded-md text-sm bg-neutral-50"
                  />
                </div>

                {/* Uploads */}
                <div className="mt-6 space-y-5">
                  <BankDropzone />
                  <TransactionDropzone />
                </div>
              </section>

              <hr className="border-t" />

              {/* Inventory-only: Bank + Account */}
              <section>
                <h2 className="text-lg leading-[120%] font-medium text-raisin">
                  Bank Details
                </h2>
                <p className="text-sm mt-2 leading-[145%] text-[#645D5D]">
                  Provide your bank information for inventory disbursement
                </p>

                {/* Bank */}
                <div className="mt-4">
                  <label className="mb-1 block text-sm font-medium">
                    Bank Name <span className="text-red-500">*</span>
                  </label>

                  <div className="relative flex items-center gap-2">
                    <div className="h-8 w-8 overflow-hidden">
                      {sel?.logo ? (
                        <Image
                          src={sel.logo}
                          alt={sel.name}
                          width={32}
                          height={32}
                          unoptimized
                        />
                      ) : null}
                    </div>

                    <div className="relative flex-1">
                      <select
                        value={values.bankCode}
                        disabled={loadingBanks}
                        onChange={(e) => {
                          setFieldValue('bankCode', e.target.value);
                          setFieldTouched('bankCode', true, false);
                          // clear resolver outputs
                          setAcctName('');
                          setResolveErr('');
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
                  <Error name="bankCode" />
                </div>

                {/* Account Number */}
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
                  <Error name="accountNumber" />
                </div>

                {/* Agreement */}
                <label className="mt-6 flex items-center gap-3">
                  <Field
                    type="checkbox"
                    name="agree"
                    className="mt-1 h-5 w-5"
                  />
                  <span className="text-sm text-raisin">
                    I have read and agree to the{' '}
                    <button
                      type="button"
                      className="text-mikado underline"
                      onClick={() => setShowAgreement(true)}
                    >
                      Loan agreement
                    </button>
                  </span>
                </label>
                <Error name="agree" />
              </section>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className="w-full py-4 px-6 rounded-md text-sm bg-mikado text-raisin font-medium disabled:bg-[#D0D5DD] disabled:cursor-not-allowed hover:bg-mikado/90"
                >
                  Submit
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>

      <LoanAgreementModal
        open={showAgreement}
        onClose={() => setShowAgreement(false)}
        onAccept={() => setShowAgreement(false)}
      />
    </>
  );
}
