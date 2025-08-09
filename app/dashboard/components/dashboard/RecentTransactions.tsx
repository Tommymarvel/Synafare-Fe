// app/dashboard/components/RecentTransactions.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import CoinStack from '@/app/assets/coins-stack.svg'; // placeholder asset

type Transaction = {
  id: string;
  type: string;
  amount: number;
  date: string;
  status: 'Successful' | 'Pending' | 'Failed';
  href: string;
};

type Props = {
  transactions?: Transaction[];
};

export default function RecentTransactions({ transactions = [] }: Props) {
  const hasTx = transactions.length > 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-800">
          Recent Transactions
        </h2>
        <a
          href="/dashboard/transactions"
          className="text-sm text-raisin hover:underline"
        >
          View all
        </a>
      </div>

      {hasTx ? (
        <div className="overflow-x-auto max-w-xs sm:max-w-[400px] md:max-w-[600px] lg:max-w-[800px] xl:max-w-full custom-scrollbar">
          <table className="table-auto inline-table min-w-full whitespace-nowrap">
            <thead className="bg-[#F0F2F5] text-raisin">
              <tr>
                <th className="py-3 px-6 text-left">#ID</th>
                <th className="py-3 px-6 text-left">Transaction Type</th>
                <th className="py-3 px-6 text-left">Amount</th>
                <th className="py-3 px-6 text-left">Date</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="pyy-3 px-6 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b last:border-none">
                  <td className="py-3 px-6 font-mono text-raisin">{tx.id}</td>
                  <td className="py-3 px-6 text-raisin">{tx.type}</td>
                  <td className="py-3 px-6  text-raisin">
                    ₦{tx.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-6 text-raisin">{tx.date}</td>
                  <td className="py-3 px-6">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        tx.status === 'Successful'
                          ? 'bg-green-100 text-green-700'
                          : tx.status === 'Pending'
                          ? 'bg-peach text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3 px-6">
                    <a
                      href={tx.href}
                      className="text-mikado font-medium hover:underline"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <Image
            src={CoinStack}
            alt="No recent transaction"
            width={80}
            height={80}
            priority
          />
          <p className="mt-4 text-sm text-gray-500">No recent transaction</p>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #ffc700 #171717;
        }
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #171717;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #ffc700;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
}
