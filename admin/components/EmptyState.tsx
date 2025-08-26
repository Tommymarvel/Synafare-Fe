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
  illustrationWidth = 162,
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
    <div className={`flex items-center justify-center h-[50vh] ${className}`}>
      <div className="space-y-5">
        {illustration && (
          <Image
            src={illustration}
            alt={title}
            width={illustrationWidth}
            height={illustrationHeight}
            className="w-[161px] block mx-auto"
          />
        )}

        <div className="text-center space-y-2">
          <h1 className="text-lg font-medium text-resin-black">{title}</h1>
          <p className="text-gray-3">{description}</p>
        </div>

        {actionLabel && (actionUrl || onAction) && (
          <div className="text-center">
            <button
              onClick={handleAction}
              className="px-6 py-3 bg-mikado text-white rounded-md hover:bg-yellow-600
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                         focus-visible:ring-mikado transition-colors"
            >
              {actionLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Predefined configurations for common empty states in admin
export const EmptyStateConfigs = {
  loanRequests: {
    title: 'No Loan Requests',
    description: 'There are no loan requests at the moment.',
    illustration: '/empty-loan.svg',
  },
  users: {
    title: 'No Users Found',
    description: 'No users match your current search criteria.',
    illustration: '/no-user.svg',
  },
  loans: {
    title: 'No Loans Found',
    description: 'There are no loans to display.',
    illustration: '/empty-loan.svg',
  },
  quotes: {
    title: 'No Quotes Found',
    description: 'There are no quotes to display.',
    illustration: '/empty-inventory.svg',
  },
  search: {
    title: 'No Results Found',
    description: "We couldn't find any results matching your search.",
    illustration: '/search-icon.svg',
  },
  general: {
    title: 'No Data Available',
    description: "There's no data to display at the moment.",
    illustration: '/no-item.svg',
  },
};
