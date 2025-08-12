'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import useSWR from 'swr';
import axiosInstance from '@/lib/axiosInstance';
import { format } from 'date-fns';
import { Pencil, Trash2, ChevronDown, ArrowLeft } from 'lucide-react';
import DeleteCustomerModal from '../components/DeleteCustomerModal';

/* ---------------------------- Types (no any) ---------------------------- */

interface CustomerAPI {
  _id: string;
  customer_name: string;
  customer_email: string;
  customer_phn: string;
  date_joined?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string; // ISO
}

function toCustomer(api: CustomerAPI): Customer {
  return {
    id: api._id,
    name: api.customer_name,
    email: api.customer_email,
    phone: api.customer_phn,
    createdAt: api.date_joined ?? api.createdAt ?? new Date().toISOString(),
  };
}

type InvoiceStatus = 'PENDING' | 'PAID';



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

/* ----------------------- FUTURE: invoices API (commented) -----------------------
   When your invoices endpoint is ready, uncomment this block and the usage below.

const INVOICES_BY_CUSTOMER_URL = '/invoice/by-customer' as const;
type InvoicesKey = readonly [typeof INVOICES_BY_CUSTOMER_URL, Readonly<{ customerId: string }>];

const fetchInvoices: (k: InvoicesKey) => Promise<{ data: Invoice[] }> = async ([url, params]) => {
  const { data } = await axiosInstance.get<{ data: Invoice[] }>(url, { params });
  return data;
};
---------------------------------------------------------------------------------- */

/* ------------------------------ Mock invoices -------------------------------- */

 type InvoiceStatusTest = 'PENDING' | 'PAID';

 interface InvoiceTest {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: InvoiceStatusTest;
}

 const mockInvoices: InvoiceTest[] = [
  {
    id: '#00001',
    customerId: '6896493a332e17793756c73a',
    customerName: 'Mary Thomas',
    customerEmail: 'mayree12@gmail.com',
    issueDate: '2025-01-06T00:00:00.000Z',
    dueDate: '2025-01-06T00:00:00.000Z',
    amount: 827_172,
    status: 'PENDING',
  },
  {
    id: '#00002',
    customerId: '6896493a332e17793756c73a',
    customerName: 'Mary Thomas',
    customerEmail: 'mayree12@gmail.com',
    issueDate: '2025-01-06T00:00:00.000Z',
    dueDate: '2025-01-06T00:00:00.000Z',
    amount: 827_172,
    status: 'PAID',
  },
  {
    id: '#00003',
    customerId: '6896493a332e17793756c73a',
    customerName: 'Mary Thomas',
    customerEmail: 'mayree12@gmail.com',
    issueDate: '2025-01-06T00:00:00.000Z',
    dueDate: '2025-01-06T00:00:00.000Z',
    amount: 827_172,
    status: 'PAID',
  },
];

function getInvoicesForCustomer(customerId: string): InvoiceTest[] {
  return mockInvoices.filter((i) => i.customerId === customerId);
}

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

  /* ----------------------- FUTURE: invoices fetch (commented) --------------------
  const invKey = [INVOICES_BY_CUSTOMER_URL, { customerId: params.id }] as const satisfies InvoicesKey;
  const { data: iRes, isLoading: invoicesLoading, error: invoicesError } = useSWR(invKey, fetchInvoices, {
    revalidateOnFocus: true,
  });
  const invoices: Invoice[] = iRes?.data ?? [];
  ------------------------------------------------------------------------------- */

  // ✅ Mock for now
  const invoices: InvoiceTest[] = getInvoicesForCustomer(params.id);

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

      {/* Loans (collapsible) */}
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
          <div className="px-4 lg:px-6 py-10 text-center text-sm text-raisin/60">
            No recent loan activity
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
                {invoices.length === 0 ? (
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
                    <tr key={inv.id} className="border-t hover:bg-neutral-50">
                      <Td className="whitespace-nowrap">{inv.id}</Td>
                      <Td className="whitespace-nowrap md:whitespace-normal">
                        <div className="font-medium text-raisin">
                          {inv.customerName}
                        </div>
                        <div className="text-xs text-raisin/60">
                          {inv.customerEmail}
                        </div>
                      </Td>
                      <Td className="hidden md:table-cell whitespace-nowrap">
                        {format(new Date(inv.issueDate), 'MMM d, yyyy')}
                      </Td>
                      <Td className="hidden lg:table-cell whitespace-nowrap">
                        {format(new Date(inv.dueDate), 'MMM d, yyyy')}
                      </Td>
                      <Td className="whitespace-nowrap">
                        ₦{inv.amount.toLocaleString()}
                      </Td>
                      <Td className="whitespace-nowrap">
                        <StatusChip status={inv.status as 'PENDING' | 'PAID'} />
                      </Td>
                      <Td className="whitespace-nowrap">
                        <Link
                          href={`/dashboard/invoices/${encodeURIComponent(
                            inv.id
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

function StatusChip({ status }: { status: InvoiceStatus }) {
  const map: Record<InvoiceStatus, readonly [label: string, classes: string]> =
    {
      PENDING: ['Pending', 'bg-yellow-50 text-yellow-600'],
      PAID: ['Paid', 'bg-green-50 text-green-600'],
    };
  const [label, cls] = map[status];
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${cls}`}
    >
      {label}
    </span>
  );
}
