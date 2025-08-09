'use client';

import { Customer } from '../types';

export default function CustomerSummaryCard({ c }: { c: Customer }) {
  const initials = `${c.name?.[0] ?? ''}${
    c.email?.[0] ?? ''
  }`.toUpperCase();

  return (
    <div className="rounded-xl border bg-white p-4 sm:p-5">
      <div className="flex gap-4 sm:gap-6 items-start">
        <div className="h-12 w-12 rounded-full bg-neutral-200 grid place-items-center text-raisin font-semibold">
          {initials || 'M'}
        </div>
        <div className="flex-1 grid gap-3 sm:grid-cols-3">
          <div>
            <div className="text-raisin font-medium">
              {c.name || 'User'} 
            </div>
            <div className="text-sm text-raisin/60">
              Customer since:{' '}
              {new Date(c.createdAt).toLocaleDateString(undefined, {
                month: 'long',
                day: '2-digit',
                year: 'numeric',
              })}
            </div>
          </div>
          <div>
            <div className="text-xs text-raisin/60">Email Address</div>
            <div className="text-sm text-raisin">{c.email}</div>
          </div>
          <div>
            <div className="text-xs text-raisin/60">Phone Number</div>
            <div className="text-sm text-raisin">{c.phone}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
