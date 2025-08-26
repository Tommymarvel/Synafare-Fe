// app/(dashboard)/wallet/page.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  EyeOff,
  Plus,
  Minus,
  Wallet as WalletIcon,
  ChevronDown,
} from 'lucide-react';
import AddMoneyModal from './components/AddMoneyModal';
import Image from 'next/image';
import Spiral from '@/app/assets/spiral.png';
import CoinStack from '@/app/assets/coins-stack.svg';
import TransactionDetailsModal from './components/TransactionDetailsModal';
import WithdrawModal from './components/WithdrawModal';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'react-toastify';
import Pagination from '@/app/components/pagination';
import { AxiosError } from 'axios';
import { useAuth } from '@/context/AuthContext';
import { Transaction, useTransactions } from './hooks/useTransactions';
import { fmtDate, fmtNaira } from '@/lib/format';
import EmptyState from '@/app/components/EmptyState';

export type BankDetails = {
  bankAccountNumber: string;
  bankAccountName: string;
  bankName: string;
};

const PAGE_SIZE = 10;

export default function WalletPage() {
  const [bankMeta, setBankMeta] = useState<BankDetails | null>(null);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const { user } = useAuth();

  const [showTxn, setShowTxn] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const { transactions, meta, isLoading, error } = useTransactions({
    page,
    limit: PAGE_SIZE,
  });
  const totalPages = meta.totalPages;

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

  return (
    <main className="pb-10">
      {/* Balance Card */}
      <section className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-2xl bg-raisin text-white">
          {/* Decorative background shape */}
          <div className="absolute right-[-90px] top-8 h-64 w-64 rotate-[48deg] opacity-20">
            <Image
              src={Spiral}
              alt=""
              fill
              sizes="16rem"
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>

          <div className="relative p-4">
            {/* Wallet label */}
            <div className="flex items-center text-[12px] text-[#D0D5DD]">
              <span>Wallet Balance</span>
              <EyeOff className="ml-1 h-5 w-5" />
            </div>

            {/* Amount */}
            <div className="mt-2 text-4xl font-medium">
              <p>
                ₦
                {new Intl.NumberFormat('en-NG').format(
                  user?.wallet_balance ?? 0
                )}
              </p>
            </div>

            {/* Account + actions */}
            <div className="mt-4 flex flex-col items-start gap-4 lg:flex-row lg:items-center lg:justify-between">
              <span className="text-white/80">
                {bankMeta?.bankAccountNumber} {bankMeta?.bankName}
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setOpen(true)}
                  className="flex items-center rounded-lg bg-mikado px-4 py-2 text-raisin transition hover:bg-yellow-600"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add money
                </button>

                <button
                  className="flex items-center rounded-lg border border-mikado px-4 py-2 text-mikado transition hover:bg-mikado hover:text-white"
                  onClick={() => setWithdrawOpen(true)}
                >
                  <Minus className="mr-2 h-4 w-4" />
                  Withdraw
                </button>
              </div>
            </div>

            {/* Icon badge */}
            <div className="absolute right-4 top-4 rounded-full bg-mikado p-3 text-gray-900">
              <WalletIcon className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Transactions card */}
        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h4 className="font-medium">Recent Transactions</h4>
            <button className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm">
              Select Date Range
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          {transactions.length > 0 ? (
            <div>
              <div className="-mx-1 md:mx-0">
                <div
                  className="scrollbar-mikado overflow-x-auto px-1 md:overflow-visible md:px-0"
                  style={{ WebkitOverflowScrolling: 'touch' }}
                >
                  <table className="w-full min-w-[500px] table-auto rounded-lg border bg-white md:min-w-0">
                    <thead className="bg-[#F0F2F5] text-xs font-medium leading-[18px]">
                      <tr>
                        <th className="px-3 py-3 text-left">ID</th>
                        <th className="px-3 py-3 text-center">
                          Transaction Type
                        </th>
                        <th className="px-3 py-3 text-center"> Amount</th>
                        <th className="hidden px-3 py-3 text-center md:table-cell">
                          Date
                        </th>

                        <th className=" px-3 py-3 text-center lg:table-cell">
                          Status
                        </th>
                        <th className="px-3 py-3 text-center">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {isLoading && (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-6 py-10 text-center text-sm text-[#797979]"
                          >
                            Loading transactions…
                          </td>
                        </tr>
                      )}

                      {!isLoading && !!error && (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-6 py-10 text-center text-sm text-red-500"
                          >
                            Failed to load transactions
                          </td>
                        </tr>
                      )}

                      {!isLoading && !error && transactions.length === 0 && (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-6 py-10 text-center text-sm text-[#797979]"
                          >
                            No transactions found.
                          </td>
                        </tr>
                      )}
                      {transactions.map((t) => (
                        <tr key={t.id} className="border-b hover:bg-neutral-50">
                          <td className="px-6 py-3">
                            <div className="whitespace-nowrap text-sm font-medium text-raisin md:whitespace-normal">
                              {t.refId.slice(0, 6)}...
                            </div>
                          </td>

                          <td className="whitespace-nowrap px-6 py-3 text-center text-sm">
                            {t.type}
                          </td>
                          <td className="whitespace-nowrap px-6 py-3 text-center text-sm">
                            {fmtNaira(t.amount)}
                          </td>

                          <td className="hidden whitespace-nowrap px-6 py-3 text-center text-sm md:table-cell">
                            {fmtDate(t.date)}
                          </td>

                          <td className="whitespace-nowrap px-6 py-3 text-center text-sm lg:table-cell">
                            <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600 capitalize">
                              {t.status}
                            </span>
                          </td>

                          <td
                            className="whitespace-nowrap px-6 py-3 text-center text-neutral-400 cursor-pointer hover:text-neutral-600"
                            onClick={() => {
                              setShowTxn(true);
                              setSelectedTx(t);
                            }}
                          >
                            View
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="py-4 px-6">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            </div>
          ) : (
            <EmptyState
              title="No Recent Transactions"
              description="You haven't made any transactions yet. Add money to your wallet or make a purchase to see transactions here."
              illustration={CoinStack}
              illustrationWidth={120}
              illustrationHeight={120}
              className="h-64"
            />
          )}
        </div>
      </section>
      {/* Modal */}
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

      <TransactionDetailsModal
        open={showTxn}
        onClose={() => {
          setShowTxn(false);
          setSelectedTx(null);
        }}
        amountIsKobo={true}
        data={selectedTx}
        onDownload={() => {
          // trigger your receipt download
        }}
      />
      <WithdrawModal
        open={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        balance={1140675} // your real wallet balance (number)
      />
    </main>
  );
}
