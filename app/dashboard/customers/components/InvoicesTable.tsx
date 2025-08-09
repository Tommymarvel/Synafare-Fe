'use client';

import { Invoice } from '../types';
import { format } from 'date-fns';
import Link from 'next/link';

const CHIP: Record<Invoice['status'], string> = {
  PENDING: 'bg-yellow-50 text-yellow-600',
  PAID: 'bg-green-50 text-green-600',
};

export default function InvoicesTable({ invoices }: { invoices: Invoice[] }) {
  const th =
    'sticky top-0 bg-[#F0F2F5] text-left text-xs font-medium text-raisin px-4 lg:px-6 py-3';

  return (
    <div className="rounded-xl border bg-white">
      <div className="border-b px-4 lg:px-6 py-3 font-medium text-raisin bg-[#F7F8FA] rounded-t-xl">
        Invoices
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-max w-full text-sm">
          <thead>
            <tr>
              <th className={th}>Invoice ID</th>
              <th className={th}>Customer</th>
              <th className={`${th} hidden md:table-cell`}>Issue Date</th>
              <th className={`${th} hidden lg:table-cell`}>Due Date</th>
              <th className={th}>Amount</th>
              <th className={th}>Status</th>
              <th className={th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-t hover:bg-neutral-50">
                <td className="px-4 lg:px-6 py-3">{inv.id}</td>
                <td className="px-4 lg:px-6 py-3">
                  <div className="font-medium text-raisin">
                    {inv.customerName}
                  </div>
                  <div className="text-xs text-raisin/60">
                    {inv.customerEmail}
                  </div>
                </td>
                <td className="px-4 lg:px-6 py-3 hidden md:table-cell">
                  {inv.issueDate ? format(new Date(inv.issueDate), 'MMM d, yyyy') : 'N/A'}
                </td>
                <td className="px-4 lg:px-6 py-3 hidden lg:table-cell">
                  {format(new Date(inv.dueDate), 'MMM d, yyyy')}
                </td>
                <td className="px-4 lg:px-6 py-3">
                  ₦{inv.amount.toLocaleString()}
                </td>
                <td className="px-4 lg:px-6 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      CHIP[inv.status]
                    }`}
                  >
                    {inv.status === 'PAID' ? 'Paid' : 'Pending'}
                  </span>
                </td>
                <td className="px-4 lg:px-6 py-3">
                  <Link
                    href={`/dashboard/invoices/${inv.id}`}
                    className="text-mikado hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {invoices.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-8 text-center text-sm text-raisin/60"
                >
                  No invoices yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
