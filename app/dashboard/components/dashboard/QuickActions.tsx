'use client';

import React from 'react';
import { Banknote, FileText, Users, Clipboard } from 'lucide-react';
import Link from 'next/link';

const actions = [
  {
    label: 'Request Loan',
    href: '/dashboard/loans/new',
    icon: Banknote,
    color: 'bg-yellow-100 text-yellow-600',
  },
  {
    label: 'Create Invoice',
    href: '/dashboard/invoices/new',
    icon: FileText,
    color: 'bg-green-100 text-green-600',
  },
  {
    label: 'Add Customer',
    href: '/dashboard/customers/new',
    icon: Users,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    label: 'New Quote',
    href: '/dashboard/quote-requests/new',
    icon: Clipboard,
    color: 'bg-purple-100 text-purple-600',
  },
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {actions.map(({ label, href, icon: Icon, color }) => (
        <Link
          key={href}
          href={href}
          className={`flex items-center space-x-2 p-4 rounded-xl bg-white shadow hover:shadow-md transition ${color}`}
        >
          <div className={`p-2 rounded-full ${color}`}>
            {' '}
            <Icon className="h-5 w-5" />{' '}
          </div>
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </Link>
      ))}
    </div>
  );
}
