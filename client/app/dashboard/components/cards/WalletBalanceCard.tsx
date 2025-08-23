'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { EyeOff, Plus, Minus, Wallet } from 'lucide-react';
import Spiral from '@/app/assets/spiral.png';
import { useAuth } from '@/context/AuthContext';

export default function WalletBalanceCard() {
  const { user } = useAuth();
  return (
    <div className="relative bg-raisin text-white rounded-2xl overflow-hidden">
      {/* Decorative background shape */}
      <div className="absolute right-[-90px] top-8 w-64 h-64 opacity-20 pointer-events-none rotate-[48deg]">
        <Image
          src={Spiral}
          alt=""
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>

      <div className="relative p-4 flex flex-col gap-6">
        {/* Left: Balance info */}
        <div>
          <div className="flex items-center text-[12px] text-[D0D5DD] ">
            <span>Wallet Balance</span>
            <EyeOff className="ml-1 w-5 h-5" />
          </div>
        </div>{' '}
        <div className="mt-1 text-[32px] font-medium">
          ₦{new Intl.NumberFormat('en-NG').format(user?.wallet_balance ?? 0)}
        </div>
        {/* Middle: Action buttons */}
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Link
            href="/dashboard/wallet"
            className="flex items-center px-4 py-2 bg-mikado rounded-lg text-raisin hover:bg-yellow-600 transition"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add money
          </Link>
          <Link
            href="/dashboard/wallet"
            className="flex items-center px-4 py-2 border border-mikado rounded-lg text-mikado hover:bg-mikado hover:text-white transition"
          >
            <Minus className="w-4 h-4 mr-2" />
            Withdraw
          </Link>
        </div>
        {/* Top-right: Icon badge */}
        <div className="absolute top-4 right-4 p-3 bg-mikado rounded-full text-gray-900">
          <Wallet className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
