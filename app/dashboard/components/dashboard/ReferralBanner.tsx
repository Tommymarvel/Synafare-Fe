import React from 'react';
import { Users } from 'lucide-react';
import Link from 'next/link';

export default function ReferralBanner() {
  return (
    <div className="bg-indigo-50 rounded-2xl p-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Users className="h-8 w-8 text-indigo-600" />
        <div>
          <p className="text-lg font-semibold text-gray-800">Refer a Friend</p>
          <p className="text-sm text-gray-600">
            Earn rewards when a friend signs up and completes a transaction.
          </p>
        </div>
      </div>
      <Link
        href="/dashboard/referrals"
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
      >
        Get Referral Link
      </Link>
    </div>
  );
}
