'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Trash2, UploadCloud } from 'lucide-react';
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  type FieldProps,
  useFormikContext,
} from 'formik';
import * as Yup from 'yup';
import useSWR from 'swr';
import axiosInstance from '@/lib/axiosInstance';
import LoanAgreementModal from '../components/LoanAgreeementModal';
import SubmissionSuccess from '../components/SubmissionSucess';
import { Input } from '@/app/components/form/Input';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

/* ----------------------------- Types & helpers ----------------------------- */

type CustomerAPI = {
  _id: string;
  customer_name: string;
  customer_email: string;
};

type CustomersListResponse = {
  data: CustomerAPI[];
  meta: { total: number; page: number; limit: number; totalPages: number };
};

type CustomerOption = { id: string; label: string };

type FormValues = {
  customerId: string; // <- dropdown
  transactionCost: string; // input string, parsed to number
  duration: '' | '3' | '4' | '5' | '6';
  downPercent: '' | '30' | '40' | '50' | '60' | '70'; // UI in %, API needs 0.3..0.7
  bankStatement: File | null;
  invoice: File | null;
  agree: boolean;
};

const MB_5 = 5 * 1024 * 1024;
const ALLOWED_MIMES = ['application/pdf', 'image/jpeg', 'image/png'] as const;

function computeDownpayment(costStr: string, pctStr: string | '') {
  const cost = Number(costStr || 0);
  const pct = Number(pctStr || 30); // default UI text says 30% if none chosen
  if (!cost || !pct) return 0;
  return Math.round((cost * pct));
}

function isAllowedType(f?: File | null) {
  return (
    !!f && ALLOWED_MIMES.includes(f.type as (typeof ALLOWED_MIMES)[number])
  );
}

/* -------------------------------- Validation -------------------------------- */

const schema: Yup.ObjectSchema<FormValues> = Yup.object({
  customerId: Yup.string().trim().required('Customer is required'),
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
      (f) => !!f && f.size <= MB_5
    ),
  invoice: Yup.mixed<File>()
    .required('Transaction invoice is required')
    .test('fileType', 'Only PDF/JPEG/PNG are allowed', (f) => isAllowedType(f))
    .test(
      'fileSize',
      'File must be 5MB or smaller',
      (f) => !!f && f.size <= MB_5
    ),
  agree: Yup.boolean()
    .oneOf([true], 'You must accept the loan agreement')
    .required(),
});

/* ------------------------------- Data fetching ------------------------------ */

const CUSTOMERS_URL = '/customer/getcustomers' as const;
type CustomersKey = readonly [typeof CUSTOMERS_URL];

const customersFetcher: (
  k: CustomersKey
) => Promise<CustomersListResponse> = async ([url]) => {
  const { data } = await axiosInstance.get<CustomersListResponse>(url);
  return data;
};

/* ---------------------------------- Page ---------------------------------- */

