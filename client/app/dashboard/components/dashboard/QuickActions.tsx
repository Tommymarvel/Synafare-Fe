'use client';

import React from 'react';
import Link from 'next/link';
import MoneyBag from '@/app/assets/MoneyBag.svg';
import SolarPanel from '@/app/assets/SolarPanel.svg';
import FileText from '@/app/assets/FileText.svg';
import HandCoins from '@/app/assets/HandCoins.svg';
import Users from '@/app/assets/Users.svg';
import Image from 'next/image';

export default function QuickActions() {
  const actions = [
    { label: 'Request Loan', href: '/dashboard/loans/', Icon: MoneyBag },
    {
      label: 'Create Invoice',
      href: '/dashboard/invoices/new',
      Icon: FileText,
    },
    { label: 'Repay Loan', href: '/dashboard/loans/repay', Icon: HandCoins },
    {
      label: 'Add Product',
      href: '/dashboard/inventory/new',
      Icon: SolarPanel,
    },
    { label: 'Add Customer', href: '/dashboard/customers/', Icon: Users },
  ];

  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Quick Actions
      </h3>
      <div className="flex w-full justify-between items-center gap-2 ">
        {actions.map(({ label, href, Icon }) => (
          <Link
            key={label}
            href={href}
            className="flex flex-col items-center space-y-2"
          >
            <div className="bg-gray-100 p-3 rounded-full">
             <Image
                src={Icon}
                alt={label}
                width={50}
                height={50}
             
              />
            </div>
            <span className="text-xs lg:text-sm text-center text-gray-800">{label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
