'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import useSWR from 'swr';
import axiosInstance from '@/lib/axiosInstance';
import { format } from 'date-fns';
import { Pencil, Trash2, ChevronDown, ArrowLeft } from 'lucide-react';
import DeleteCustomerModal from '../components/DeleteCustomerModal';
import StatusChip from '@/app/components/statusChip';

/* ---------------------------- Types (no any) ---------------------------- */

interface CustomerAPI {
  _id: string;
  customer_name: string;
  customer_email: string;
  customer_phn: string;
  customer_bvn?: string;
  customer_dob?: string;
  date_joined?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  bvn?: string;
  dob?: string;
  createdAt: string; // ISO
}

function toCustomer(api: CustomerAPI): Customer {
  return {
    id: api._id,
    name: api.customer_name,
    email: api.customer_email,
    phone: api.customer_phn,
    bvn: api.customer_bvn,
    dob: api.customer_dob,
    createdAt: api.date_joined ?? api.createdAt ?? new Date().toISOString(),
  };
}

/* ----------------------------- SWR (customer) ----------------------------- */

const CUSTOMER_URL = '/customer/getcustomers' as const;
type SingleKey = readonly [typeof CUSTOMER_URL, Readonly<{ id: string }>];

const fetchCustomer: (
  k: SingleKey
) => Promise<{ data: CustomerAPI | CustomerAPI[] }> = async ([url, params]) => {
  const { data } = await axiosInstance.get<{
    data: CustomerAPI | CustomerAPI[];
  }>(url, { params });
  return data;
};

/* ---------------------------- Loans API -------------------------------- */

const LOANS_BY_CUSTOMER_URL = '/loan/customer' as const;
type LoansKey = readonly [
  typeof LOANS_BY_CUSTOMER_URL,
  Readonly<{ cus_id: string }>
];

interface LoanAPI {
  _id: string;
  interest: number;
  loan_agreement: string;
  customer: {
    _id: string;
    customer_name: string;
    customer_email: string;
    customer_phn: string;
  };
  transaction_cost: number;
  loan_duration_in_months: number;
  downpayment_in_percent: number;
  downpayment_in_naira: number;
  loan_status: string;
  createdAt: string;
  updatedAt: string;
}

const fetchLoans: (
  k: LoansKey
) => Promise<{ customer_loans: LoanAPI[] }> = async ([url, params]) => {
  const { data } = await axiosInstance.get<{ customer_loans: LoanAPI[] }>(
    `${url}/${params.cus_id}`
  );
  return data;
};

/* ---------------------------- Invoices API -------------------------------- */

const INVOICES_URL = '/invoice' as const;
type InvoicesKey = readonly [typeof INVOICES_URL, Readonly<{ cus_id: string }>];

interface InvoiceAPI {
  _id: string;
  receipient: {
    _id: string;
    customer_name: string;
    customer_email: string;
    customer_phn: string;
  };
  issue_date: string;
  invoice_number: number;
  due_date: string;
  items: Array<{
    product: string;
    quantity: number;
    unit_price: number;
    amount: number;
    _id: string;
  }>;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const fetchInvoices: (
  k: InvoicesKey
) => Promise<{ data: InvoiceAPI[] }> = async ([url, params]) => {
  const { data } = await axiosInstance.get<{ data: InvoiceAPI[] }>(url, {
    params: { cus_id: params.cus_id },
  });
  return data;
};

/* -------------------------------- Component -------------------------------- */

export default function CustomerDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [showDelete, setShowDelete] = useState(false);
  const [loansOpen, setLoansOpen] = useState(true);

  // Customer
  const custKey = [
    CUSTOMER_URL,
    { id: params.id },
  ] as const satisfies SingleKey;
  const {
    data: cRes,
    isLoading: customerLoading,
    error: customerError,
  } = useSWR(custKey, fetchCustomer, {
    revalidateOnFocus: true,
  });

  const raw = Array.isArray(cRes?.data) ? cRes?.data[0] : cRes?.data;
  const customer = raw ? toCustomer(raw) : undefined;

  // Loans
  const loansKey = [
    LOANS_BY_CUSTOMER_URL,
    { cus_id: params.id },
  ] as const satisfies LoansKey;
  const {
    data: loansRes,
    isLoading: loansLoading,
    error: loansError,
  } = useSWR(loansKey, fetchLoans, {
    revalidateOnFocus: true,
  });
  const loans: LoanAPI[] = loansRes?.customer_loans ?? [];

