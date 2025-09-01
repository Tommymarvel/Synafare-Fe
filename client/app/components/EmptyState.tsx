'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionUrl?: string;
  illustration?: string;
  illustrationWidth?: number;
  illustrationHeight?: number;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionUrl,
  illustration,
  illustrationWidth = 180,
  illustrationHeight = 180,
  onAction,
  className = '',
}: EmptyStateProps) {
  const router = useRouter();

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else if (actionUrl) {
      router.push(actionUrl);
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center h-[70dvh] space-y-6  rounded-lg ${className}`}
    >
      {illustration && (
        <Image
          src={illustration}
          alt={`${title} illustration`}
          width={illustrationWidth}
          height={illustrationHeight}
        />
      )}

      <div className="text-center space-y-3">
        <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
        <p className="text-sm text-neutral-500 max-w-xs">{description}</p>
      </div>

      {actionLabel && (actionUrl || onAction) && (
        <button
          onClick={handleAction}
          className="px-6 py-3 bg-mikado text-raisin rounded-md hover:bg-yellow-600
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                     focus-visible:ring-mikado transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

// Predefined configurations for common empty states
export const EmptyStateConfigs = {
  loans: {
    title: 'No Loan Request',
    description:
      'You do not have any loan request. Click "Request Loan" to make your first request.',
    actionLabel: 'Request Loan',
    actionUrl: '/dashboard/loans/request',
    illustration: '/assets/repayment-illustration.svg',
  },
  invoices: {
    title: 'No Invoices Found',
    description:
      "You haven't created any invoices yet. Start by creating your first invoice.",
    actionLabel: 'Create Invoice',
    actionUrl: '/dashboard/invoices/create',
    illustration: '/assets/empty-invoice.svg',
  },
  customers: {
    title: 'No Customers Found',
    description:
      "You haven't added any customers yet. Start by adding your first customer.",
    actionLabel: 'Add Customer',
    actionUrl: '/dashboard/customers/create',
    illustration: '/assets/no-user.svg',
  },
  products: {
    title: 'No Products Found',
    description:
      "You haven't added any products yet. Start by adding your first product.",
    actionLabel: 'Add Product',
    actionUrl: '/dashboard/products/create',
    illustration: '/assets/no-item.svg',
  },
  quotes: {
    title: 'No Quotes Found',
    description:
      "You haven't created any quotes yet. Start by creating your first quote.",
    actionLabel: 'Create Quote',
    actionUrl: '/dashboard/quotes/create',
    illustration: '/assets/empty-quote.svg',
  },
  marketplace: {
    title: 'No Products Found',
    description:
      'No products match your current search criteria. Try adjusting your filters.',
    actionLabel: 'Clear Filters',
    illustration: '/assets/no-item.svg',
  },
  search: {
    title: 'No Results Found',
    description:
      "We couldn't find any results matching your search. Try different keywords.",
    actionLabel: 'Clear Search',
    illustration: '/assets/search-icon.svg',
  },
  general: {
    title: 'No Data Available',
    description: "There's no data to display at the moment.",
    illustration: '/assets/no-item.svg',
  },
};
