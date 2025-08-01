'use client';

import React from 'react';
import { Wallet } from 'lucide-react';

export default function WalletBalanceCard() {
  return (
    <div className="bg-white rounded-2xl shadow p-5 flex items-center space-x-4">
      <div className="p-3 bg-yellow-100 rounded-full">
        <Wallet className="h-6 w-6 text-yellow-600" />
      </div>
      <div>
        <p className="text-sm text-gray-500">Wallet Balance</p>
        <p className="text-xl font-semibold text-gray-900">₦120,000</p>
      </div>
    </div>
  );
}
