// app/(dashboard)/wallet/page.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import {
  EyeOff,
  Plus,
  Minus,
  Wallet as WalletIcon,
  ChevronDown,
  Eye,
  Calendar,
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

type DateRange = {
  startDate: string;
  endDate: string;
  label: string;
};

const PAGE_SIZE = 10;

const dateRangeOptions: DateRange[] = [
  {
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    label: 'Last 7 days',
  },
  {
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    label: 'Last 30 days',
  },
  {
    startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    label: 'Last 3 months',
  },
];

export default function WalletPage() {
  const [bankMeta, setBankMeta] = useState<BankDetails | null>(null);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const { user } = useAuth();

  const [showTxn, setShowTxn] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | null>(
    null
  );
  const [customDateRange, setCustomDateRange] = useState({
    startDate: '',
    endDate: '',
  });
  const dateFilterRef = useRef<HTMLDivElement>(null);

  // Close date filter when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dateFilterRef.current &&
        !dateFilterRef.current.contains(event.target as Node)
      ) {
        setShowDateFilter(false);
      }
    };

    if (showDateFilter) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDateFilter]);

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  const handleDateRangeSelect = (range: DateRange | null) => {
    setSelectedDateRange(range);
    setPage(1); // Reset to first page when filtering
    setShowDateFilter(false);
  };

  const handleCustomDateRange = () => {
    if (!customDateRange.startDate || !customDateRange.endDate) {
      toast.error('Please select both start and end dates');
      return;
    }

    if (
      new Date(customDateRange.startDate) > new Date(customDateRange.endDate)
    ) {
      toast.error('Start date cannot be after end date');
      return;
    }

    setSelectedDateRange({
      startDate: customDateRange.startDate,
      endDate: customDateRange.endDate,
      label: `${customDateRange.startDate} to ${customDateRange.endDate}`,
    });
    setPage(1);
    setShowDateFilter(false);
  };

  const clearDateFilter = () => {
    setSelectedDateRange(null);
    setCustomDateRange({ startDate: '', endDate: '' });
    setPage(1);
    setShowDateFilter(false);
  };

  const { transactions, meta, isLoading, error } = useTransactions({
    page,
    limit: PAGE_SIZE,
    from: selectedDateRange?.startDate,
    to: selectedDateRange?.endDate,
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
            {/* Amount */}
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
            <div className="mt-1 text-[32px] font-medium">
              {isBalanceVisible ? (
                <>
                  ₦{Math.floor(user?.wallet_balance ?? 0)}
                  <span className="text-sm">
                    .{((user?.wallet_balance ?? 0) % 1).toFixed(2).slice(2)}
                  </span>
                </>
              ) : (
                <span>₦****</span>
              )}
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
            <div className="relative" ref={dateFilterRef}>
              <button
                onClick={() => setShowDateFilter(!showDateFilter)}
                className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
              >
                <Calendar className="h-4 w-4" />
                {selectedDateRange
                  ? selectedDateRange.label
                  : 'Select Date Range'}
                <ChevronDown className="h-4 w-4" />
              </button>

              {showDateFilter && (
                <div className="absolute right-0 top-full mt-1 w-64 rounded-lg border bg-white shadow-lg z-10">
                  <div className="p-2">
                    {/* Predefined ranges */}
                    <div className="space-y-1">
                      {dateRangeOptions.map((range, index) => (
                        <button
                          key={index}
                          onClick={() => handleDateRangeSelect(range)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                        >
                          {range.label}
                        </button>
                      ))}

                      {/* Custom range */}
                      <div className="border-t pt-2 mt-2">
                        <div className="px-3 py-2">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Custom Range
                          </p>
                          <div className="space-y-2">
                            <input
                              type="date"
                              value={customDateRange.startDate}
                              onChange={(e) =>
                                setCustomDateRange((prev) => ({
                                  ...prev,
                                  startDate: e.target.value,
                                }))
                              }
                              className="w-full px-2 py-1 text-xs border rounded"
                              placeholder="Start date"
                            />
                            <input
                              type="date"
                              value={customDateRange.endDate}
                              onChange={(e) =>
                                setCustomDateRange((prev) => ({
                                  ...prev,
                                  endDate: e.target.value,
                                }))
                              }
                              className="w-full px-2 py-1 text-xs border rounded"
                              placeholder="End date"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={handleCustomDateRange}
                                className="flex-1 px-2 py-1 text-xs bg-mikado text-raisin rounded hover:bg-yellow-600"
                              >
                                Apply
                              </button>
                              <button
                                onClick={clearDateFilter}
                                className="flex-1 px-2 py-1 text-xs border rounded hover:bg-gray-100"
                              >
                                Clear
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
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
                            {selectedDateRange
                              ? `No transactions found for the selected date range (${selectedDateRange.label}). Try adjusting your filter or clear it to see all transactions.`
                              : 'No transactions found.'}
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
            <div className="h-64">
              <EmptyState
                title={
                  selectedDateRange
                    ? 'No Transactions in Date Range'
                    : 'No Recent Transactions'
                }
                description={
                  selectedDateRange
                    ? `No transactions found for ${selectedDateRange.label}. Try adjusting your date range or clear the filter to see all transactions.`
                    : "You haven't made any transactions yet. Add money to your wallet or make a purchase to see transactions here."
                }
                illustration={CoinStack}
                illustrationWidth={120}
                illustrationHeight={120}
                className="h-64"
              />
              {selectedDateRange && (
                <div className="text-center mt-4">
                  <button
                    onClick={clearDateFilter}
                    className="px-4 py-2 bg-mikado text-raisin rounded-lg hover:bg-yellow-600"
                  >
                    Clear Filter
                  </button>
                </div>
              )}
            </div>
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