  // Invoices
  const invoicesKey = [
    INVOICES_URL,
    { cus_id: params.id },
  ] as const satisfies InvoicesKey;
  const {
    data: invoicesRes,
    isLoading: invoicesLoading,
    error: invoicesError,
  } = useSWR(invoicesKey, fetchInvoices, {
    revalidateOnFocus: true,
  });
  const invoices: InvoiceAPI[] = invoicesRes?.data ?? [];

  if (customerLoading) return <div className="p-6">Loading…</div>;
  if (customerError || !customer)
    return <div className="p-6 text-red-600">Customer not found.</div>;

  const initials = customer.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]!.toUpperCase())
    .join('');

  async function handleDelete() {
    // 🔁 FUTURE: call your delete endpoint then navigate
    // await axiosInstance.delete('/customer/delete', { params: { id: params.id } });
    router.push('/dashboard/customers');
  }

  return (
    <div className="space-y-6 overflow-x-hidden">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm text-[#797979] hover:text-raisin"
      >
        <ArrowLeft className="h-6 w-6 p-1.5 border rounded" /> Go Back
      </button>

      {/* Top actions */}
      <div className="hidden justify-end sm:flex shrink-0 gap-2">
        <button className="inline-flex items-center gap-2 border rounded-md px-3 py-2 hover:bg-neutral-50">
          <Pencil className="w-4 h-4" /> Edit Customer
        </button>
        <button
          className="inline-flex items-center gap-2 border rounded-md px-3 py-2 hover:bg-neutral-50 text-red-600"
          onClick={() => setShowDelete(true)}
        >
          <Trash2 className="w-4 h-4" /> Delete
        </button>
      </div>

      {/* Summary */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 rounded-xl border bg-white p-4 sm:p-5">
          <div className="flex items-start gap-4 sm:gap-6">
            <div className="h-12 w-12 rounded-full bg-neutral-200 grid place-items-center text-raisin font-semibold">
              {initials || 'M'}
            </div>
            <div className="flex-1 flex flex-col gap-4 justify-between lg:flex-row w-full max-w-[700px]">
              <div>
                <div className="text-black text-[20px] font-medium">
                  {customer.name}
                </div>
                <div className="text-sm  text-raisin/60">
                  Customer since:{' '}
                  {format(new Date(customer.createdAt), 'MMMM dd, yyyy')}
                </div>
              </div>
              <div>
                <div className="text-xs text-raisin/60">Email Address</div>
                <div className="text-base mt-3 text-wrap text-raisin">
                  {customer.email}
                </div>
              </div>
              <div>
                <div className="text-xs text-raisin/60">Phone Number</div>
                <div className="text-base mt-3 text-raisin">
                  {customer.phone}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loans Table */}
      <div className="rounded-xl border bg-white">
        <button
          onClick={() => setLoansOpen((v) => !v)}
          className="w-full flex items-center justify-between px-4 lg:px-6 py-3 font-medium text-raisin"
          aria-expanded={loansOpen}
        >
          <span>Loans</span>
          <ChevronDown
            className={`w-5 h-5 transition-transform ${
              loansOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
        {loansOpen && (
          <div className="border-t">
            {loansLoading ? (
              <div className="py-10 text-center text-sm text-raisin/60">
                Loading loans...
              </div>
            ) : loansError ? (
              <div className="py-10 text-center text-sm text-red-600">
                Error loading loans
              </div>
            ) : loans.length === 0 ? (
              <div className="py-10 text-center text-sm text-raisin/60">
                No recent loan activity
              </div>
            ) : (
              <div className="-mx-1">
                <div
                  className="overflow-x-auto touch-pan-x scrollbar-mikado"
                  style={{ WebkitOverflowScrolling: 'touch' }}
                >
                  <table className="min-w-[700px] w-full text-sm table-auto whitespace-nowrap md:whitespace-normal">
                    <thead>
                      <tr className="bg-[#F0F2F5]">
                        <Th className="w-[120px]">Loan ID</Th>
                        <Th className="w-[160px]">Customer</Th>
                        <Th className="w-[140px]">Transaction Cost</Th>
                        <Th className="hidden md:table-cell w-[120px]">
                          Duration
                        </Th>
                        <Th className="hidden lg:table-cell w-[140px]">
                          Downpayment
                        </Th>
                        <Th className="w-[120px]">Status</Th>
                        <Th className="w-[80px]">Action</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {loans.map((loan) => (
                        <tr
                          key={loan._id}
                          className="border-t hover:bg-neutral-50"
                        >
                          <Td className="whitespace-nowrap">
                            #{loan._id.slice(-6)}
                          </Td>
                          <Td className="whitespace-nowrap md:whitespace-normal">
                            <div className="font-medium text-raisin">
                              {loan.customer.customer_name}
                            </div>
                            <div className="text-xs text-raisin/60">
                              {loan.customer.customer_email}
                            </div>
                          </Td>
                          <Td className="whitespace-nowrap">
                            ₦{loan.transaction_cost.toLocaleString()}
                          </Td>
                          <Td className="hidden md:table-cell whitespace-nowrap">
                            {loan.loan_duration_in_months} months
                          </Td>
                          <Td className="hidden lg:table-cell whitespace-nowrap">
                            ₦{loan.downpayment_in_naira.toLocaleString()}
                          </Td>
                          <Td className="whitespace-nowrap">
                            <StatusChip status={loan.loan_status} />
                          </Td>
                          <Td className="whitespace-nowrap">
                            <Link
                              href={`/dashboard/loans/${encodeURIComponent(
                                loan._id
                              )}`}
                              className="text-mikado hover:underline"
                            >
                              View
                            </Link>
                          </Td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Invoices */}
      <div className="rounded-xl border bg-white">
        <div className="border-b px-4 lg:px-6 py-3 font-medium text-raisin bg-[#F7F8FA] rounded-t-xl">
          Invoices
        </div>

        {/* 🔽 Full-bleed scroll on small; normal on md+ */}
        <div className="-mx-1 ">
          {/* 🔽 Only this container scrolls */}
          <div
            className="overflow-x-auto touch-pan-x scrollbar-mikado"
            style={{ WebkitOverflowScrolling: 'touch' }} // smooth iOS scroll
          >
            <table className="min-w-[700px] w-full text-sm table-auto whitespace-nowrap md:whitespace-normal">
              <thead>
                <tr className="bg-[#F0F2F5]">
                  <Th className="w-[120px]">Invoice ID</Th>
                  <Th className="w-[240px]">Customer</Th>
                  <Th className="hidden md:table-cell w-[160px]">Issue Date</Th>
                  <Th className="hidden lg:table-cell w-[160px]">Due Date</Th>
                  <Th className="w-[140px]">Amount</Th>
                  <Th className="w-[120px]">Status</Th>
                  <Th className="w-[120px]">Action</Th>
                </tr>
              </thead>
              <tbody>
                {invoicesLoading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-10 text-center text-raisin/60"
                    >
                      Loading invoices...
                    </td>
                  </tr>
                ) : invoicesError ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-10 text-center text-red-600"
                    >
                      Error loading invoices
                    </td>
                  </tr>
                ) : invoices.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-10 text-center text-raisin/60"
                    >
                      No invoices yet.
                    </td>
                  </tr>
                ) : (
                  invoices.map((inv) => (
                    <tr key={inv._id} className="border-t hover:bg-neutral-50">
                      <Td className="whitespace-nowrap">
                        #{inv.invoice_number}
                      </Td>
                      <Td className="whitespace-nowrap md:whitespace-normal">
                        <div className="font-medium text-raisin">
                          {inv.receipient.customer_name || 'N/A'}
                        </div>
                        <div className="text-xs text-raisin/60">
                          {inv.receipient.customer_email || 'N/A'}
                        </div>
                      </Td>
                      <Td className="hidden md:table-cell whitespace-nowrap">
                        {format(new Date(inv.issue_date), 'MMM d, yyyy')}
                      </Td>
                      <Td className="hidden lg:table-cell whitespace-nowrap">
                        {format(new Date(inv.due_date), 'MMM d, yyyy')}
                      </Td>
                      <Td className="whitespace-nowrap">
                        ₦{inv.total.toLocaleString()}
                      </Td>
                      <Td className="whitespace-nowrap">
                        <StatusChip status={inv.status} />
                      </Td>
                      <Td className="whitespace-nowrap">
                        <Link
                          href={`/dashboard/invoices/${encodeURIComponent(
                            inv._id
                          )}`}
                          className="text-mikado hover:underline"
                        >
                          View
                        </Link>
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <DeleteCustomerModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

/* --------------------------- Small UI helpers -------------------------- */

function Th({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`text-left text-xs font-medium text-raisin px-4 lg:px-6 py-3 ${className}`}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-4 lg:px-6 py-3 ${className}`}>{children}</td>;
}
