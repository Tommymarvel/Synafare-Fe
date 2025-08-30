'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';
import { Eye, Pencil, Trash2, Search } from 'lucide-react';
import { Customer } from '../types';
import { Input } from '@/app/components/form/Input';
import EmptyState from '@/app/components/EmptyState';

export default function CustomersTable({
  customers,
}: {
  customers: Customer[];
}) {
  const [q, setQ] = useState('');

  const filtered = customers.filter(
    (c) =>
      `${c.name} ${c.email}`.toLowerCase().includes(q.toLowerCase()) ||
      c.email.toLowerCase().includes(q.toLowerCase()) ||
      c.phone.includes(q)
  );

  const th =
    'sticky top-0 bg-[#F0F2F5] text-left text-xs font-medium text-raisin px-4 lg:px-6 py-3';

  return (
    <div className="space-y-4 border border-[#DCDCDC] rounded-lg bg-white py-4">
      {/* search */}
      <div className="px-4">
        <div className="relative max-w-xl">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search"
            className="rounded-2xl pl-11"
          />
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        </div>
      </div>

      {/* table (only this scrolls horizontally) */}
      <div className="overflow-x-auto scrollbar-mikado rounded-xl border bg-white">
        <table className="min-w-max w-full text-sm">
          <thead>
            <tr>
              <th className={`${th} w-10`}>
                <input type="checkbox" />
              </th>
              <th className={th}>Name</th>
              <th className={th}>Email Address</th>
              <th className={`${th} hidden md:table-cell`}>Phone Number</th>
              <th className={`${th} hidden lg:table-cell`}>Date Added</th>
              <th className={th}>Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-t hover:bg-neutral-50">
                <td className="px-4 lg:px-6 py-3">
                  <input type="checkbox" />
                </td>
                <td className="px-4 lg:px-6 py-3 whitespace-nowrap">
                  <div className="font-medium text-raisin">{c.name}</div>
                </td>
                <td className="px-4 lg:px-6 py-3 text-raisin/80">{c.email}</td>
                <td className="px-4 lg:px-6 py-3 hidden md:table-cell">
                  {c.phone}
                </td>
                <td className="px-4 lg:px-6 py-3 hidden lg:table-cell">
                  {format(new Date(c.createdAt), 'MMM d, yyyy')}
                </td>
                <td className="px-4 lg:px-6 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/customers/${c.id}`}
                      className="p-2 rounded-md border hover:bg-neutral-50"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      className="p-2 rounded-md border hover:bg-neutral-50"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 rounded-md border hover:bg-neutral-50"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-0">
                  <EmptyState
                    title="No Customers Found"
                    description="No customers match your search criteria. Try adjusting your search terms."
                    illustration="/empty.svg"
                    className="border-0 py-8"
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* pagination stub */}
      <div className="flex items-center justify-between px-4 py-3">
        <button className="px-3 py-2 border rounded-md hover:bg-neutral-50">
          Previous
        </button>
        <div className="space-x-1">
          <button className="px-2 py-1 rounded-md bg-mikado/20 text-mikado">
            1
          </button>
          <button className="px-2 py-1 rounded-md hover:bg-neutral-100">
            2
          </button>
          <span>…</span>
          <button className="px-2 py-1 rounded-md hover:bg-neutral-100">
            10
          </button>
        </div>
        <button className="px-3 py-2 border rounded-md hover:bg-neutral-50">
          Next
        </button>
      </div>
    </div>
  );
}