export default function RequestLoanPage() {
  const [showAgreement, setShowAgreement] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    data: list,
    isLoading: loadingCustomers,
    error: customersError,
  } = useSWR<CustomersListResponse, unknown, CustomersKey>(
    [CUSTOMERS_URL],
    customersFetcher,
    { revalidateOnFocus: true, dedupingInterval: 60_000 }
  );

  const options: CustomerOption[] = useMemo(
    () =>
      (list?.data ?? []).map((c) => ({
        id: c._id,
        label: `${c.customer_name} — ${c.customer_email}`,
      })),
    [list]
  );

  const initialValues: FormValues = {
    customerId: '',
    transactionCost: '',
    duration: '',
    downPercent: '',
    bankStatement: null,
    invoice: null,
    agree: false,
  };

  if (isSuccess) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-4 max-w-3xl mx-auto">
        <SubmissionSuccess />
      </div>
    );
  }

  return (
    <div className="py-4 max-w-3xl mx-auto">
      <Link
        href="/dashboard/loans"
        className="inline-flex items-center gap-2 text-sm text-[#797979] hover:text-raisin"
      >
        <ArrowLeft className="h-6 w-6 p-1.5 border rounded" /> Go Back
      </Link>

      <header className="mt-5 text-center">
        <h1 className="text-2xl sm:text-3xl font-medium text-raisin">
          Request Loan
        </h1>
        <p className="mt-2 text-sm text-[#645D5D]">
          Provide details to submit your loan application
        </p>
      </header>

      <Formik<FormValues>
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          try {
            // Build API payload
            const transaction_cost = Number(values.transactionCost);
            const loan_duration_in_months = Number(values.duration);
            const downpayment_in_percent = Number(values.downPercent) ; // 0.3 – 0.7
            const downpayment_in_naira = computeDownpayment(
              values.transactionCost,
              values.downPercent
            );

            const fd = new FormData();
            fd.append('customer', values.customerId);
            fd.append('transaction_cost', String(transaction_cost));
            fd.append(
              'loan_duration_in_months',
              String(loan_duration_in_months)
            );
            fd.append('downpayment_in_percent', String(downpayment_in_percent));
            fd.append('downpayment_in_naira', String(downpayment_in_naira));
            if (values.invoice instanceof File)
              fd.append('trx_invoice', values.invoice, values.invoice.name);
            if (values.bankStatement instanceof File)
              fd.append(
                'bank_statement',
                values.bankStatement,
                values.bankStatement.name
              );

            await axiosInstance.post('/loan/apply', fd); // Content-Type auto-set for FormData
            setIsSuccess(true);
          } catch (error) {
            const axiosError = error as AxiosError<{ message?: string }>;
            toast.error(
              (axiosError.response && axiosError.response.data
                ? axiosError.response.data.message || axiosError.response.data
                : axiosError.message || 'An error occurred'
              ).toString()
            );
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, isSubmitting, isValid }) => {
          const downAmount = computeDownpayment(
            values.transactionCost,
            values.downPercent
          );

          return (
            <Form className="mt-8 space-y-6">
              {/* Customer */}
              <section>
                <h2 className="text-lg leading-[120%] font-medium text-raisin">
                  Customer
                </h2>
                <p className="text-sm mt-2 leading-[145%] text-[#645D5D]">
                  Select an existing customer on your account
                </p>

                <div className="my-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer *
                  </label>
                  <Field name="customerId">
                    {({ field }: FieldProps<string>) => (
                      <select
                        {...field}
                        disabled={loadingCustomers || !!customersError}
                        className="w-full rounded-md text-sm border py-3 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-mikado"
                      >
                        <option value="">
                          {loadingCustomers
                            ? 'Loading customers…'
                            : 'Select customer'}
                        </option>
                        {!loadingCustomers &&
                          !customersError &&
                          options.map((opt) => (
                            <option key={opt.id} value={opt.id}>
                              {opt.label}
                            </option>
                          ))}
                      </select>
                    )}
                  </Field>
                  <Error name="customerId" />
                </div>
              </section>

              <hr className="border-t" />

              {/* Loan details */}
              <section>
                <h2 className="text-lg leading-[120%] font-medium text-raisin">
                  Loan Details
                </h2>
                <p className="text-sm mt-2 leading-[145%] text-[#645D5D]">
                  Provide the details to create your loan request
                </p>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Transaction Cost */}
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

              {/* Submit */}
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
    </div>
  );
}

/* ------------------------------ Reusable bits ------------------------------ */

function Error({ name }: { name: keyof FormValues | string }) {
  return (
    <ErrorMessage
      name={name}
      component="p"
      className="mt-1 text-xs text-red-600"
    />
  );
}

function BankDropzone() {
  const { values, setFieldValue, setFieldError } =
    useFormikContext<FormValues>();

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'application/pdf': [], 'image/jpeg': [], 'image/png': [] },
    maxSize: MB_5,
    multiple: false,
    onDrop: (files) => {
      const f = files[0];
      if (!f) return;
      setFieldError('bankStatement', undefined);
      setFieldValue('bankStatement', f);
    },
    onDropRejected: (rejections) => {
      const r = rejections[0];
      const tooBig = r?.errors?.some((e) => e.code === 'file-too-large');
      const wrongType = r?.errors?.some((e) => e.code === 'file-invalid-type');
      if (tooBig) setFieldError('bankStatement', 'File must be 5MB or smaller');
      else if (wrongType)
        setFieldError('bankStatement', 'Only PDF/JPEG/PNG are allowed');
      else setFieldError('bankStatement', 'Unable to accept this file');
    },
  });

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Upload your Business Bank Statement (last 6 months){' '}
        <span className="text-red-500">*</span>
      </label>

      {values.bankStatement ? (
        <UploadedFileRow
          name={values.bankStatement.name}
          size={values.bankStatement.size}
          lastModified={values.bankStatement.lastModified}
          onRemove={() => setFieldValue('bankStatement', null)}
        />
      ) : (
        <DropArea getRootProps={getRootProps} getInputProps={getInputProps} />
      )}

      <Error name="bankStatement" />
    </div>
  );
}

