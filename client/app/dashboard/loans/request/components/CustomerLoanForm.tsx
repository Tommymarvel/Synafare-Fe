'use client';

import { Formik, Form, Field, type FieldProps } from 'formik';
import * as Yup from 'yup';
import useSWR from 'swr';
import axiosInstance from '@/lib/axiosInstance';
import { Input } from '@/app/components/form/Input';
import CustomerSelect from '../components/CustomerSelect';
import Error, {
  BankDropzone,
  TransactionDropzone,
} from '../components/DropAreas';
import { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { computeDownpayment, isAllowedType } from '../libs/utils';
import LoanAgreementModal from '../../components/LoanAgreeementModal';

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

const CUSTOMERS_URL = '/customer/getcustomers' as const;
type CustomersKey = readonly [typeof CUSTOMERS_URL];

const customersFetcher: (
  k: CustomersKey
) => Promise<CustomersListResponse> = async ([url]) => {
  const { data } = await axiosInstance.get<CustomersListResponse>(url);
  return data;
};

export type CustomerFormValues = {
  customerId: string;
  transactionCost: string;
  duration: '' | '3' | '4' | '5' | '6';
  downPercent: '' | '30' | '40' | '50' | '60' | '70';
  bankStatement: File | null;
  invoice: File | null;
  agree: boolean;
};

const schema: Yup.ObjectSchema<CustomerFormValues> = Yup.object({
  customerId: Yup.string().required('Customer is required'),
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
  agree: Yup.boolean()
    .oneOf([true], 'You must accept the loan agreement')
    .required(),
}).required();

export default function CustomerLoanForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [showAgreement, setShowAgreement] = useState(false);

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

  const initialValues: CustomerFormValues = {
    customerId: '',
    transactionCost: '',
    duration: '',
    downPercent: '',
    bankStatement: null,
    invoice: null,
    agree: false,
  };

  return (
    <>
      <Formik<CustomerFormValues>
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
            fd.append('loan_type', 'customer_loan');
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
                  <CustomerSelect
                    name="customerId"
                    options={options}
                    loading={loadingCustomers}
                    disabled={!!customersError}
                    placeholder={
                      loadingCustomers
                        ? 'Loading customers…'
                        : 'Search customers by name or email'
                    }
                  />
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
