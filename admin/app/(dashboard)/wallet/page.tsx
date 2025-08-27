'use client';
import CalenderComp from '@/components/calender-comp';
import CardWrapper from '@/components/cardWrapper';
import PageIntro from '@/components/page-intro';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import TransactionTable from './components/transaction.table';
import { useTransactions } from '@/hooks/useTransactions';
import { useMemo, useState } from 'react';
import { TRANSACTIONTYPE } from '@/lib/constants';
import Image from 'next/image';
import { useDashboardData } from '@/hooks/useDashboard';
import { fmtNaira } from '@/lib/format';

const Wallet = () => {
  const { items: transactions } = useTransactions(1, 10);
  const [status, setStatus] = useState('*');
  const { dashboardData } = useDashboardData();

  const filteredTransactions = useMemo(() => {
    if (status === '*') return transactions;
    return transactions.filter((t) => t.transactionType === status);
  }, [status, transactions]);
  return (
    <div className="space-y-6">
      <PageIntro>Wallet</PageIntro>

      <div className="rounded-2xl px-[30px] pt-[15px] bg-deep-green relative">
        <span className="ms-auto items-center justify-center flex w-10 h-10 rounded-full bg-mikado-yellow ">
          <svg
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.0416 10.6562H7.79163C7.36454 10.6562 7.01038 10.3021 7.01038 9.875C7.01038 9.44792 7.36454 9.09375 7.79163 9.09375H14.0416C14.4687 9.09375 14.8229 9.44792 14.8229 9.875C14.8229 10.3021 14.4687 10.6562 14.0416 10.6562Z"
              fill="#00110A"
            />
            <path
              d="M20.3332 15.9153C18.7603 15.9153 17.427 14.7487 17.302 13.2487C17.2186 12.3841 17.5311 11.5404 18.1561 10.9258C18.677 10.3841 19.4165 10.082 20.1978 10.082H22.3749C23.4061 10.1133 24.1978 10.9257 24.1978 11.9257V14.0716C24.1978 15.0716 23.4061 15.8841 22.4061 15.9153H20.3332ZM22.3436 11.6445H20.2082C19.8436 11.6445 19.5103 11.7799 19.2707 12.0299C18.9686 12.3216 18.8228 12.7174 18.8645 13.1133C18.9165 13.8008 19.5832 14.3528 20.3332 14.3528H22.3749C22.5103 14.3528 22.6353 14.2279 22.6353 14.0716V11.9257C22.6353 11.7695 22.5103 11.6549 22.3436 11.6445Z"
              fill="#00110A"
            />
            <path
              d="M17.1667 22.6361H7.79171C4.20837 22.6361 1.80212 20.2298 1.80212 16.6465V9.35482C1.80212 6.14648 3.78127 3.82358 6.85418 3.43816C7.13543 3.39649 7.45837 3.36523 7.79171 3.36523H17.1667C17.4167 3.36523 17.7396 3.37565 18.073 3.42773C21.1459 3.7819 23.1563 6.11523 23.1563 9.35482V10.8652C23.1563 11.2923 22.8021 11.6465 22.375 11.6465H20.2084C19.8438 11.6465 19.5105 11.7819 19.2709 12.0319L19.2605 12.0423C18.9688 12.3236 18.8334 12.709 18.8646 13.1048C18.9167 13.7923 19.5834 14.3444 20.3334 14.3444H22.375C22.8021 14.3444 23.1563 14.6985 23.1563 15.1256V16.6361C23.1563 20.2298 20.75 22.6361 17.1667 22.6361ZM7.79171 4.92773C7.54171 4.92773 7.30211 4.94855 7.06253 4.9798C4.77086 5.27147 3.36462 6.93815 3.36462 9.35482V16.6465C3.36462 19.334 5.10421 21.0736 7.79171 21.0736H17.1667C19.8542 21.0736 21.5938 19.334 21.5938 16.6465V15.9173H20.3334C18.7604 15.9173 17.4271 14.7506 17.3021 13.2506C17.2188 12.3965 17.5313 11.5423 18.1563 10.9382C18.698 10.3861 19.4271 10.084 20.2084 10.084H21.5938V9.35482C21.5938 6.91732 20.1667 5.24021 17.8542 4.96938C17.6042 4.92771 17.3855 4.92773 17.1667 4.92773H7.79171Z"
              fill="#00110A"
            />
          </svg>
        </span>
        <div className="space-y-6 pb-[72px]">
          <p className="text-xs text-[#D0D5DD]">Wallet Balance</p>
          {(() => {
            const formatted = String(fmtNaira(Number(dashboardData?.wallet_bal?.amount ?? 0)));
            const [whole, fraction] = formatted.split('.');
            return (
              <h1 className="text-[36px] font-medium text-white">
                {whole}
                <span className="text-gray-400 text-sm">.{fraction ?? '00'}</span>
              </h1>
            );
          })()}
        </div>
        <Image
          src="/wallet.svg"
          width="32"
          height="32"
          className="absolute right-0 top-5"
          alt=""
        />
      </div>
      <CardWrapper className="p-0 ">
        <div className="flex justify-between items-center px-6 py-2 border-b border-b-gray-4">
          <p className="font-medium">Recent Transactions</p>
          <div className="flex gap-x-[10px] items-center">
            <Select value={status} onValueChange={(val) => setStatus(val)}>
              <SelectTrigger className=" border py-[10px] text-[#344054] px-3 border-border-gray rounded-md ">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="*">Status</SelectItem>
                <SelectItem value={TRANSACTIONTYPE.DOWNPAYMENT}>
                  Downpayment
                </SelectItem>
                <SelectItem value={TRANSACTIONTYPE.LOANDISBURSAL}>
                  Disbursal
                </SelectItem>
                <SelectItem value={TRANSACTIONTYPE.LOANREPAYMENT}>
                  Repayment
                </SelectItem>
              </SelectContent>
            </Select>
            <CalenderComp />
          </div>
        </div>
        <TransactionTable data={filteredTransactions} />
      </CardWrapper>
    </div>
  );
};

export default Wallet;