function TransactionDropzone() {
  const { values, setFieldValue, setFieldError } =
    useFormikContext<FormValues>();

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'application/pdf': [], 'image/jpeg': [], 'image/png': [] },
    maxSize: MB_5,
    multiple: false,
    onDrop: (files) => {
      const f = files[0];
      if (!f) return;
      setFieldError('invoice', undefined);
      setFieldValue('invoice', f);
    },
    onDropRejected: (rejections) => {
      const r = rejections[0];
      const tooBig = r?.errors?.some((e) => e.code === 'file-too-large');
      const wrongType = r?.errors?.some((e) => e.code === 'file-invalid-type');
      if (tooBig) setFieldError('invoice', 'File must be 5MB or smaller');
      else if (wrongType)
        setFieldError('invoice', 'Only PDF/JPEG/PNG are allowed');
      else setFieldError('invoice', 'Unable to accept this file');
    },
  });

  return (
    <div>
      <label>
        <p className="text-sm font-medium text-raisin">Transaction Invoice *</p>
        <p className="text-sm text-[#645D5D] -mt-1 mb-2">
          <button
            type="button"
            className="text-mikado underline"
            onClick={() => alert('Open invoice creator')}
          >
            Click here
          </button>{' '}
          to instantly create an invoice
        </p>
      </label>

      {values.invoice ? (
        <UploadedFileRow
          name={values.invoice.name}
          size={values.invoice.size}
          lastModified={values.invoice.lastModified}
          onRemove={() => setFieldValue('invoice', null)}
        />
      ) : (
        <DropArea getRootProps={getRootProps} getInputProps={getInputProps} />
      )}

      <Error name="invoice" />
    </div>
  );
}

function UploadedFileRow({
  name,
  size,
  lastModified,
  onRemove,
}: {
  name: string;
  size: number;
  lastModified: number;
  onRemove: () => void;
}) {
  return (
    <div className="mt-1 border border-dashed border-[#DCDCDC] rounded-md p-4 flex items-center justify-between">
      <div className="flex items-center">
        <span className="bg-[#E7F6EC] p-3 rounded-full">
          <CheckCircle className="text-green-500" size={24} />
        </span>
        <div className="ml-2">
          <p className="font-medium text-black break-all">{name}</p>
          <p className="text-sm text-gray-500">
            {new Date(lastModified).toLocaleDateString()} •{' '}
            {(size / (1024 * 1024)).toFixed(1)} MB
          </p>
        </div>
      </div>
      <button type="button" onClick={onRemove} aria-label="Remove file">
        <Trash2 className="text-red-500" size={24} />
      </button>
    </div>
  );
}

function DropArea({
  getRootProps,
  getInputProps,
}: {
  getRootProps: ReturnType<typeof useDropzone>['getRootProps'];
  getInputProps: ReturnType<typeof useDropzone>['getInputProps'];
}) {
  return (
    <div
      {...getRootProps()}
      className="mt-1 border-dashed border-[1.5px] border-[#DCDCDC] rounded-md p-6 flex gap-4 items-center justify-start cursor-pointer"
    >
      <input {...getInputProps()} />
      <span className="bg-[#F0F2F5] p-3 rounded-full">
        <UploadCloud className="text-[#797979]" size={32} />
      </span>
      <span className="flex flex-col items-start">
        <span className="mt-2 text-[#E2A109] underline font-medium">
          Upload
        </span>
        <span className="text-sm text-gray-500 mt-1">
          .pdf, .jpeg, .png • Max. 5MB
        </span>
      </span>
    </div>
  );
}
