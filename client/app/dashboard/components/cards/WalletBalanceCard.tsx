'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { EyeOff, Eye, Plus, Minus, Wallet } from 'lucide-react';
import Spiral from '@/app/assets/spiral.png';
import { fmtNaira } from '@/lib/format';
import { useAuth } from '@/context/AuthContext';
import AddMoneyModal from '../../wallet/components/AddMoneyModal';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'react-toastify';
import WithdrawModal from '../../wallet/components/WithdrawModal';
import { AxiosError } from 'axios';

export type BankDetails = {
  bankAccountNumber: string;
  bankAccountName: string;
  bankName: string;
};

const SplitCurrency = ({
  amount,
  className = 'text-[32px] font-medium',
  decimalClassName = 'text-sm',
}: {
  amount: number;
  className?: string;
  decimalClassName?: string;
}) => {
  const formatted = fmtNaira(amount);
  const [integerPart, decimalPart] = formatted.split('.');

  return (
    <div className={`flex items-end ${className}`}>
      {integerPart}
      {decimalPart && (
        <span className={`${decimalClassName} self-end mb-1`}>
          .{decimalPart}
        </span>
      )}
    </div>
  );
};

export default function WalletBalanceCard() {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [bankMeta, setBankMeta] = useState<BankDetails | null>(null);

  useEffect(() => {
    const getAccountDetails = async () => {
      try {
        const res = await axiosInstance.get('/account/my-account');
        const data = res.data.data;
        setBankMeta(data);
      } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        toast.error(
          (axiosError.response && axiosError.response.data
            ? axiosError.response.data.message || axiosError.response.data
            : axiosError.message || 'An error occurred'
          ).toString()
        );
      }
    };

    getAccountDetails();
  }, []);

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

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
            <button
              onClick={toggleBalanceVisibility}
              className="ml-1 hover:text-white transition-colors"
            >
              {isBalanceVisible ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>{' '}
        {isBalanceVisible ? (
          <div className="mt-1">
            <SplitCurrency
              amount={user?.wallet_balance ?? 0}
              className="text-white text-[32px] font-medium"
              decimalClassName="text-sm"
            />
          </div>
        ) : (
          <div className="mt-1 text-[32px] font-medium text-white">
            <span>₦****</span>
          </div>
        )}
        {/* Middle: Action buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen(true)}
            className="flex items-center text-sm lg:text-base rounded-lg bg-mikado px-4 py-2 text-raisin transition hover:bg-yellow-600"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add money
          </button>

          <button
            className="flex items-center rounded-lg border text-sm lg:text-base border-mikado px-4 py-2 text-mikado transition hover:bg-mikado hover:text-white"
            onClick={() => setWithdrawOpen(true)}
          >
            <Minus className="mr-2 h-4 w-4" />
            Withdraw
          </button>
        </div>
        {/* Top-right: Icon badge */}
        <div className="absolute top-4 right-4 p-3 bg-mikado rounded-full text-gray-900">
          <Wallet className="w-5 h-5" />
        </div>
      </div>
      <AddMoneyModal
        open={open}
        onClose={() => setOpen(false)}
        bankMeta={bankMeta}
        onProceedNomba={async ({ amount }) => {
          try {
            // If your backend expects kobo, change to: amount * 100
            const { data } = await axiosInstance.post(
              '/payment/get-payment-link',
              {
                amount,
              }
            );
            const link = data?.data?.checkoutLink;
            const ref = data?.data?.orderReference;
            if (!link) {
              toast.error('Could not get checkout link');
              return;
            }
            try {
              localStorage.setItem('nomba_order_ref', String(ref ?? ''));
            } catch {}
            window.location.href = link; // redirect to Nomba
          } catch (error) {
            const axiosError = error as AxiosError<{
              message?: string;
              errors?: string | string[];
            }>;
            toast.error(
              (axiosError.response && axiosError.response.data
                ? axiosError.response.data.errors || axiosError.response.data
                : axiosError.message || 'An error occurred'
              ).toString()
            );
          }
        }}
        onConfirmBank={() => {
          setOpen(false);
        }}
      />
      <WithdrawModal
        open={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        balance={user?.wallet_balance ?? 0} // your real wallet balance (number)
      />
    </div>
  );
}
